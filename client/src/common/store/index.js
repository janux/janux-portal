'use strict'

import Vuex from 'vuex'
import Vue from 'vue'
import {app} from 'App/app'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		currentUser: null,
		navBarExpanded: true,
		lang: 'en'
	},
	mutations: {
		navBarExpandedMutation (state, payload) {
			state.navBarExpanded = payload.value
			return state.navBarExpanded
		},

		currentUserMutation (state, payload) {
			state.currentUser = payload.value
			return state.currentUser
		},

		setLangMutation (state, payload) {
			app.$i18n.locale = payload
		}
	},
	actions: {
		toggleNavBar (context, payload) {
			context.commit('navBarExpandedMutation', payload)
		},

		updateCurrentUser (context, payload) {
			context.commit('currentUserMutation', payload)
		},

		setLang (context, payload) {
			context.commit('setLangMutation', payload)
		}

		// async setLangNew (context, payload) {
		// 	if (payload in app.$i18n.messages) {
		// 		context.commit('setLangMutation', payload)
		// 	} else {
		// 		try {
		// 			const res = await import('Locale/${payload}.json')
		// 			app.$i18n.setLocaleMessage(payload, res.data)
		// 			context.commit('setLangMutation', payload)
		// 		}
		// 		catch (e) {
		// 			console.log(e)
		// 		}
		// 	}
		// }
	}
})

export default store
