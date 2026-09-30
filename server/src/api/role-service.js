'use strict';

var _ = require('lodash');
var Promise = require('bluebird');

var log4js      = require('log4js'),
	log         = log4js.getLogger('RoleService');

// variable to hold the singleton instance, if used in that manner
var roleServiceInstance = undefined;
var roleServicePersistence = undefined;

var createInstance = function(roleServiceReference) {

	roleServicePersistence = roleServiceReference;

	// Constructor
	function RoleService() {
		// roleDAO.call(this);
	}

	RoleService.prototype = Object.create(null);
	RoleService.prototype.constructor = RoleService;

	//
	// Returns a promise that resolves to a dictionary of the Roles defined in the
	// Authorization Scheme; the Roles include references to the Authorization
	// Contexts in which they have been provided with permissions
	//
	RoleService.prototype.findAll = function(callback) {
		log.trace('finding all roles');
		return roleServicePersistence.findAll()
			.catch(function (err) {
				log.error('failed to find all roles: %s', err && err.stack || err);
				throw err;
			})
			.asCallback(callback);
	};

	//
	// Returns a promise that resolves to a single Role
	//
	RoleService.prototype.findOneByName = function(name, callback) {
		log.debug('finding role by name %j', name);
		return roleServicePersistence.findOneByName(name)
			.catch(function (err) {
				log.error('failed to find role by name %j: %s', name, err && err.stack || err);
				throw err;
			})
			.asCallback(callback);
	};

	//
	// Insert a role
	//
	RoleService.prototype.insert = function(role, callback) {
		log.debug('inserting role %j', role);
		return roleServicePersistence.insert(role)
			.then(function (result) {
				log.info('inserted role -> name %j', result && result.name);
				return result;
			})
			.catch(function (err) {
				// A rejection is typically validation errors (e.g. duplicate
				// role name) - expected, correctable input, not a system
				// fault.
				if (_.isArray(err)) {
					log.warn('rejected role insert %j: %s', role, _.map(err, 'message').join('; '));
				} else {
					log.error('failed to insert role %j: %s', role, err && err.stack || err);
				}
				throw err;
			})
			.asCallback(callback);
	};

	//
	// Update a role
	//
	RoleService.prototype.update = function(name, roleObject, callback) {
		log.debug('updating role %j -> %j', name, roleObject);
		return roleServicePersistence.findOneByName(name)
			.then(function (role) {
				// Ensure that only the name, description, and bit list fields are updated
				var roleToUpdate = role.toJSON();

				roleToUpdate.id = role.id;
				roleToUpdate.name = roleObject.name;
				roleToUpdate.description = roleObject.description;
				roleToUpdate.enabled = roleObject.enabled;
				roleToUpdate.isAlmighty = roleObject.isAlmighty;
				roleToUpdate.sortOrder = roleObject.sortOrder;
				roleToUpdate.authContexts = roleObject.authContexts;
				roleToUpdate.permissions = roleObject.permissions;

				// Save the role
				return roleServicePersistence.update(roleToUpdate);
			})
			.then(function (result) {
				log.info('updated role %j -> %j', name, result && result.name);
				return result;
			})
			.catch(function (err) {
				if (_.isArray(err)) {
					log.warn('rejected role update %j: %s', name, _.map(err, 'message').join('; '));
				} else {
					log.error('failed to update role %j: %s', name, err && err.stack || err);
				}
				throw err;
			})
			.asCallback(callback);
	};

	//
	// Update order of the roles
	//
	RoleService.prototype.updateSortOrder = function(rolesOrder, callback) {
		log.debug('updating role sort order %j', rolesOrder);
		return roleServicePersistence.updateSortOrder(rolesOrder)
			.catch(function (err) {
				log.error('failed to update role sort order %j: %s', rolesOrder, err && err.stack || err);
				throw err;
			})
			.asCallback(callback);
	};

	//
	// Delete one role by name
	//
	RoleService.prototype.deleteByName = function(name, callback) {
		log.debug('deleting role by name %j', name);
		return roleServicePersistence.deleteByName(name)
			.then(function (result) {
				log.info('deleted role -> name %j', name);
				return result;
			})
			.catch(function (err) {
				log.error('failed to delete role by name %j: %s', name, err && err.stack || err);
				throw err;
			})
			.asCallback(callback);
	};

	return new RoleService();
};

module.exports.create = function(rolePersist){
	// if the instance does not exist, create it
	if ( !_.isObject(roleServiceInstance) ) {
		// roleServiceInstance = new RoleService(aDAO);
		roleServiceInstance = createInstance(rolePersist);
	}
	return roleServiceInstance;
};
