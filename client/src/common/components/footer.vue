/**
* Project janux-vuejs-seed
* Created by hielo on 2018-04-24
*/

<template lang="pug">
	.sd-page-footer
		.sd-page-footer-inner
			| {{ getCurrrentYear() }} {{ $t('login.copy') }}

</template>

<script>
export default {
	name: 'jnx-footer',
	methods: {
		getCurrrentYear () {
			return new Date().getFullYear()
		}
	}
}
</script>
