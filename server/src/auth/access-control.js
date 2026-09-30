'use strict';

const 	log = require('log4js').getLogger('AccessControl'),
	_ 	= require('lodash');

const middleware = (accessControlService) => {

	return (req, res, next) => {
		const baseUrl = req.baseUrl;			// /rpc/2.0/...
		const method = req.body.method;			// findOneById
		const params = _.clone(req.body.params);// array with params
		const user = req.user;					// requester user

		if (!_.isNil(accessControlService)) {
			if (!_.isNil(accessControlService[method])) {
				// Adding user as method parameter
				params.push(user);
				// Execute access control method
				return accessControlService[method](...params).then((accessGranted) => {
					log.debug('access %s for service %s, method %s', accessGranted ? 'granted' : 'denied', baseUrl, method);
				if (accessGranted) {
					// Pass request to json rpc server
					next();
				} else {
					// Resource is forbidden for this user - expected, correctly-
					// handled input (an unauthorized attempt), not a system fault.
					log.warn(`Access forbidden for service ${baseUrl}, method ${method}`);
					res.status(403).end();
				}
			});
			} else {
				// Most services have no per-method access control at all, so
				// this is the common case on nearly every request, not
				// noteworthy on its own - TRACE, not INFO.
				log.trace(`No access control handler found for service ${baseUrl}, method ${method}`);
				next();
			}
		} else {
			// Nothing more to do
			next();
		}
	};
};

module.exports = { middleware };
