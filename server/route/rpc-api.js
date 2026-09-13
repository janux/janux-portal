'use strict';

var
	jsonrpc      = require('multitransport-jsonrpc'),
	log          = require('log4js').getLogger('sandbox'),
	tokenHandler = require('../src/auth/token-handler'),
	authenticationHandler = require('../src/auth/authentication-handler'),
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
		//
		// Express calls each function below in order for a matching request,
		// passing req/res down the chain via next() - the same idea as a
		// servlet Filter chain, except the chain is this literal argument
		// list rather than a separate web.xml/@WebFilter mapping, and a step
		// stops the request early just by not calling next() (optionally
		// ending the response itself first) rather than not calling
		// chain.doFilter(). A 4-arg function - (err, req, res, next) instead
		// of (req, res, next) - is Express's error-handling shape: it's
		// skipped during normal flow and only reached via next(err).
		app.use('/rpc/2.0/' + service,
			// Decodes the JWT into req.user (identity only, since JAM-29 -
			// just { username }, no roles), or calls next(err) if the token
			// is missing, invalid, or expired.
			tokenHandler.authenticate,
			// Error-handling middleware (4-arg shape) - only runs if
			// tokenHandler.authenticate above called next(err). Turns a
			// bad/missing token into a clean 401 response instead of an
			// unhandled exception reaching the rest of the chain.
			tokenHandler.handleInvalidTokenAuth,
			// JAM-29: re-fetches the real, current account by the username
			// carried in the token and replaces req.user with the result of
			// expandRoles() on it - the token itself proves identity only,
			// so accessControlMiddleware's isAdmin()-style checks need this
			// step to have a real role graph to read, not the empty one a
			// slimmed token would otherwise leave on req.user. 401s and
			// stops the chain here if that username no longer resolves to a
			// real account. This is also what closes the pre-JAM-29 forged-
			// role bypass: roles now come from a live database lookup by
			// identity, never from the token's own claims.
			authenticationHandler.resolveUser,
			// Allow/forbid decision for this service+method, now evaluated
			// against the real role graph resolveUser just attached to
			// req.user. Calls next() to admit the request, or ends it with a
			// 403 without calling next() to block it.
			accessControlMiddleware,
			// The actual JSON-RPC dispatcher for this service - reached only
			// once every middleware above has called next().
			resource.transport.middleware);
	}
};
