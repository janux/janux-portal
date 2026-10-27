'user strict';

var
	_           = require('underscore'),
	// Q    = require('q'),
	log4js      = require('log4js'),
	util        = require('util'),
	RoleService = require('../api/index').RoleService,
	UserPersistenceService = require('../api/index').UserPersistenceService,
	PasswordService = require('../api/index').PasswordService,
	log         = log4js.getLogger('Auth UserService');

// Resolves each role name in user.roles to its full janux-authorize Role
// (roles/permissions, not just a name) - a caller cannot make an
// authorization decision from a bare string. Used both on login and on
// passport's session deserialization (load(), below), so /current-user
// returns the same fully-expanded shape login does after a page reload
// (JAM-29). Idempotent: already-expanded Role objects pass through
// unchanged, so it's safe to call on a user that has been expanded once
// already.
function expandRoles(user) {
	if (!_.isObject(user) || !_.isArray(user.roles) || user.roles.length === 0) {
		return Promise.resolve(user);
	}
	return Promise.all(_.map(user.roles, function (role) {
		return _.isString(role) ? RoleService.findOneByName(role) : role;
	})).then(function (roles) {
		user.roles = roles;
		return user;
	});
}

var service = {

	load: function load(oid, done) {
		// log.debug('calling findByOid with oid: '%s'',oid);
		'use strict';

		UserPersistenceService.findOneByUserId(oid)
			.then(function (result) {
				done(null, UserPersistenceService.removeSensitiveData(result));
			}, function (err) {
				var msg = util.format('User with oid: "%s" does not exist', oid);
				log.error(msg);
				done(new Error(msg));
			})
			.catch(function (err) {
				throw new Error(err);
			});
	},

	findByAccountName: function findByAccountName(username, done) {
		'use strict';
		log.debug('looking up account with name "%s"', username);

		UserPersistenceService.findOneByUserName(username)
			.then(function (result) {
				done(null, result);
			}, function (err) {
				var msg = util.format('User with username: "%s" does not exist', username);
				log.error(msg);
				done(new Error(msg));
			})
			.catch(function (err) {
				throw new Error(err);
			});
	},

	/*
	 * Given a valid username/password combination, returns the corresponding user.
	 * throws an error otherwise
	 */
	authenticate: function authenticate(username, password, done) {
		'use strict';

		// Anything that goes wrong while checking the credentials (a role that no
		// longer exists, a stored hash that bcrypt cannot parse) has to reach
		// passport as an error. One that escapes this callback becomes an
		// unhandled promise rejection, which crashes the whole process on Node 15+
		// (and, on older versions, left the login request hanging forever).
		var answered = false;

		function reply() {
			answered = true;
			return done.apply(null, arguments);
		}

		function fail(e) {
			log.error('Failed to authenticate "%s": %s', username, e && e.stack || e);
			if (!answered) {
				reply(e instanceof Error ? e : new Error(e));
			}
		}

		service.findByAccountName(username, function (err, user) {
			try {
				if (err) {
					return reply(null, false, { message:err});
				} else if (_.isObject(user) && PasswordService.isValidPassword(user.password, password) &&
						user.canAuthenticate()) {
					// enabled/locked/expire are janux-persist's AccountEntity#canAuthenticate()
					// (JAM-24/JAM-46) - expirePassword is deliberately not checked
					// here, see JAM-24's follow-up (JAM-45).

					// JAM-41: a successful match against a pre-migration md5 hash
					// is the cue to upgrade it to bcrypt now. update() takes a
					// full account-shaped object and hashes whatever plaintext
					// password it's given, so snapshot user's current fields
					// before roles below get replaced with resolved Role
					// objects - accountDao.update() would otherwise persist
					// those instead of the plain role names. Fire-and-forget:
					// this is housekeeping, not something login should wait on
					// or fail over.
					if (PasswordService.isLegacyHash(user.password)) {
						UserPersistenceService.update(_.extend({}, user, { password: password }), null)
							.catch(function (err) {
								log.error('Failed to upgrade legacy password hash for "%s": %j', username, err);
							});
					}

					expandRoles(user).then(function (expandedUser) {
						log.info('Authenticated "%s"', username);
						return reply(null, UserPersistenceService.removeSensitiveData(expandedUser));
					}).catch(fail);

				} else {
					var msg = util.format('Invalid username/password supplied by "%s"', username);
					log.warn(msg);
					return reply(null, false, {message: msg});  // return 'false' for failure to authenticate (rather than a null user)
				}
			} catch (e) {
				fail(e);
			}
		});
	}
};

module.exports = service;
module.exports.expandRoles = expandRoles;
