/**
* Project janux-vuejs-seed
* Created by hielo on 2018-05-17
*/

<template lang="pug" src="./auth-context-group-edit.pug">
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

export default {
	name: 'auth-context-group-edit',
	props: ['authContextGroupCode'],
	data () {
		return {
			sectionTitle: this.$t('permission.title'),
			originalGroupCode: '',
			group: {},
			snackbar: { show: false, message: '', duration: 1000 }
		}
	},
	beforeRouteEnter (to, from, next) {
		Vue.jnx.authContextService.findGroupByCode(to.params.authContextGroupCode).then(group => {
			next((vm) => {
				vm.group = group
				vm.originalGroupCode = group.code // Preserve group code
			})
		})
	},
	methods: {
		saveAuthContextGroup () {
			// TODO Add form validation
			let authContextGroupForm = true

			if (authContextGroupForm) {
				const group = {
					name: this.group.name,
					code: this.group.code,
					description: this.group.description
				}

				Vue.jnx.authContextService.updateGroup(this.originalGroupCode, group)
					.then(() => {
						this.$root.$router.push({name: 'authContextList'})
					})
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
