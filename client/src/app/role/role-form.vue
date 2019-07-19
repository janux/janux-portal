<template lang="pug" src="./role-form.pug">
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
