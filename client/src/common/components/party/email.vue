/**
* Project janux-vuejs-seed
* Created by hielo on 2018-05-10
*/

<template lang="pug">
	.section-form
		p.form-section
			| Emails
		fieldset.fieldset-flex(v-for="(email,index) in data.contactMethods.emails")
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

</template>

<script>
import {EmailAddress} from 'janux-people'

export default {
	name: 'jnx-email',
	props: ['data'],
	data () {
		return {
			mailTypes: ['PERSONAL', 'WORK', 'OTHER']
		}
	},
	methods: {
		removeEmail (index) {
			this.staff.contactMethods.emails.splice(index, 1)
		},
		addNewEmail () {
			this.staff.setContactMethod('work', new EmailAddress())
		}
	}
}
</script>
