'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-05-15
 */
import _ from 'lodash'

export function roleService (http) {
	return {
		findAll: function () {
			return http.jsonrpc(
				'/rpc/2.0/role',
				'findAll'
			).then(function (resp) {
				return resp.result
			})
		},

		findOneByName: function (roleName) {
			return http.jsonrpc(
				'/rpc/2.0/role',
				'findOneByName',
				[ roleName ]
			).then(function (resp) {
				let role = resp.result
				// Index by name
				role.roleContexts = _.mapKeys(role.roleContexts, function (roleC) {
					return roleC.name
				})
				return role
			})
		},

		insert: function (roleObject) {
			return http.jsonrpc(
				'/rpc/2.0/role',
				'insert',
				[ roleObject ]
			).then(function (resp) {
				console.log('resp.result', resp.result)
				return resp.result
			})
		},

		update: function (name, modifiedRole) {
			return http.jsonrpc(
				'/rpc/2.0/role',
				'update',
				[ name, modifiedRole ]
			).then(function (resp) {
				console.log('resp.result', resp.result)
				return resp.result
			})
		},

		updateSortOrder: function (rolesOrder) {
			return http.jsonrpc(
				'/rpc/2.0/role',
				'updateSortOrder',
				[ rolesOrder ]
			).then(function (resp) {
				console.log('resp.result', resp.result)
				return resp.result
			})
		},

		deleteByName: function (roleName) {
			return http.jsonrpc(
				'/rpc/2.0/role',
				'deleteByName',
				[ roleName ]
			).then(function (resp) {
				console.log('resp.result', resp.result)
				return resp.result
			})
		}
	}
}
