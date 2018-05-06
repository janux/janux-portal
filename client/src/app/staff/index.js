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
		component: StaffList
	},
	{
		path: '/staff/create',
		name: 'staffCreate',
		component: StaffCreate
	},
	{
		path: '/staff/edit:id',
		name: 'staffEdit',
		component: StaffEdit,
		props: true
	}
]

export default routes
