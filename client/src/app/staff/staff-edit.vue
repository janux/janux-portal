/**
* Project janux-vuejs-seed
* Created by hielo on 2018-04-24
*/

<template lang="pug" src="./staff-views.pug">
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
			viewType: 'edit',
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
