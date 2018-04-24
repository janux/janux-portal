/**
* Project janux-vuejs-seed
* Created by hielo on 2018-04-18
*/

<template lang="pug">

	div#app
		v-login-toolbar(:title="title")
		v-nav-bar
		router-view
		v-jnx-footer

</template>

<script>
	import loginToolbar from 'Common/login-toolbar'
	import footer from 'Common/footer'
	import navBar from 'Common/nav-bar'

	export default {
		name: 'App',
		components: {
			'v-login-toolbar': loginToolbar,
			'v-jnx-footer': footer,
			'v-nav-bar': navBar
		},
		data() {
			return {
				title: 'People & Organizations'
			};
		}
	}
</script>
