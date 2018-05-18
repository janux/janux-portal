'use strict'

import _ from 'lodash'

export function authCBitsToArray (authContextBits) {
	var authCBitsArray = Object.keys(authContextBits).map(function (key) {
		authContextBits[key].label = key
		return authContextBits[key]
	})
	// console.log('authCBitsArray',authCBitsArray)
	return _.orderBy(authCBitsArray, 'position')
}
