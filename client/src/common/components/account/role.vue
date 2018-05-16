/**
* Project janux-vuejs-seed
* Created by hielo on 2018-05-15
*/

<template lang="pug">
div
	p.form-section {{ componentTitle }}
	div.an-material

		table.list.list-glarus
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
	computed: {
		componentTitle () {
			return this.$t(this.sectionTitle)
		}
	}
}
</script>
