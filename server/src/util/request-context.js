'use strict';

/**
 * A Java-ThreadLocal-equivalent for this server: per-request values (right
 * now just the authenticated user's username) that any log statement,
 * anywhere in that request's async call chain (services, DAOs, promise
 * continuations), can read without the caller having to pass it down
 * through every function signature.
 *
 * Node's AsyncLocalStorage correctly scopes the store per concurrent
 * request - unlike a plain module-level variable, which would leak one
 * request's value into another running at the same time.
 */

const { AsyncLocalStorage } = require('async_hooks');

const storage = new AsyncLocalStorage();

// Establishes the context for the synchronous extent of callback() and
// everything that runs asynchronously as a continuation of it (promises,
// timers, ...). Call this once per request, as early as the request's
// identity is known (see route/rpc-api.js), wrapping the rest of that
// request's handling.
module.exports.run = function (context, callback) {
	storage.run(context, callback);
};

// Returns the given key from the current request's context, or undefined
// if called outside of any run() - e.g. at boot, or for an anonymous
// request that never reached the point where identity is resolved.
module.exports.get = function (key) {
	const store = storage.getStore();
	return store ? store[key] : undefined;
};

// log4js custom pattern token (%x{user}, see config/log4js.js) - a dash
// outside any request context or for an anonymous one, so the column
// stays present and alignable either way.
module.exports.usernameToken = function () {
	return module.exports.get('username') || '-';
};
