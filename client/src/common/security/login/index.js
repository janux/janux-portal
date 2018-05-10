'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-05-07
 */

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
