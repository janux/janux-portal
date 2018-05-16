'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-05-14
 */
import {Person} from 'janux-people'
import _ from 'lodash'

export function userService (http) {
	return {
		// Find users by specifying the field and search string
		findBy: function (field, search) {
			return http.jsonrpc(
				'/rpc/2.0/users',
				'findBy',
				[ field, search ]
			).then((resp) => {
				let out = resp.result
				out = (typeof out.length === 'undefined') ? [out] : out
				console.log('findBy', field, search, out)
				out.forEach((user, iUser) => {
					out[iUser].contact = Person.fromJSON(out[iUser].contact)
				})
				return out
			})
		},

		// Load user by id
		findById: function (userId) {
			return http.jsonrpc(
				'/rpc/2.0/users',
				'findById',
				[ userId ]
			).then((resp) => {
				let out = resp.result
				const id = out.contact.id
				out.contact = Person.fromJSON(out.contact)
				out.contact.id = id
				return out
			})
		},

		// Load all users by user id
		findByUsernameMatch: function (username) {
			return http.jsonrpc(
				'/rpc/2.0/users',
				'findByUsernameMatch',
				[ username ]
			).then((resp) => {
				let out = resp.result
				out.forEach((user, iUser) => {
					out[iUser].contact = Person.fromJSON(out[iUser].contact)
				})
				return out
			})
		},

		// Add new user
		saveOrUpdate: function (userObject) {
			let userObjClone = _.cloneDeep(userObject)
			const id = userObjClone.contact.id
			const typeName = userObjClone.contact.typeName
			userObjClone.contact = userObjClone.contact.toJSON()
			userObjClone.contact.id = id
			userObjClone.contact.typeName = typeName

			// //
			// // If the user's role has been loaded, we ensure that only the name is stored back
			// //
			// userObjClone.roles = _.map(userObjClone.roles, function (role) {
			//	return (typeof role.name !== 'undefined')?role.name:role
			// })

			return http.jsonrpc(
				'/rpc/2.0/users',
				'saveOrUpdate',
				[ userObjClone ]
			).then((resp) => {
				const out = resp.result
				console.log('saveOrUpdate', out)
				return out
			})
		},

		// Delete user by id
		deleteUser: function (userId) {
			return http.jsonrpc(
				'/rpc/2.0/users',
				'deleteUser',
				[ userId ]
			).then((resp) => {
				return resp.result
			})
		},

		// Delete user by id
		deleteByUserIds: function (userIds) {
			return http.jsonrpc(
				'/rpc/2.0/users',
				'deleteByUserIds',
				[ userIds ]
			).then((resp) => {
				return resp.result
			})
		}
	}
}
