/**
* Project janux-vuejs-seed
* Created by hielo on 2018-05-10
*/

<template lang="pug">
	.section-form
		p.form-section
			| Adresses
		md-divider.divider-line-glarus(ng-show="lastAddress==0")

		fieldset(v-for="(address, index) in data.contactMethods.addresses")
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

</template>

<script>
import {PostalAddress} from 'janux-people'

export default {
	name: 'jnx-address',
	props: ['data'],
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
	}
}
</script>
