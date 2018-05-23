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
							h3.md-title(style="flex: 1") {{ $t('permission.createContext') }}

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

export default {
	name: 'auth-context-create',
	data () {
		return {
			sectionTitle: this.$t('permission.title'),
			groupsList: [],
			authContext: {
				name: '',
				description: '',
				permissionBits: [],
				groupCode: ''
			},
			snackbar: { show: false, message: '', duration: 1000 }
		}
	},
	components: { authContext: authContextForm },
	beforeRouteEnter (to, from, next) {
		Vue.jnx.authContextService.findGroupsList().then((groupsList) => {
			next((vm) => {
				vm.groupsList = groupsList
				vm.authContext.groupCode = groupsList[0].code
			})
		})
	},
	methods: {
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

					Vue.jnx.authContextService.insert(this.authContext.groupCode, authContext.toJSON())
						.then(() => {
							this.$root.$router.go(-1)
						})
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
