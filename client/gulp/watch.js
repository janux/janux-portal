'use strict';

const webpack          	 = require('webpack');
const WebpackDevServer 	 = require('webpack-dev-server');
const webpackConfig    	 = require('../build/webpack.dev.conf.js');
const gutil  			 = require('gulp-util');

//
// Watch
//

var path = require('path');

module.exports = function(gulp) {

	var cfg = gulp.cfg;

	gulp.task('webpack-dev-server', function(callback) {
		webpackConfig.then(function (wpConfig) {
			// Start a webpack-dev-server
			var compiler = webpack(wpConfig);

			new WebpackDevServer(compiler, wpConfig.devServer).listen(cfg.dev.port, cfg.dev.host, function(err) {
				if(err) throw new gutil.PluginError("webpack-dev-server", err);

				// Server listening
				gutil.log("[webpack-dev-server]", "http://",cfg.dev.host,":",cfg.dev.port,"/index.html");

				// keep the server alive or continue?
				// callback();
			});
		});
	});

	gulp.task('watch', ['webpack-dev-server', 'serve-reload']);
}
