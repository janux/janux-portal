<template lang="pug">
	p {{ params.data.username }}
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
	name: 'ag-grid-row-username'
})
</script>
