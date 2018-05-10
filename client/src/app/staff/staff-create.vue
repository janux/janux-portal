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
				md-toolbar.form-root-toolbar.md-accent(md-elevation="1")
					.md-toolbar-tools.form-toolbar
						h3.md-title(style="flex: 1") Create Staff

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

								md-button.md-icon-button.save(aria-label="Save" @click='save')
									md-icon
										span.fa.fa-check.fa-sm

								md-button.md-icon-button.cancel(aria-label="Cancel" @click='cancel')
									md-icon
										span.fa.fa-times.fa-sm

						.container-flex-form
							.staff-form-left
								.section-form
									p.form-section
										| Contact
									fieldset.fieldset-flex
										.fieldset-flex
											.an-material.nopadding
												md-field.full
													label Name
													md-input(v-model='staff.name.first')

											.an-material.nopadding
												md-field.full
													label Middle name
													md-input(v-model='staff.name.middle')

									fieldset.fieldset-flex
										.fieldset-flex
											.an-material.nopadding
												md-field.full
													label Last name
													md-input(v-model='staff.name.last')

											.an-material.nopadding
												md-field.full
													label Maternal name
													md-input(v-model='staff.name.maternal')
								.section-form
									p.form-section
										| Adresses
									md-divider.divider-line-glarus(ng-show="lastAddress==0")

									fieldset(v-for="(address, index) in staff.contactMethods.addresses")
										.fieldset-flex
											.an-material.nopadding.half
												md-field.full
													//label {{ 'party.type' | translate}}
													//md-input(v-model="address.type" id="address1")
													label Type
													md-select(aria-label='type' v-model='address.type')
														md-option(value='aType', v-for='aType in addressTypes' :key='aType') {{ aType }}

											.an-material.nopadding
												md-field.full
													label Country
													md-input(v-model="address.country")
											div
												md-checkbox.md-primary(aria-label="Fiscal" v-model="address.fiscal")
													| Fiscal
											div
												button.btn-trash(@click="removeAddress(index)")
													i.fa.fa-trash

										.container-flex-form
											.an-material.nopadding
												md-field.full
													label Street 1
													md-input(v-model='address.line1')
										.container-flex-form
											.an-material.nopadding
												md-field.full
													label Street 2
													md-input(v-model='address.line2')

										.fieldset-flex
											.an-material.nopadding
												md-field.full
													label City
													md-input(v-model="address.cityText")
											.an-material.nopadding
												md-field.full
													label State
													md-input(v-model="address.stateText")
											.an-material.nopadding
												md-field.full
													label Zip
													md-input(v-model='address.postalCode')

									.btn-row-form
										md-divider.divider-line-glarus
										button.btn-plus(@click="addNewAddress")
											i.fa.fa-plus-square

							.staff-form-right
								.section-form
									p.form-section
										| Job
									fieldset.fieldset-flex
										.fieldset-flex
											.an-material.nopadding
												md-field.full
													label Job
													md-input(v-model='staff.staff.jobTitle')

									fieldset.fieldset-flex
										.fieldset-flex
											.an-material.nopadding
												md-field.full
													label Area
													md-input(v-model='staff.staff.jobDepartment')

								.section-form
									p.form-section
										| Phones
									fieldset.fieldset-flex(v-for="(phone, index) in staff.contactMethods.phones")
										.fieldset-flex
											.an-material.nopadding
												md-field.full
													//label {{ 'party.type' | translate}}
													//md-input(v-model="phone.type")
													label Type
													md-select(aria-label='type' v-model='phone.type')
														md-option(value='pType', v-for='pType in phoneTypes' :key='pType') {{ pType }}

											.an-material.nopadding
												md-field.full
													label Code
													md-input(v-model="phone.countryCode")
											.an-material.nopadding
												md-field.full
													label Area
													md-input(v-model='phone.areaCode')
											.an-material.nopadding
												md-field.full
													label Number
													md-input(v-model='phone.number')
											.an-material.nopadding
												md-field.full
													label Ext.
													md-input(v-model='phone.ext')
											div
												md-checkbox.md-primary(aria-label="SMS" v-model='phone.sms')
													| SMS
											div
												md-checkbox.md-primary(aria-label="WSP" v-model='phone.wsp')
													| WSP
											div
												button.btn-trash(@click="removePhone(index)")
													i.fa.fa-trash

									.btn-row-form
										md-divider.divider-line-glarus
										button.btn-plus(@click="addNewPhone")
											i.fa.fa-plus-square

								.section-form
									p.form-section
										| Emails
									fieldset.fieldset-flex(v-for="(email,index) in staff.contactMethods.emails")
										.fieldset-flex
											.an-material.nopadding.half
												md-field.full
													//label {{ 'party.type' | translate}}
													//md-input(v-model="email.type")
													label Type
													md-select(aria-label='type' v-model='email.type')
														md-option(value='aType', v-for='(aType, index) in mailTypes' :key='index') {{ aType }}

											.an-material.nopadding
												md-field.full
													label Email
													md-input(v-model="email.address")

											div
												md-checkbox.md-primary(aria-label="Principal" v-model='email.principal')
													| Main

											div
												button.btn-trash(@click="removeEmail(index)")
													i.fa.fa-trash

									.btn-row-form
										md-divider.divider-line-glarus
										button.btn-plus(@click="addNewEmail")
											i.fa.fa-plus-square
	v-jnx-footer
</template>

<script>
import {Person, PhoneNumber, EmailAddress, PostalAddress} from 'janux-people'
import Vue from 'vue'
import { mapState } from 'vuex'

export default {
	name: 'staff-edit',
	props: ['id'],
	data () {
		return {
			sectionTitle: 'People & Organizations',
			staff: {},
			phoneTypes: ['HOME', 'WORK', 'MOBILE', 'FAX', 'OTHER'],
			mailTypes: ['PERSONAL', 'WORK', 'OTHER'],
			addressTypes: ['HOME', 'WORK', 'OTHER']
		}
	},
	created: function () {
		this.initStaffObject()
	},
	methods: {
		initStaffObject () {
			let staffObj = new Person()
			staffObj.setContactMethod('work', new PhoneNumber())
			staffObj.setContactMethod('work', new EmailAddress())
			staffObj.setContactMethod('Home', new PostalAddress())

			// Fullfill missing staff job object
			staffObj.staff = {
				jobTitle: '', jobDepartment: ''
			}
			this.staff = staffObj
		},
		removeAddress (index) {
			this.staff.contactMethods.addresses.splice(index, 1)
		},
		addNewAddress () {
			this.staff.setContactMethod('work', new PostalAddress())
		},
		removePhone (index) {
			this.staff.contactMethods.phones.splice(index, 1)
		},
		addNewPhone () {
			this.staff.setContactMethod('work', new PhoneNumber())
		},
		removeEmail (index) {
			this.staff.contactMethods.emails.splice(index, 1)
		},
		addNewEmail () {
			this.staff.setContactMethod('work', new EmailAddress())
		},
		save () {
			console.log('user created', this.staff)
			Vue.jnx.partyService.insert(this.staff).then((resp) => {
				console.log('Staff has been saved!', resp)
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
