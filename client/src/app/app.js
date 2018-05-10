'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-04-18
 */

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Router from 'vue-router'
import vueResource from 'vue-resource'
import vueMaterial from 'vue-material'

import App from './App'
import appRouter from './router'
import store from 'Common/store'
import common from 'Common'
import jnxServices from 'Common/services'
import jnxComponents from 'Common/components'

Vue.use(Router)
Vue.use(vueMaterial)
Vue.use(vueResource)
Vue.use(common)
Vue.use(jnxServices)
Vue.use(jnxComponents)

Vue.config.productionTip = false

new Vue({
	el: '#app',
	store,
	router: appRouter,
	components: { App },
	template: '<App/>',
	beforeCreate () {
		// On page reload, check to see whether the user logged in previously
		Vue.jnx.security.requestCurrentUser()
	}
})
