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
						h3.md-title(style="flex: 1") {{ $t('permission.editingRole') }} {{ role.name }}

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
			roleName: '',
			role: {},
			authContextGroups: [],
			authContexts: [],
			dataReady: false
		}
	},
	components: { roleForm },
	beforeRouteEnter (to, from, next) {
		Vue.jnx.authContextService.findGroups().then(authContextGroups => {
			Vue.jnx.roleService.findOneByName(to.params.roleName).then((role) => {
				next((vm) => {
					vm.authContextGroups = authContextGroups
					vm.role = role
					vm.dataReady = true
					vm.init()
				})
			})
		})
	},
	methods: {
		init () {
			// save the role name in case it changes
			this.roleName = this.role.name

			// Extract authorization contexts
			this.authContexts = _.mapKeys(_.flatten(_.map(this.authContextGroups, 'values')), 'name')

			// Create role instance
			let loadedRole = Role.fromJSON(this.role)
			loadedRole.authContexts = {}

			// This function is used below
			let setBit = function (contextName, bit) {
				if (typeof loadedRole.authContexts[contextName] === 'undefined') {
					loadedRole.authContexts[contextName] = { bit: {} }
				}
				loadedRole.authContexts[contextName].bit[bit] = true
			}

			for (const contextName in this.authContexts) {
				// console.log('Granted bits', this.role.getGrantAsBitList(contextName))
				// Get granted bit list
				const grantBitList = loadedRole.getGrantAsBitList(contextName)

				if (grantBitList.length > 0) {
					// Iterate over each granted bit
					grantBitList.forEach(setBit.bind(null, contextName))
				} else {
					// No bits has been granted for this context, so we define bit as empty object
					loadedRole.authContexts[contextName] = { bit: {} }
				}
			}

			this.role = loadedRole
		},
		saveRole () {
			let roleToSave = Role.createInstance(this.role.name, this.role.description)
			roleToSave.enabled = this.role.enabled
			roleToSave.isAlmighty = this.role.isAlmighty
			roleToSave.sortOrder = this.role.sortOrder

			for (let contextName in this.role.authContexts) {
				// Create instance of authorization context
				const givenContext = AuthorizationContext.fromJSON(this.authContexts[contextName])

				// Get granted bits list
				let grantedBits = []
				for (let grantedBit in _.values(this.role.authContexts[contextName])[0]) {
					if (_.values(this.role.authContexts[contextName])[0][grantedBit]) {
						grantedBits.push(grantedBit)
					}
				}

				roleToSave.grant(grantedBits, givenContext)
			}

			Vue.jnx.roleService.update(this.roleName, roleToSave.toJSON()).then(() => {
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
