'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-05-04
 */

import UserList from './list.vue'
import UserEdit from './user-edit.vue'
import UserCreate from './user-create.vue'

const routes = [
	{
		path: '/user',
		name: 'userList',
		component: UserList,
		meta: { authRequired: true }
	},
	{
		path: '/user/create',
		name: 'userCreate',
		component: UserCreate,
		meta: { authRequired: true }
	},
	{
		path: '/user/edit:userId',
		name: 'userEdit',
		component: UserEdit,
		props: true,
		meta: { authRequired: true }
	}
]

export default routes
