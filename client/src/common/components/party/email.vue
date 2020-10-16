/**
* Project janux-vuejs-seed
* Created by hielo on 2018-05-10
*/

<template lang="pug">
	.section-form
		p.form-section
			| {{ componentTitle }}
		fieldset.fieldset-flex(v-for="(email,index) in data.contactMethods.emails")
			.fieldset-flex
				.an-material.nopadding.party-element
					md-field.full
						//label {{ 'party.type' | translate}}
						//md-input(v-model="email.type")
						label {{ $t('party.type') }}
						md-select(aria-label='type' v-model='email.type')
							md-option(:value='eType', v-for='eType in mailTypes', :key='eType') {{ $t('party.contactType.'+eType) }}

				div
					md-checkbox.md-primary(aria-label="Principal" v-model='email.principal')
						| {{ $t('party.first') }}

				.an-material.party-element
					md-field.full
						label {{ $t('party.email') }}
						md-input(v-model="email.address")

				div
					button.btn-trash(@click="removeEmail(index)")
						i.fa.fa-trash

		.btn-row-form
			md-divider
			button.btn-plus(@click="addNewEmail")
				i.fa.fa-plus-square

</template>

<script>
import {EmailAddress} from 'janux-people'

export default {
	name: 'jnx-email',
	props: ['sectionTitle', 'data'],
	data () {
		return {
			mailTypes: ['PERSONAL', 'WORK', 'OTHER']
		}
	},
	methods: {
		removeEmail (index) {
			this.data.contactMethods.emails.splice(index, 1)
		},
		addNewEmail () {
			this.data.setContactMethod('work', new EmailAddress())
		}
	},
	computed: {
		componentTitle () {
			return this.$t(this.sectionTitle)
		}
	}
}
</script>
