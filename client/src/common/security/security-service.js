'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-05-08
 */

import {Person} from 'janux-people'
import {Role} from 'janux-authorize'
import _ from 'lodash'
import jwtHelper from './jwt-helper'
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
		// Check if user is currently authenticated
		//
		isAuthenticated: function () {
			// Validate if there is a token
			const token = localStorage.getItem('token')
			if (_.isNil(service.currentUser) && _.isNil(token) === false) {
				if (jwtHelper.isTokenExpired(token) === false) {
					var tokenPayload = jwtHelper.decodeToken(token)
					service.currentUser = hydrateRoles(tokenPayload)
					service.currentUser.contact = Person.fromJSON(service.currentUser.contact)
					console.log('Token decoded')
				}
			}
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
