'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-05-02
 *
 * This plugin exposes janux-demo services through a Vue.js plugin
 */

import {partyService} from './party-service'
import {security} from 'Common/security/security-service'
import {userService} from './user-service'
import {roleService} from './role-service'
import {authContextService} from './auth-context-service'

function jnxServices (Vue) {
	if (jnxServices.installed) {
		return
	}

	Vue.jnx = {
		partyService: partyService(Vue.http),
		security: security(Vue.http),
		userService: userService(Vue.http),
		roleService: roleService(Vue.http),
		authContextService: authContextService(Vue.http)
	}
}

if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.use(jnxServices)
}

export default jnxServices
