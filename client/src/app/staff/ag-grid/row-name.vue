<template lang="pug">
	p {{ params.data.name.last }}, {{ params.data.name.first }}
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
	name: 'ag-grid-row-name'
})
</script>
