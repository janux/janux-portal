/**
* Project janux-vuejs-seed
* Created by hielo on 2018-05-10
*/

<template lang="pug">
	.section-form
		p.form-section
			| {{ componentTitle }}
		md-divider.divider-line-glarus(ng-show="lastAddress==0")

		fieldset(v-for="(address, index) in data.contactMethods.addresses")
			.fieldset-flex
				.an-material.nopadding.half
					md-field.full
						//label {{ 'party.type' | translate}}
						//md-input(v-model="address.type" id="address1")
						label {{ $t('party.type') }}
						md-select(aria-label='type' v-model='address.type')
							md-option(:value='aType', v-for='aType in addressTypes', :key='aType') {{ $t('party.contactType.'+aType) }}

				.an-material.nopadding
					md-field.full
						label {{ $t('party.country') }}
						md-input(v-model="address.country")
				div
					md-checkbox.md-primary(aria-label="Fiscal" v-model="address.fiscal")
						| {{ $t('party.fiscal') }}
				div
					button.btn-trash(@click="removeAddress(index)")
						i.fa.fa-trash

			.container-flex-form
				.an-material.nopadding
					md-field.full
						label {{ $t('party.street1') }}
						md-input(v-model='address.line1')
			.container-flex-form
				.an-material.nopadding
					md-field.full
						label {{ $t('party.street2') }}
						md-input(v-model='address.line2')

			.fieldset-flex
				.an-material.nopadding
					md-field.full
						label {{ $t('party.city') }}
						md-input(v-model="address.cityText")
				.an-material.nopadding
					md-field.full
						label {{ $t('party.state') }}
						md-input(v-model="address.stateText")
				.an-material.nopadding
					md-field.full
						label {{ $t('party.zip') }}
						md-input(v-model='address.postalCode')

		.btn-row-form
			md-divider.divider-line-glarus
			button.btn-plus(@click="addNewAddress")
				i.fa.fa-plus-square

</template>

<script>
import {PostalAddress} from 'janux-people'

export default {
	name: 'jnx-address',
	props: ['sectionTitle', 'data'],
	data () {
		return {
			addressTypes: ['HOME', 'WORK', 'OTHER']
		}
	},
	methods: {
		removeAddress (index) {
			this.data.contactMethods.addresses.splice(index, 1)
		},
		addNewAddress () {
			this.data.setContactMethod('work', new PostalAddress())
		}
	},
	computed: {
		componentTitle () {
			return this.$t(this.sectionTitle)
		}
	}
}
</script>
