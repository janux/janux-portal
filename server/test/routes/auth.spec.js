'use strict';

/**
 * route/auth.js: verifies the HTTP verbs route correctly, and that
 * /authenticated-user's own composition (authenticationRequired ->
 * sendCurrentUser) behaves as wired - that's this file's own code, not
 * src/auth/authentication-handler.js's, which is already covered directly
 * in test/auth/authentication-handler.spec.js. Stubs that whole module so
 * none of its real passport/DB dependencies need to be wired up here.
 */

var request = require('supertest');
var expect = require('chai').expect;
var harness = require('./harness');

describe('route/auth.js:', function() {
	var restoreAuthenticationHandler;

	function buildApp(overrides) {
		// route/auth.js unconditionally wires all four handlers at
		// require time, regardless of which one a given test cares about.
		var fakeAuthenticate = Object.assign({
			login: function() { throw new Error('login not stubbed for this test'); },
			logout: function() { throw new Error('logout not stubbed for this test'); },
			sendCurrentUser: function() { throw new Error('sendCurrentUser not stubbed for this test'); },
			authenticationRequired: function() { throw new Error('authenticationRequired not stubbed for this test'); }
		}, overrides);
		restoreAuthenticationHandler = harness.stub('../../src/auth/authentication-handler', fakeAuthenticate);
		var mountAuthRoute = harness.freshRequire('../../route/auth');
		return harness.buildApp(mountAuthRoute);
	}

	afterEach(function() {
		if (restoreAuthenticationHandler) { restoreAuthenticationHandler(); restoreAuthenticationHandler = undefined; }
	});

	it('POST /login delegates to authenticate.login', function(done) {
		var app = buildApp({
			login: function(req, res) { res.json({user: {username: 'admin'}, token: 'tok'}); }
		});
		request(app).post('/login').send({username: 'admin', password: 'x'}).expect(200).end(function(err, res) {
			expect(err).to.equal(null);
			expect(res.body.user.username).to.equal('admin');
			done();
		});
	});

	it('POST /logout delegates to authenticate.logout', function(done) {
		var app = buildApp({
			logout: function(req, res) { res.sendStatus(204); }
		});
		request(app).post('/logout').expect(204, done);
	});

	it('GET /current-user delegates to authenticate.sendCurrentUser', function(done) {
		var app = buildApp({
			sendCurrentUser: function(req, res) { res.status(200).json({user: {username: 'admin'}}); }
		});
		request(app).get('/current-user').expect(200).end(function(err, res) {
			expect(err).to.equal(null);
			expect(res.body.user.username).to.equal('admin');
			done();
		});
	});

	describe('GET /authenticated-user:', function() {
		it('calls sendCurrentUser only once authenticationRequired admits the request', function(done) {
			var app = buildApp({
				authenticationRequired: function(req, res, next) { next(); },
				sendCurrentUser: function(req, res) { res.status(200).json({user: {username: 'admin'}}); }
			});
			request(app).get('/authenticated-user').expect(200).end(function(err, res) {
				expect(err).to.equal(null);
				expect(res.body.user.username).to.equal('admin');
				done();
			});
		});

		it('never reaches sendCurrentUser when authenticationRequired denies the request', function(done) {
			var sendCurrentUserCalled = false;
			var app = buildApp({
				authenticationRequired: function(req, res) { res.status(401).json({user: null}); },
				sendCurrentUser: function() { sendCurrentUserCalled = true; }
			});
			request(app).get('/authenticated-user').expect(401).end(function(err, res) {
				expect(err).to.equal(null);
				expect(sendCurrentUserCalled).to.equal(false);
				done();
			});
		});
	});
});
