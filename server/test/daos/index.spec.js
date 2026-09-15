'use strict';

var expect = require('chai').expect;
var setup = require('./setup');

/**
 * Integration-level coverage for src/api/daos.js and src/api/index.js
 * themselves - the DI wiring, not any one service's business logic (each
 * service has its own stubbed-dependency spec elsewhere in test/api/).
 * Real DAOs against the seeded in-memory DB prove the DaoSettings/schema
 * wiring actually works, not just that it doesn't throw at require time.
 */
describe('src/api/{daos,index}.js wiring:', function() {

	it('daos.js builds every DAO the app declares in config/default.js', function() {
		return setup.getDaos().then(function(daos) {
			['partyDao', 'staffDao', 'accountDao', 'authContextDao', 'roleDao',
				'groupDao', 'groupContentDao', 'groupAttributeValueDao'].forEach(function(name) {
				expect(daos[name], name).to.exist;
			});
		});
	});

	it('index.js wires every service with its real, seeded-DB-backed persistence dependency', function() {
		return setup.getApiIndex().then(function(api) {
			['UserService', 'AuthContextService', 'RoleService', 'PartyService',
				'PartyGroupService', 'UserAccessControl'].forEach(function(name) {
				expect(api[name], name).to.exist;
			});
		});
	});

	it('the wired UserService round-trips the seeded admin account through a real DB lookup', function() {
		return setup.getApiIndex().then(function(api) {
			return setup.getSeeded().then(function() {
				return new Promise(function(resolve, reject) {
					api.UserService.findBy('username', 'admin', function(err, result) {
						if (err) { return reject(err); }
						resolve(result);
					});
				});
			}).then(function(result) {
				expect(result).to.have.length(1);
				expect(result[0].username).to.equal('admin');
				// removeSensitiveData() stripped the password
				expect(result[0].password).to.equal(undefined);
			});
		});
	});
});
