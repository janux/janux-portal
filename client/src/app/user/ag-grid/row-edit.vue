<template lang="pug">
	div(class="text-center")
		router-link.fa.fa-pencil.fa-lg(:to="{name:'userEdit', params:{userId: params.data.userId}}")
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
	name: 'ag-grid-row-edit'
})
</script>
