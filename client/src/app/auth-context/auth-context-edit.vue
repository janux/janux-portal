/**
* Project janux-vuejs-seed
* Created by hielo on 2018-05-17
*/

<template lang="pug">
div
	v-jnx-header(:sectionTitle="sectionTitle")
	.page-content-wrapper(v-bind:class="{ 'page-content-left' : navBarExpanded }")
		.container-fluid
			.row
				md-toolbar.form-root-toolbar.md-accent(md-elevation="1")
					.md-toolbar-tools.form-toolbar
						// h3.md-title(v-if="mode=='creating'", style="flex: 1") {{ $t('permission.createContext') }}
						h3.md-title(v-if="mode=='copying'", style="flex: 1") {{ $t('permission.copyContext') }} {{ copyFrom }}
						h3.md-title(v-if="mode=='editing'", style="flex: 1") {{ $t('permission.editContext') }}

						md-button.md-icon-button.save(aria-label="Save", @click="saveAuthContext")
							md-icon.fa.fa-check.fa-lg

						md-button.md-icon-button.cancel(aria-label="Cancel", @click="cancel")
							md-icon.fa.fa-times.fa-lg

				.container-fluid-flex.spacing-bottom
					auth-context(:contextName="contextName", :contextDesc="contextDesc", :contextGroupCode="contextGroupCode", :permissionBits="permissionBits")
	v-jnx-footer
</template>

<script>
import {AuthorizationContext} from 'janux-authorize'
import Vue from 'vue'
import { mapState } from 'vuex'
import authContext from './auth-context.vue'
import _ from 'lodash'
import { authCBitsToArray } from 'App/role/util'

export default {
	name: 'auth-context-edit',
	props: ['contextGroupCode', 'contextName', 'copyFromContext'],
	data () {
		return {
			groupsList: [],
			authContext: [],
			dataReady: false,
			mode: 'editing'
		}
	},
	components: { authContext },
	beforeRouteEnter (to, from, next) {
		Vue.jnx.authContextService.findOneByName(to.params.contextName).then(authContext => {
			Vue.jnx.authContextService.findGroupsList().then((groupsList) => {
				next((vm) => {
					vm.authContext = authContext
					vm.groupsList = groupsList
					vm.dataReady = true
					vm.init()
				})
			})
		})
	},
	methods: {
		init () {
			let name = this.authContext.name

			// Convert object of authorization bits to array
			this.permissionBits = _.orderBy(authCBitsToArray(this.authContext.bit), 'position')

			this.contextName = name
			this.contextDesc = this.authContext.description

			// Copying authorization context
			if (this.copyFromContext) {
				this.mode = 'copying'
				this.contextName = ''
				this.contextDesc = ''
				this.copyFrom = this.copyFromContext
				this.contextGroupCode = this.groupsList[0].code
			} else if (this.contextGroupCode && this.contextName) {
				// Editing authorization context
				this.mode = 'editing'
			}
		},
		saveAuthContext () {
			var bitListSortedByPosition = this.permissionBits.sort(function (a, b) {
				return a.position > b.position
			}).map(function (bit) {
				return bit.label
			})

			// TODO Add form validation
			let authContextForm = true

			if (authContextForm) {
				if (this.permissionBits.length > 0) {
					var authContext = AuthorizationContext.createInstance(this.contextName, this.contextDesc, bitListSortedByPosition)

					if (this.copying) {
						if (authContext.name !== name) {
							Vue.jnx.authContextService.insert(this.contextGroupCode, authContext.toJSON())
								.then(() => {
									this.$root.$router.go(-1)
								})
						} else {
							/* $modal.open({
								templateUrl: 'app/dialog-tpl/info-dialog.html',
								controller: ['this','$modalInstance',
									function(this , $modalInstance) {
										this.message = 'The authorization context has the same name as the one you are copying'
										this.ok = function() {
											$modalInstance.close()
										}
									}],
								size: 'md'
							}) */
						}
					} else if (this.editing) {
						Vue.jnx.authContextService.update(name, this.contextGroupCode, authContext.toJSON())
							.then(function () {
								this.$root.$router.go(-1)
							})
					}
				} else {
					console.error('Select at least one permission bit in order to create an authorization context')
				}
			} else {
				console.error('Please complete all required fields')
			}
		},
		cancel () {
			// Return by one record
			this.$root.$router.go(-1)
		}
	},
	computed: mapState({
		navBarExpanded: state => state.navBarExpanded
	})
}
</script>
