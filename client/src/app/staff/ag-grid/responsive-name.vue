<template lang="pug">
	div(style="display: flex; justify-content: space-between; padding-top: 15px;")
		div(style="width: 70%; display: flex; flex-direction: column;")
			span Name´s: {{ params.data.name.last }}, {{ params.data.name.first }}
			span Phone: {{ params.data.contactMethods.phones[0].number }}
			span Email: {{ params.data.contactMethods.emails[0].address }}
		div(style="width: 25%; display: flex; flex-direction: column; justify-content: space-around;")
			div(class="text-center")
				router-link.fa.fa-pencil.fa-lg(style="font-size: 3rem;" :to="{name:'staffEdit', params:{id: params.data.id} }")
			div(class="text-center")
				a.row-btn(@click="openDelete")
					i(class="fa fa-trash" style="font-size: 3rem;"  aria-hidden="true")
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
	name: 'ag-grid-responsive-row-name',
	methods: {
		openDelete () {
			// console.log('Deleting staff')
		}
	}
})
</script>
