/**
* Project janux-vuejs-seed
* Created by hielo on 2018-05-10
*/

<template lang="pug">
	.section-form
		p.form-section
			| {{ componentTitle }}
		fieldset.fieldset-flex(v-for="(phone, index) in data.contactMethods.phones")
			.fieldset-flex
				.an-material.nopadding
					md-field.full
						//label {{ 'party.type' | translate}}
						//md-input(v-model="phone.type")
						label {{ $t('party.type') }}
						md-select(aria-label='type' v-model='phone.type')
							md-option(value='pType', v-for='pType in phoneTypes', :key='pType') {{ $t('party.contactType.'+pType) }}

				.an-material.nopadding
					md-field.full
						label {{ $t('party.code') }}
						md-input(v-model="phone.countryCode")
				.an-material.nopadding
					md-field.full
						label {{ $t('party.area') }}
						md-input(v-model='phone.areaCode')
				.an-material.nopadding
					md-field.full
						label {{ $t('party.number') }}
						md-input(v-model='phone.number')
				.an-material.nopadding
					md-field.full
						label {{ $t('party.ext') }}
						md-input(v-model='phone.ext')
				div
					md-checkbox.md-primary(aria-label="SMS" v-model='phone.sms')
						| {{ $t('party.sms') }}
				div
					md-checkbox.md-primary(aria-label="WSP" v-model='phone.wsp')
						| {{ $t('party.wsp') }}
				div
					button.btn-trash(@click="removePhone(index)")
						i.fa.fa-trash

		.btn-row-form
			md-divider.divider-line-glarus
			button.btn-plus(@click="addNewPhone")
				i.fa.fa-plus-square

</template>

<script>
import {PhoneNumber} from 'janux-people'

export default {
	name: 'jnx-phone',
	props: ['sectionTitle', 'data'],
	data () {
		return {
			phoneTypes: ['HOME', 'WORK', 'MOBILE', 'FAX', 'OTHER']
		}
	},
	methods: {
		removePhone (index) {
			this.staff.contactMethods.phones.splice(index, 1)
		},
		addNewPhone () {
			this.staff.setContactMethod('work', new PhoneNumber())
		}
	},
	computed: {
		componentTitle () {
			return this.$t(this.sectionTitle)
		}
	}
}
</script>
