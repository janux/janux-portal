'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-05-02
 *
 * This is an example of a Vue.js plugin, this plugin add 'jsonrpc' method to Vue.http
 */

import {jsonrpc} from './jsonrpc'
import {ExampleDirective} from './directives'

function plugin (Vue) {
	if (plugin.installed) {
		return
	}

	// Common directives
	Vue.directive('example-directive', ExampleDirective)

	// Adding jsonrpc method to http service
	if (typeof Vue.http !== 'undefined') {
		Vue.http.jsonrpc = jsonrpc(Vue.http)
	} else {
		console.error('To install the jsonrpc plugin it is necessary to have vue-resource in advance')
	}
}

if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.use(plugin)
}

export default plugin