/* eslint-disable */
'use strict';

import withRender from './template.html';

export default withRender({
	data () {
		return {
			text: 'I\'m an alligator'
		};
	},
	methods: {
		baz () {
			console.log('Clicked!');
		}
	}
});