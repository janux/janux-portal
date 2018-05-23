/**
* Project janux-vuejs-seed
* Created by hielo on 2018-05-17
*/

<template lang="pug">
	div
		v-jnx-header(:sectionTitle="sectionTitle")
		.page-content-wrapper(v-bind:class="{ 'page-content-left' : navBarExpanded }")
			.container-fluid
				.row
					md-toolbar.form-root-toolbar.md-accent(md-elevation="1")
						.md-toolbar-tools.form-toolbar
							h3.md-title(style="flex: 1") {{ $t('permission.authContextGroup') }}

							md-button.md-icon-button.save(aria-label="Save", @click="saveAuthContextGroup")
								md-icon.fa.fa-check.fa-lg

							md-button.md-icon-button.cancel(aria-label="Cancel", @click="cancel")
								md-icon.fa.fa-times.fa-lg

					.container-fluid-flex.spacing-bottom
						form(name='authContextGroupForm')
							table.table.context-form
								tr
									td: label(for='authContextGroupName') {{ $t('permission.group.name') }}:
									td: input#authContextGroupName.form-control(type='text' v-model='group.name' name='name' required='')
								tr
									td: label(for='authContextGroupCode') {{ $t('permission.group.code') }}:
									td: input#authContextGroupCode.form-control(type='text' v-model='group.code' name='code' required='')
								tr
									td: label(for='authContextGroupDesc') {{ $t('permission.group.description') }}:
									td: input#authContextGroupDesc.form-control(type='text' v-model='group.description' name='description' required='')

		v-jnx-footer

		md-snackbar(md-position='center', :md-duration='snackbar.duration', :md-active.sync='snackbar.show', md-persistent='')
			span {{ $t(snackbar.message) }}
			md-button.md-primary(@click='snackbar.show = false') {{ $t('label.ok') }}
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

export default {
	name: 'auth-context-group-edit',
	data () {
		return {
			sectionTitle: this.$t('permission.title'),
			group: {
				name: '',
				code: '',
				description: ''
			},
			snackbar: { show: false, message: '', duration: 1000 }
		}
	},
	methods: {
		saveAuthContextGroup () {
			// TODO Add form validation
			let authContextGroupForm = true

			if (authContextGroupForm) {
				const group = {
					name: this.group.name,
					code: this.group.code,
					description: this.group.description,
					attributes: { sortOrder: '0' }
				}

				Vue.jnx.authContextService.insertGroup(group)
					.then(() => {
						this.$root.$router.go(-1)
					})
			} else {
				this.snackbar.message = 'permission.dialogs.allRequired'
				this.snackbar.show = true
				console.error('Please complete all required fields')
			}
		},
		cancel () {
			// Return by one record
			this.$root.$router.go(-1)
		}
	},
	computed: mapState({
		navBarExpanded: state => state.navBarExpanded
	})
}
</script>
