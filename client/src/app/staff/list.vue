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
						.title {{ $t('staff.staff') }}
						.options
							router-link(:to="{name:'staffCreate'}")
								span.fa.fa-plus-circle.fa-lg
								| &nbsp; {{ $t('label.add') }}
					hr

					table.list.users-list.list-with-footer(v-if='staffList.length')
						thead
							tr
								th {{ $t('party.person.name') }}
								th {{ $t('party.phone') }}
								th {{ $t('party.email') }}
								th {{ $t('staff.userName') }}
								th
									.col-edit-staff {{ $t('staff.edit') }}
								th
									md-button.md-icon-button(aria-label="Trash" style="padding-left:10px; padding-top:0 !important; margin-top:0 ;" @click='openDelete')
										md-icon
											span.fa.fa-trash.fa-sm(style="color:#ffffff; background:none;" )

						tbody
							tr(v-for='staff in staffList')
								td {{ staff.name.middle }} {{ staff.name.last }}, {{ staff.name.first }}
								td {{ staff.phoneNumber().number }}
								td {{ staff.emailAddress().address }}
								td {{ staff.user }}
								td(style="text-align:center")
									a.action-button
										router-link.fa.fa-pencil.fa-lg(:to="{name:'staffEdit', params:{id: staff.id} }")
								td(style="text-align:center")
									md-checkbox.md-primary(aria-label="Trash" v-model='staff.Selected' style="margin-top:8px; margin-left:10px; background:none;")

	v-jnx-footer
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

export default {
	name: 'staff-list',
	data () {
		return {
			sectionTitle: this.$t('staff.title'),
			staffList: []
		}
	},
	beforeRouteEnter: (to, from, next) => {
		Vue.jnx.partyService.findPeople().then((response) => {
			next(vm => {
				vm.staffList = response
				console.log('staffList', vm.staffList)
			})
		})
	},
	methods: {
		openDelete () {
			console.log('Deleting staff')
		}
	},
	computed: mapState({
		navBarExpanded: state => state.navBarExpanded
	})
}
</script>
