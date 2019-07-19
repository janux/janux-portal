/**
* Project janux-vuejs-seed
* Created by hielo on 2018-05-17
*/

<template lang="pug" src="./auth-context-group-create.pug">
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

export default {
	name: 'auth-context-group-edit',
	data () {
		return {
			sectionTitle: this.$t('permission.title'),
			group: {
				name: '',
				code: '',
				description: ''
			},
			snackbar: { show: false, message: '', duration: 1000 }
		}
	},
	methods: {
		saveAuthContextGroup () {
			// TODO Add form validation
			let authContextGroupForm = true

			if (authContextGroupForm) {
				const group = {
					name: this.group.name,
					code: this.group.code,
					description: this.group.description,
					attributes: { sortOrder: '0' }
				}

				Vue.jnx.authContextService.insertGroup(group)
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
