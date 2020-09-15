<template lang="pug">
	p {{ params.data.contactMethods.phones[0].number }}
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
	name: 'ag-grid-row-phone'
})
</script>
