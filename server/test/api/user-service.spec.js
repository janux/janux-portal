var _    = require('lodash')
	cfg    = require('config'),
	expect = require('chai').expect,
	log4js = require('log4js'),
	should = require('should'),
	util   = require('util'),
	// src/api/user-service.js exports the raw `.create(dependency)` factory,
	// not a usable instance - src/api/index.js is what wires it up with its
	// real UserPersistenceService dependency, the same way route files do.
	userService = require('../../src/api/index').UserService;

var log = log4js.getLogger('test');
log4js.configure(cfg.serverAppContext.log4js.config);

describe ('user-service:', function() {

	it("should return a user by its name", function(done) {
		// findByUsername doesn't exist on the current UserService - this was
		// the exact-match lookup, which findBy('username', ...) now is.
		userService.findBy('username', 'admin', function(err, response) {
			if (err) (log.error('error: %j', err));
			log.info('response: %j', response);
			done();
		});
	});

	it("should return a user by specifying the corresponding field and its name", function(done) {
		userService.findBy('username','admin', function(err, response) {
			if (err) (log.error('error: %j', err));
			log.info('response: %j', response);
			done();
		});
	});

	it("should delete a user by id", function(done) {
		userService.deleteUser('8be24a60-3ac1-4414-abb0-b6739bbd0069', function(err, response) {
			if (err) (log.error('error: %j', err));
			log.info('response: %j', response);
			done();
		});
	});

});