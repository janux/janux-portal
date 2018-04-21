/* eslint-disable */
'use strict';

import Vue from 'vue';

export const ExampleDirective = {
	bind(el) {
		el.style.color = 'red';
	}
};

Vue.directive('example-directive', ExampleDirective);