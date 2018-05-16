'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-05-15
 */
// import _ from 'lodash'

export function roleService (http) {
	return {
		findAll: function () {
			return http.jsonrpc(
				'/rpc/2.0/role',
				'findAll'
			).then(function (resp) {
				return resp.result
			})
		}
	}
}
