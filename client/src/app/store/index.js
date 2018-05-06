'use strict'

import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		navBarExpanded: true
	},
	mutations: {
		toggleNavBar (state, payload) {
			state.navBarExpanded = payload.value
			return state.navBarExpanded
		}
	},
	actions: {
		toggleNavBar (context, payload) {
			context.commit('toggleNavBar', payload)
		}
	}
})

export default store
