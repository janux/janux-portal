<template lang="pug">
	div(class="text-center")
		a.row-btn(@click="openDelete")
			i(class="fa fa-trash" aria-hidden="true")
</template>

<script>
import Vue from 'vue'
// import { EventBus } from '@/common/event-bus.js'

export default Vue.extend({
	name: 'ag-grid-row-delete',
	methods: {
		openDelete () {
			console.log('Deleting staff')
		}
	}
})
</script>
