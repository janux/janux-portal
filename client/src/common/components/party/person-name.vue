/**
* Project janux-vuejs-seed
* Created by hielo on 2018-05-10
*/

<template lang="pug">
	.section-form
		p.form-section
			| Contact
		fieldset.fieldset-flex
			.fieldset-flex
				.an-material.nopadding
					md-field.full
						label Name
						md-input(v-model='data.name.first')

				.an-material.nopadding
					md-field.full
						label Middle name
						md-input(v-model='data.name.middle')

		fieldset.fieldset-flex
			.fieldset-flex
				.an-material.nopadding
					md-field.full
						label Last name
						md-input(v-model='data.name.last')

				.an-material.nopadding
					md-field.full
						label Maternal name
						md-input(v-model='data.name.maternal')

</template>

<script>
export default {
	name: 'jnx-person-name',
	props: ['data']
}
</script>
