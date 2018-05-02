'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-04-18
 */
import http from 'Common/jsonrpc'
import {Person, Organization} from 'janux-people'
import _ from 'lodash'

/**
 * Convert a json object to a PartyAbstract instance.
 * @param object
 */
function fromJSON (object) {
	var contact

	if (_.isNil(object)) {
		return object
	}

	var result = _.cloneDeep(object)

	if (result.typeName === 'PersonImpl') {
		contact = Person.fromJSON(result)
	} else if (result.typeName === 'OrganizationImpl') {
		contact = Organization.fromJSON(result)
	} else {
		console.error('No implementation for typeName ', result.typeName, ' returning undefined')
		// Let it crash.
		return undefined
	}
	contact.id = result.id
	// TODO: implement dateUtilService service
	// contact.dateCreated = dateUtilService.stringToDate(result.dateCreated);
	// contact.lastUpdate = dateUtilService.stringToDate(result.lastUpdate);
	contact.dateCreated = result.dateCreated
	contact.lastUpdate = result.lastUpdate

	return contact
}

/**
 * Convert a PartyAbstract instance to a JSON object.
 * @param object
 */
function toJSON (object) {
	var cloned = _.cloneDeep(object)
	var id = cloned.id
	var typeName = cloned.typeName
	var contact = cloned.toJSON()
	contact.id = id
	contact.typeName = typeName
	contact.dateCreated = object.dateCreated
	contact.lastUpdate = object.lastUpdate
	return contact
}

export default {
	/**
	 * Find all people.
	 */
	findPeople () {
		return http.jsonrpc(
			'/rpc/2.0/partyService',
			'findPeople',
			[]
		).then((resp) => {
			console.log('/rpc/2.0/partyService - findPeople:', resp.result)
			let contacts = resp.result
			contacts = _.map(contacts, function (o) {
				return fromJSON(o)
			})
			return contacts
		})
	},
	/**
	 * Find one contact by id.
	 * @param id
	 */
	findOne: function (id) {
		return http.jsonrpc(
			'/rpc/2.0/partyService',
			'findOne',
			[id]
		).then((resp) => {
			let contact = resp.result
			contact = fromJSON(contact)
			return contact
		})
	},
	/**
	 * Insert a party.
	 * @param timeEntry
	 */
	insert: function (party) {
		console.log('Call to insert with ', JSON.stringify(party))
		var objectToSend = toJSON(party)

		return http.jsonrpc(
			'/rpc/2.0/partyService',
			'insert',
			[objectToSend]
		).then(function (resp) {
			var contact = resp.result
			contact = fromJSON(contact)
			return contact
		})
	},

	/**
	 * Update a party.
	 * @param party
	 */
	update: function (party) {
		var objectToSend = toJSON(party)
		return http.jsonrpc(
			'/rpc/2.0/partyService',
			'update',
			[objectToSend]
		).then(function (resp) {
			var contact = resp.result
			contact = fromJSON(contact)
			return contact
		})
	}
}
