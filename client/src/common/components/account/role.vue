/**
* Project janux-vuejs-seed
* Created by hielo on 2018-05-15
*/

<template lang="pug">
div
	p.form-section {{ componentTitle }}
	div.an-material

		table.list.list-glarus
			tr(v-for='role in data' style="display: flex; border: 1px solid lightgray;" v-if="screenResponsiveWidth")
				div(style="width: 40%; padding: 10px;")
					p {{ $t('user.roleName') }}:
					p {{ $t('user.roleEnabled') }}:
					p {{ $t('user.roleDescr') }}:
				div(style="width: 50%; padding: 10px;")
					p(style="font-weight: bold;") {{ role.name }}
					p
						md-checkbox.md-primary(aria-label="role.name" v-model='role.enabled' style="margin: 0;")
					p {{ role.description }}

			span(v-if="!screenResponsiveWidth")
				tr
					th {{ $t('user.roleName') }}
					th {{ $t('user.roleDescr') }}
					th {{ $t('user.roleEnabled') }}
				tr(v-for='role in data')
					td.role-name {{ role.name }}
					td {{ role.description }}
					td.role-enabled
						md-checkbox.md-primary(aria-label="role.name" v-model='role.enabled')
</template>

<script>
export default {
	name: 'jnx-role',
	props: ['sectionTitle', 'data'],
	data () {
		return {
			screenResponsiveWidth: true
		}
	},
	mounted () {
		let w = window.innerWidth
		this.screenResponsiveWidth = w <= 460 ? this.screenResponsiveWidth : !this.screenResponsiveWidth
		console.log('w ', w, typeof w)
	},
	computed: {
		componentTitle () {
			return this.$t(this.sectionTitle)
		}
	}
}
</script>
