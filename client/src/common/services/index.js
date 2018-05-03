'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-05-02
 *
 * This plugin exposes
 */

import {partyService} from './party-service'

function jnxServices (Vue) {
	if (jnxServices.installed) {
		return
	}

	Vue.jnx = {
		partyService: partyService(Vue.http)
	}
}

if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.use(jnxServices)
}

export default jnxServices
