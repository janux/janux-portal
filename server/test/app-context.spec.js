'use strict';

var expect = require('chai').expect;
var passport = require('passport');
var moduleStub = require('./util/module-stub');
var stub = moduleStub.stub;
var freshRequire = moduleStub.freshRequire;

/**
 * app-context.js's real work happens at require time: it registers
 * passport's serialize/deserialize callbacks and the local auth strategy
 * on the (real, singleton) passport module. passport accumulates
 * serializers/deserializers/strategies across repeated registrations
 * rather than replacing them (confirmed: calling passport.serializeUser()
 * twice tries the first-registered one first, forever) - so passport's
 * own registries are reset before each freshRequire below, or only the
 * very first test's registration would ever actually run.
 */
describe('app-context.js:', function() {
	var restoreUserService;

	function buildAppContext(fakeUserService) {
		passport._serializers = [];
		passport._deserializers = [];
		passport._strategies = {};
		restoreUserService = stub('../../src/auth/user-service', fakeUserService || {});
		return freshRequire('../../app-context');
	}

	afterEach(function() {
		if (restoreUserService) { restoreUserService(); restoreUserService = undefined; }
	});

	describe('passport session serialization:', function() {
		it('serializeUser stores just the userId', function(done) {
			buildAppContext();
			passport.serializeUser({userId: 'u-1', username: 'admin'}, function(err, serialized) {
				expect(err).to.equal(null);
				expect(serialized).to.equal('u-1');
				done();
			});
		});

		it('deserializeUser loads the user by id via user-service, stripped of sensitive data', function(done) {
			buildAppContext({
				load: function(userId, callback) {
					expect(userId).to.equal('u-1');
					callback(null, {userId: 'u-1', username: 'admin'});
				}
			});
			passport.deserializeUser('u-1', function(err, user) {
				expect(err).to.equal(null);
				expect(user.username).to.equal('admin');
				done();
			});
		});

		it('deserializeUser passes a user-service error through', function(done) {
			buildAppContext({
				load: function(userId, callback) { callback(new Error('gone')); }
			});
			passport.deserializeUser('missing', function(err, user) {
				expect(err).to.be.instanceOf(Error);
				done();
			});
		});
	});

	describe('the local strategy:', function() {
		it('delegates verification to user-service.authenticate', function(done) {
			var calledWith;
			buildAppContext({
				authenticate: function(username, password, callback) {
					calledWith = [username, password];
					callback(null, {username: username});
				}
			});
			passport._strategies.local._verify('admin', 'secret', function(err, user) {
				expect(err).to.equal(null);
				expect(calledWith).to.eql(['admin', 'secret']);
				expect(user.username).to.equal('admin');
				done();
			});
		});
	});
});
