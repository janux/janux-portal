'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-05-02
 *
 */

import {jsonrpc} from './jsonrpc'
import {ExampleDirective} from './directives'
import _ from 'lodash'
import { EventBus } from 'Common/event-bus'

function plugin (Vue) {
	if (plugin.installed) {
		return
	}

	//
	// Common directives
	//
	Vue.directive('example-directive', ExampleDirective)

	//
	// Adding jsonrpc
	//
	if (typeof Vue.http !== 'undefined') {
		// Adding jsonrpc method to http service
		Vue.http.jsonrpc = jsonrpc(Vue.http)

		// Interceptor
		Vue.http.interceptors.push((request, next) => {
			// Adding authorization header to jsonrpc requests
			if (!_.isNil(request.body) && !_.isNil(request.body.jsonrpc) && Vue.jnx.security.isAuthenticated()) {
				request.headers.set('Authorization', Vue.jnx.security.authHeader())
			}

			// Catch invalid token response
			next((response) => {
				if (response.status === 401 && response.bodyText === 'invalid token...') {
					console.log("Broadcasting invalid token")
					EventBus.$emit('jsonrpc', 'INVALID_TOKEN')
				}
			})
		})
	} else {
		console.error('To install the jsonrpc plugin it is necessary to have vue-resource in advance')
	}
}

if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.use(plugin)
}

export default plugin
