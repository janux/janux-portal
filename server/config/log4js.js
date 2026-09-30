// %x{user} -- the authenticated request's username, via
// src/util/request-context.js's AsyncLocalStorage-based context (a
// ThreadLocal equivalent). "-" outside of any request (boot) or for an
// anonymous one.
var usernameToken = require('../src/util/request-context').usernameToken;

module.exports = {
	appenders: [
		{
			type: 'file',
			filename: 'server.log',
			layout : {
				type : 'pattern',
				pattern : '%d | %p | %c | %x{user} | %m',
				tokens: { user: usernameToken }
			}
		},
		{
			type:'logLevelFilter',
			level: 'INFO',
			appender: {
				type: 'console',
				layout: {
					type: 'pattern',
					pattern: '%[%d | %p | %c | %x{user} |%] %m',
					tokens: { user: usernameToken }
				}
			}
		}
	],
	replaceConsole : false
	,levels: {
		'AppContext': 'DEBUG',
		'Server':     'DEBUG'
	}
}
