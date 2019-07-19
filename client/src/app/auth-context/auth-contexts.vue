<template lang="pug" src="./auth-contexts.pug">
</template>

<script>
import draggable from 'vuedraggable'
import { authCBitsToArray } from 'App/role/util'
import Vue from 'vue'
import _ from 'lodash'
import {EventBus} from 'Common/event-bus'

export default {
	name: 'auth-context-list',
	props: ['authCGroups'],
	computed: {
		authContextGroups: {
			get: function () {
				return this.authCGroups
			},
			set: function (newValue) {
				this.authCGroups = newValue
			}
		}
	},
	data () {
		return {
			listTypes: {
				authContextGroup: 'authContextGroup',
				authContext: 'authContext'
			},
			snackbar: { show: false, message: '', duration: 1000 },
			authContextToDelete: {},
			authContextGroupToDelete: '',
			showDelConf: false,
			deleteTarget: '',
			dialog: { show: false, message: '' }
		}
	},
	components: { draggable },
	methods: {
		authCBitsToArray: authCBitsToArray,
		groupMoved () {
			console.log('group moved')
			let groupsOrder = []

			this.authContextGroups.forEach(function (group, iGroup) {
				group.attributes = { sortOrder: '' + iGroup }
				let groupToSave = {}
				groupToSave.code = group.code
				groupToSave.attributes = group.attributes
				groupsOrder.push(groupToSave)
			})

			Vue.jnx.authContextService.updateGroupsSortOrder(groupsOrder).then((resp) => {
				this.snackbar.message = 'permission.dialogs.authCGroupPositionUpdated'
				this.snackbar.show = true
				console.log('Updated groups order', resp)
			})
		},
		authContextMoved (authContextGroup, evt) {
			const authContextName = evt.item.id		// get item id
			let promises = []
			let groupToWork
			let authContextsOrder = []

			// Check if the context has fallen into another group
			if (!_.find(authContextGroup.values, {name: authContextName})) {
				var newGroup = _.find(this.authContextGroups, function (group) {
					return _.find(group.values, {name: authContextName})
				})
				groupToWork = newGroup

				// Ensure auth context order
				const authContextIndex = _.findIndex(groupToWork.values, {name: authContextName})
				let authContext = groupToWork.values[authContextIndex]
				authContext.sortOrder = authContextIndex
				promises.push(Vue.jnx.authContextService.update(authContextName, groupToWork.code, authContext))
			} else {
				groupToWork = authContextGroup
			}

			// Sort authorization contexts
			groupToWork.values.forEach(function (authContext, iContext) {
				let contextToSave = {}
				contextToSave.name = authContext.name
				contextToSave.sortOrder = iContext
				authContextsOrder.push(contextToSave)
			})

			console.log('Sorted auth context group', authContextsOrder)

			promises.push(Vue.jnx.authContextService.updateSortOrder(authContextsOrder))

			Promise.all(promises).then((resp) => {
				this.snackbar.message = 'permission.dialogs.authContextPositionUpdated'
				this.snackbar.show = true
				console.log('Updated authorization context', resp)
			})
		},
		openDeleteAuthContextGroupDialog (group) {
			// Can't delete the group because it still contains linked authorization contexts
			if (group.values.length) {
				this.dialog.message = 'permission.dialogs.warningGroupDeletion'
				this.dialog.show = true
			} else {
				this.deleteTarget = 'Are you sure to delete the selected Authorization Context Group'
				this.authContextGroupToDelete = group.code
				this.showDelConf = true
			}
		},
		openDeleteAuthContextDialog (groupCode, authContextName) {
			this.deleteTarget = 'Are you sure to delete the selected Authorization Context'
			this.authContextToDelete = { group: groupCode, name: authContextName }
			this.showDelConf = true
		},
		deleteConfirmed () {
			if (!_.isNil(this.authContextToDelete.group)) {
				Vue.jnx.authContextService.deleteByName(this.authContextToDelete.group, this.authContextToDelete.name).then(() => {
					this.authContextToDelete = {}
					EventBus.$emit('auth-context-list-reload')
				})
			} else if (this.authContextGroupToDelete !== '') {
				Vue.jnx.authContextService.removeGroup(this.authContextGroupToDelete).then(() => {
					this.authContextGroupToDelete = ''
					EventBus.$emit('auth-context-list-reload')
				})
			}
		}
	}
}
</script>
