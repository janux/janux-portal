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
import common from 'Common'
import vueResource from 'vue-resource'
import vueMaterial from 'vue-material'
import jnxServices from 'Common/services'
import jnxComponents from 'Common/components'

Vue.use(vueMaterial)
Vue.use(vueResource)
Vue.use(common)
Vue.use(jnxServices)
Vue.use(jnxComponents)

Vue.config.productionTip = false

new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>'
	// directives: { ExampleDirective }	// optional?
})
