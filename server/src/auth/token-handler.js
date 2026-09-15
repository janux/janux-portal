/**
 * Project janux-auth-angular-seed
 * Created by ernesto on 9/22/17.
 */
'use strict';
var config = require('config').serverAppContext;

//const TOKEN_TIME = 120 * 60; // in seconds

const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

/**
 * Generates a new token based on the user info.
 *
 * Carries identity only (username). The full role graph and contact record
 * deliberately stay out of it (JAM-29): embedding them makes token size
 * scale with how many roles an account holds and how rich its contact
 * record is, and once a token crosses nginx's 8 KB header limit every
 * request fails with "Request Header or Cookie Too Large" - including the
 * login meant to replace the token, which leaves no way back but clearing
 * browser storage by hand. This is the same fix glarus-ops shipped for
 * JAM-7 after hitting that outage for real; porting it here before
 * janux-portal does too. It's also a security fix, not just a stability
 * one: with the full role graph embedded, an isAdmin-style check reading
 * roles straight off the JWT's own claims is never re-verified against the
 * database - whoever holds the signing secret could forge a token with a
 * fabricated admin role and pass every such check. Once roles aren't
 * embedded, a forged token only claims an identity, not a privilege level
 * - route/rpc-api.js's resolveUser middleware (user-service.js) is what
 * re-resolves the real role graph from the database on every request.
 *
 * Callers needing the current user's roles/contact fetch them from
 * `/current-user` (see `authentication-handler.js#sendCurrentUser`), which
 * also means a revoked role takes effect on the next request rather than
 * remaining valid for the token's full lifetime.
 * @param user
 * @return {*}
 */
function generateToken(user) {

	const now = new Date();
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	//Setting expiration date at 3 am of the next day.
	const expirationDate = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 3, 0, 0, 0);
	// jwt.sign's `expiresIn` takes seconds (or a duration string) -
	// Date#getTime() returns milliseconds, so this has to be converted,
	// not passed straight through (found while adding test coverage here:
	// every token ended up valid for ~279 days instead of ~1).
	const expirationMillis = expirationDate.getTime() - now.getTime();
	const expirationSeconds = Math.round(expirationMillis / 1000);
	return jwt.sign({ username: user.username }, config.server.secret, {
		expiresIn: expirationSeconds
	});
}

/**
 * This method handles a correct token auth.
 * @type {middleware}
 */
const authenticate = expressJwt({
	secret: config.server.secret
});

/**
 * This method helps to return a 401 in case of no token or if the token is invalid.
 * @param err
 * @param req
 * @param res
 * @param next
 */
function handleInvalidTokenAuth(err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		res.status(401).send('invalid token...');
	} else {
		next();
	}
}

module.exports = {
	generateToken: generateToken,
	authenticate: authenticate,
	handleInvalidTokenAuth: handleInvalidTokenAuth
};