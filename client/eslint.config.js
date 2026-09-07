import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

// Flat config replacing the old .eslintrc.js (eslint 4 + plugin:vue/essential
// + eslint-config-standard). 'vue2-recommended' is the flat-config equivalent
// of 'plugin:vue/essential' for this app's Vue 2.7 codebase, one notch
// stricter (matches the old intent without requiring a Vue 3 migration).
export default [
	...pluginVue.configs['flat/vue2-recommended'],
	{
		languageOptions: {
			globals: {
				...globals.browser
			}
		},
		rules: {
			// preserve the tab-indent convention already used throughout src/
			indent: 'off',
			'vue/html-indent': 'off'
		}
	},
	{
		ignores: ['dist/**', 'node_modules/**']
	}
]
