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
import {EventBus} from 'Common/event-bus'

export default {
	name: 'role-list',
	data () {
		return {
			sectionTitle: this.$t('permission.title'),
			authContextGroups: []
		}
	},
	components: { authContextList },
	methods: {
		loadData () {
			Vue.jnx.authContextService.findGroups().then((response) => {
				this.authContextGroups = response
			})
		}
	},
	beforeMount () {
		this.loadData()

		// Reload list in case of auth-context or auth-context group delete
		EventBus.$on('auth-context-list-reload', () => {
			this.loadData()
		})
	},
	computed: mapState({
		navBarExpanded: state => state.navBarExpanded
	})
}
</script>
