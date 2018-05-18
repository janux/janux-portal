<template lang="pug">
.role-page
	.role-data
		.role-option
			.text Name:
			.control
				input.form-control(type='text' v-model='role.name' required='')

		.role-option
			.text
			.control
				| Enabled &nbsp;
				input(type='checkbox' v-model='role.enabled')
				| &nbsp; Is Almighty &nbsp;
				input(type='checkbox' v-model='role.isAlmighty')

		.role-option
			.text Description:
			.control
				textarea.form-control(required='' v-model='role.description') {{ role.description }}

	.role-permissions(v-for='authContextGroup in authContextGroups')
		.group-element {{ authContextGroup.name }}
		table.context-check-list
			tbody
				tr(v-for='authContext in authContextGroup.values')
					td.name {{ authContext.name }}
					td.bits
						div.bit(v-for="authBit in authCBitsToArray(authContext.bit)")
							| {{ authBit.label }}
							input.bit-check(type='checkbox', v-model='role.authContexts[authContext.name].bit[authBit.label]')
</template>

<script>
import { authCBitsToArray } from './util'

export default {
	name: 'roleForm',
	props: ['role', 'authContextGroups'],
	methods: {
		authCBitsToArray: authCBitsToArray
	}
}
</script>
