/**
* Project janux-vuejs-seed
* Created by hielo on 2018-04-18
*/

<template lang="pug">

	div#app
		v-login-toolbar(:title="title")
		v-nav-bar
		.page-content-wrapper(v-bind:class="{ 'page-content-left' : navBarExpanded }")
			router-view
		v-jnx-footer

</template>

<script>
import jnxLoginToolbar from 'Common/login-toolbar'
import jnxFooter from 'Common/footer'
import jnxNavBar from 'Common/nav-bar'

export default {
	name: 'App',
	components: {
		'v-login-toolbar': jnxLoginToolbar,
		'v-jnx-footer': jnxFooter,
		'v-nav-bar': jnxNavBar
	},
	data () {
		return {
			title: 'People & Organizations',
			navBarExpanded: true
		}
	},
	methods: {
		toogleNavBar: function () {
			console.log('event fired!!')
		}
	},
	mounted () {
		this.$root.$on('toogleNavBar', data => {
			this.navBarExpanded = data
		})
	}
}
</script>
