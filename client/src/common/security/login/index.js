'use strict'

import loginComponent from './login-component'

const routes = [
	{
		path: '/login:goodbye',
		name: 'login',
		props: true,
		component: loginComponent
	}
]

export default routes
