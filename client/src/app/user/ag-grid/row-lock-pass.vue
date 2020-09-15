<template lang="pug">
	div(class="text-center")
		a.row-btn(@click="lockPass")
			i(class="fa fa-lock" aria-hidden="true")
</template>

<script>
import Vue from 'vue'
// import { EventBus } from '@/common/event-bus.js'

export default Vue.extend({
	name: 'ag-grid-row-lock-pass',
	methods: {
		lockPass () {
			console.log('Password lock')
		}
	}
})
</script>
