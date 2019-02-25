'use strict';

var nodemon = require('gulp-nodemon'),
	path = require('path');

//
// starts and reloads an express server
//

module.exports = function(gulp) {
	var cfg = gulp.cfg;

	// Monitor for any changes in server side and automatically restart the server
	gulp.task('server-dev', function() {
		var stream = nodemon({
			script: cfg.server.file,
			ext: 'js',
			verbose: true,
			watch: cfg.dir.server,
			ignore: cfg.fileset.nodemonIgnore,
		}).on('restart', function () {
			// console.log('Server restarted!')
		})
			.on('crash', function() {
				console.error('Application has crashed!\n')
				stream.emit('restart', 10)  // restart the server in 10 seconds
			})
	});
};
