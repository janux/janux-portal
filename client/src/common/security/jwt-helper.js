'use strict'

/**
 * Project janux-vuejs-seed
 * Created by hielo on 2018-05-09
 */

const jwtHelper = {

	/*
	 * This has been taken from angular-jwt package
	 */

	urlBase64Decode: function (str) {
		var output = str.replace(/-/g, '+').replace(/_/g, '/')
		switch (output.length % 4) {
		case 0:
			break
		case 2:
			output += '=='
			break
		case 3:
			output += '='
			break
		default:
			throw new Error('Illegal base64url string!')
		}
		return decodeURIComponent(escape(window.atob(output))) // polyfill https://github.com/davidchambers/Base64.js
	},

	decodeToken: function (token) {
		var parts = token.split('.')

		if (parts.length !== 3) {
			throw new Error('JWT must have 3 parts')
		}

		var decoded = jwtHelper.urlBase64Decode(parts[1])
		if (!decoded) {
			throw new Error('Cannot decode the token')
		}

		return JSON.parse(decoded)
	},

	getTokenExpirationDate: function (token) {
		var decoded = jwtHelper.decodeToken(token)

		if (typeof decoded.exp === 'undefined') {
			return null
		}

		var d = new Date(0) // The 0 here is the key, which sets the date to the epoch
		d.setUTCSeconds(decoded.exp)

		return d
	},

	isTokenExpired: function (token, offsetSeconds) {
		var d = this.getTokenExpirationDate(token)
		offsetSeconds = offsetSeconds || 0
		if (d === null) {
			return false
		}

		// Token expired?
		return !(d.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)))
	}
}

export default jwtHelper
