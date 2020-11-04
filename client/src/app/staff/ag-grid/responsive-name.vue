<template lang="pug">
	.grids-inside-wrapper
		div
			span Name´s:&nbsp;
				span.content {{ params.data.name.last }}, {{ params.data.name.first }}
			span Phone:&nbsp;
				span.content {{ params.data.contactMethods.phones[0].number }}
			span Email:&nbsp;
				span.content {{ params.data.contactMethods.emails[0].address }}
		div
			.text-center
				router-link.fa.fa-pencil.fa-lg(:to="{name:'staffEdit', params:{id: params.data.id} }")
			.text-center
				a.row-btn(@click="openDelete")
					i(class="fa fa-trash" aria-hidden="true")
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
