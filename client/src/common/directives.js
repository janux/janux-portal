'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-04-24
 */

import Vue from 'vue'

export const ExampleDirective = {
	bind (el) {
		el.style.color = 'red'
	}
}

Vue.directive('example-directive', ExampleDirective)
