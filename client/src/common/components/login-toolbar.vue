/**
* Project janux-vuejs-seed
* Created by hielo on 2018-04-24
*/

<template lang="pug">
	md-toolbar.sd-page-header(md-elevation='1')
		//.md-toolbar-row
		.sd-page-logo.sd-page-logo-collapsed
			a(href='../')
				img.sd-logo-default(src='/img/janux_logo.png', alt='Janux')

		.sd-page-breadcrum
			| {{ title }}

		.sd-top-menu
			md-button
				span.sd-name Ronda Peterson
			md-button.md-icon-button(aria-label='Logout')
				md-icon
					span.fa.fa-sign-out.fa-sm
		md-button.md-icon-button.navbar-toggle-btn(aria-label='Menu', v-on:click='openMenu')
			md-icon
				span.fa.fa-bars.fa-lg

</template>

<script>
import { EventBus } from 'Common/event-bus'

export default {
	name: 'login-toolbar',
	//	data () {
	//		return {
	//			subTitle: 'Subtitles ***'
	//		};
	//	},
	props: ['title'],
	methods: {
		openMenu: function () {
			EventBus.$emit('toogleSlidein', 'any')
			console.log('Toogle mobile menu')
		}
	}
}
</script>
