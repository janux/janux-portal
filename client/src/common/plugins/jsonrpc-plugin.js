'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-04-18
 *
 * This is an example of a Vue.js plugin, this plugin add 'jsonrpc' method to Vue.http
 */

import {jsonrpc} from 'Common/jsonrpc'

function plugin (Vue) {
	if (plugin.installed) {
		return
	}

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
