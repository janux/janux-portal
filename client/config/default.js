'use strict';

var path = require('path');
var now = require('moment')();

var cfg = {
	dir: {
		src:     'src',
		bower:   'bower',
		npm:   	 'node_modules',
		css:     'css',
		dist:    'dist',
		img:     'img',
		js:      'app',
		locale:  'locale',
		partial: 'view',
		server:  '../server',
		test:    'test',
		vendor:  'vendor'
	},
	file: {
		app:    'app.js',
		karma:  'karma.conf.js',
		server: 'server.js'
	},
	fileset: {},
	build: {
		// appended via query string to app.js and main.css
		// to force browser reload of new version
		timestamp: now.format('YYYYMMDDHHmm'),
		// Template for index.html
		index: path.resolve(__dirname, '../dist/index.html'),

		// Paths
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsSubDirectory: 'static',
		assetsPublicPath: '/',

		/**
		 * Source Maps
		 */

		productionSourceMap: true,
		// https://webpack.js.org/configuration/devtool/#production
		devtool: '#source-map',

		// Gzip off by default as many popular static hosts such as
		// Surge or Netlify already gzip all static assets for you.
		// Before setting to `true`, make sure to:
		// npm install --save-dev compression-webpack-plugin
		productionGzip: false,
		productionGzipExtensions: ['js', 'css'],

		// Run the build command with an extra argument to
		// View the bundle analyzer report after build finishes:
		// `npm run build --report`
		// Set to `true` or `false` to always turn it on or off
		bundleAnalyzerReport: process.env.npm_config_report
	},
	dev: {

		// Various Dev Server settings
		host: '0.0.0.0', // can be overwritten by process.env.HOST
		port: 3000,
		autoOpenBrowser: false,
		errorOverlay: true,
		notifyOnErrors: true,
		poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

		// Paths
		assetsSubDirectory: 'static',
		assetsPublicPath: '/',
		proxyTable: {
			'/current-user': 'http://localhost:9000',
			'/login': 'http://localhost:9000',
			'/logout': 'http://localhost:9000',
			'/rpc/**': 'http://localhost:9000'
		},

		// Use Eslint Loader?
		// If true, your code will be linted during bundling and
		// linting errors and warnings will be shown in the console.
		useEslint: true,
		// If true, eslint errors and warnings will also be shown in the error overlay
		// in the browser.
		showEslintErrorsInOverlay: false,

		/**
		 * Source Maps
		 */

		// https://webpack.js.org/configuration/devtool/#development
		devtool: 'cheap-module-eval-source-map',

		// If you have problems debugging vue-files in devtools,
		// set this to false - it *may* help
		// https://vue-loader.vuejs.org/en/options.html#cachebusting
		cacheBusting: true,

		cssSourceMap: true
	}
};

// Nodemon ignore (server side in development mode)
cfg.fileset.nodemonIgnore = [
	path.join(cfg.dir.server,'node_modules'),
	path.join(cfg.dir.server,'vendor'),
	path.join(cfg.dir.server,'test'),
	path.join(cfg.dir.server,'test-api')
];

// The test specs; override this locally to run a single test suite
cfg.fileset.test = [
	path.join(cfg.dir.test,'**','*.spec.js')
];

cfg.karma = {
	singleRun: true,
	browsers: ['PhantomJS']
};

// the connect or other server config
/*
cfg.server = {
	exec: 'connect',
	root: [cfg.dir.dist],
	port: 9000,
	host: '0.0.0.0',
	open: false,
	livereload: false
};
*/

//
// gulp-express client-side config
cfg.server = {
	exec: 'express',
	file: path.join(cfg.dir.server, cfg.file.server),
	static: ''
};

// express server-side config
// Load the default config from the config file in the server project;
// this configuration also supports running 'node server.js' from the server folder
cfg.serverAppContext = require(path.join('..', cfg.dir.server, 'config', 'default.js')).serverAppContext;

module.exports = cfg;
