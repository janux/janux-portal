<template lang="pug" src="./user-views.pug">
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import _ from 'lodash'

export default {
	name: 'user-edit',
	props: ['userId'],
	data () {
		return {
			viewType: 'edit',
			sectionTitle: this.$t('user.title'),
			currentNavItem: 'user',
			user: {},
			roles: [],
			dataReady: false
		}
	},
	created: function () {
		this.fetchData()
	},
	methods: {
		fetchData () {
			Vue.jnx.userService.findById(this.userId).then((response) => {
				this.user = response
				console.log('user response ', response)

				if (_.isNil(this.user.contact.staff)) {
					this.user.contact.staff = {
						jobTitle: '', jobDepartment: ''
					}
				}

				Vue.jnx.roleService.findAll().then((response) => {
					this.roles = response
					this.roles.forEach((role, iRole) => {
						this.roles[iRole].enabled = !!(this.user.roles.indexOf(role.name) > -1)
					})
					this.dataReady = true
				})
			})
		},
		save () {
			this.user.roles = []

			// Enabled roles
			this.roles.forEach((role) => {
				if (role.enabled) {
					this.user.roles.push(role.name)
				}
			})

			Vue.jnx.userService.saveOrUpdate(this.user).then(() => {
				console.log('User has been saved!')
				this.$root.$router.go(-1)	// History back
			})
		},
		cancel () {
			this.$root.$router.go(-1)	// History back
		}
	},
	computed: mapState({
		navBarExpanded: state => state.navBarExpanded
	})
}
</script>
