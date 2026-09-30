'user strict';

var log4js = require('log4js'),
	_      = require('underscore'),
	bluebird = require('bluebird'),
	log    = log4js.getLogger('UserService'),
	md5 	= require('md5');

// variable to hold the singleton instance, if used in that manner
var userServiceInstance = undefined;
var userServicePersistence = undefined;
//
// Example of user service
//

var createInstance = function (serviceReference) {

	userServicePersistence = serviceReference;

	// Constructor
	function UserService() {
		//userDAO.call(this);
	}

	UserService.prototype = Object.create(null);
	UserService.prototype.constructor = UserService;

	//
	// Specific methods of user service
	//

	function logFailure(message) {
		return function (err) {
			if (_.isArray(err)) {
				log.warn(message + ': %s', _.map(err, function (e) { return e.message; }).join('; '));
			} else {
				log.error(message + ': %s', err && err.stack || err);
			}
			throw err;
		};
	}

	// Find records depending on a particular field
	UserService.prototype.findBy = function (field, search, callback) {
		log.debug("finding users by field %j, search %j", field, search);
		var promise;
		switch (field) {
			case 'username':
				promise = userServicePersistence.findAllByUserNameMatch(search);
				break;
			case 'name':
				promise = userServicePersistence.findAllByContactNameMatch(search);
				break;
			case 'email':
				promise = userServicePersistence.findAllByEmail(search);
				break;
			case 'phone':
				promise = userServicePersistence.findAllByPhone(search);
				break;
		}
		return promise
			.then(function (result) {
				var filteredResult = _.map(result, function (o) {
					return userServicePersistence.removeSensitiveData(o);
				});
				return filteredResult;
			})
			.catch(logFailure('failed to find users by field ' + JSON.stringify(field) + ', search ' + JSON.stringify(search)))
			.asCallback(callback);
	};

	UserService.prototype.findById = function (userId, callback) {
		log.debug("finding user by id %j", userId);
		return userServicePersistence.findOneByUserId(userId)
			.then(function (value) {
				return userServicePersistence.removeSensitiveData(value);
			})
			.catch(logFailure('failed to find user by id ' + JSON.stringify(userId)))
			.asCallback(callback);
	};

	// Override the method to save users
	UserService.prototype.saveOrUpdate = function (aUserObj, callback) {
		// Never log the raw object - it carries the plaintext password on
		// registration and password-change requests.
		log.debug("saving or updating user %j", _.omit(aUserObj, 'password'));

		return userServicePersistence.saveOrUpdate(aUserObj)
			.then(function (result) {
				log.info("saved user %j -> userId %j", aUserObj.username, result && result.userId);
				return result;
			})
			.catch(logFailure('failed to save user ' + JSON.stringify(aUserObj.username)))
			.asCallback(callback);

	};

	UserService.prototype.deleteUser = function (userId, callback) {
		log.debug("deleting user %j", userId);
		return userServicePersistence.deleteUserByUserId(userId)
			.then(function (result) {
				log.info("deleted user -> userId %j", userId);
				return result;
			})
			.catch(logFailure('failed to delete user ' + JSON.stringify(userId)))
			.asCallback(callback);
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
