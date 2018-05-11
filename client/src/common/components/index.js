'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-05-02
 */

import jnxFooter from './footer.vue'
import jnxNavBar from './nav-bar.vue'
import jnxToolbar from './toolbar.vue'
import jnxSlidein from './slidein.vue'
import jnxHeader from './header.vue'

// Party components
import jnxPersonName from './party/person-name.vue'
import jnxAddress from './party/address.vue'
import jnxPersonJob from './party/person-job.vue'
import jnxPhone from './party/phone.vue'
import jnxEmail from './party/email.vue'

function components (Vue, options) {
	Vue.component('v-jnx-footer', jnxFooter)
	Vue.component('v-jnx-nav-bar', jnxNavBar)
	Vue.component('v-jnx-toolbar', jnxToolbar)
	Vue.component('v-jnx-slide-in', jnxSlidein)
	Vue.component('v-jnx-header', jnxHeader)
	Vue.component('v-jnx-person-name', jnxPersonName)
	Vue.component('v-jnx-address', jnxAddress)
	Vue.component('v-jnx-person-job', jnxPersonJob)
	Vue.component('v-jnx-phone', jnxPhone)
	Vue.component('v-jnx-email', jnxEmail)
}

export default components
