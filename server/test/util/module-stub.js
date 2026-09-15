'use strict';

/**
 * Requires modulePath fresh - bypassing whatever's cached from an earlier
 * spec file or a previous call in this same file - returning the
 * freshly-evaluated module.exports.
 *
 * Needed for any module built as a memoizing `.create(dependency)` factory
 * (src/api/user-service.js and its siblings all follow this shape): the
 * first caller in the process to invoke `.create()` wins the singleton
 * permanently, so a test that wants its own fake dependency wired in has
 * to force a fresh module evaluation first, or it silently gets whatever
 * an earlier test's `.create()` call already built.
 */
function freshRequire(modulePath) {
	var resolved = require.resolve(modulePath);
	delete require.cache[resolved];
	return require(modulePath);
}

module.exports = {
	freshRequire: freshRequire
};
