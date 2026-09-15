'use strict';

/**
 * IMPORTANT - both functions below resolve `modulePath` relative to THIS
 * file's own directory (test/util/), not relative to whichever spec file
 * calls them - `require.resolve()` always resolves against the module
 * doing the resolving, and that's this file, regardless of who's calling
 * stub()/freshRequire(). Every caller under test/<subdir>/*.spec.js (one
 * level below test/) has so far used a path as if it were relative to its
 * own location, which happens to resolve correctly only because
 * test/util/ sits at that same depth - a spec file at a different depth
 * (e.g. directly under test/) needs a path relative to test/util/
 * instead, or it'll resolve to the wrong file (or none at all).
 *
 * Injects a fake module into node's require cache so whatever requires it
 * next - by any path spelling that resolves to the same file, relative or
 * otherwise - picks up the fake instead of the real module. Needed for
 * src/auth/authentication-handler.js and route/auth.js, whose real
 * dependencies (app-context.js's passport wiring, src/api/index.js's
 * DI-wired services) pull in the whole janux-persist DB connection chain
 * just by being required.
 *
 * stub() returns a restore() function; call it (typically in an `after`
 * hook) to put the original cache entry - or its absence - back exactly as
 * it was. Independent stub() calls can be nested/stacked; each has its own
 * restore().
 */
function stub(modulePath, exportsObj) {
	var resolved = require.resolve(modulePath);
	var previous = require.cache[resolved];
	require.cache[resolved] = {
		id: resolved,
		filename: resolved,
		loaded: true,
		children: [],
		paths: [],
		exports: exportsObj
	};
	return function restore() {
		if (previous) {
			require.cache[resolved] = previous;
		} else {
			delete require.cache[resolved];
		}
	};
}

/**
 * Requires modulePath fresh - bypassing whatever's cached from an earlier
 * spec file or a stub() above - returning the freshly-evaluated
 * module.exports.
 *
 * Needed for any module built as a memoizing `.create(dependency)` factory
 * (src/api/user-service.js and its siblings all follow this shape): the
 * first caller in the process to invoke `.create()` wins the singleton
 * permanently, so a test that wants its own fake dependency wired in has
 * to force a fresh module evaluation first, or it silently gets whatever
 * an earlier test's `.create()` call already built. Also needed whenever a
 * module reads its dependencies once at require time (e.g.
 * `var x = require('./y').Z`) rather than on every call, so a stub() has
 * to happen *before* this, not after.
 */
function freshRequire(modulePath) {
	var resolved = require.resolve(modulePath);
	delete require.cache[resolved];
	return require(modulePath);
}

module.exports = {
	stub: stub,
	freshRequire: freshRequire
};
