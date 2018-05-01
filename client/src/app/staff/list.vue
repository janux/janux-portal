/**
* Project janux-vuejs-seed
* Created by hielo on 2018-04-24
*/

<template lang="pug">

	.container-fluid
		.row
			.col-lg-12
				.title-bar
					.title Staff
					.options
						router-link(:to="{name:'staffCreate'}")
							span.fa.fa-plus-circle.fa-lg
							| &nbsp; Add
				hr

				table.list.users-list.list-with-footer(v-if='staffList.length')
					thead
						tr
							th Name
							th Phone number
							th Email
							th User Name
							th
								.col-edit-staff Edit
							th
								md-button.md-icon-button(aria-label="Trash" style="padding-left:10px; padding-top:0 !important; margin-top:0 ;" @click='openDelete')
									md-icon
										span.fa.fa-trash.fa-sm(style="color:#ffffff; background:none;" )

					tbody
						tr(v-for='staff in staffList')
							td {{ staff.name.middle }} {{ staff.name.last }}, {{ staff.name.first }}
							td {{ staff.phoneNumber('work').number }}
							td {{ staff.emailAddress('work').address }}
							td {{ staff.user }}
							td(style="text-align:center")
								a.action-button
									router-link.fa.fa-pencil.fa-lg(:to="{name:'staffEdit', params:{id: staff.id} }")
							td(style="text-align:center")
								md-checkbox.md-primary(aria-label="Trash" v-model='staff.Selected' style="margin-top:8px; margin-left:10px; background:none;")


</template>

<script>
import partyService from 'Common/services/party-service'

export default {
	name: 'staff-list',
	data(){
		return{
			staffList: []
		}
	},
	created: function()
	{
		this.fetchStaff()
	},
	methods: {
		fetchStaff (){
			return partyService.findPeople()
				.then(staff => {
					this.staffList = staff
				})
		},
		openDelete (){
			console.log('Deleting staff')
		}
	}
}
</script>
