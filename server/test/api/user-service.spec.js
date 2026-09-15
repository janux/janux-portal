'use strict';

var expect = require('chai').expect;
var Promise = require('bluebird');
var freshRequire = require('../util/module-stub').freshRequire;

/**
 * src/api/user-service.js is a memoizing `.create(serviceReference)`
 * factory - each test below freshRequires it and calls .create() with its
 * own fake persistence service, rather than sharing the one instance
 * src/api/index.js wires up for the real app.
 */
describe('src/api/user-service.js:', function() {

	function buildService(fakePersistence) {
		var userServiceModule = freshRequire('../../src/api/user-service');
		return userServiceModule.create(fakePersistence);
	}

	it('.create() memoizes: a second call with a different dependency returns the same instance', function() {
		var first = buildService({});
		var userServiceModule = require('../../src/api/user-service');
		var second = userServiceModule.create({});
		expect(second).to.equal(first);
	});

	describe('findBy:', function() {
		it('dispatches to the persistence method matching the given field, and strips sensitive data from each result', function(done) {
			var userService = buildService({
				findAllByUserNameMatch: function(search) {
					expect(search).to.equal('admin');
					return Promise.resolve([{username: 'admin', password: 'secret'}]);
				},
				removeSensitiveData: function(o) {
					return {username: o.username};
				}
			});
			userService.findBy('username', 'admin', function(err, result) {
				expect(err).to.equal(null);
				expect(result).to.eql([{username: 'admin'}]);
				done();
			});
		});

		// The bug this test guards against: the persistence call's promise
		// was resolved inside a .then() success handler, with
		// .asCallback(callback) nested inside that handler rather than
		// chained onto the outer promise - so a rejection never reached the
		// callback at all, and a caller would hang forever instead of
		// getting an error.
		it('passes a rejection from the persistence layer to the callback instead of swallowing it', function(done) {
			var userService = buildService({
				findAllByUserNameMatch: function() {
					return Promise.reject(new Error('boom'));
				}
			});
			userService.findBy('username', 'nobody', function(err, result) {
				expect(err).to.exist;
				expect(err.message).to.equal('boom');
				expect(result).to.equal(undefined);
				done();
			});
		});
	});

	describe('findById:', function() {
		it('resolves the user and strips sensitive data', function(done) {
			var userService = buildService({
				findOneByUserId: function(userId) {
					expect(userId).to.equal('u-1');
					return Promise.resolve({userId: 'u-1', password: 'secret'});
				},
				removeSensitiveData: function(o) {
					return {userId: o.userId};
				}
			});
			userService.findById('u-1', function(err, result) {
				expect(err).to.equal(null);
				expect(result).to.eql({userId: 'u-1'});
				done();
			});
		});

		it('passes a rejection from the persistence layer to the callback instead of swallowing it', function(done) {
			var userService = buildService({
				findOneByUserId: function() {
					return Promise.reject(new Error('not found'));
				}
			});
			userService.findById('missing', function(err, result) {
				expect(err).to.exist;
				expect(err.message).to.equal('not found');
				expect(result).to.equal(undefined);
				done();
			});
		});
	});

	it('saveOrUpdate delegates to the persistence layer', function(done) {
		var calledWith;
		var userService = buildService({
			saveOrUpdate: function(aUserObj) {
				calledWith = aUserObj;
				return Promise.resolve(aUserObj);
			}
		});
		userService.saveOrUpdate({username: 'admin'}, function(err, result) {
			expect(err).to.equal(null);
			expect(calledWith).to.eql({username: 'admin'});
			expect(result).to.eql({username: 'admin'});
			done();
		});
	});

	it('deleteUser delegates to the persistence layer', function(done) {
		var calledWith;
		var userService = buildService({
			deleteUserByUserId: function(userId) {
				calledWith = userId;
				return Promise.resolve({removed: true});
			}
		});
		userService.deleteUser('u-1', function(err, result) {
			expect(err).to.equal(null);
			expect(calledWith).to.equal('u-1');
			expect(result).to.eql({removed: true});
			done();
		});
	});
});
