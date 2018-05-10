<template lang="pug">
	form.login-form(name='form', novalidate v-on:submit.prevent="")

		.login-body

			img.logo(src='/img/janux_logo.png')
			.brand
				span.janux janux
			.brand
				span.people people
			.brand
				hr.line

			div.info-text
				p Use one of the following user/password credentials to login:
				ul
					li widget/test1
					li manager/test2
					li admin/1234567

			.alert.alert-warning(v-if='authReason') {{authReason}}
			.alert.alert-danger(v-if='authError') {{authError}}

			.login-lbl
				label User:
				input.login-field(name='login', v-model='user.account.name', required, autofocus, novalidate='')

			.login-lbl
				label Password:
				input.login-field(name="pass", type='password', v-model='user.account.password', required, novalidate='')

			div.text-right
				a.forgot-pass(href="#") Forgot Password

			.btn-login-cnt
				button.btn.btn-login(@click='login', :disabled='invalidForm') Log In

			hr.line

			div.text-center
				.copy &copy; 2018 Janux Media LTD. Copyright.
</template>

<script>
import Vue from 'vue'

export default {
	name: 'Login',
	props: ['goodbye', 'redirect'],
	data () {
		return {
			// The reason that we are being asked to login - for instance because we tried
			// to access something to which we are not authorized We could do something
			// different for each reason here but to keep it simple...
			authReason: null,
			// Any error message from failing to login
			authError: null,
			// The model for the login form
			user: {
				account: {},
				person: {}
			},
			invalidForm: false
		}
	},
	created () {
		if (this.goodbye) {
			if (this.goodbye === 'TRUE') {
				this.authReason = 'You have been signed out'
			} else if (this.goodbye === 'FORCED_LOGOUT') {
				this.authReason = 'Your session has expired. Please log in again'
			}
		}
	},
	methods: {
		// Attempt to authenticate the user specified in the form's model
		login () {
			console.debug('login controller')
			// Clear any previous security errors
			this.authError = null

			// Try to login
			Vue.jnx.security.login(this.user.account.name, this.user.account.password).then((loggedIn) => {
				if (!loggedIn) {
					// If we get here then the login failed due to bad credentials
					this.authError = 'The user/password that you entered is not valid'
					this.authReason = null
				} else if (this.$route.name === 'login') {
					let redirect = (this.redirect) ? this.redirect : '/'
					this.$router.push(redirect)
				}
			}, (err) => {
				// If we get here then there was a problem with the login request to the server
				console.error('Server is unavailable or returned an error', err)
				this.authError = 'Server is unavailable or returned an error'
				this.authReason = null
			})
		}
	}
}
</script>
