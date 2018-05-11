/**
* Project janux-vuejs-seed
* Created by hielo on 2018-04-24
*/

<template lang="pug">
	md-toolbar.sd-page-header(md-elevation='1')
		.sd-page-logo(:class="{ 'sd-page-logo-collapsed': navBarExpanded }")
			a(href='../')
				img.sd-logo-default(src='/img/janux_logo.png', alt='Janux')

		.sd-page-breadcrum
			| {{ sectionTitle }}

		.sd-top-menu
			md-button
				span.sd-name {{ currentUser.contact.name.first +' '+currentUser.contact.name.last}}
			md-button.md-icon-button(aria-label='Logout' v-on:click='logout')
				md-icon
					span.fa.fa-sign-out.fa-sm
		md-button.md-icon-button.navbar-toggle-btn(aria-label='Menu', v-on:click='openMenu')
			md-icon
				span.fa.fa-bars.fa-lg

</template>

<script>
import Vue from 'vue'
import { EventBus } from 'Common/event-bus'
import { mapState } from 'vuex'

export default {
	name: 'login-toolbar',
	data () {
		return {}
	},
	props: ['sectionTitle'],
	methods: {
		openMenu: function () {
			EventBus.$emit('toogleSlidein', 'any')
			console.log('Toogle mobile menu')
		},
		logout: function () {
			Vue.jnx.security.logout().then((resp) => {
				this.$router.push({name: 'login', params: {goodbye: 'TRUE'}})
			})
		}
	},
	computed: mapState({
		navBarExpanded: state => state.navBarExpanded,
		currentUser: state => state.currentUser
	})
}
</script>
