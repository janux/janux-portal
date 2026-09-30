'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var GroupImpl = require('janux-persist').GroupImpl;

var log4js      = require('log4js'),
	log         = log4js.getLogger('AuthContextService');

// variable to hold the singleton instance, if used in that manner
var authContextServiceInstance = undefined;
var authContextServicePersistence = undefined;
var authContextGroupServicePersistence = undefined;

var createInstance = function(authContextServiceReference,
							  authContextGroupServiceReference) {

	authContextServicePersistence = authContextServiceReference;
	authContextGroupServicePersistence = authContextGroupServiceReference;

	// Constructor
	function AuthContextService() {
		// authDAO.call(this);
	}

	AuthContextService.prototype = Object.create(null);
	AuthContextService.prototype.constructor = AuthContextService;

	//
	// Returns a promise that resolves to a dictionary of the AuthContextorization Contexts
	// that make up the AuthContextorization Scheme for an application. The keys of the map
	// are the names of each AuthContextorizationContext.
	//
	function logFailure(message) {
		return function (err) {
			if (_.isArray(err)) {
				log.warn(message + ': %s', _.map(err, 'message').join('; '));
			} else {
				log.error(message + ': %s', err && err.stack || err);
			}
			throw err;
		};
	}

	AuthContextService.prototype.findAll = function(callback) {
		log.trace('finding all auth contexts');
		return authContextServicePersistence.findAll()
			.catch(logFailure('failed to find all auth contexts'))
			.asCallback(callback);
	};


	//
	// Returns Array of the AuthContextorization Context Groups
	//
	AuthContextService.prototype.findGroups = function(callback) {
		log.trace('finding all auth context groups');
		return authContextGroupServicePersistence.findAll()
			.catch(logFailure('failed to find all auth context groups'))
			.asCallback(callback);
	};

	//
	// Returns a dictionary of the AuthContextorization Contexts within their respective groups
	//
	AuthContextService.prototype.findGroupsList = function(callback) {
		log.trace('finding auth context group properties');
		return authContextGroupServicePersistence.findGroupProperties()
			.catch(logFailure('failed to find auth context group properties'))
			.asCallback(callback);
	};

	//
	// Returns a promise that resolves to a single authorizationContext
	//
	AuthContextService.prototype.findOneByName = function(name, callback) {
		log.debug('finding auth context by name %j', name);
		return authContextServicePersistence.findOneByName(name).then(function (result) {
			return result.toJSON();
		})
			.catch(logFailure('failed to find auth context by name ' + JSON.stringify(name)))
			.asCallback(callback);
	};

	//
	// Insert an authorization context in their respective group
	//
	AuthContextService.prototype.insert = function(authContextGroupCode, authContext, callback) {
		log.debug('inserting auth context %j into group %j', authContext, authContextGroupCode);

		// Insert the AuthContextorization Context
		return authContextServicePersistence.insert(authContext)
			.then(function (insertedAuthContextContext) {
				// Add the authorization context reference to the corresponding group
				return authContextGroupServicePersistence.addItem(
					authContextGroupCode, insertedAuthContextContext
				);
			})
			.then(function (result) {
				log.info('inserted auth context into group %j -> %j', authContextGroupCode, result && result.name);
				return result;
			})
			.catch(logFailure('failed to insert auth context into group ' + JSON.stringify(authContextGroupCode)))
			.asCallback(callback);
	};

	//
	// Insert an authorization context in their respective group
	//
	AuthContextService.prototype.update = function(name, groupCode, authContextObject, callback) {
		log.debug('updating auth context %j -> %j, group %j', name, authContextObject, groupCode);

		return authContextServicePersistence.findOneByName(name)
			.then(function (authContext) {
				// Ensure that only the name, description, and bit list fields are updated
				var authContextToUpdate = authContext.toJSON();

				authContextToUpdate.id = authContext.id;
				authContextToUpdate.name = authContextObject.name;
				authContextToUpdate.description = authContextObject.description;
				authContextToUpdate.bit = authContextObject.bit;
				authContextToUpdate.sortOrder = authContextObject.sortOrder;
				authContextToUpdate.enabled = authContextObject.enabled;

				// Ensure that the authorization context is in the correct group
				return authContextGroupServicePersistence.switchToNewGroup(authContextToUpdate, groupCode)
					.then(function () {
						// Save the authorization context
						return authContextServicePersistence.update(authContextToUpdate);
					});
			})
			.then(function (result) {
				log.info('updated auth context %j -> %j', name, result && result.name);
				return result;
			})
			.catch(logFailure('failed to update auth context ' + JSON.stringify(name)))
			.asCallback(callback);
	};

	//
	// Update order of the authorization contexts
	//
	AuthContextService.prototype.updateSortOrder = function(authContextsOrder, callback) {
		log.debug('updating auth context sort order %j', authContextsOrder);
		return authContextServicePersistence.updateSortOrder(authContextsOrder)
			.catch(logFailure('failed to update auth context sort order'))
			.asCallback(callback);
	};

	//
	// Delete one AuthContextorization Context By Name, and delete the reference in the corresponding group
	//
	AuthContextService.prototype.deleteByName = function(groupCode, name, callback) {
		log.debug('deleting auth context %j from group %j', name, groupCode);
		return authContextServicePersistence.findOneByName(name)
			.then(function (authContext) {
				return authContextGroupServicePersistence.removeItem(groupCode, authContext)
					.then(function () {
						return authContextServicePersistence.deleteByName(name);
					});
		})
			.then(function (result) {
				log.info('deleted auth context %j from group %j', name, groupCode);
				return result;
			})
			.catch(logFailure('failed to delete auth context ' + JSON.stringify(name) + ' from group ' + JSON.stringify(groupCode)))
			.asCallback(callback);
	};

	//
	// Insert one authorization context group
	//
	AuthContextService.prototype.insertGroup = function(groupObject, callback) {
		log.debug('inserting auth context group %j', groupObject);

		var group = new GroupImpl();
		group.name = groupObject.name;
		group.code = groupObject.code;
		group.description = groupObject.description;
		group.attributes = groupObject.attributes;
		group.values = [];

		// Insert the AuthContextorization Context Group
		return authContextGroupServicePersistence.insert(group)
			.then(function (result) {
				log.info('inserted auth context group -> code %j', result && result.code);
				return result;
			})
			.catch(logFailure('failed to insert auth context group ' + JSON.stringify(groupObject)))
			.asCallback(callback);
	};

	//
	// Update one authorization context group
	//
	AuthContextService.prototype.updateGroup = function(code, groupObject, callback) {
		log.debug('updating auth context group %j -> %j', code, groupObject);
		return authContextGroupServicePersistence.findOne(code).then(function (group) {
			group.name = groupObject.name;
			group.code = groupObject.code;
			group.description = groupObject.description;

			// Update the AuthContextorization Context Group
			return authContextGroupServicePersistence.update(group);
		})
			.then(function (result) {
				log.info('updated auth context group -> code %j', code);
				return result;
			})
			.catch(logFailure('failed to update auth context group ' + JSON.stringify(code)))
			.asCallback(callback);
	};

	//
	// Update order of authorization context groups
	//
	AuthContextService.prototype.updateGroupsSortOrder = function(groupsOrder, callback) {
		log.debug('updating auth context group sort order %j', groupsOrder);
		return authContextGroupServicePersistence.updateGroupsSortOrder(groupsOrder)
			.catch(logFailure('failed to update auth context group sort order'))
			.asCallback(callback);
	};

	//
	// Load one authorization context group
	//
	AuthContextService.prototype.findGroupByCode = function(groupCode, callback) {
		log.debug('finding auth context group by code %j', groupCode);
		return authContextGroupServicePersistence.findOne(groupCode)
			.catch(logFailure('failed to find auth context group by code ' + JSON.stringify(groupCode)))
			.asCallback(callback);
	};

	//
	// Delete one authorization context group by code
	//
	AuthContextService.prototype.removeGroup = function(groupCode, callback) {
		log.debug('removing auth context group %j', groupCode);

		// Remove the AuthContextorization Context Group
		return authContextGroupServicePersistence.remove(groupCode)
			.then(function (result) {
				log.info('removed auth context group -> code %j', groupCode);
				return result;
			})
			.catch(logFailure('failed to remove auth context group ' + JSON.stringify(groupCode)))
			.asCallback(callback);
	};

	return new AuthContextService();
};

module.exports.create = function(authContextPersist, authContextGroupPersist){
	// if the instance does not exist, create it
	if ( !_.isObject(authContextServiceInstance) ) {
		// authContextServiceInstance = new AuthContextService(aDAO);
		authContextServiceInstance = createInstance(authContextPersist, authContextGroupPersist);
	}
	return authContextServiceInstance;
};
