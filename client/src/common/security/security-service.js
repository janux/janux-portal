'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-05-08
 */

import {Person} from 'janux-people'
import {Role} from 'janux-authorize'
import _ from 'lodash'
import store from 'Common/store'
import * as actionTypes from 'Common/store/action-types'

//
// When a user is returned from the back-end, hydrate each
// role json structure into a full janux Role instance
//
function hydrateRoles (user) {
	if (user && user.roles) {
		user.roles = _.map(user.roles, (role) => {
			return Role.fromJSON(role)
		})
	}
	return user
}

export function security (http) {
	const service = {

		//
		// Check if user is currently authenticated.
		//
		// JAM-29: this used to also report true on the strength of an
		// unexpired local token alone, rebuilding currentUser from the
		// token's own payload when it was still nil. That was sound only
		// while the token carried the full user - since the token was
		// slimmed to identity only (same fix glarus-ops shipped for JAM-7,
		// ported here before janux-portal hit the same 8 KB header-limit
		// outage), a token merely proves the browser once logged in, never
		// that the server-side session backing it is still alive, and it no
		// longer carries roles/contact to rebuild currentUser from anyway.
		// A caller needing a definitive answer must await
		// requestCurrentUser() first - see JAM-28, the glarus-ops instance
		// of exactly this defect.
		isAuthenticated: function () {
			return !_.isNil(service.currentUser)
		},

		//
		// Authenticate the user with username and password
		//
		login: function (username, password) {
			return http.post('/login', {username: username, password: password}).then((response) => {
				let user = response.data.user
				console.log('login resp:', response)

				if (user) {
					service.currentUser = hydrateRoles(response.data.user)
					service.currentUser.contact = Person.fromJSON(service.currentUser.contact)
					service.token = response.data.token
					// Save the token in local storage.
					localStorage.setItem('token', service.token)
				}
				return service.isAuthenticated()
			})
		},

		//
		// The object to be passed as a header for authenticated requests
		//
		authHeader: function () {
			return 'Bearer ' + localStorage.getItem('token')
		},

		//
		// Clear token in case user request logout
		// or token gets expired during a request
		//
		clearLoginData: function () {
			service.currentUser = null
			localStorage.removeItem('token')
		},

		//
		// Request user logout
		//
		logout: function () {
			return http.post('/logout').then((resp) => {
				// console.debug("logout resp:", JSON.stringify(resp));
				service.clearLoginData()
				return resp
			})
		},

		//
		// Check if user is authenticated and return its data
		//
		requestCurrentUser: function () {
			if (service.isAuthenticated()) {
				console.log('currentUser-cached:', service.currentUser)
				// Get current User
				return new Promise((resolve, reject) => {
					resolve(service.currentUser)
				})
			} else {
				return http.get('/current-user').then((response) => {
					// Set current User
					service.currentUser = hydrateRoles(response.data.user)
					if (typeof response.data.user !== 'undefined') {
						service.currentUser.contact = Person.fromJSON(response.data.user.contact)
					}
					console.log('currentUser-served:', service.currentUser)
					return service.currentUser
				}).catch((err) => {
					// JAM-29: /current-user now answers 401, not 200 with an
					// empty body, when there's no live server session (JAM-28
					// is the glarus-ops instance of this same defect). That's
					// the same outcome the old empty-body response meant -
					// normalize it the same way, so every caller of
					// requestCurrentUser() still gets a promise that settles
					// with null rather than one that rejects.
					if (err && err.status === 401) {
						service.currentUser = null
						return null
					}
					throw err
				})
			}
		},

		set currentUser (currentUser) {
			store.dispatch({
				type: actionTypes.UpdateCurrentUser,
				value: currentUser
			})
		},

		get currentUser () {
			return store.state.currentUser
		}
	}

	return service
}
