<template lang="pug">
	.grids-inside-wrapper
		div
			span Name´s:&nbsp;
				span.content {{ params.data.names }}
			span Username:&nbsp;
				span.content {{ params.data.username }}
			span Roles:&nbsp;
				span.content {{ getRoles(params.data.roles) }}
			span Phone:&nbsp;
				span.content {{ params.data.phone }}
			span Email:&nbsp;
				span.content {{ params.data.email }}
		div
			.text-center
				router-link.fa.fa-pencil.fa-lg(:to="{name:'userEdit', params:{userId: params.data.userId}}")
			.text-center
				a.row-btn(@click="openDelete")
					i(class="fa fa-trash" aria-hidden="true")
</template>

<script>
import Vue from 'vue'
import { EventBus } from '@/common/event-bus.js'

export default Vue.extend({
	name: 'ag-grid-responsive-row-record',
	methods: {
		openDelete (id) {
			// console.log('Deleting staff')
			EventBus.$emit('ask-if-delete-this', id)
		},
		getRoles (roles) {
			const result = roles.map(r => {
				return r
			})
			return result
		}
	}
})
</script>
