'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-05-04
 */

import AuthContextList from './list.vue'
import AuthContextEdit from './auth-context-edit.vue'
import AuthContextCreate from './auth-context-create.vue'

const routes = [
	{
		path: '/authContext',
		name: 'authContextList',
		component: AuthContextList,
		meta: { authRequired: true }
	},
	{
		path: '/authContext/create',
		name: 'authContextCreate',
		component: AuthContextCreate,
		meta: { authRequired: true }
	},
	{
		path: '/authContext/edit:id',
		name: 'authContextEdit',
		component: AuthContextEdit,
		props: true,
		meta: { authRequired: true }
	}
]

export default routes
