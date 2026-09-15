'use strict';

/**
 * This is the main run script that configures and starts the express server
 */
var _              = require('lodash'),
	express        = require('express'),
	cookieParser   = require('cookie-parser'),
	bodyParser     = require('body-parser'),
	methodOverride = require('method-override'),
	serveFavicon   = require('serve-favicon'),
	session        = require('express-session'),
	MongoStore     = require('connect-mongo')(session),
	errorHandler   = require('errorhandler'),
	livereload     = require('connect-livereload'),
	// flash         = require('connect-flash'),
	http           = require('http'),
	log4js         = require('log4js')
;

var
	appContext   = require('./app-context'),
	passport     = appContext.passport
;

// Logging config is done via 'config' package in config/default.js via property config.log4js;
// it is also being initialized programmatically in app-context.js
var log = log4js.getLogger('Server');

var app = module.exports = express();

// Express Configuration
app.set('port', appContext.server.port);
// app.set('views', appContext.server.distFolder);
// app.set('views', __dirname + '/views');
// app.set('view engine', 'jade');
// app.use(express.logger());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser(appContext.server.sessionSecret));

// cookieSession stores the session info encrypted in the cookie client-side
// app.use(express.cookieSession());

app.use(methodOverride());
// JAM-29: sessions must survive a restart/deploy and be visible from both
// eos-01 and eos-02 - MemoryStore (express-session's default) is per-process
// and dies with it. Same fix glarus-ops shipped for JAM-28 (session state
// stranding users on a blank page after any restart), ported here before
// janux-portal hits the same failure - see JAM-29 for the full writeup.
// connect-mongo opens its own connection (via its own bundled driver), so
// this doesn't depend on this app's own mongoose/mongodb versions.
//
// saveUninitialized is false: `true` unconditionally persisted a session
// document for every anonymous request, an unbounded leak against
// MemoryStore (which the Express docs call out by name as unsuitable for
// production) and unnecessary write volume even against a durable store.
app.use(session({
	secret: appContext.server.sessionSecret,
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({ url: appContext.db.mongoConnUrl })
}));

app.use(passport.initialize());
app.use(passport.session()); // supports persistent login sessions
// app.use(flash()); // used to pass messages on failed login

// Serve the built client's static assets (JS/CSS/fonts/images) directly.
// Must come before route/index.js's app.get('*', index) SPA-fallback catch-all,
// or every asset request 404s into that fallback and gets index.html back
// instead of the real file - confirmed live (JAM-37): this app has never had
// this middleware, and has only ever actually run with something else (nginx
// in QA, Vite's dev server locally) serving its static assets on its behalf.
// A hard navigation/reload straight at this server, with nothing in front of
// it, could not load its own JS bundle before this was added.
app.use(express.static(appContext.server.distFolder));

// route configuration, see route/index.js for details
require('./route')(app);

// standard error handler, catches unhandled errors and returns a nicely formatted 500 error
app.use(errorHandler({dumpExceptions: true, showStack: true}));

// Start server
var server = http.createServer(app);
server.on('error', function () {
	console.log("Error on express server port '%s': %j", app.get('port'), arguments);
});

server.on('listening', function () {
	console.log("janux-auth-seed listening on port '%d' in '%s' mode", this.address().port, app.settings.env);
});

server.listen(app.get('port'));

log.trace('app.routes: ', app.routes);
