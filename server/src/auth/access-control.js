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
					console.log('accessGranted', accessGranted);
				if (accessGranted) {
					// Pass request to json rpc server
					next();
				} else {
					// Resource is forbidden for this user
					log.error(`Access forbidden for service ${baseUrl}, method ${method}`);
					res.status(403).end();
				}
			});
			} else {
				log.info(`No access control handler found for service ${baseUrl}, method ${method}`);
				next();
			}
		} else {
			// Nothing more to do
			next();
		}
	};
};

module.exports = { middleware };
