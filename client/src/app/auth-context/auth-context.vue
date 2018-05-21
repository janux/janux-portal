<template lang="pug">

					form(name='authContextForm')
						table.table.context-form
							tr
								td: label(for='authContextName') Name:
								td: input#authContextName.form-control(type='text' v-model='contextName' name='name' required='')
							tr
								td: label(for='authContextRep') Description:
								td: input#authContextRep.form-control(type='text' v-model='contextDesc' name='description' required='')
							tr
								td: label(for='authContextGroup') Display Group:
								td
									select#authContextGroup.form-control(v-model='contextGroupCode' required='')
										option(v-for='group in groupsList', :value="group.code") {{ group.name }}

						table.table.table-condensed.context-form
							tr
								th #
								th Permission Bit
								td
							tr(v-for="permBit in permissionBits")
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
export default {
	name: 'auth-context',
	props: ['contextName', 'contextDesc', 'contextGroupCode', 'permissionBits'],
	methods: {
		removeBit (position) {
			this.permissionBits = _.remove(this.permissionBits, function (bit) {
				return bit.position !== position
			})
		},
		addPermissionBit () {
			var maxPosition = (this.permissionBits.length > 0) ? _.maxBy(this.permissionBits, function (bit) { return bit.position }).position+1 : 0
			this.permissionBits.push({
				'label': '', 'position': maxPosition
			})
		}
	}
}
</script>
