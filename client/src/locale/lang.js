'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-05-10
 */

import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from 'Locale/en.json'
// import es from './es.json'

Vue.use(VueI18n)

const locale = 'en'

const messages = {
	en
}

const i18n = new VueI18n({
	locale,
	messages
})

export default i18n