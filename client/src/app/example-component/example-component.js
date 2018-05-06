/* eslint-disable */
'use strict';

import withRender from './example-component.html';

export default withRender({
	data () {
		return {
			text: 'Janux Vue.js proof-of-concept'
		}
	},
	methods: {
		baz () {
			console.log('Clicked!');
		}
	}
})