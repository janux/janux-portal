<template lang="pug">
form.context-form(name='authContextForm', @submit.prevent="")
	.context-form-column
		table.table
			tr
				td: label(for='authContextName') Name:
				td: input#authContextName.form-control(type='text' v-model='authContext.name' name='name' required='')
			tr
				td: label(for='authContextRep') Description:
				td: input#authContextRep.form-control(type='text' v-model='authContext.description' name='description' required='')
			tr
				td: label(for='authContextGroup') Display Group:
				td
					select#authContextGroup.form-control(v-model='authContext.groupCode' required='')
						option(v-for='group in groupsList', :value="group.code") {{ group.name }}

		table.table.table-condensed.context-form
			tr
				th #
				th Permission Bit
				td
			tr(v-for="permBit in authContext.permissionBits")
				td {{ permBit.position + 1 }}
				td
					input.form-control(type='text' v-model='permBit.label' required='')
				td
					span.glyphicon.glyphicon-remove-circle(@click='removeBit(permBit.position)')
				//td: input.form-control(type='text' v-model='permBit.description')

		.text-right
			a.link.primary(@click='addPermissionBit')
				span.fa.fa-plus.fa-lg
				| &nbsp; Add Permission Bit
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
