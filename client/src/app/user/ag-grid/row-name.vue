<template lang="pug">
	p {{ params.data.contact.name.last }}, {{ params.data.contact.name.first }}
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
	name: 'ag-grid-row-name'
})
</script>
