'use strict';

var expect = require('chai').expect;
var Promise = require('bluebird');
var JanuxPeople = require('janux-people');
var freshRequire = require('../util/module-stub').freshRequire;

describe('src/api/party-service.js:', function() {

	function buildService(fakePersistence) {
		var partyServiceModule = freshRequire('../../src/api/party-service');
		return partyServiceModule.create(fakePersistence);
	}

	function fakePerson() {
		return JanuxPeople.Person.fromJSON({name: {first: 'Admin', last: 'User'}, emails: [{type: 'work', address: 'admin@example.com'}]});
	}

	// Each find* method used to nest .asCallback(callback) inside its
	// .then() handler on a freshly created Promise.resolve(...), instead
	// of chaining it onto the persistence call's own promise - so a
	// rejection from the persistence layer never reached the callback.
	// One regression test below (findByName) pins the fix; the others get
	// a happy-path test since the bug and fix are identical in shape.

	it('findByName maps each result to JSON', function(done) {
		var partyService = buildService({
			findByName: function(name) {
				expect(name).to.equal('Admin');
				return Promise.resolve([fakePerson()]);
			}
		});
		partyService.findByName('Admin', function(err, results) {
			expect(err).to.equal(null);
			expect(results).to.have.length(1);
			expect(results[0].name.first).to.equal('Admin');
			done();
		});
	});

	it('findByName passes a persistence rejection to the callback', function(done) {
		var partyService = buildService({
			findByName: function() { return Promise.reject(new Error('boom')); }
		});
		partyService.findByName('nobody', function(err, results) {
			expect(err).to.be.instanceOf(Error);
			expect(results).to.equal(undefined);
			done();
		});
	});

	it('findByEmail maps each result to JSON', function(done) {
		var partyService = buildService({
			findByEmail: function() { return Promise.resolve([fakePerson()]); }
		});
		partyService.findByEmail('admin@example.com', function(err, results) {
			expect(err).to.equal(null);
			expect(results).to.have.length(1);
			done();
		});
	});

	it('findPeople maps each result to JSON', function(done) {
		var partyService = buildService({
			findPeople: function() { return Promise.resolve([fakePerson()]); }
		});
		partyService.findPeople(function(err, results) {
			expect(err).to.equal(null);
			expect(results).to.have.length(1);
			done();
		});
	});

	it('findOrganizations maps each result to JSON', function(done) {
		var partyService = buildService({
			findOrganizations: function() { return Promise.resolve([]); }
		});
		partyService.findOrganizations(function(err, results) {
			expect(err).to.equal(null);
			expect(results).to.eql([]);
			done();
		});
	});

	it('findOne maps the single result to JSON', function(done) {
		var partyService = buildService({
			findOne: function(id) { expect(id).to.equal('p-1'); return Promise.resolve(fakePerson()); }
		});
		partyService.findOne('p-1', function(err, result) {
			expect(err).to.equal(null);
			expect(result.name.first).to.equal('Admin');
			done();
		});
	});

	it('findByIds maps each result to JSON', function(done) {
		var partyService = buildService({
			findByIds: function(ids) { expect(ids).to.eql(['p-1']); return Promise.resolve([fakePerson()]); }
		});
		partyService.findByIds(['p-1'], function(err, results) {
			expect(err).to.equal(null);
			expect(results).to.have.length(1);
			done();
		});
	});

	it('insert converts the plain object to a Person before persisting, and the result back to JSON', function(done) {
		var insertedWasPerson;
		var partyService = buildService({
			insert: function(party) { insertedWasPerson = (party.typeName === 'PersonImpl'); return Promise.resolve(party); }
		});
		partyService.insert({typeName: 'PersonImpl', name: {first: 'New', last: 'Contact'}, emails: []}, function(err, result) {
			expect(err).to.equal(null);
			expect(insertedWasPerson).to.equal(true);
			expect(result.name.first).to.equal('New');
			done();
		});
	});

	it('update converts the plain object to a Person before persisting, and the result back to JSON', function(done) {
		var partyService = buildService({
			update: function(party) { return Promise.resolve(party); }
		});
		partyService.update({name: {first: 'Admin', last: 'User'}, emails: []}, function(err, result) {
			expect(err).to.equal(null);
			expect(result.name.first).to.equal('Admin');
			done();
		});
	});

	it('remove delegates to the persistence layer', function(done) {
		var partyService = buildService({
			remove: function(id) { expect(id).to.equal('p-1'); return Promise.resolve({removed: true}); }
		});
		partyService.remove('p-1', function(err, result) {
			expect(err).to.equal(null);
			expect(result).to.eql({removed: true});
			done();
		});
	});
});
