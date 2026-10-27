<template lang="pug">
div
	v-jnx-toolbar(:sectionTitle="sectionTitle")
	v-jnx-nav-bar
	v-jnx-slide-in

</template>

<script>
export default {
	name: 'jnx-header',
	props: ['sectionTitle']
}
</script>
