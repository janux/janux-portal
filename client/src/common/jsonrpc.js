'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-04-18
 *
 * This can be imported in any service or used through a plugin
 */

import _ from 'lodash'

export function jsonrpc (http) {
	return (url, method, parameters, config) => {
		// Custom headers
		let headers = {
			'Content-Type': 'application/json;charset=utf-8'
		}

		// Data to be sent as the request body
		let data = {'jsonrpc': '2.0', 'method': method, 'params': parameters, 'id': 1}

		// filter the user object from the logs, more cosmetic than security issue
		var filteredParms = _.filter(parameters, function (parm) {
			return !_.isString(parm.password)
		})
		console.debug('calling:' + url + ' - ' + method + ' - ' + JSON.stringify(filteredParms))

		return http.post(url, data, {'headers': headers}).then((response) => {
			// console.log('jsonrpc url:',url,' method:',method, 'response:', response.body)
			return response.body
		})
	}
}
