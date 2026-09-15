'use strict';

var expect = require('chai').expect;
var Promise = require('bluebird');
var accessControl = require('../../src/auth/access-control');

function fakeReqRes(method, params) {
	return {
		req: {baseUrl: '/rpc/2.0/users', body: {method: method, params: params || []}, user: {username: 'admin'}},
		res: {statusCode: undefined, status: function(code) { this.statusCode = code; return this; }, end: function() {}}
	};
}

describe('src/auth/access-control.js middleware:', function() {

	it('calls next() with no access-control service at all', function(done) {
		var mw = accessControl.middleware(undefined);
		var rr = fakeReqRes('findBy', ['username', 'admin']);
		mw(rr.req, rr.res, function() { done(); });
	});

	it('calls next() when the service has no handler for the requested method', function(done) {
		var mw = accessControl.middleware({});
		var rr = fakeReqRes('findBy', ['username', 'admin']);
		mw(rr.req, rr.res, function() { done(); });
	});

	it('admits the request when the handler resolves true, appending req.user as the last argument', function(done) {
		var calledWith;
		var mw = accessControl.middleware({
			findBy: function() {
				calledWith = Array.prototype.slice.call(arguments);
				return Promise.resolve(true);
			}
		});
		var rr = fakeReqRes('findBy', ['username', 'admin']);
		mw(rr.req, rr.res, function() {
			expect(calledWith).to.eql(['username', 'admin', {username: 'admin'}]);
			done();
		});
	});

	it('responds 403 and does not call next() when the handler resolves false', function(done) {
		var mw = accessControl.middleware({
			deleteUser: function() { return Promise.resolve(false); }
		});
		var rr = fakeReqRes('deleteUser', ['u-1']);
		mw(rr.req, rr.res, function() {
			throw new Error('next() should not be called when access is forbidden');
		});
		setTimeout(function() {
			expect(rr.res.statusCode).to.equal(403);
			done();
		}, 10);
	});
});
