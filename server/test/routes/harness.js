'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var moduleStub = require('../util/module-stub');

/**
 * A minimal Express app - just body parsing, no session/passport/DB - with
 * a single route file mounted. Real passport/session wiring lives in
 * server.js, not in the route files themselves; every route.js under test
 * here is given a fully-stubbed dependency instead (see auth.spec.js), so
 * none of that machinery is needed to exercise the route's own wiring.
 */
function buildApp(mountRoute) {
	var app = express();
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());
	mountRoute(app);
	return app;
}

module.exports = {
	stub: moduleStub.stub,
	freshRequire: moduleStub.freshRequire,
	buildApp: buildApp
};
