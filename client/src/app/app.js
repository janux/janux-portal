'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-04-18
 */

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import { ExampleDirective } from 'Common/directives'
import JsonRPC from 'Common/plugins/jsonrpc-plugin'
import VueResource from 'vue-resource'
import VueMaterial from 'vue-material'

Vue.use(VueMaterial)
Vue.use(VueResource)
Vue.use(JsonRPC)

Vue.config.productionTip = false

new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>'
	// directives: { ExampleDirective }	// optional?
})
