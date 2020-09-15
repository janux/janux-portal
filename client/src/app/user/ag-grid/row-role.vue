<template lang="pug">
	p {{ params.data.roles[0] }}
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
	name: 'ag-grid-row-role'
})
</script>
