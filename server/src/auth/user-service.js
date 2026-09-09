'user strict';

var
	_           = require('underscore'),
	// Q    = require('q'),
	log4js      = require('log4js'),
	util        = require('util'),
	canAccountAuthenticate = require('janux-persist').canAccountAuthenticate,
	RoleService = require('../api/index').RoleService,
	UserPersistenceService = require('../api/index').UserPersistenceService,
	PasswordService = require('../api/index').PasswordService,
	log         = log4js.getLogger('Auth UserService');

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

		service.findByAccountName(username, function (err, user) {
			if (err) {
				return done(null, false, { message:err});
			} else if (_.isObject(user) && PasswordService.isValidPassword(user.password, password) &&
					canAccountAuthenticate(user)) {
				// enabled/locked/expire are janux-persist's canAccountAuthenticate()
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

				user.roles = _.map(user.roles, function (role) {
					return RoleService.findOneByName(role)
				});
				Promise.all(user.roles).then(function (roles) {
					user.roles = roles;
					return done(null, UserPersistenceService.removeSensitiveData(user));
				});
				// RoleService.findOneByName(user.role).then(function(role) {
				// 	user.roles = role;
				// 	return done(null, user);
				// });

			} else {
				var msg = util.format('Invalid username/password supplied by "%s"', username);
				log.warn(msg);
				return done(null, false, {message: msg});  // return 'false' for failure to authenticate (rather than a null user)
			}
		});
	}
};

module.exports = service;
