'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-05-02
 */

import jnxFooter from './footer.vue'
import jnxNavBar from './nav-bar.vue'
import jnxToolbar from './login-toolbar.vue'
import jnxSlidein from './slidein.vue'

function components (Vue, options) {
	Vue.component('v-jnx-footer', jnxFooter)
	Vue.component('v-jnx-nav-bar', jnxNavBar)
	Vue.component('v-jnx-toolbar', jnxToolbar)
	Vue.component('v-jnx-slide-in', jnxSlidein)
}

export default components
