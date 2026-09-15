'use strict';

var expect = require('chai').expect;
var Promise = require('bluebird');
var freshRequire = require('../util/module-stub').freshRequire;

describe('src/api/role-service.js:', function() {

	function buildService(fakePersistence) {
		var roleServiceModule = freshRequire('../../src/api/role-service');
		return roleServiceModule.create(fakePersistence);
	}

	it('findAll delegates to the persistence layer', function(done) {
		var roleService = buildService({
			findAll: function() { return Promise.resolve([{name: 'ADMIN'}]); }
		});
		roleService.findAll(function(err, roles) {
			expect(err).to.equal(null);
			expect(roles).to.eql([{name: 'ADMIN'}]);
			done();
		});
	});

	it('findOneByName delegates to the persistence layer', function(done) {
		var roleService = buildService({
			findOneByName: function(name) {
				expect(name).to.equal('ADMIN');
				return Promise.resolve({name: 'ADMIN'});
			}
		});
		roleService.findOneByName('ADMIN', function(err, role) {
			expect(err).to.equal(null);
			expect(role.name).to.equal('ADMIN');
			done();
		});
	});

	it('insert delegates to the persistence layer', function(done) {
		var roleService = buildService({
			insert: function(role) { return Promise.resolve(role); }
		});
		roleService.insert({name: 'NEW_ROLE'}, function(err, role) {
			expect(err).to.equal(null);
			expect(role.name).to.equal('NEW_ROLE');
			done();
		});
	});

	describe('update:', function() {
		function fakeRole() {
			return {
				id: 'r-1',
				toJSON: function() { return {id: 'r-1', name: 'OLD_NAME'}; }
			};
		}

		it('loads the role by name, then persists only the editable fields', function(done) {
			var updateCalledWith;
			var roleService = buildService({
				findOneByName: function() { return Promise.resolve(fakeRole()); },
				update: function(role) { updateCalledWith = role; return Promise.resolve(role); }
			});
			roleService.update('OLD_NAME', {
				name: 'NEW_NAME', description: 'd', enabled: true, isAlmighty: false,
				sortOrder: 1, authContexts: [], permissions: []
			}, function(err) {
				expect(err).to.equal(null);
				expect(updateCalledWith.name).to.equal('NEW_NAME');
				expect(updateCalledWith.id).to.equal('r-1');
				done();
			});
		});

		// Regression: .asCallback(callback) used to be nested inside the
		// findOneByName().then() handler, on the *inner* update() call
		// only - so a rejection from findOneByName itself never reached
		// the callback.
		it('passes a findOneByName rejection to the callback', function(done) {
			var roleService = buildService({
				findOneByName: function() { return Promise.reject(new Error('no such role')); }
			});
			roleService.update('MISSING', {}, function(err) {
				expect(err).to.be.instanceOf(Error);
				expect(err.message).to.equal('no such role');
				done();
			});
		});
	});

	it('updateSortOrder delegates to the persistence layer', function(done) {
		var roleService = buildService({
			updateSortOrder: function(order) { return Promise.resolve(order); }
		});
		roleService.updateSortOrder(['A', 'B'], function(err, order) {
			expect(err).to.equal(null);
			expect(order).to.eql(['A', 'B']);
			done();
		});
	});

	it('deleteByName delegates to the persistence layer', function(done) {
		var roleService = buildService({
			deleteByName: function(name) { expect(name).to.equal('ADMIN'); return Promise.resolve({removed: true}); }
		});
		roleService.deleteByName('ADMIN', function(err, result) {
			expect(err).to.equal(null);
			expect(result).to.eql({removed: true});
			done();
		});
	});
});
