/**
* Project janux-vuejs-seed
* Created by hielo on 2018-05-17
*/

<template lang="pug">
	div
		v-jnx-header(:sectionTitle="sectionTitle")
		.page-content-wrapper(v-bind:class="{ 'page-content-left' : navBarExpanded }")
			.container-fluid(v-if="dataReady")
				.row
					md-toolbar.form-root-toolbar.md-accent(md-elevation="1")
						.md-toolbar-tools.form-toolbar
							h3.md-title(style="flex: 1") {{ $t('permission.createRole') }}

							md-button.md-icon-button.save(aria-label="Save", @click="saveRole")
								md-icon.fa.fa-check.fa-lg

							md-button.md-icon-button.cancel(aria-label="Cancel", @click="cancel")
								md-icon.fa.fa-times.fa-lg

					.container-fluid-flex.spacing-bottom
						role-form(:role="role", :authContextGroups="authContextGroups")
		v-jnx-footer
</template>

<script>
import {Role, AuthorizationContext} from 'janux-authorize'
import Vue from 'vue'
import { mapState } from 'vuex'
import roleForm from './role-form.vue'
import _ from 'lodash'

export default {
	name: 'staff-edit',
	props: ['id'],
	data () {
		return {
			sectionTitle: this.$t('permission.title'),
			role: {
				'name': '',
				'description': '',
				'isAlmighty': false,
				'enabled': true,
				'authContexts': {}
			},
			authContextGroups: [],
			dataReady: false
		}
	},
	components: { roleForm },
	beforeRouteEnter (to, from, next) {
		Vue.jnx.authContextService.findGroups().then(authContextGroups => {
			next((vm) => {
				vm.authContextGroups = authContextGroups
				vm.dataReady = true
				vm.init()
			})
		})
	},
	methods: {
		init () {
			// Extract authorization contexts
			this.authContexts = _.mapKeys(_.flatten(_.map(this.authContextGroups, 'values')), 'name')

			for (const contextName in this.authContexts) {
				this.role.authContexts[contextName] = { bit: {} }
			}
		},
		saveRole () {
			// Instantiate the authorization contexts from which
			// at least one permit has been granted for this role

			// Create Role
			let role = Role.createInstance(this.role.name, this.role.description)
			role.enabled = this.role.enabled
			role.isAlmighty = this.role.isAlmighty

			for (const contextName in this.role.authContexts) {
				// Create instance of authorization context
				const givenContext = AuthorizationContext.fromJSON(this.authContexts[contextName])

				// Get granted bits list
				let grantedBits = []
				for (const grantedBit in _.values(this.role.authContexts[contextName])[0]) {
					grantedBits.push(grantedBit)
				}

				role.grant(grantedBits, givenContext)
			}

			Vue.jnx.roleService.insert(role.toJSON()).then(() => {
				this.$root.$router.push({name: 'roleList'})
			})
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
