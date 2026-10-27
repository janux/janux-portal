var log4js           = require('log4js'),
	_                = require('lodash'),
	Promise          = require('bluebird'),
	PartyServiceImplClass = require('janux-persist').PartyServiceImpl,
	log              = log4js.getLogger('PartyService'),
	fixDate          = require('../util/fix-date').fixDate;


// variable to hold the singleton instance, if used in that manner
var partyServiceServiceInstance = undefined;
var partyServiceImpl = undefined;

var createInstance = function (serviceReference) {
	partyServiceImpl = serviceReference;

	function PartyService() {

	}

	PartyService.prototype = Object.create(null);
	PartyService.prototype.constructor = PartyService;

	function fixDates(party) {
		party.dateCreated = fixDate(party.dateCreated);
		party.lastUpdate = fixDate(party.lastUpdate);
		return party;
	}

	function toJSONMany(records) {
		return _.map(records, function (o) {
			return PartyServiceImplClass.toJSON(o);
		})
	}

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

	/**
	 * Find all contacts by name.
	 * @param name
	 * @param callback
	 * @return {*}
	 */
	PartyService.prototype.findByName = function (name, callback) {
		log.debug("finding party by name %j", name);
		return partyServiceImpl.findByName(name)
			.then(function (result) {
				return toJSONMany(result);
			})
			.catch(logFailure('failed to find party by name ' + JSON.stringify(name)))
			.asCallback(callback);
	};

	/**
	 * Find all by email.
	 * @param email
	 * @param callback
	 */
	PartyService.prototype.findByEmail = function (email, callback) {
		log.debug("finding party by email %j", email);
		return partyServiceImpl.findByEmail(email)
			.then(function (result) {
				return toJSONMany(result);
			})
			.catch(logFailure('failed to find party by email ' + JSON.stringify(email)))
			.asCallback(callback);
	};

	/**
	 * Find all people.
	 * @param callback
	 */
	PartyService.prototype.findPeople = function (callback) {
		log.trace("finding all people");
		return partyServiceImpl.findPeople()
			.then(function (result) {
				return toJSONMany(result);
			})
			.catch(logFailure('failed to find all people'))
			.asCallback(callback);
	};

	/**
	 * Find all organizations.
	 * @param callback
	 */
	PartyService.prototype.findOrganizations = function (callback) {
		log.trace("finding all organizations");
		return partyServiceImpl.findOrganizations()
			.then(function (result) {
				return toJSONMany(result);
			})
			.catch(logFailure('failed to find all organizations'))
			.asCallback(callback);
	};

	/**
	 * Find one by id
	 * @param id
	 * @param callback
	 */
	PartyService.prototype.findOne = function (id, callback) {
		log.debug("finding party by id %j", id);
		return partyServiceImpl.findOne(id)
			.then(function (result) {
				return PartyServiceImplClass.toJSON(result);
			})
			.catch(logFailure('failed to find party by id ' + JSON.stringify(id)))
			.asCallback(callback);
	};

	/**
	 * Find all by ids.
	 * @param ids
	 * @param callback
	 */
	PartyService.prototype.findByIds = function (ids, callback) {
		log.debug("finding parties by ids %j", ids);
		return partyServiceImpl.findByIds(ids)
			.then(function (result) {
				return toJSONMany(result);
			})
			.catch(logFailure('failed to find parties by ids ' + JSON.stringify(ids)))
			.asCallback(callback);
	};

	/**
	 * Insert a new party.
	 * @param party
	 * @param callback
	 * @return {*}
	 */
	PartyService.prototype.insert = function (party, callback) {
		log.debug("inserting party %j", party);
		object = PartyServiceImplClass.fromJSON(party);
		return partyServiceImpl.insert(object)
			.then(function (result) {
				var json = PartyServiceImplClass.toJSON(result);
				log.info("inserted party -> id %j", json && json.id);
				return json;
			})
			.catch(logFailure('failed to insert party ' + JSON.stringify(party)))
			.asCallback(callback);
	};

	/**
	 * Update a party.
	 * @param party
	 * @param callback
	 */
	PartyService.prototype.update = function (party, callback) {
		log.debug("updating party %j", party);
		object = PartyServiceImplClass.fromJSON(party);
		return partyServiceImpl.update(object)
			.then(function (result) {
				var json = PartyServiceImplClass.toJSON(result);
				log.info("updated party -> id %j", json && json.id);
				return json;
			})
			.catch(logFailure('failed to update party ' + JSON.stringify(party)))
			.asCallback(callback);
	};

	/**
	 * Remove a party.
	 * @param id
	 * @param callback
	 */
	PartyService.prototype.remove = function (id, callback) {
		log.debug("removing party %j", id);
		return partyServiceImpl.remove(id)
			.then(function (result) {
				log.info("removed party -> id %j", id);
				return result;
			})
			.catch(logFailure('failed to remove party ' + JSON.stringify(id)))
			.asCallback(callback);
	};

	return new PartyService();
};


module.exports.create = function (PartyServiceImpl) {
	// if the instance does not exist, create it
	if (!_.isObject(partyServiceServiceInstance)) {
		partyServiceServiceInstance = createInstance(PartyServiceImpl);
	}
	return partyServiceServiceInstance;
};