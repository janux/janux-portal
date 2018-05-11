/**
* Project janux-vuejs-seed
* Created by hielo on 2018-05-10
*/

<template lang="pug">
	.section-form
		p.form-section
			| Job
		fieldset.fieldset-flex
			.fieldset-flex
				.an-material.nopadding
					md-field.full
						label Job
						md-input(v-model='data.staff.jobTitle')

		fieldset.fieldset-flex
			.fieldset-flex
				.an-material.nopadding
					md-field.full
						label Area
						md-input(v-model='data.staff.jobDepartment')
</template>

<script>
export default {
	name: 'jnx-person-job',
	props: ['data']
}
</script>
