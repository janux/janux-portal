'use strict';

var gulp   = require('gulp'),
  path     = require('path');

if (!gulp.cfg) {
	gulp.cfg = require('config');
} else {
	// in the event that gulp decides to define a 'gulp.cfg' field
	console.error("gulp.cfg is defined, cannot override!");
	return;
}

// see config/default.js for the base configuration;
// default.js is overridable via the standard 'config' mechanism.

gulp.cfg.pkg = require('./package.json');
gulp.plugins = require('gulp-load-plugins')();

/*
for (var plugin in gulp.plugins) {
	console.log(plugin);
}
*/

// Load all the tasks that are defined in the 'gulp' folder.
var taskDir  = require('require-dir')('./gulp');

for (var filename in taskDir) {
	taskDir[filename](gulp);
}

gulp.task('serve-reload', function() {
	gulp.start('server-dev');
});
