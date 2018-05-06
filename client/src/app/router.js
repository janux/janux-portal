'use strict'

import Router from 'vue-router'
import exampleComponent from './example-component'
import staff from './staff'

const appRoutes = [].concat(
	exampleComponent,
	staff
)

const appRouter = new Router({ routes: appRoutes })

appRouter.beforeEach((to, from, next) => {
	console.log('router before each from', from, 'to', to)
	next()
})

export default appRouter
