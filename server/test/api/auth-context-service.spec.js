'use strict';

var expect = require('chai').expect;
var Promise = require('bluebird');
var freshRequire = require('../util/module-stub').freshRequire;

describe('src/api/auth-context-service.js:', function() {

	function buildService(fakes) {
		var authContextServiceModule = freshRequire('../../src/api/auth-context-service');
		return authContextServiceModule.create(fakes.authContext || {}, fakes.authContextGroup || {});
	}

	it('findAll delegates to the auth-context persistence layer', function(done) {
		var service = buildService({authContext: {findAll: function() { return Promise.resolve([{name: 'A'}]); }}});
		service.findAll(function(err, result) {
			expect(err).to.equal(null);
			expect(result).to.eql([{name: 'A'}]);
			done();
		});
	});

	it('findGroups delegates to the group persistence layer', function(done) {
		var service = buildService({authContextGroup: {findAll: function() { return Promise.resolve([{code: 'G1'}]); }}});
		service.findGroups(function(err, result) {
			expect(err).to.equal(null);
			expect(result).to.eql([{code: 'G1'}]);
			done();
		});
	});

	it('findOneByName resolves the context as JSON', function(done) {
		var service = buildService({
			authContext: {findOneByName: function(name) {
				expect(name).to.equal('READ');
				return Promise.resolve({toJSON: function() { return {name: 'READ'}; }});
			}}
		});
		service.findOneByName('READ', function(err, result) {
			expect(err).to.equal(null);
			expect(result).to.eql({name: 'READ'});
			done();
		});
	});

	describe('insert:', function() {
		it('inserts the context, then adds it to the given group', function(done) {
			var addedTo;
			var service = buildService({
				authContext: {insert: function(ctx) { return Promise.resolve({id: 'c-1', name: ctx.name}); }},
				authContextGroup: {addItem: function(code, ctx) { addedTo = code; return Promise.resolve(ctx); }}
			});
			service.insert('G1', {name: 'READ'}, function(err, result) {
				expect(err).to.equal(null);
				expect(addedTo).to.equal('G1');
				expect(result.id).to.equal('c-1');
				done();
			});
		});

		// Regression: .asCallback(callback) used to be nested inside the
		// insert().then() handler on the *inner* addItem() call only - so
		// a rejection from insert() itself never reached the callback.
		it('passes an insert rejection to the callback', function(done) {
			var service = buildService({authContext: {insert: function() { return Promise.reject(new Error('boom')); }}});
			service.insert('G1', {name: 'READ'}, function(err) {
				expect(err).to.be.instanceOf(Error);
				done();
			});
		});
	});

	describe('update:', function() {
		function fakeContext() {
			return {id: 'c-1', toJSON: function() { return {id: 'c-1', name: 'OLD'}; }};
		}

		it('loads by name, switches group, then persists the update', function(done) {
			var switched, updated;
			var service = buildService({
				authContext: {
					findOneByName: function() { return Promise.resolve(fakeContext()); },
					update: function(ctx) { updated = ctx; return Promise.resolve(ctx); }
				},
				authContextGroup: {switchToNewGroup: function(ctx, groupCode) { switched = groupCode; return Promise.resolve(); }}
			});
			service.update('OLD', 'G2', {name: 'NEW', description: 'd', bit: 1, sortOrder: 1, enabled: true}, function(err) {
				expect(err).to.equal(null);
				expect(switched).to.equal('G2');
				expect(updated.name).to.equal('NEW');
				done();
			});
		});

		it('passes a findOneByName rejection to the callback', function(done) {
			var service = buildService({authContext: {findOneByName: function() { return Promise.reject(new Error('no such context')); }}});
			service.update('MISSING', 'G1', {}, function(err) {
				expect(err).to.be.instanceOf(Error);
				done();
			});
		});
	});

	it('deleteByName removes the group reference, then deletes the context', function(done) {
		var removedFrom;
		var service = buildService({
			authContext: {
				findOneByName: function() { return Promise.resolve({name: 'READ'}); },
				deleteByName: function(name) { expect(name).to.equal('READ'); return Promise.resolve({removed: true}); }
			},
			authContextGroup: {removeItem: function(code, ctx) { removedFrom = code; return Promise.resolve(); }}
		});
		service.deleteByName('G1', 'READ', function(err, result) {
			expect(err).to.equal(null);
			expect(removedFrom).to.equal('G1');
			expect(result).to.eql({removed: true});
			done();
		});
	});

	it('insertGroup builds a GroupImpl and persists it', function(done) {
		var insertedWith;
		var service = buildService({
			authContextGroup: {insert: function(group) { insertedWith = group; return Promise.resolve(group); }}
		});
		service.insertGroup({name: 'G1', code: 'g1', description: 'd', attributes: []}, function(err, result) {
			expect(err).to.equal(null);
			expect(insertedWith.name).to.equal('G1');
			expect(insertedWith.values).to.eql([]);
			done();
		});
	});

	describe('updateGroup:', function() {
		it('loads the group by code, then persists the editable fields', function(done) {
			var updated;
			var service = buildService({
				authContextGroup: {
					findOne: function() { return Promise.resolve({code: 'g1', name: 'OLD'}); },
					update: function(group) { updated = group; return Promise.resolve(group); }
				}
			});
			service.updateGroup('g1', {name: 'NEW', code: 'g1', description: 'd'}, function(err) {
				expect(err).to.equal(null);
				expect(updated.name).to.equal('NEW');
				done();
			});
		});

		// Regression: same nested-asCallback shape as insert/deleteByName.
		it('passes a findOne rejection to the callback', function(done) {
			var service = buildService({authContextGroup: {findOne: function() { return Promise.reject(new Error('no such group')); }}});
			service.updateGroup('missing', {}, function(err) {
				expect(err).to.be.instanceOf(Error);
				done();
			});
		});
	});

	it('updateGroupsSortOrder delegates to the group persistence layer', function(done) {
		var service = buildService({authContextGroup: {updateGroupsSortOrder: function(order) { return Promise.resolve(order); }}});
		service.updateGroupsSortOrder(['g1', 'g2'], function(err, result) {
			expect(err).to.equal(null);
			expect(result).to.eql(['g1', 'g2']);
			done();
		});
	});

	it('findGroupByCode delegates to the group persistence layer', function(done) {
		var service = buildService({authContextGroup: {findOne: function(code) { expect(code).to.equal('g1'); return Promise.resolve({code: 'g1'}); }}});
		service.findGroupByCode('g1', function(err, result) {
			expect(err).to.equal(null);
			expect(result.code).to.equal('g1');
			done();
		});
	});

	it('removeGroup delegates to the group persistence layer', function(done) {
		var service = buildService({authContextGroup: {remove: function(code) { expect(code).to.equal('g1'); return Promise.resolve({removed: true}); }}});
		service.removeGroup('g1', function(err, result) {
			expect(err).to.equal(null);
			expect(result).to.eql({removed: true});
			done();
		});
	});
});
