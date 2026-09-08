/**
* Project janux-vuejs-seed
* Created by hielo on 2018-05-15
*/

<template lang="pug">
div
	p.form-section {{ componentTitle }}
	div.an-material
		md-field.user-field
			label {{ $t('user.username') }}
			md-input(v-model='data.username' required='')

		md-field.user-field(v-if='password')
			label {{ $t('user.password') }}
			md-input(type="password" v-model='data.password' required='')

		md-field.user-field
			label {{ $t('user.email') }}
			md-input(v-model='data.contact.contactMethods.emails[0].address')

		md-field.full
			md-checkbox.md-primary(aria-label="Enabled" v-model='data.enabled')
				| {{ $t('user.enabled') }}

		md-field.full
			md-checkbox.md-primary(aria-label="Locked" v-model='data.locked')
				| {{ $t('user.locked') }}
		.full
			md-datepicker(v-model="selectedDate", :md-open-on-focus="false")
				label {{ $t('user.expirationDate') }}

		//- Greyed out: expirePassword isn't enforced at login yet (JAM-24's
		//- follow-up covers forcing a password change on the way in). Also
		//- corrects this field having written to data.expirePassWord (wrong
		//- case) rather than the schema's actual expirePassword - it was
		//- never reaching the account record either way.
		.full
			md-datepicker(v-model="data.expirePassword", :md-open-on-focus="false", :disabled="true")
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
