'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-04-18
 *
 * This can be imported in any service or used through a plugin
 */

export function jsonrpc (http) {
	return (url, method, parameters, config) => {
		let headers = {
			'Content-Type': 'application/json'
		}

		let data = {'jsonrpc': '2.0', 'method': method, 'params': parameters, 'id': 1}

		return http.post(url, data, { options: headers }).then((response) => {
			// console.log('jsonrpc url:',url,' method:',method, 'response:', response.body)
			return response.body
		})
	}
}
