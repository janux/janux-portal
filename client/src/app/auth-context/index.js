'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-05-04
 */

import AuthContextList from './list.vue'
import AuthContextEdit from './auth-context-edit.vue'
import AuthContextCreate from './auth-context-create.vue'
import AuthContextGroupCreate from './auth-context-group-create.vue'
import AuthContextGroupEdit from './auth-context-group-edit.vue'

const routes = [
	{
		path: '/auth-context',
		name: 'authContextList',
		component: AuthContextList,
		meta: { authRequired: true }
	},
	{
		path: '/auth-context/create',
		name: 'authContextCreate',
		component: AuthContextCreate,
		meta: { authRequired: true }
	},
	{
		path: '/auth-context/edit/:contextGroupCode/:contextName/:copyFromContext',
		name: 'authContextEdit',
		component: AuthContextEdit,
		props: true,
		meta: { authRequired: true }
	},
	{
		path: '/auth-context/create-group',
		name: 'authContextGroupCreate',
		component: AuthContextGroupCreate,
		meta: { authRequired: true }
	},
	{
		path: '/auth-context/edit-group/:authContextGroupCode',
		name: 'authContextGroupEdit',
		component: AuthContextGroupEdit,
		props: true,
		meta: { authRequired: true }
	}
]

export default routes
