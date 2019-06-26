'use strict';

var
	jsonrpc      = require('multitransport-jsonrpc'),
	log          = require('log4js').getLogger('sandbox'),
	tokenHandler = require('../src/auth/token-handler'),
	accessControl = require('../src/auth/access-control')
;

var transport = jsonrpc.transports.server.middleware;

var apiRoot = '../src/api/index';

var services = {
	users       : require(apiRoot).UserService,
	authContext : require(apiRoot).AuthContextService,
	role        : require(apiRoot).RoleService,
	partyService: require(apiRoot).PartyService,
	partyGroupService: require(apiRoot).PartyGroupService
};

const accessControlHandlers = {
	users		: require(apiRoot).UserAccessControl
};

/*
var jsonrpcServer = new jsonrpc.server(
	new jsonrpc.transports.server.middleware(), {
		findByAccountName: userService.findByAccountName
	});
*/

/*module.exports = function (app) {
	for (var service in services) {
		var resource = new jsonrpc.server(new transport(), services[service]);
		app.use('/rpc/2.0/' + service, resource.transport.middleware);
		log.info('service created', service);
	}
};*/

module.exports = function (app) {
	for (const service in services) {
		const resource = new jsonrpc.server(new transport(), services[service]);
		const accessControlMiddleware = accessControl.middleware(accessControlHandlers[service]);
		// TODO: move the '/rpc/2.0' to a configuration variable
		app.use('/rpc/2.0/' + service, tokenHandler.authenticate, tokenHandler.handleInvalidTokenAuth, accessControlMiddleware, resource.transport.middleware);
	}
};
