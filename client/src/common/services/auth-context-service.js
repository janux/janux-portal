'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-05-17
 */

import _ from 'lodash'

export function authContextService (http) {
	return {
		// Load available permission bits
		loadPermissionBits: function () {
			return http.jsonrpc(
				'/rpc/2.0/authContext',
				'loadPermissionBits'
			).then(function (resp) {
				var out = resp.result
				return out
			})
		},

		// Load available authContextorization contexts
		findAll: function () {
			return http.jsonrpc(
				'/rpc/2.0/authContext',
				'findAll'
			).then(function (resp) {
				return resp.result
			})
		},

		// Load available authContextorization contexts within their respective groups
		findGroups: function () {
			return http.jsonrpc(
				'/rpc/2.0/authContext',
				'findGroups'
			).then(function (resp) {
				// Ensure order of groups
				return _.sortBy(resp.result, function (group) {
					group.values = _.sortBy(group.values, 'sortOrder')
					return (!group.attributes.sortOrder) ? 0 : group.attributes.sortOrder
				})
			})
		},

		// Load authContextorization contexts groups list
		findGroupsList: function () {
			return http.jsonrpc(
				'/rpc/2.0/authContext',
				'findGroupsList'
			).then(function (resp) {
				return resp.result
			})
		},

		findOneByName: function (contextName) {
			return http.jsonrpc(
				'/rpc/2.0/authContext',
				'findOneByName',
				[ contextName ]
			).then(function (resp) {
				console.log('resp.result', resp.result)
				return resp.result
			})
		},

		insert: function (contextGroupCode, contextObject) {
			return http.jsonrpc(
				'/rpc/2.0/authContext',
				'insert',
				[ contextGroupCode, contextObject ]
			).then(function (resp) {
				console.log('resp.result', resp.result)
				return resp.result
			})
		},

		update: function (name, contextGroupCode, modifiedContext) {
			return http.jsonrpc(
				'/rpc/2.0/authContext',
				'update',
				[ name, contextGroupCode, modifiedContext ]
			).then(function (resp) {
				console.log('resp.result', resp.result)
				return resp.result
			})
		},

		updateSortOrder: function (authsOrder) {
			return http.jsonrpc(
				'/rpc/2.0/authContext',
				'updateSortOrder',
				[ authsOrder ]
			).then(function (resp) {
				console.log('resp.result', resp.result)
				return resp.result
			})
		},

		deleteByName: function (groupCode, contextName) {
			return http.jsonrpc(
				'/rpc/2.0/authContext',
				'deleteByName',
				[ groupCode, contextName ]
			).then(function (resp) {
				console.log('resp.result', resp.result)
				return resp.result
			})
		},

		findGroupByCode: function (contextGroupCode) {
			return http.jsonrpc(
				'/rpc/2.0/authContext',
				'findGroupByCode',
				[ contextGroupCode ]
			).then(function (resp) {
				console.log('resp.result', resp.result)
				return resp.result
			})
		},

		insertGroup: function (contextGroupObject) {
			return http.jsonrpc(
				'/rpc/2.0/authContext',
				'insertGroup',
				[ contextGroupObject ]
			).then(function (resp) {
				console.log('resp.result', resp.result)
				return resp.result
			})
		},

		updateGroup: function (code, contextGroupObject) {
			return http.jsonrpc(
				'/rpc/2.0/authContext',
				'updateGroup',
				[ code, contextGroupObject ]
			).then(function (resp) {
				console.log('resp.result', resp.result)
				return resp.result
			})
		},

		updateGroupsSortOrder: function (groupsOrder) {
			return http.jsonrpc(
				'/rpc/2.0/authContext',
				'updateGroupsSortOrder',
				[ groupsOrder ]
			).then(function (resp) {
				console.log('resp.result', resp.result)
				return resp.result
			})
		},

		removeGroup: function (code) {
			return http.jsonrpc(
				'/rpc/2.0/authContext',
				'removeGroup',
				[ code ]
			).then(function (resp) {
				console.log('resp.result', resp.result)
				return resp.result
			})
		}
	}
}
