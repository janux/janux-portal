/**
* Project janux-vuejs-seed
* Created by hielo on 2018-05-10
*/

<template lang="pug">
	.section-form
		p.form-section
			| {{ componentTitle }}
		fieldset.fieldset-flex
			.fieldset-flex
				.an-material.nopadding
					md-field.full
						label {{ $t('party.person.name') }}
						md-input(v-model='data.name.first')

				.an-material.nopadding
					md-field.full
						label {{ $t('party.person.middleName') }}
						md-input(v-model='data.name.middle')

		fieldset.fieldset-flex
			.fieldset-flex
				.an-material.nopadding
					md-field.full
						label {{ $t('party.person.lastName') }}
						md-input(v-model='data.name.last')

				.an-material.nopadding
					md-field.full
						label {{ $t('party.person.maternalName') }}
						md-input(v-model='data.name.maternal')

</template>

<script>
export default {
	name: 'jnx-person-name',
	props: ['sectionTitle', 'data'],
	computed: {
		componentTitle () {
			return this.$t(this.sectionTitle)
		}
	}
}
</script>
