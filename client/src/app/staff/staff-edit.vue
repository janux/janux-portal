/**
* Project janux-vuejs-seed
* Created by hielo on 2018-04-24
*/

<template lang="pug">
div
	v-jnx-header(:sectionTitle="sectionTitle")
	.page-content-wrapper(v-bind:class="{ 'page-content-left' : navBarExpanded }")
		.container-fluid(v-if="dataReady")
			.row
				md-toolbar.form-root-toolbar.md-accent(md-elevation="1")
					.md-toolbar-tools.form-toolbar
						h3.md-title(style="flex: 1") {{ $t('staff.editStaff') }} : {{ staff.name.shortName }}

						md-button.md-icon-button.form-btn-toolbar(aria-label="Grid")
							md-icon
								span.fa.fa-table.fa-sm

						md-button.md-icon-button(aria-label="Upload")
							md-icon
								span.fa.fa-upload.fa-sm

				.container-fluid-flex.spacing-bottom

					//md-content.staff-name
					//	h4 {{ staff.name.shortName }}

					md-content.spacing-ls
						md-toolbar.form-mid-toolbar
							.md-toolbar-tools
								md-tabs(md-active-tab="tab-general")
									md-tab#tab-general(md-label="GENERAL DATA")

								span(flex)

								//md-button.md-icon-button.trash(aria-label="Trash")
								//	md-icon.fa.fa-trash.fa-lg

								md-button.md-icon-button.save(aria-label="Save", @click='save')
									md-icon
										span.fa.fa-check.fa-sm

								md-button.md-icon-button.cancel(aria-label="Cancel", @click='cancel')
									md-icon
										span.fa.fa-times.fa-sm

						.container-flex-form
							.staff-form-left
								v-jnx-person-name(section-title='party.contact', :data='staff')
								v-jnx-address(section-title='party.addressesTitle', :data='staff')

							.staff-form-right
								v-jnx-person-job(section-title='staff.jobTitle', :data='staff')
								v-jnx-phone(section-title='party.phonesTitle', :data='staff')
								v-jnx-email(section-title='party.emailsTitle', :data='staff')
	v-jnx-footer
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import { mapState } from 'vuex'

export default {
	name: 'staff-edit',
	props: ['id'],
	data () {
		return {
			sectionTitle: this.$t('staff.title'),
			staff: {},
			dataReady: false,
			phoneTypes: ['HOME', 'WORK', 'MOBILE', 'FAX', 'OTHER'],
			mailTypes: ['PERSONAL', 'WORK', 'OTHER'],
			addressTypes: ['HOME', 'WORK', 'OTHER']
		}
	},
	beforeRouteEnter: (to, from, next) => {
		Vue.jnx.partyService.findOne(to.params.id).then((response) => {
			if (_.isNil(response.staff)) {
				response.staff = {
					jobTitle: '', jobDepartment: ''
				}
			}
			next((vm) => {
				vm.dataReady = true
				vm.staff = response
			})
		})
	},
	methods: {
		save () {
			console.log('Staff about to insert', this.staff)
			Vue.jnx.partyService.update(this.staff).then((resp) => {
				console.log('Staff has been inserted!', resp)
				this.$root.$router.go(-1)
			})
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
