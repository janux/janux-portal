'use strict';
//
// lints javascript files
//

var	path     = require('path'),
	buffer     = require('vinyl-buffer'),
	source     = require('vinyl-source-stream'),
	webpack 	= require('webpack'),
	webpackStream = require('webpack-stream'),
	webpackConfig = require('../build/webpack.dev.conf.js');

module.exports = function(gulp) {
	var cfg = gulp.cfg;

	var appFile = '.' + path.sep + path.join(cfg.dir.src, cfg.dir.js, cfg.file.app);

	gulp.task('webpack', function() {
		console.log('bundling app...');

		return gulp.src(appFile)
			.pipe(webpackStream(webpackConfig), webpack)
			.pipe(gulp.dest(cfg.dir.dist));
	});

	gulp.task('minify', function() {
		console.log('minifying app...');
		return browserify(appFile, {debug:false})
			.bundle()
			.pipe(source(cfg.file.app))
			.pipe(buffer())
			.pipe(gulp.plugins.uglify())
			.pipe(gulp.dest(cfg.dir.dist));
	});
};
