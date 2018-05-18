'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-05-04
 */

import RoleList from './list.vue'
import RoleEdit from './role-edit.vue'
import RoleCreate from './role-create.vue'

const routes = [
	{
		path: '/role',
		name: 'roleList',
		component: RoleList,
		meta: { authRequired: true }
	},
	{
		path: '/role/create',
		name: 'roleCreate',
		component: RoleCreate,
		meta: { authRequired: true }
	},
	{
		path: '/role/edit:roleName',
		name: 'roleEdit',
		component: RoleEdit,
		props: true,
		meta: { authRequired: true }
	}
]

export default routes
