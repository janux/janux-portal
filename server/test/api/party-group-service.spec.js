'use strict';

var expect = require('chai').expect;
var Promise = require('bluebird');
var freshRequire = require('../util/module-stub').freshRequire;

describe('src/api/party-group-service.js:', function() {

	function buildService(fakePersistence) {
		var partyGroupServiceModule = freshRequire('../../src/api/party-group-service');
		return partyGroupServiceModule.create(fakePersistence);
	}

	it('findPropertiesByType delegates to the persistence layer', function(done) {
		var service = buildService({findPropertiesByType: function(type) { expect(type).to.equal('T'); return Promise.resolve([]); }});
		service.findPropertiesByType('T', function(err, result) {
			expect(err).to.equal(null);
			expect(result).to.eql([]);
			done();
		});
	});

	it('findPropertiesOwnedByPartyAndTypes delegates to the persistence layer', function(done) {
		var service = buildService({
			findPropertiesOwnedByPartyAndTypes: function(partyId, types) {
				expect(partyId).to.equal('p-1');
				expect(types).to.eql(['T']);
				return Promise.resolve([]);
			}
		});
		service.findPropertiesOwnedByPartyAndTypes('p-1', ['T'], function(err, result) {
			expect(err).to.equal(null);
			done();
		});
	});

	it('findOne delegates to the persistence layer', function(done) {
		var service = buildService({findOne: function(code) { expect(code).to.equal('G1'); return Promise.resolve({code: 'G1'}); }});
		service.findOne('G1', function(err, result) {
			expect(err).to.equal(null);
			expect(result.code).to.equal('G1');
			done();
		});
	});

	it('findOneOwnedByPartyAndType delegates to the persistence layer', function(done) {
		var service = buildService({
			findOneOwnedByPartyAndType: function(partyId, type, createOne) {
				expect(createOne).to.equal(true);
				return Promise.resolve({code: 'G1'});
			}
		});
		service.findOneOwnedByPartyAndType('p-1', 'T', true, function(err, result) {
			expect(err).to.equal(null);
			done();
		});
	});

	it('findByTypes delegates to the persistence layer', function(done) {
		var service = buildService({findByTypes: function(types) { return Promise.resolve([]); }});
		service.findByTypes(['T'], function(err, result) {
			expect(err).to.equal(null);
			done();
		});
	});

	it('insert converts the JSON group before persisting', function(done) {
		var insertedWith;
		var service = buildService({
			insert: function(partyId, group) { insertedWith = {partyId: partyId, group: group}; return Promise.resolve(group); }
		});
		service.insert('p-1', {code: 'G1', name: 'Group 1'}, function(err, result) {
			expect(err).to.equal(null);
			expect(insertedWith.partyId).to.equal('p-1');
			done();
		});
	});

	it('update converts the JSON group before persisting', function(done) {
		var service = buildService({update: function(group) { return Promise.resolve(group); }});
		service.update({code: 'G1', name: 'Group 1'}, function(err, result) {
			expect(err).to.equal(null);
			done();
		});
	});

	it('remove delegates to the persistence layer', function(done) {
		var service = buildService({remove: function(code) { expect(code).to.equal('G1'); return Promise.resolve({removed: true}); }});
		service.remove('G1', function(err, result) {
			expect(err).to.equal(null);
			expect(result).to.eql({removed: true});
			done();
		});
	});

	it('addItem converts the JSON item before persisting', function(done) {
		var service = buildService({addItem: function(code, item) { return Promise.resolve(item); }});
		service.addItem('G1', {partyId: 'p-1'}, function(err, result) {
			expect(err).to.equal(null);
			done();
		});
	});

	describe('addItemNewParty:', function() {
		it('converts the JSON party before persisting', function(done) {
			var insertedIsPerson;
			var service = buildService({
				addItemNewParty: function(code, party, attributes) {
					insertedIsPerson = (party.typeName === 'PersonImpl');
					return Promise.resolve({code: code});
				}
			});
			service.addItemNewParty('G1', {typeName: 'PersonImpl', name: {first: 'A', last: 'B'}, emails: []}, {}, function(err, result) {
				expect(err).to.equal(null);
				expect(insertedIsPerson).to.equal(true);
				done();
			});
		});

		// Regression: .asCallback(callback) used to be nested inside a
		// .then() handler on a freshly created Promise.resolve(result), so
		// a rejection from the persistence layer never reached the
		// callback.
		it('passes a persistence rejection to the callback', function(done) {
			var service = buildService({addItemNewParty: function() { return Promise.reject(new Error('boom')); }});
			service.addItemNewParty('G1', {name: {first: 'A', last: 'B'}, emails: []}, {}, function(err, result) {
				expect(err).to.be.instanceOf(Error);
				expect(result).to.equal(undefined);
				done();
			});
		});
	});

	it('removeItem delegates to the persistence layer', function(done) {
		var service = buildService({removeItem: function(code, partyId) { expect(partyId).to.equal('p-1'); return Promise.resolve({removed: true}); }});
		service.removeItem('G1', 'p-1', function(err, result) {
			expect(err).to.equal(null);
			expect(result).to.eql({removed: true});
			done();
		});
	});
});
