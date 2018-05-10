'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-05-04
 */

import StaffList from './list.vue'
import StaffEdit from './staff-edit.vue'
import StaffCreate from './staff-create.vue'

const routes = [
	{
		path: '/staff',
		name: 'staffList',
		component: StaffList,
		meta: { authRequired: true }
	},
	{
		path: '/staff/create',
		name: 'staffCreate',
		component: StaffCreate,
		meta: { authRequired: true }
	},
	{
		path: '/staff/edit:id',
		name: 'staffEdit',
		component: StaffEdit,
		props: true,
		meta: { authRequired: true }
	}
]

export default routes
