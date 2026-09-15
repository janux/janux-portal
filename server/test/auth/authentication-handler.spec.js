'use strict';

var expect = require('chai').expect;
var Promise = require('bluebird');
var moduleStub = require('../util/module-stub');
var stub = moduleStub.stub;
var freshRequire = moduleStub.freshRequire;

/**
 * authentication-handler.js requires ../../app-context (passport wiring,
 * which itself pulls in the whole janux-persist DB connection chain just
 * by being required) and ../api/index (the DI-wired service instances) at
 * module load time. Every test below stubs those - plus ./user-service,
 * so expandRoles can be controlled without a real role graph - before
 * freshRequiring the module under test.
 */
describe('src/auth/authentication-handler.js:', function() {
	var restores;

	function buildHandler(fakes) {
		restores = [
			stub('../../app-context', {passport: (fakes && fakes.passport) || {}}),
			stub('../../src/auth/user-service', (fakes && fakes.userService) || {}),
			stub('../../src/api/index', {UserPersistenceService: (fakes && fakes.userPersistenceService) || {}})
		];
		return freshRequire('../../src/auth/authentication-handler');
	}

	afterEach(function() {
		restores.forEach(function(restore) { restore(); });
	});

	describe('authenticationRequired:', function() {
		it('calls next() when the session is authenticated', function(done) {
			var handler = buildHandler();
			var req = {isAuthenticated: function() { return true; }};
			handler.authenticationRequired(req, {}, function() { done(); });
		});

		it('responds with the (deprecated Express 4) 401/user body when not authenticated', function() {
			var handler = buildHandler();
			var jsonArgs;
			var req = {isAuthenticated: function() { return false; }, user: undefined};
			var res = {json: function() { jsonArgs = Array.prototype.slice.call(arguments); }};
			handler.authenticationRequired(req, res, function() {
				throw new Error('next() should not be called when not authenticated');
			});
			expect(jsonArgs[0]).to.equal(401);
		});
	});

	describe('sendCurrentUser:', function() {
		it('responds 401 with a null user when there is no session user (JAM-29)', function() {
			var handler = buildHandler();
			var statusCode, body;
			var res = {status: function(c) { statusCode = c; return this; }, json: function(b) { body = b; }};
			handler.sendCurrentUser({user: undefined}, res);
			expect(statusCode).to.equal(401);
			expect(body).to.eql({user: null});
		});

		it('expands roles and returns 200 with the expanded user', function(done) {
			var handler = buildHandler({
				userService: {
					expandRoles: function(user) {
						expect(user.username).to.equal('admin');
						return Promise.resolve({username: 'admin', roles: [{name: 'ADMIN', isAlmighty: true}]});
					}
				}
			});
			var res = {
				status: function(c) { this.statusCode = c; return this; },
				json: function(b) {
					expect(this.statusCode).to.equal(200);
					expect(b.user.roles[0].isAlmighty).to.equal(true);
					done();
				}
			};
			handler.sendCurrentUser({user: {username: 'admin'}}, res);
		});
	});

	describe('login:', function() {
		function buildHandlerWithPassport(scenario) {
			return buildHandler({
				passport: {
					authenticate: function(strategyName, authenticationFailed) {
						expect(strategyName).to.equal('local');
						return function(req, res, next) {
							authenticationFailed(scenario.err, scenario.user, scenario.info);
						};
					}
				}
			});
		}

		it('calls next(err) when passport itself errors', function(done) {
			var handler = buildHandlerWithPassport({err: new Error('boom')});
			handler.login({}, {}, function(err) {
				expect(err.message).to.equal('boom');
				done();
			});
		});

		it('responds with a null user when credentials are rejected', function(done) {
			var handler = buildHandlerWithPassport({user: false, info: {message: 'bad creds'}});
			var res = {json: function(body) {
				expect(body).to.eql({user: null});
				done();
			}};
			handler.login({}, res, function() { throw new Error('next() should not be called'); });
		});

		it('logs the user in and returns a token on success', function(done) {
			var handler = buildHandlerWithPassport({user: {username: 'admin'}});
			var req = {logIn: function(user, callback) { callback(); }};
			var res = {json: function(body) {
				expect(body.user).to.eql({username: 'admin'});
				expect(body.token).to.be.a('string');
				done();
			}};
			handler.login(req, res, function() { throw new Error('next() should not be called'); });
		});
	});

	describe('logout:', function() {
		it('ends the session and responds 204', function() {
			var handler = buildHandler();
			var logoutCalled = false;
			var statusSent;
			var req = {logout: function() { logoutCalled = true; }};
			var res = {sendStatus: function(code) { statusSent = code; }};
			handler.logout(req, res);
			expect(logoutCalled).to.equal(true);
			expect(statusSent).to.equal(204);
		});
	});

	describe('resolveUser:', function() {
		it('responds 401 when the token carries no username', function() {
			var handler = buildHandler();
			var statusCode, body;
			var res = {status: function(c) { statusCode = c; return this; }, send: function(b) { body = b; }};
			handler.resolveUser({user: undefined}, res, function() {
				throw new Error('next() should not be called');
			});
			expect(statusCode).to.equal(401);
			expect(body).to.equal('invalid token...');
		});

		it('responds 401 when the username no longer resolves to a real account', function(done) {
			var handler = buildHandler({
				userPersistenceService: {findOneByUserName: function() { return Promise.resolve(null); }}
			});
			var res = {status: function(c) { this.statusCode = c; return this; }, send: function(b) {
				expect(this.statusCode).to.equal(401);
				expect(b).to.equal('invalid token...');
				done();
			}};
			handler.resolveUser({user: {username: 'ghost'}}, res, function() {
				throw new Error('next() should not be called');
			});
		});

		it('re-resolves the real, current role graph and calls next()', function(done) {
			var req = {user: {username: 'admin'}};
			var handler = buildHandler({
				userPersistenceService: {
					findOneByUserName: function(username) {
						expect(username).to.equal('admin');
						return Promise.resolve({username: 'admin', password: 'hash', roles: ['ADMIN']});
					},
					removeSensitiveData: function(u) { return {username: u.username, roles: u.roles}; }
				},
				userService: {
					expandRoles: function(u) {
						return Promise.resolve({username: u.username, roles: [{name: 'ADMIN', isAlmighty: true}]});
					}
				}
			});
			handler.resolveUser(req, {}, function(err) {
				expect(err).to.equal(undefined);
				expect(req.user.roles[0].isAlmighty).to.equal(true);
				done();
			});
		});

		it('passes a persistence-layer rejection to next()', function(done) {
			var handler = buildHandler({
				userPersistenceService: {findOneByUserName: function() { return Promise.reject(new Error('db down')); }}
			});
			handler.resolveUser({user: {username: 'admin'}}, {}, function(err) {
				expect(err.message).to.equal('db down');
				done();
			});
		});
	});
});
