/**
* Project janux-vuejs-seed
* Created by hielo on 2018-04-24
*/

<template lang="pug" src="./staff-create.pug">
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
			sectionTitle: this.$t('staff.title'),
			staff: {}
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
