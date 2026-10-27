'use strict';

var expect = require('chai').expect;
var januxPersist = require('janux-persist');
var UserGenerator = require('./user-generator/user-generator').UserGenerator;

/**
 * The demo accounts the login page advertises (client/src/common/security/
 * login/login-component.vue) are created by this generator through
 * UserService, which refuses a password that breaks the password policy, and
 * authenticate() refuses an account that is not enabled. Neither held for
 * the original seed data, so every demo login failed on QA.
 */
describe('user generator:', function() {
	var users;

	before(function() {
		users = UserGenerator.generateUserFakeData();
	});

	it('generates the three demo accounts the login page shows', function() {
		var byName = {};
		users.forEach(function(user) { byName[user.username] = user; });

		expect(byName.widget.password).to.equal('widget-demo-1');
		expect(byName.manager.password).to.equal('manager-demo-2');
		expect(byName.admin.password).to.equal('admin-demo-3');
	});

	it('gives every generated account, demo or random, a password that satisfies the policy', function() {
		expect(users.length).to.be.above(3);
		users.forEach(function(user) {
			expect(januxPersist.isPasswordValid(user.password, januxPersist.DEFAULT_PASSWORD_POLICY),
				'password of "' + user.username + '"').to.equal(true);
		});
	});

	it('enables every generated account, so authenticate() lets it sign in', function() {
		users.forEach(function(user) {
			expect(user.enabled, 'enabled flag of "' + user.username + '"').to.equal(true);
		});
	});
});
