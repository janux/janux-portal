/**
* Project janux-vuejs-seed
* Created by hielo on 2018-04-24
*/

<template lang="pug">
div
	v-jnx-header(:sectionTitle="sectionTitle")
	.page-content-wrapper.fa-adjust-view(v-bind:class="{ 'page-content-left' : navBarExpanded }")
		.container-fluid
			.row
				.col-lg-12
					.title-bar
						.title {{ $t('role.title') }}
					hr
					.maincolumn

						.role-list-header
							.name Name / Description
							.role-aggregated Role(s) Aggregated
							.allmighty Is Allmighty?
							.enabled Enabled?
							.actions Actions

						draggable(v-model='roles', :options="{draggable: longView ? '.role' : '.none'}",  @end="roleMoved" :class="{ 'responsive-list': !longView }")
							.role(v-for="role in roles" :class="{ responsive: !longView }")
								.element
									table.roles-list
										tr
											h5(v-if="!longView") Name/Description:
											td.name
												span.role-title {{ role.name }}
												br
												| {{ role.description }}

											h5(v-if="!longView") Role(s) Aggregated:
											td.addRole
												// This functionality does not exist yet
												span
												| Role added

											td.allmighty(v-if="longView")
												span.fa.fa-check-square(v-if='role.isAlmighty')
												| &nbsp
											td.enabled(v-if="longView")
												span.fa.fa-check-square(v-if='role.enabled')
												| &nbsp
											td.options(v-if="longView")
												router-link.action-button(:to="{name: 'roleEdit', params: {roleName: role.name}}")
													span.fa.fa-pencil.fa-lg
												a.action-button(@click='openDeleteRoleDialog(role.name)')
													span.fa.fa-trash.fa-lg

											h4(v-if="!longView")
											td.allmighty(v-if="!longView")
												span.label.label-success(v-if='role.isAlmighty') Allmighty
												span.label.label-default(v-if='!role.isAlmighty') No allmighty

											h4(v-if="!longView")
											td.enabled(v-if="!longView")
												span.label.label-success(v-if='role.enabled') Enabled
												span.label.label-default(v-if='!role.enabled') No enabled

											h4(v-if="!longView")
											td.options(v-if="!longView")
												button.edit-btn(type="button" class="btn btn-success" aria-haspopup="true" aria-expanded="false")
													router-link.md-primary(:to="{name: 'roleEdit', params: {roleName: role.name}}") Edit

												button.delete-btn(type="button" class="btn btn-danger" aria-haspopup="true" aria-expanded="false")
													a.action-button(@click='openDeleteRoleDialog(role.name)') Delete

						.text-left.add-role
							router-link.link.primary(:to="{name: 'roleCreate'}")
								span.fa.fa-plus.fa-lg
								| &nbsp;Add Role
	v-jnx-footer

	md-snackbar(md-position='center', :md-duration='snackbar.duration', :md-active.sync='snackbar.show', md-persistent='')
		span {{ $t(snackbar.message) }}
		md-button.md-primary(@click='snackbar.show = false') {{ $t('label.ok') }}

	md-dialog-confirm(
		:md-active.sync='showDelConf',
		md-title="Confirm delete?",
		md-content='Are you sure to delete the role selected',
		:md-confirm-text='$t("label.ok")',
		:md-cancel-text='$t("label.no")',
		@md-cancel='',
		@md-confirm='deleteRole')
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import draggable from 'vuedraggable'

export default {
	name: 'role-list',
	data () {
		return {
			longView: false,
			widthBrowser: 0,
			sectionTitle: this.$t('permission.title'),
			roles: [],
			snackbar: { show: false, message: '', duration: 4000 },
			showDelConf: false,
			roleNameToDelete: ''
		}
	},
	components: { draggable },
	beforeRouteEnter: (to, from, next) => {
		Vue.jnx.roleService.findAll().then((response) => {
			next(vm => (vm.roles = response))
		})
	},
	created () {
		this.isShowResponsiveData()
	},
	mounted () {
		window.addEventListener('resize', this.isShowResponsiveData)
	},
	destroyed () {
		window.removeEventListener('resize', this.isShowResponsiveData)
	},
	methods: {
		roleMoved () {
			let rolesToSave = []
			// Update sort order
			this.roles.forEach(function (role, iRole) {
				role.sortOrder = iRole
				let roleToSave = {}
				roleToSave.id = role.id
				roleToSave.sortOrder = role.sortOrder
				rolesToSave.push(roleToSave)
			})

			Vue.jnx.roleService.updateSortOrder(rolesToSave).then((resp) => {
				this.snackbar.message = 'role.dialogs.positionUpdated'
				this.snackbar.show = true
				console.log('Updated roles', resp)
			})
		},
		openDeleteRoleDialog (roleName) {
			this.roleNameToDelete = roleName
			this.showDelConf = true
		},
		deleteRole () {
			Vue.jnx.roleService.deleteByName(this.roleNameToDelete).then(() => {
				this.$root.$router.go()	// Reload
			})
		},
		isShowResponsiveData () {
			let widthPage = document.documentElement.clientWidth
			console.log('widthPage ', widthPage)
			this.widthBrowser = widthPage
			if (widthPage >= 760) {
				this.longView = true
			} else {
				this.longView = false
			}
		}
	},
	computed: mapState({
		navBarExpanded: state => state.navBarExpanded
	})
}
</script>
