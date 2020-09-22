/**
* Project janux-vuejs-seed
* Created by hielo on 2018-05-15
*/

<template lang="pug">
div
	p.form-section {{ componentTitle }}
	div.an-material.p-30px
		md-field.user-field
			label {{ $t('user.username') }}
			md-input(v-model='data.username' required='')

		md-field.user-field(v-if='password')
			label {{ $t('user.password') }}
			md-input(type="password" v-model='data.password' required='')

		md-field.user-field
			label {{ $t('user.email') }}
			md-input(v-model='data.contact.contactMethods.emails[0].address')

		.row-user
			md-field.full.row-child
				md-checkbox.md-primary(aria-label="Enabled" v-model='data.enabled')
					| {{ $t('user.enabled') }}

			md-field.full.row-child
				md-checkbox.md-primary(aria-label="Locked" v-model='data.locked')
					| {{ $t('user.locked') }}
		.row-user
			.full.row-child
				md-datepicker(v-model="selectedDate", :md-open-on-focus="false")
					label {{ $t('user.expirationDate') }}

			.full.row-child
				md-datepicker(v-model="data.expirePassWord", :md-open-on-focus="false")
					label {{ $t('user.passExpirationDate') }}

</template>

<script>
export default {
	name: 'jnx-user',
	props: ['sectionTitle', 'data', 'password'],
	computed: {
		componentTitle () {
			return this.$t(this.sectionTitle)
		}
	},
	data: () => ({
		selectedDate: null
	})
}
</script>
