'use strict';

var expect = require('chai').expect;
var freshRequire = require('../util/module-stub').freshRequire;

/**
 * src/api/access-control/user.js: the actual admin/self decision logic
 * plugged into src/auth/access-control.js's generic middleware
 * (test/auth/access-control.spec.js covers that generic wiring with a
 * fake service; this covers the real decisions this file makes).
 */
describe('src/api/access-control/user.js:', function() {

	function buildAccessControl() {
		var module = freshRequire('../../src/api/access-control/user');
		// The dependency isn't actually read anywhere in the file's
		// method bodies (only isAdmin(user)/userId comparisons are), but
		// .create() still takes one - a real DAO in production.
		return module.create({});
	}

	function admin() {
		return {userId: 'admin-1', roles: [{isAlmighty: true}]};
	}

	function nonAdmin(userId) {
		return {userId: userId, roles: [{isAlmighty: false}]};
	}

	it('findBy: only an admin is granted', function() {
		var ac = buildAccessControl();
		return Promise.all([
			ac.findBy('username', 'x', admin()).then(function(granted) { expect(granted).to.equal(true); }),
			ac.findBy('username', 'x', nonAdmin('u-1')).then(function(granted) { expect(granted).to.equal(false); })
		]);
	});

	it('findById: an admin or the user themselves is granted', function() {
		var ac = buildAccessControl();
		return Promise.all([
			ac.findById('u-1', admin()).then(function(granted) { expect(granted).to.equal(true); }),
			ac.findById('u-1', nonAdmin('u-1')).then(function(granted) { expect(granted).to.equal(true); }),
			ac.findById('u-1', nonAdmin('u-2')).then(function(granted) { expect(granted).to.equal(false); })
		]);
	});

	it('findOneByUsernameOrEmail: always granted (no access control)', function() {
		var ac = buildAccessControl();
		return ac.findOneByUsernameOrEmail('anything').then(function(granted) {
			expect(granted).to.equal(true);
		});
	});

	describe('saveOrUpdate:', function() {
		it('requires admin to create a new user (no id)', function() {
			var ac = buildAccessControl();
			return Promise.all([
				ac.saveOrUpdate({username: 'new'}, admin()).then(function(granted) { expect(granted).to.equal(true); }),
				ac.saveOrUpdate({username: 'new'}, nonAdmin('u-1')).then(function(granted) { expect(granted).to.equal(false); })
			]);
		});

		it('allows a non-admin to update their own existing record', function() {
			var ac = buildAccessControl();
			return Promise.all([
				ac.saveOrUpdate({id: 'x', userId: 'u-1'}, nonAdmin('u-1')).then(function(granted) { expect(granted).to.equal(true); }),
				ac.saveOrUpdate({id: 'x', userId: 'u-2'}, nonAdmin('u-1')).then(function(granted) { expect(granted).to.equal(false); })
			]);
		});
	});

	it('insert: only an admin is granted', function() {
		var ac = buildAccessControl();
		return Promise.all([
			ac.insert({}, admin()).then(function(granted) { expect(granted).to.equal(true); }),
			ac.insert({}, nonAdmin('u-1')).then(function(granted) { expect(granted).to.equal(false); })
		]);
	});

	it('deleteUser: only an admin is granted', function() {
		var ac = buildAccessControl();
		return Promise.all([
			ac.deleteUser('u-1', admin()).then(function(granted) { expect(granted).to.equal(true); }),
			ac.deleteUser('u-1', nonAdmin('u-1')).then(function(granted) { expect(granted).to.equal(false); })
		]);
	});

	it('deleteByUserIds: only an admin is granted', function() {
		var ac = buildAccessControl();
		return Promise.all([
			ac.deleteByUserIds(['u-1'], admin()).then(function(granted) { expect(granted).to.equal(true); }),
			ac.deleteByUserIds(['u-1'], nonAdmin('u-1')).then(function(granted) { expect(granted).to.equal(false); })
		]);
	});
});
