var _ = require('lodash');
var PartyGroupServiceStatic = require('janux-persist').PartyGroupServiceImpl;
var PartyServiceImplClass = require('janux-persist').PartyServiceImpl;
var log4js = require('log4js');
var Promise = require('bluebird');
var log = log4js.getLogger('party-group-service');

var partyGroupServiceInstance = undefined;
var partyGroupServiceReferenceInstance = undefined;

var createInstance = function (partyGroupServiceReference) {
	partyGroupServiceReferenceInstance = partyGroupServiceReference;

	function PartyGroupService() {

	}

	// function toJsonMany(values) {
	// 	return _.map(values, function (o) {
	// 		return PartyGroupServiceStatic.toJSON(o);
	// 	})
	// }

	PartyGroupService.prototype = Object.create(null);
	PartyGroupService.prototype.constructor = PartyGroupService;

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

	PartyGroupService.prototype.findPropertiesByType = function (type, callback) {
		log.trace('finding party group properties by type %j', type);
		return partyGroupServiceReferenceInstance.findPropertiesByType(type)
			.catch(logFailure('failed to find party group properties by type ' + JSON.stringify(type)))
			.asCallback(callback);
	};

	PartyGroupService.prototype.findPropertiesOwnedByPartyAndTypes = function (partyId, types, callback) {
		log.trace('finding party group properties owned by party %j, types %j', partyId, types);
		return partyGroupServiceReferenceInstance.findPropertiesOwnedByPartyAndTypes(partyId, types)
			.catch(logFailure('failed to find party group properties owned by party ' + JSON.stringify(partyId)))
			.asCallback(callback);
	};

	PartyGroupService.prototype.findOne = function (code, callback) {
		log.debug('finding party group by code %j', code);
		return partyGroupServiceReferenceInstance.findOne(code)
			.catch(logFailure('failed to find party group by code ' + JSON.stringify(code)))
			.asCallback(callback);
	};

	PartyGroupService.prototype.findOneOwnedByPartyAndType = function (partyId, type, createOne, callback) {
		log.debug('finding party group owned by party %j, type %j, createOne %j', partyId, type, createOne);
		return partyGroupServiceReferenceInstance.findOneOwnedByPartyAndType(partyId, type, createOne)
			.catch(logFailure('failed to find party group owned by party ' + JSON.stringify(partyId)))
			.asCallback(callback);
	};

	PartyGroupService.prototype.findByTypes = function (types, callback) {
		log.trace('finding party groups by types %j', types);
		return partyGroupServiceReferenceInstance.findByTypes(types)
			.catch(logFailure('failed to find party groups by types ' + JSON.stringify(types)))
			.asCallback(callback);
	};

	PartyGroupService.prototype.insert = function (partyId, group, callback) {
		log.debug('inserting party group %j for party %j', group, partyId);
		return partyGroupServiceReferenceInstance.insert(partyId, PartyGroupServiceStatic.fromJSON(group))
			.then(function (result) {
				log.info('inserted party group for party %j -> code %j', partyId, result && result.code);
				return result;
			})
			.catch(logFailure('failed to insert party group for party ' + JSON.stringify(partyId)))
			.asCallback(callback);
	};

	PartyGroupService.prototype.update = function (group, callback) {
		log.debug('updating party group %j', group);
		return partyGroupServiceReferenceInstance.update(PartyGroupServiceStatic.fromJSON(group))
			.then(function (result) {
				log.info('updated party group -> code %j', result && result.code);
				return result;
			})
			.catch(logFailure('failed to update party group ' + JSON.stringify(group && group.code)))
			.asCallback(callback);
	};

	PartyGroupService.prototype.remove = function (code, callback) {
		log.debug('removing party group %j', code);
		return partyGroupServiceReferenceInstance.remove(code)
			.then(function (result) {
				log.info('removed party group -> code %j', code);
				return result;
			})
			.catch(logFailure('failed to remove party group ' + JSON.stringify(code)))
			.asCallback(callback);
	};

	PartyGroupService.prototype.addItem = function (code, item, callback) {
		log.debug('adding item %j to party group %j', item, code);
		return partyGroupServiceReferenceInstance.addItem(code, PartyGroupServiceStatic.fromJSONItem(item))
			.catch(logFailure('failed to add item to party group ' + JSON.stringify(code)))
			.asCallback(callback);
	};

	PartyGroupService.prototype.addItemNewParty = function (code, party, attributes, callback) {
		log.debug('adding new party %j to party group %j', party, code);
		var partyObject = PartyServiceImplClass.fromJSON(party);
		return partyGroupServiceReferenceInstance.addItemNewParty(code, partyObject, attributes)
			.catch(logFailure('failed to add new party to party group ' + JSON.stringify(code)))
			.asCallback(callback);
	};

	PartyGroupService.prototype.removeItem = function (code, partyId, callback) {
		log.debug('removing party %j from party group %j', partyId, code);
		return partyGroupServiceReferenceInstance.removeItem(code, partyId)
			.then(function (result) {
				log.info('removed party %j from party group %j', partyId, code);
				return result;
			})
			.catch(logFailure('failed to remove party ' + JSON.stringify(partyId) + ' from party group ' + JSON.stringify(code)))
			.asCallback(callback);
	};


	return new PartyGroupService();
};

module.exports.create = function (partyGroupServiceReference) {
	// if the instance does not exist, create it
	if (!_.isObject(partyGroupServiceInstance)) {
		// userServiceInstance = new UserService(aDAO);
		partyGroupServiceInstance = createInstance(partyGroupServiceReference);
	}
	return partyGroupServiceInstance;
};