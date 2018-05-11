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
						label {{ $t('staff.job') }}
						md-input(v-model='data.staff.jobTitle')

		fieldset.fieldset-flex
			.fieldset-flex
				.an-material.nopadding
					md-field.full
						label {{ $t('staff.area') }}
						md-input(v-model='data.staff.jobDepartment')
</template>

<script>
export default {
	name: 'jnx-person-job',
	props: ['sectionTitle', 'data'],
	computed: {
		componentTitle () {
			return this.$t(this.sectionTitle)
		}
	}
}
</script>
