'use strict';

var expect = require('chai').expect;
var Promise = require('bluebird');
var moduleStub = require('../util/module-stub');
var stub = moduleStub.stub;
var freshRequire = moduleStub.freshRequire;

/**
 * src/auth/user-service.js destructures RoleService/UserPersistenceService/
 * PasswordService off ../api/index once, at require time - so ../api/index
 * has to be stubbed before this module is freshRequired, not after.
 */
describe('src/auth/user-service.js:', function() {
	var restore;

	function buildService(fakes) {
		restore = stub('../../src/api/index', {
			RoleService: (fakes && fakes.roleService) || {},
			UserPersistenceService: (fakes && fakes.userPersistenceService) || {},
			PasswordService: (fakes && fakes.passwordService) || {}
		});
		return freshRequire('../../src/auth/user-service');
	}

	afterEach(function() {
		if (restore) { restore(); restore = undefined; }
	});

	describe('load (passport session deserialization):', function() {
		it('resolves the user with sensitive data stripped', function(done) {
			var userService = buildService({
				userPersistenceService: {
					findOneByUserId: function(oid) {
						expect(oid).to.equal('u-1');
						return Promise.resolve({userId: 'u-1', password: 'secret'});
					},
					removeSensitiveData: function(u) { return {userId: u.userId}; }
				}
			});
			userService.load('u-1', function(err, user) {
				expect(err).to.equal(null);
				expect(user).to.eql({userId: 'u-1'});
				done();
			});
		});

		it('reports an error when the user no longer exists', function(done) {
			var userService = buildService({
				userPersistenceService: {findOneByUserId: function() { return Promise.reject(new Error('gone')); }}
			});
			userService.load('missing', function(err, user) {
				expect(err).to.be.instanceOf(Error);
				expect(user).to.equal(undefined);
				done();
			});
		});
	});

	describe('findByAccountName:', function() {
		it("finds 'admin' by account name", function(done) {
			var userService = buildService({
				userPersistenceService: {
					findOneByUserName: function(username) {
						expect(username).to.equal('admin');
						return Promise.resolve({username: 'admin'});
					}
				}
			});
			userService.findByAccountName('admin', function(err, user) {
				expect(err).to.equal(null);
				expect(user.username).to.equal('admin');
				done();
			});
		});

		it('reports an error when the account does not exist', function(done) {
			var userService = buildService({
				userPersistenceService: {findOneByUserName: function() { return Promise.reject(new Error('no such user')); }}
			});
			userService.findByAccountName('nobody', function(err, user) {
				expect(err).to.be.instanceOf(Error);
				done();
			});
		});
	});

	describe('authenticate:', function() {
		function fakeAccount(overrides) {
			return Object.assign({
				username: 'admin',
				password: 'hashed-password',
				roles: ['ADMIN'],
				canAuthenticate: function() { return true; }
			}, overrides);
		}

		it('rejects an unknown username', function(done) {
			var userService = buildService({
				userPersistenceService: {findOneByUserName: function() { return Promise.reject(new Error('no such user')); }}
			});
			userService.authenticate('nobody', 'whatever', function(err, user, info) {
				expect(err).to.equal(null);
				expect(user).to.equal(false);
				done();
			});
		});

		it('rejects a wrong password', function(done) {
			var userService = buildService({
				userPersistenceService: {findOneByUserName: function() { return Promise.resolve(fakeAccount()); }},
				passwordService: {isValidPassword: function() { return false; }}
			});
			userService.authenticate('admin', 'wrong', function(err, user, info) {
				expect(err).to.equal(null);
				expect(user).to.equal(false);
				expect(info.message).to.match(/Invalid username\/password/);
				done();
			});
		});

		// JAM-24/JAM-46: canAuthenticate() (disabled/locked/expire) gates
		// login even with the right password.
		it('rejects a disabled, locked or expired account even with the right password', function(done) {
			var userService = buildService({
				userPersistenceService: {findOneByUserName: function() {
					return Promise.resolve(fakeAccount({canAuthenticate: function() { return false; }}));
				}},
				passwordService: {isValidPassword: function() { return true; }, isLegacyHash: function() { return false; }}
			});
			userService.authenticate('admin', 'correct', function(err, user, info) {
				expect(err).to.equal(null);
				expect(user).to.equal(false);
				done();
			});
		});

		it('authenticates a valid username/password and expands roles', function(done) {
			var userService = buildService({
				userPersistenceService: {
					findOneByUserName: function() { return Promise.resolve(fakeAccount()); },
					removeSensitiveData: function(u) { return {username: u.username, roles: u.roles}; }
				},
				passwordService: {isValidPassword: function() { return true; }, isLegacyHash: function() { return false; }},
				roleService: {findOneByName: function(name) { return Promise.resolve({name: name, isAlmighty: true}); }}
			});
			userService.authenticate('admin', 'correct', function(err, user, info) {
				expect(err).to.equal(null);
				expect(user.username).to.equal('admin');
				expect(user.roles[0]).to.eql({name: 'ADMIN', isAlmighty: true});
				done();
			});
		});

		// JAM-41: a successful match against a legacy md5 hash triggers a
		// fire-and-forget upgrade to bcrypt - doesn't block or fail login.
		it('upgrades a legacy password hash on successful login, without blocking the response', function(done) {
			var updateCalledWith;
			var userService = buildService({
				userPersistenceService: {
					findOneByUserName: function() { return Promise.resolve(fakeAccount()); },
					removeSensitiveData: function(u) { return {username: u.username, roles: u.roles}; },
					update: function(account) { updateCalledWith = account; return Promise.resolve(account); }
				},
				passwordService: {isValidPassword: function() { return true; }, isLegacyHash: function() { return true; }},
				roleService: {findOneByName: function(name) { return Promise.resolve({name: name}); }}
			});
			userService.authenticate('admin', 'correct', function(err, user) {
				expect(err).to.equal(null);
				expect(user.username).to.equal('admin');
				expect(updateCalledWith.password).to.equal('correct');
				done();
			});
		});

		// An unhandled promise rejection crashes the whole process on Node 15+
		// (on Node 12 it was a warning and the login request just hung), so a
		// failure while checking the credentials has to come back through
		// passport's callback instead.
		describe('a failure while checking the credentials:', function() {
			var unhandled;

			function onUnhandled(reason) { unhandled.push(reason); }

			beforeEach(function() {
				unhandled = [];
				process.on('unhandledRejection', onUnhandled);
			});

			afterEach(function() {
				process.removeListener('unhandledRejection', onUnhandled);
			});

			// Rejections are reported a tick after they happen, so look a moment later
			function expectNoUnhandledRejection(done) {
				setTimeout(function() {
					expect(unhandled).to.eql([]);
					done();
				}, 20);
			}

			it('reports a role that cannot be resolved as an error', function(done) {
				var userService = buildService({
					userPersistenceService: {findOneByUserName: function() { return Promise.resolve(fakeAccount()); }},
					passwordService: {isValidPassword: function() { return true; }, isLegacyHash: function() { return false; }},
					// a native promise, as expandRoles' own Promise.all is: bluebird would report a
					// rejection it considers unhandled a tick before Promise.all adopts it
					roleService: {findOneByName: function() { return global.Promise.reject(new Error('No role with the rolename ADMIN')); }}
				});
				userService.authenticate('admin', 'correct', function(err, user) {
					expect(err).to.be.instanceOf(Error);
					expect(err.message).to.match(/No role with the rolename ADMIN/);
					expect(user).to.equal(undefined);
					expectNoUnhandledRejection(done);
				});
			});

			it('reports an exception while checking the stored password as an error', function(done) {
				// bcryptjs throws, rather than returning false, for a stored value
				// that looks like a hash but is not a valid one
				var userService = buildService({
					userPersistenceService: {findOneByUserName: function() { return Promise.resolve(fakeAccount()); }},
					passwordService: {isValidPassword: function() { throw new Error('Invalid salt version: aa'); }}
				});
				userService.authenticate('admin', 'whatever', function(err, user) {
					expect(err).to.be.instanceOf(Error);
					expect(err.message).to.match(/Invalid salt version/);
					expect(user).to.equal(undefined);
					expectNoUnhandledRejection(done);
				});
			});

			it('answers only once when the callback itself throws after answering', function(done) {
				var userService = buildService({
					userPersistenceService: {
						findOneByUserName: function() { return Promise.resolve(fakeAccount()); },
						removeSensitiveData: function(u) { return {username: u.username}; }
					},
					passwordService: {isValidPassword: function() { return true; }, isLegacyHash: function() { return false; }},
					roleService: {findOneByName: function(name) { return Promise.resolve({name: name}); }}
				});
				var answers = 0;
				userService.authenticate('admin', 'correct', function() {
					answers++;
					throw new Error('passport blew up');
				});
				setTimeout(function() {
					expect(answers).to.equal(1);
					expect(unhandled).to.eql([]);
					done();
				}, 30);
			});
		});
	});
});
