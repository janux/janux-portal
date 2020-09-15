'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-04-18
 */

import 'vue-material/dist/vue-material.css'
import 'vue-material/dist/theme/default.css'
import 'Css/main.less'

import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Router from 'vue-router'
import vueResource from 'vue-resource'
import vueMaterial from 'vue-material'
import i18n from 'Locale/lang'
import App from './app-component.vue'
import appRouter from './router'
import store from 'Common/store'
import common from 'Common'
import jnxServices from 'Common/services'
import jnxComponents from 'Common/components'
import {EventBus} from 'Common/event-bus'

Vue.use(Router)
Vue.use(vueMaterial)
Vue.use(vueResource)
Vue.use(jnxServices)
Vue.use(jnxComponents)
Vue.use(common)

Vue.config.productionTip = false

export const app = new Vue({
	el: '#app',
	store,
	i18n,
	router: appRouter,
	components: { App },
	template: '<App/>',
	beforeCreate () {
		// On page reload, check to see whether the user logged in previously
		Vue.jnx.security.requestCurrentUser()
	},
	mounted () {
		EventBus.$on('jsonrpc', data => {
			if (data === 'INVALID_TOKEN') {
				// There was a json rpc post and the server reject the token we send ( for whatever reason).
				this.$router.push({name: 'login', params: { goodbye: 'FORCED_LOGOUT', redirect: '' }})
				Vue.jnx.security.clearLoginData()
			}
		})
	}
})

window.vue = app
