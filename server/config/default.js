'use strict';

var path = require('path');

module.exports = {

	serverAppContext: {
		server: {
			port: 9000,
			staticUrl: '',
			distFolder: path.join('..', 'client', 'dist'),
			livereload: false,
			// Never a real secret - this repo has no live deployment (no PM2
			// process, no Jenkins job - see jam-devops/production-env.md and
			// jenkins-build.md, neither mentions janux-portal), so unlike
			// easytitle24/glarus-ops there's no host-resident override to add;
			// a real value belongs in a gitignored config/local.js if this is
			// ever actually run somewhere. Was a real, working secret
			// (identical to easytitle24's own, pre-rotation) - see JAM-23.
			secret: 'CHANGE IN EACH janux-portal ENV',
			// Same story, for the express-session/cookie-parser secret (was
			// hardcoded inline in server.js as 'lucy in the sky', identical
			// across easytitle24/glarus-ops/janux-portal).
			sessionSecret: 'CHANGE IN EACH janux-portal ENV'
		},

		dao: {
			//Daos to be used by the services.
			accountDao: 'accountDao',
			partyDao: 'partyDao',
			authContextDao: 'authContextDao',
			roleDao: 'roleDao',
			groupContentDao: 'groupContentDao',
			groupDao: 'groupDao',
			groupAttributeValueDao: 'groupAttributeValueDao',
			staffDao              : 'staffDao'
		},

		log4js: {
			config: require('./log4js.js'),
			globalLogLevel: 'INFO'
		},

		// janux-persistence settings
		db: {
			//Default db engine to use for user generator.
			//Because this setting is not used for the daos. Just make use
			//the db you are going to use for user generation is the same
			//for the daos.
			dbEngine: "mongoose",
			//If mongodb is chosen for user generation and daos, you must define the connection url.
			mongoConnUrl: "mongodb://localhost/janux-demo",
			//If lokijs is defined for user generation and daos, you must define the path of the file database.
			lokiJsDBPath: "../server/janux-people.db"
		}
	}
};
