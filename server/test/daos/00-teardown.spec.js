'use strict';

// Root-level `after`, run once the entire suite has finished. Named
// 00-teardown.spec.js (not just .js) so it's picked up by the
// test/**/*.spec.js glob both npm scripts use - a plain .js name here
// would silently never run, and mongoUnit.stop() would never be called.
var setup = require('./setup');

after(function() {
	return setup.teardownAll();
});
