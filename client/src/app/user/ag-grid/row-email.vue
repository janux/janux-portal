<template lang="pug">
	p {{ params.data.contact.contactMethods.emails[0].address }}
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
	name: 'ag-grid-row-email'
})
</script>
