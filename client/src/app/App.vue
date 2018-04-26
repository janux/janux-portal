/**
* Project janux-vuejs-seed
* Created by hielo on 2018-04-18
*/

<template lang="pug">

	div#app
		v-jnx-toolbar(:title="title")
		v-jnx-nav-bar
		.page-content-wrapper(v-bind:class="{ 'page-content-left' : navBarExpanded }")
			router-view
		v-jnx-footer
		v-jnx-slide-in

</template>

<script>
import components from 'Common/components'

export default {
	name: 'App',
	components: {},
	data () {
		return {
			title: 'People & Organizations',
			navBarExpanded: true
		}
	},
	methods: {
	//		toogleNavBar: function () {
	//			console.log('event fired!!')
	//		}
	},
	mounted () {
		this.$root.$on('toogleNavBar', data => {
			this.navBarExpanded = data
		})
	}
}
</script>
