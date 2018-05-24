<template lang="pug">
div
	v-jnx-header(:sectionTitle="sectionTitle")
	.page-content-wrapper(v-bind:class="{ 'page-content-left' : navBarExpanded }")
		.container-fluid(v-if="dataReady")
			.row
				md-toolbar.form-root-toolbar.md-accent(md-elevation="1")
					.md-toolbar-tools.form-toolbar
						h3.md-title(style="flex: 1") {{ $t('user.createUser') }}

				.container-fluid-flex.spacing-bottom

					//md-content.staff-name
					//	h4 {{ staff.name.shortName }}

					md-content.spacing-ls
						md-toolbar.form-mid-toolbar
							.md-toolbar-tools
								md-tabs(md-active-tab="tab-user")
									md-tab#tab-user(md-label="USER", @click="currentNavItem='user'")
									md-tab#tab-contact(md-label="CONTACT", @click="currentNavItem='userContact'")
									md-tab#tab-notifications(md-label="NOTIFICATIONS", @click="currentNavItem='userNotifications'")

								span(flex)

								md-button.md-icon-button.save(aria-label="Save", @click='save')
									md-icon
										span.fa.fa-check.fa-sm

								md-button.md-icon-button.cancel(aria-label="Cancel", @click='cancel')
									md-icon
										span.fa.fa-times.fa-sm

						.user-form(v-if="currentNavItem == 'user'")
							md-content.staff-form(layout-padding)
								.container-flex-form
									v-jnx-user(section-title="user.user", :data="user", password="true")
									v-jnx-role(section-title="user.roles", :data="roles")

						.user-form(v-if="currentNavItem == 'userContact'")
							.container-flex-form
								.staff-form-left
									v-jnx-person-name(section-title='party.contact', :data='user.contact')
									v-jnx-address(section-title='party.addressesTitle', :data='user.contact')

								.staff-form-right
									v-jnx-person-job(section-title='staff.jobTitle', :data='user.contact')
									v-jnx-phone(section-title='party.phonesTitle', :data='user.contact')
									v-jnx-email(section-title='party.emailsTitle', :data='user.contact')

						.user-form(v-if="currentNavItem == 'userNotifications'")
							h3 User notifications
	v-jnx-footer

	md-dialog-alert(
		:md-active.sync='dialog.show',
		:md-content='$t(dialog.message)',
		:md-confirm-text='$t("label.ok")')
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
			if (!_.isNil(this.user.password) && !_.isNil(this.user.username)) {
				this.roles.forEach(function (role) {
					if (role.enabled) {
						this.user.roles.push(role.name)
					}
				})

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
