<template lang="pug">
div
	v-jnx-header(:sectionTitle="sectionTitle")
	.page-content-wrapper(:class="{'page-content-left' : navBarExpanded}")
		.container-fluid
			.row
				.col-lg-12

					.title-bar
						.title {{ $t('user.listTitle') }}
						.options
							router-link(:to="{name:'userCreate'}")
								span.fa.fa-plus-circle.fa-lg
								| &nbsp; {{ $t('label.add') }}
					hr

					table.list.users-list(v-if='usersMatch.length')
						thead
							tr
								th {{ $t('user.username') }}
								th {{ $t('user.displayName') }}
								th {{ $t('user.role') }}
								th {{ $t('user.email') }}
								th {{ $t('user.phone') }}
								th {{ $t('user.renew') }}
								th {{ $t('user.edit') }}
								th
									md-button.md-icon-button(aria-label="Trash" style="background:none;", @click='openDelete')
										md-icon.fa.fa-trash.fa-lg(style="color:#ffffff;")

						tbody
							tr(v-for='user in usersMatch')
								td {{ user.username }}
								td {{ user.contact.name.shortName }}
								td {{ user.roles[0] }}
								td {{ user.contact.emailAddress('work').address }}
								td {{ user.contact.phoneNumber('work').number }}
								td(style="text-align:center")
									a.action-button
										router-link.fa.fa-lock.fa-lg(to="#")
								td.text-center
									a.action-button
										router-link.fa.fa-pencil.fa-lg(:to="{name:'userEdit', params:{userId:user.userId}}")
								td(style="text-align:center")
									md-checkbox(aria-label="Trash" v-model='user.Selected' class="md-primary")
								//td.text-center
								//	a.action-button(@click='editUser(user.userId)')
								//		span.fa.fa-pencil.fa-lg
								//	a.action-button(@click='openDeleteAuthContextDialog(user)')
								//		span.fa.fa-trash.fa-lg

					.users-filter
						form
							.fieldset-flex
								.an-material.nopadding
									label(for='username') Find by:
								.an-material.nopadding
									md-field.full
										md-select(aria-label='type' v-model='searchField')
											md-option(:value='field', v-for='(field, index) in searchFields', :key='index') {{ field }}
								.an-material.nopadding
									md-field.full
										md-input(id='username' type='text' v-model='searchString')
								.an-material.nopadding
									button.btn.btn-default(type='submit', @click='findUsers') {{ $t('label.search') }}
	v-jnx-footer

	md-dialog-confirm(
		:md-active.sync='showDelConf',
		md-title="Confirm delete?",
		md-content='Are you sure to delete the users selected',
		:md-confirm-text='$t("label.ok")',
		:md-cancel-text='$t("label.no")',
		@md-cancel='',
		@md-confirm='confirmDelete')

	md-dialog-alert(
		:md-active.sync='showErrorSel',
		:md-content='$t("user.dialogs.noRowSelectedError")',
		:md-confirm-text='$t("label.ok")')

</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import _ from 'lodash'
import {mapState} from 'vuex'

export default {
	name: 'user-list',
	data () {
		return {
			sectionTitle: this.$t('user.title'),
			searchFields: ['username', 'name', 'email', 'phone'],
			usersMatch: [],
			searchField: 'username',
			searchString: '',
			showDelConf: false,
			showErrorSel: false,
			selectedIds: []
		}
	},
	created: function () {
		this.fetchUsers()
	},
	methods: {
		fetchUsers () {
			Vue.jnx.userService.findBy('username', '').then((result) => {
				this.usersMatch = _.map(result, function (user) {
					user.cdate = moment(user.cdate).format('YYYY-MM-DD HH:mm:ss')
					return user
				})
				console.log('users match', this.usersMatch)
			})
		},

		findUsers () {
			Vue.jnx.userService.findBy(this.searchField, this.searchString).then((result) => {
				this.usersMatch = _.map(result, function (user) {
					user.cdate = moment(user.cdate).format('YYYY-MM-DD HH:mm:ss')
					return user
				})
				console.log('usersMatch', this.usersMatch)
			})
		},

		openDelete () {
			this.selectedIds = []
			for (var i = 0; i < this.usersMatch.length; i++) {
				if (this.usersMatch[i].Selected) {
					var userId = this.usersMatch[i].userId
					this.selectedIds.push(userId)
				}
			}

			if (this.selectedIds.length > 0) {
				this.showDelConf = true
			} else {
				this.showErrorSel = true
			}
		},

		confirmDelete () {
			let userDeletionArray = []
			for (var i = 0; i < this.selectedIds.length; i++) {
				// console.log(selectedIds[i]);
				userDeletionArray.push(Vue.jnx.userService.deleteUser(this.selectedIds[i]))
			}

			Promise.all(userDeletionArray).then(() => {
				this.$root.$router.go()
			})
		}
	},
	computed: mapState({
		navBarExpanded: state => state.navBarExpanded
	})
}
</script>
