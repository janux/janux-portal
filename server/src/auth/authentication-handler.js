var passport = require('../../app-context').passport;
// var MongoStrategy = require('./mongo-strategy');
var log = require('log4js').getLogger('authentication');
var tokenHandler = require("./token-handler");
var userService = require('./user-service');
var UserPersistenceService = require('../api/index').UserPersistenceService;
var security = {
	/*
  initialize: function(url, apiKey, dbName, authCollection) {
    passport.use(new MongoStrategy(url, apiKey, dbName, authCollection));
  },
	*/

  authenticationRequired: function(req, res, next) {
    console.log('authRequired');
    if (req.isAuthenticated()) {
      next();
    } else {
      res.json(401, req.user);
    }
  },

	/*
  adminRequired: function(req, res, next) {
    console.log('adminRequired');
    if (req.user && req.user.admin ) {
      next();
    } else {
      res.json(401, req.user);
    }
  },
	*/

  sendCurrentUser: function(req, res, next) {
		log.debug('sendCurrentUser: %j', req.user);

		// JAM-29: req.user is undefined whenever there's no live server
		// session for this browser - e.g. the session lived in MemoryStore and
		// died in a restart/deploy/balancer re-pin, while the browser's own
		// JWT (identity only as of this change) is still unexpired. A 200
		// with an empty body here reads as "successfully fetched an empty
		// user" to the client instead of "not logged in" - see JAM-28, the
		// glarus-ops instance of this same defect. Answering 401 lets the
		// client route this the same way any other auth failure is routed.
		if (!req.user) {
			return res.status(401).json({user: null});
		}

		// req.user comes from passport's session deserialization
		// (user-service.js#load), which now expands roles the same way
		// login does (JAM-29) - the client cannot make an authorization
		// decision from a bare role name.
		userService.expandRoles(req.user).then(function (user) {
			// put the user in a 'user' field to keep it symmetric with the passport login
			res.status(200).json({user: user});
		}, next);
  },

  login: function(req, res, next) {
		log.debug('calling login');

    function authenticationFailed(err, user, info){
			log.debug('err:', err);
			log.debug('user:', user);
			log.debug('info:', info);
      if (err) { return next(err); }
      if (!user) { return res.json( {user: null} ); }
      req.logIn(user, function(err) {
        if ( err ) { return next(err); }
        var token = tokenHandler.generateToken(user);
        return res.json({user: user,token:token});
      });
    }
    return passport.authenticate('local', authenticationFailed)(req, res, next);
    // return passport.authenticate(MongoStrategy.name, authenticationFailed)(req, res, next);
  },

  logout: function(req, res, next) {
    req.logout();
    res.sendStatus(204);
  },

  /**
   * Express middleware for the JWT-authenticated RPC routes
   * (route/rpc-api.js). tokenHandler.authenticate only decodes the JWT,
   * which carries identity only as of JAM-29 - req.user at that point is
   * just `{username}`, with no roles. access-control.js's checks
   * (isAdmin(user), etc.) need the real, current role graph to mean
   * anything.
   *
   * Lives here rather than in user-service.js: this file is the
   * HTTP-aware layer that adapts the pure business service (user-service.js
   * - no req/res, no knowledge of Express) to Express's middleware
   * signature, same as sendCurrentUser/login/logout already do. user-service.js
   * itself should depend only on the DAO/persistence layer, not on Express.
   *
   * Before JAM-29, the JWT carried the full user including roles, so
   * access-control.js's checks were reading claims straight off a token
   * whoever holds the signing secret can forge - a fabricated
   * `isAlmighty: true` role passed every admin check with no database
   * involved. Re-resolving from the database on every request, by
   * identity only, is what actually closes that: a forged token can claim
   * a username, never a privilege level. It also means a revoked role
   * takes effect on the very next request, same as /current-user already
   * does for the session-based routes.
   */
  resolveUser: function resolveUser(req, res, next) {
    if (!req.user || !req.user.username) {
      return res.status(401).send('invalid token...');
    }
    UserPersistenceService.findOneByUserName(req.user.username)
      .then(function (user) {
        if (!user) {
          return res.status(401).send('invalid token...');
        }
        return userService.expandRoles(UserPersistenceService.removeSensitiveData(user)).then(function (expandedUser) {
          req.user = expandedUser;
          next();
        });
      })
      .catch(next);
  }
};

module.exports = security;
