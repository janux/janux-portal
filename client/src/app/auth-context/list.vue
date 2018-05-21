/**
* Project janux-vuejs-seed
* Created by hielo on 2018-04-24
*/

<template lang="pug">
div
	v-jnx-header(:sectionTitle="sectionTitle")
	.page-content-wrapper(v-bind:class="{ 'page-content-left' : navBarExpanded }")
		.container-fluid
			.row
				.col-lg-12
					.title-bar
						.title {{ $t('permission.authContexts') }}
					hr
					auth-context-list(:authCGroups="authContextGroups")

	v-jnx-footer
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import authContextList from './auth-contexts.vue'

export default {
	name: 'role-list',
	data () {
		return {
			sectionTitle: this.$t('permission.title'),
			authContextGroups: []
		}
	},
	components: { authContextList },
	beforeRouteEnter: (to, from, next) => {
		Vue.jnx.authContextService.findGroups().then((response) => {
			next(vm => (vm.authContextGroups = response))
		})
	},
	computed: mapState({
		navBarExpanded: state => state.navBarExpanded
	})
}
</script>
