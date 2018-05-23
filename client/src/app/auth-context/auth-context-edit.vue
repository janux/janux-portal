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
						h3.md-title(v-else-if="mode=='editing'", style="flex: 1") {{ $t('permission.editContext') }}

						md-button.md-icon-button.save(aria-label="Save", @click="saveAuthContext")
							md-icon.fa.fa-check.fa-lg

						md-button.md-icon-button.cancel(aria-label="Cancel", @click="cancel")
							md-icon.fa.fa-times.fa-lg

				.container-fluid-flex.spacing-bottom
					auth-context(:authContext="authContext", :groupsList="groupsList")
	v-jnx-footer

	md-snackbar(v-if='snackbar.show', md-position='center', :md-duration='snackbar.duration', :md-active.sync='snackbar.show', md-persistent='')
		span {{ $t(snackbar.message) }}
		md-button.md-primary(@click='snackbar.show = false') {{ $t('label.ok') }}
</template>

<script>
import { AuthorizationContext } from 'janux-authorize'
import Vue from 'vue'
import { mapState } from 'vuex'
import authContextForm from './auth-context.vue'
import _ from 'lodash'
import { authCBitsToArray } from 'App/role/util'

export default {
	name: 'auth-context-edit',
	props: ['contextGroupCode', 'contextName', 'copyFromContext'],
	data () {
		return {
			sectionTitle: this.$t('permission.title'),
			originalContextName: '',
			groupsList: [],
			authContext: {
				name: this.contextName,
				description: '',
				permissionBits: [],
				groupCode: this.contextGroupCode
			},
			dataReady: false,
			mode: 'editing',
			snackbar: { show: false, message: '', duration: 1000 }
		}
	},
	components: { authContext: authContextForm },
	beforeRouteEnter (to, from, next) {
		const contextName = (to.params.copyFromContext !== false) ? to.params.copyFromContext : to.params.contextName

		Vue.jnx.authContextService.findOneByName(contextName).then(authContext => {
			Vue.jnx.authContextService.findGroupsList().then((groupsList) => {
				next((vm) => {
					console.log('authContext', authContext)
					vm.authContext.description = authContext.description
					// Convert object of authorization bits to array
					vm.authContext.permissionBits = _.orderBy(authCBitsToArray(authContext.bit), 'position')
					vm.groupsList = groupsList
					vm.init()
				})
			})
		})
	},
	methods: {
		init () {
			// Save name (in case we are editing)
			this.originalContextName = this.authContext.name

			// Copying authorization context
			if (this.copyFromContext !== false) {
				this.mode = 'copying'
				this.authContext.name = ''
				this.authContext.description = ''
				this.authContext.groupCode = this.groupsList[0].code
				this.copyFrom = this.copyFromContext
			} else if (this.contextGroupCode && this.contextName) {
				// Editing authorization context
				this.mode = 'editing'
			}
		},
		saveAuthContext () {
			console.log('saving auth context', this.authContext.name)
			let bitListSortedByPosition = this.authContext.permissionBits.sort(function (a, b) {
				return a.position > b.position
			}).map(function (bit) {
				return bit.label
			})

			// TODO Add form validation
			let authContextForm = true

			if (authContextForm) {
				if (this.authContext.permissionBits.length > 0) {
					let authContext = AuthorizationContext.createInstance(this.authContext.name, this.authContext.description, bitListSortedByPosition)

					if (this.mode === 'copying') {
						if (authContext.name !== this.originalContextName) {
							Vue.jnx.authContextService.insert(this.authContext.groupCode, authContext.toJSON())
								.then(() => {
									this.$root.$router.go(-1)
								})
						} else {
							this.snackbar.message = 'permission.dialogs.clonedSameName'
							this.snackbar.show = true
						}
					} else if (this.mode === 'editing') {
						Vue.jnx.authContextService.update(this.originalContextName, this.authContext.groupCode, authContext.toJSON())
							.then(() => {
								this.$root.$router.go(-1)
							})
					}
				} else {
					this.snackbar.message = 'permission.dialogs.oneBitMin'
					this.snackbar.show = true
					console.error('Select at least one permission bit in order to create an authorization context')
				}
			} else {
				this.snackbar.message = 'permission.dialogs.allRequired'
				this.snackbar.show = true
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
