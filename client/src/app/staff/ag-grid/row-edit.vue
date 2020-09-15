<template lang="pug">
	div(class="text-center")
		router-link.fa.fa-pencil.fa-lg(:to="{name:'staffEdit', params:{id: params.data.id} }")
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
	name: 'ag-grid-row-edit'
})
</script>
