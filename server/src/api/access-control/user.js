'user strict';

let log4js = require('log4js'),
	_      = require('lodash'),
	Promise = require('bluebird'),
	stack	= require('stack-trace'),
	log    = log4js.getLogger('UserAccessControl');

// letiable to hold the singleton instance, if used in that manner
let userServiceInstance = undefined;
let userServicePersistence = undefined;
//
// Example of user service
//

let createInstance = function (serviceReference) {

	userServicePersistence = serviceReference;

	const isAdmin = (user) => {
		return (user.roles[0].isAlmighty);
	};

	// Constructor
	function UserService() {
		//userDAO.call(this);
	}

	UserService.prototype = Object.create(null);
	UserService.prototype.constructor = UserService;

	//
	// Specific methods of user service
	//

	// Find records depending on a particular field
	UserService.prototype.findBy = function (field, search, user) {
		const method = stack.get()[0].getFunctionName() + ':';
		const out = isAdmin(user);
		log.debug(`${method} result ${out}`);
		return Promise.resolve(out);
	};

	UserService.prototype.findById = function (userId, user) {
		const method = stack.get()[0].getFunctionName() + ':';
		const out = (isAdmin(user) || (user.userId === userId));
		log.debug(`${method} result ${out}`);
		return Promise.resolve(out);
	};

	UserService.prototype.findOneByUsernameOrEmail = function (subject) {
		const method = stack.get()[0].getFunctionName() + ':';
		// No access control
		log.debug(`${method} No access control required`);
		return Promise.resolve(true);
	};

	// Override the method to save users
	UserService.prototype.saveOrUpdate = function (aUserObj, user) {
		log.info('save or update method', JSON.stringify(aUserObj));
		const method = stack.get()[0].getFunctionName() + ':';
		let out = false;
		if (_.isNil(aUserObj.id)) {
			out = isAdmin(user);
		} else {
			out = (isAdmin(user) || (aUserObj.userId === user.userId));
		}
		log.debug(`${method} result ${out}`);
		return Promise.resolve(out);
	};

	// Insert a new user, user object must contains contact information to insert a new party
	UserService.prototype.insert = function (aUserObj, user) {
		const method = stack.get()[0].getFunctionName() + ':';
		const out = isAdmin(user);
		log.debug(`${method} result ${out}`);
		return Promise.resolve(out);
	};

	UserService.prototype.deleteUser = function (userId, user) {
		const method = stack.get()[0].getFunctionName() + ':';
		const out = isAdmin(user);
		log.debug(`${method} result ${out}`);
		return Promise.resolve(out);
	};

	UserService.prototype.deleteByUserIds = function (userIds, user) {
		const method = stack.get()[0].getFunctionName() + ':';
		const out = isAdmin(user);
		log.debug(`${method} result ${out}`);
		return Promise.resolve(out);
	};

	return new UserService();
};

module.exports.create = function (UserDAO) {
	// if the instance does not exist, create it
	if (!_.isObject(userServiceInstance)) {
		// userServiceInstance = new UserService(aDAO);
		userServiceInstance = createInstance(UserDAO);
	}
	return userServiceInstance;
};
