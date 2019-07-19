<template lang="pug" src="./auth-context.pug">
</template>

<script>
import _ from 'lodash'

export default {
	name: 'auth-context',
	props: ['authContext', 'groupsList'],
	methods: {
		removeBit (position) {
			this.authContext.permissionBits = _.remove(this.authContext.permissionBits, function (bit) {
				return bit.position !== position
			})
		},
		addPermissionBit () {
			const maxPosition = (this.authContext.permissionBits.length > 0) ? _.maxBy(this.authContext.permissionBits, function (bit) { return bit.position }).position + 1 : 0
			this.authContext.permissionBits.push({
				'label': '', 'position': maxPosition
			})
		}
	}
}
</script>
