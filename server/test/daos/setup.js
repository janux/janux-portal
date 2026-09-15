'use strict';

/**
 * Seeded, in-memory test database for server's DAO/DI-wiring tests. Real
 * (not mocked) in-memory MongoDB via mongo-unit, set up once and torn down
 * once for the whole suite run (see 00-teardown.spec.js's root-level
 * `after`), not per test or per file.
 *
 * src/api/daos.js reads config.serverAppContext.db.mongoConnUrl once, at
 * its own require time, to build its DaoFactory-backed DAOs - so getDaos()
 * has to (a) point that config value at the mongo-unit URL, then (b)
 * freshRequire daos.js so it re-reads it. src/api/index.js captures its
 * own dependencies (daos.js, and every `.create(dependency)` service
 * module) at require time too, so getApiIndex() freshRequires the whole
 * chain, in that order, so every link picks up what the previous one just
 * rebuilt.
 *
 * IMPORTANT - janux-persist's own DataSourceHandler.getDataSource()
 * (node_modules/janux-persist/dist/services/datasource-handler/
 * datasource-handler.js) has a real bug: its existing-datasource filter
 * effectively only keys on dbEngine, not on the connection path/URL - so
 * the *first* caller in the whole process to ever request a "mongoose"
 * datasource wins that shared connection for everyone, for the life of the
 * process, regardless of what path any later caller asks for. getDaos()
 * only gets a real, isolated mongo-unit connection if it is the *first*
 * code in the process to reach DataSourceHandler.getDataSource() - which
 * means no *.spec.js file may require (even transitively, e.g. via
 * app-context.js) anything that reaches daos.js at module top level;
 * always defer such requires into a before() hook (mocha loads every spec
 * file's top-level code before running any hook, across every file - a
 * top-level require elsewhere still runs first regardless of file/hook
 * order). Getting this wrong doesn't error - it silently binds the
 * "fresh" test DAOs to whatever real database won the race.
 */

var _ = require('underscore');
var mongoUnit = require('mongo-unit');
var config = require('config');
var JanuxPeople = require('janux-people');
var moduleStub = require('../util/module-stub');

// partyDao.validateBeforeInsert() calls objectToInsert.emailAddresses() - a
// plain {typeName, name, emails} object isn't enough, it has to be a real
// janux-people Person/Organization instance.
var fixtures = {
	contacts: {
		admin: JanuxPeople.Person.fromJSON({
			name: {first: 'Admin', last: 'User'},
			emails: [{type: 'work', address: 'admin@janux-portal.example'}]
		})
	},
	accounts: {
		// contactId is filled in once the matching contact above has been
		// inserted and its auto-generated id is known.
		admin: {
			username: 'admin',
			password: 'seed-hash-not-a-real-credential',
			enabled: true,
			locked: false,
			roles: ['ADMIN']
		}
	}
};

// Every src/api/*.js file using the `.create(dependency)`
// singleton-memoizing factory pattern. src/api/index.js calls `.create()`
// on each of these exactly once, the first time it's required in the
// process - so each has to be freshRequire()d too, to reset its own
// memoized instance, or index.js's require() of it would just return the
// already-poisoned singleton from the cache.
var API_SINGLETON_MODULES = [
	'../../src/api/user-service',
	'../../src/api/auth-context-service',
	'../../src/api/role-service',
	'../../src/api/party-service',
	'../../src/api/party-group-service',
	'../../src/api/access-control/user'
];

var daosPromise;
var seededPromise;
var apiIndexPromise;

function seed(daos) {
	// Not _.clone()d - it'd copy fixtures.contacts.admin's own properties
	// into a plain object, losing the janux-people Person prototype (and
	// so emailAddresses()) that validateBeforeInsert() above needs.
	return daos.partyDao.insert(fixtures.contacts.admin).then(function(adminContact) {
		return daos.accountDao.insert(_.extend({}, fixtures.accounts.admin, {contactId: adminContact.id})).then(function(adminAccount) {
			return {
				contacts: {admin: adminContact},
				accounts: {admin: adminAccount}
			};
		});
	});
}

// Starts mongo-unit (once), points config at it, freshRequires daos.js so
// it builds its DaoFactory-backed DAOs against the test DB, and seeds the
// fixtures above. Memoized - later calls return the same in-flight/settled
// promise rather than starting a second mongo-unit instance or seeding
// twice.
function getDaos() {
	if (!daosPromise) {
		// janux-portal-{env} - matching this project's own kebab-case
		// convention (config/local.js uses janux-portal-dev).
		daosPromise = mongoUnit.start({dbName: 'janux-portal-test'}).then(function(testDbUrl) {
			config.serverAppContext.db.mongoConnUrl = testDbUrl;
			var daos = moduleStub.freshRequire('../../src/api/daos');
			seededPromise = seed(daos);
			return seededPromise.then(function() { return daos; });
		});
	}
	return daosPromise;
}

// Same as getDaos(), but freshRequires the rest of the DI chain
// (index.js) too, for tests that need the fully wired services rather
// than raw DAOs.
function getApiIndex() {
	if (!apiIndexPromise) {
		apiIndexPromise = getDaos().then(function() {
			API_SINGLETON_MODULES.forEach(function(modulePath) {
				moduleStub.freshRequire(modulePath);
			});
			return moduleStub.freshRequire('../../src/api/index');
		});
	}
	return apiIndexPromise;
}

// Resolves to the fixtures actually inserted (with their DB-assigned ids),
// once seeding has happened.
function getSeeded() {
	return getDaos().then(function() { return seededPromise; });
}

function teardownAll() {
	if (!daosPromise) { return Promise.resolve(); }
	return mongoUnit.stop();
}

module.exports = {
	fixtures: fixtures,
	getDaos: getDaos,
	getApiIndex: getApiIndex,
	getSeeded: getSeeded,
	teardownAll: teardownAll
};
