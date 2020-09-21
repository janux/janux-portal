<template lang="pug" src="./user-create.pug">
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import _ from 'lodash'
import md5 from 'js-md5'
import {Person, EmailAddress} from 'janux-people'

export default {
	name: 'user-create',
	props: ['userId'],
	data () {
		return {
			sectionTitle: this.$t('user.title'),
			currentNavItem: 'user',
			user: {
				username: '',
				password: '',
				roles: [],
				enabled: true
			},
			roles: [],
			dataReady: false,
			dialog: { show: false, message: '' }
		}
	},
	created: function () {
		this.fetchData()
	},
	methods: {
		infoDialog (message) {
			this.dialog.show = true
			this.dialog.message = message
		},
		fetchData () {
			// Create a new person
			var person = new Person()
			// person.setContactMethod('work', new PhoneNumber());
			person.setContactMethod('work', new EmailAddress())
			// person.setContactMethod('Home', new PostalAddress());

			this.user.contact = person
			this.user.contact.staff = {
				jobTitle: '', jobDepartment: ''
			}

			Vue.jnx.roleService.findAll().then((response) => {
				this.roles = response
				this.dataReady = true
				console.log('role', this.roles)
			})
		},
		save () {
			if (_.trim(this.user.username) === '' && _.trim(this.user.password) === '' ) {
				this.infoDialog('user.dialogs.noUsernamePassword')
				return
			}

			console.log('user roles ', this.roles)
			let Roles = []
			if (!_.isNil(this.user.password) && !_.isNil(this.user.username)) {
				this.roles.forEach(function (role) {
					if (role.enabled) {
						// this.user.roles.push(role.name)
						Roles.push(role.name)
					}
				})
				this.user.roles = Roles

				if (this.user.roles.length > 0) {
					if (this.user.contact.contactMethods.emails[0].address) {
						if (!_.isNil(this.user.contact.name.first) && !_.isNil(this.user.contact.name.first)) {
							console.log('user created', this.user)
							this.user.password = md5(this.user.password)
							Vue.jnx.userService.saveOrUpdate(this.user).then((resp) => {
								console.log('User has been saved!', resp)
								this.$root.$router.go(-1)	// History back
							})
						} else {
							this.currentNavItem = 'contact'
							this.infoDialog('user.dialogs.nameEmpty')
						}
					} else {
						this.infoDialog('user.dialogs.emailEmpty')
					}
				} else {
					this.infoDialog('user.dialogs.noRoles')
				}
			}
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
