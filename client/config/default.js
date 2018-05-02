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

		// Paths
		assetsSubDirectory: 'static',
		assetsPublicPath: '/',
		proxyTable: {},

		// Various Dev Server settings
		host: 'localhost', // can be overwritten by process.env.HOST
		port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
		autoOpenBrowser: false,
		errorOverlay: true,
		notifyOnErrors: true,
		poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

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

// the pug files to watch
cfg.fileset.pug = path.join(cfg.dir.src,'**','*.pug');

// the pug 'top-level' files that will be turned into html, excludes partials;
// relative to src folder
cfg.fileset.html = [
	path.join('**','*.pug'),
	path.join('!**',cfg.dir.partial,'*')
];

cfg.fileset.js = path.join(cfg.dir.src, cfg.dir.js, '**','*.js');

// files watched during the build
cfg.fileset.watch = [
	path.join(cfg.dir.dist,'**','*.html'),
	// cfg.fileset.pug,
	path.join(cfg.dir.src, cfg.dir.css,'**','*.css'),
	path.join(cfg.dir.src, cfg.dir.css,'**','*.less'),
	path.join(cfg.dir.src, cfg.dir.img,'**','*'),
	path.join(cfg.dir.src, cfg.dir.locale,'*.json'),
	path.join(cfg.dir.dist, cfg.file.app)
];

// these are relative to the 'src' folder, and get copied to the dist folder
cfg.fileset.assets = [
	'favicon.ico',
	path.join(cfg.dir.img,'**','*.*'),
	path.join(cfg.dir.css,'font','**','*.*'),
	path.join(cfg.dir.css,'icon','**','*.*'),
	path.join(cfg.dir.locale,'*.json'),
	path.join('!**','*.less') 
];

// The 'target' less files that will be transformed into corresponding css files;
// included files are not in this set, and for 'watch' task we need all less files
cfg.fileset.less = [
	// 'typography.less',
	// 'util.less',
	// 'layout.less',
	// 'responsive.less',
	'main.less'
];

// all less sources, used for 'watch' task
cfg.fileset.lessSrc = path.join(cfg.dir.src, cfg.dir.css,'**','*.less');

// any css libs that need to be copied to the dist/css folder
cfg.fileset.cssLibs = [
	// path.join(cfg.dir.bower,'normalize.css', 'normalize.css'),
	// path.join(cfg.dir.bower,'bootstrap','dist','css','bootstrap.css'),
	path.join(cfg.dir.npm,'vue-material','dist','vue-material.css'),
	path.join(cfg.dir.npm,'vue-material','dist','theme','default.css')
];

// any javascript libs that need to be copied to dist/js
cfg.fileset.jsLibs = [
	path.join(cfg.dir.bower, 'jquery', 'dist', 'jquery.js')
];

// The test specs; override this locally to run a single test suite
cfg.fileset.test = [
	path.join(cfg.dir.test,'**','*.spec.js')
];

cfg.pug = {
	debug:  false,
	pretty: true
};

cfg.jshint = {
	rcfile:   '.jshintrc',
	reporter: 'default'
};

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
