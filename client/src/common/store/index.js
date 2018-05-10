'use strict'

import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		currentUser: null,
		navBarExpanded: true
	},
	mutations: {
		navBarExpandedMutation (state, payload) {
			state.navBarExpanded = payload.value
			return state.navBarExpanded
		},

		currentUserMutation (state, payload) {
			state.currentUser = payload.value
			return state.currentUser
		}
	},
	actions: {
		toggleNavBar (context, payload) {
			context.commit('navBarExpandedMutation', payload)
		},

		updateCurrentUser (context, payload) {
			context.commit('currentUserMutation', payload)
		}
	}
})

export default store
