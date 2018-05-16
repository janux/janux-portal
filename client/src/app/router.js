'use strict'

import Vue from 'vue'
import Router from 'vue-router'
import staff from './staff'
import user from './user'
import login from 'Common/security/login'

const appRoutes = [
	{
		path: '/',
		name: 'Main',
		redirect: {
			name: 'staffList'
		}
	}
].concat(
	login,
	staff,
	user
)

const appRouter = new Router({ routes: appRoutes })

appRouter.beforeEach((to, from, next) => {
	console.debug('router before each from', from, 'to', to)

	if (to.matched.some(record => record.meta.authRequired)) {
		// this route requires auth, check if logged in
		// if not, redirect to login page.
		Vue.jnx.security.requestCurrentUser().then(() => {
			if (!Vue.jnx.security.isAuthenticated()) {
				next({
					name: 'login',
					params: { goodbye: false, redirect: to.fullPath }
				})
			} else {
				next()
			}
		})
	} else {
		next() // make sure to always call next()!
	}
})

export default appRouter
