/**
* Project janux-vuejs-seed
* Created by hielo on 2018-04-24
*/

<template lang="pug">
div
	v-jnx-header(:sectionTitle="sectionTitle")
	.page-content-wrapper(v-bind:class="{ 'page-content-left' : navBarExpanded }")
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

						draggable(v-model='roles', :options="{draggable:'.role'}")
							.role(v-for="role in roles")
								.element
									table.roles-list
										tr
											td.name
												span.role-title {{ role.name }}
												br
												| {{ role.description }}
											td.allmighty
												span.fa.fa-check-square(v-if='role.isAlmighty')
												| &nbsp;
											td.enabled
												span.fa.fa-check-square(v-if='role.enabled')
												| &nbsp;
											td.options
												router-link.action-button(:to="{name: 'roleEdit', params: {roleName: role.name}}")
													span.fa.fa-pencil.fa-lg
												a.action-button(@click='openDeleteRoleDialog(role.name)')
													span.fa.fa-trash.fa-lg

						.text-left
							router-link.link.primary(:to="{name: 'roleCreate'}")
								span.fa.fa-plus.fa-lg
								| &nbsp;Add Role
	v-jnx-footer
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import draggable from 'vuedraggable'

export default {
	name: 'role-list',
	data () {
		return {
			sectionTitle: this.$t('permission.title'),
			roles: []
		}
	},
	components: { draggable },
	beforeRouteEnter: (to, from, next) => {
		Vue.jnx.roleService.findAll().then((response) => {
			next(vm => (vm.roles = response))
		})
	},
	methods: {
		openDeleteRoleDialog (roleName) {}
	},
	computed: mapState({
		navBarExpanded: state => state.navBarExpanded
	})
}
</script>
