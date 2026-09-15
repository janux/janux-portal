'use strict';

var expect = require('chai').expect;
var jwt = require('jsonwebtoken');
var config = require('config').serverAppContext;
var tokenHandler = require('../../src/auth/token-handler');

describe('src/auth/token-handler.js:', function() {

	describe('generateToken:', function() {
		it('signs a token carrying only the username (JAM-29: no roles, no contact)', function() {
			var token = tokenHandler.generateToken({username: 'admin', roles: ['ADMIN'], contact: {id: 'c-1'}});
			var decoded = jwt.verify(token, config.server.secret);
			expect(decoded.username).to.equal('admin');
			expect(decoded).to.not.have.property('roles');
			expect(decoded).to.not.have.property('contact');
		});

		// The token targets a fixed wall-clock instant (3am local the
		// following day), not a fixed duration from "now" - so the exact
		// lifetime depends on what time the test happens to run. Bound it
		// generously rather than asserting an exact hour-of-day (one clock
		// tick from flaking at the boundary). What this pins down is that
		// it's on the order of a day - not the ~279 days the ms/seconds
		// bug produced (expiresIn takes seconds; Date#getTime() returns
		// milliseconds, and the difference was passed straight through).
		it('expires roughly a day out, not ~279 days out', function() {
			var before = Date.now();
			var token = tokenHandler.generateToken({username: 'admin'});
			var decoded = jwt.verify(token, config.server.secret);
			var lifetimeSeconds = decoded.exp - Math.floor(before / 1000);
			var maxLifetimeSeconds = 2 * 24 * 3600;
			expect(lifetimeSeconds).to.be.above(0);
			expect(lifetimeSeconds).to.be.below(maxLifetimeSeconds);
		});
	});

	describe('handleInvalidTokenAuth:', function() {
		it('responds 401 when the error is an UnauthorizedError', function() {
			var statusCode, body;
			var res = {
				status: function(code) { statusCode = code; return this; },
				send: function(msg) { body = msg; }
			};
			tokenHandler.handleInvalidTokenAuth({name: 'UnauthorizedError'}, {}, res, function() {
				throw new Error('next() should not be called for an UnauthorizedError');
			});
			expect(statusCode).to.equal(401);
			expect(body).to.equal('invalid token...');
		});

		it('calls next() for any other kind of error', function() {
			var nextCalled = false;
			tokenHandler.handleInvalidTokenAuth({name: 'SomeOtherError'}, {}, {}, function() {
				nextCalled = true;
			});
			expect(nextCalled).to.equal(true);
		});
	});
});
