'use strict';

// See config/README for how the 'config' package resolves this file
// against local overrides. Read by vite.config.js only - Vite itself
// picks up NODE_ENV/dev vs. build mode, this just carries the
// per-deployment values (dev server host/port, API proxy target,
// production output paths) that used to live in the gulp/webpack build.

module.exports = {
	build: {
		// where `vite build` writes the production bundle
		outDir: 'dist',
		// base public path the built assets are served from
		assetsPublicPath: '/',
		productionSourceMap: true
	},
	dev: {
		host: '0.0.0.0', // can be overridden by process.env.HOST
		port: 3000,
		// requests under these paths are proxied to the server during
		// `vite dev` instead of being served by the dev server itself
		// Vite's proxy match is a simple `url.startsWith(key)`, unlike
		// webpack-dev-server's glob keys - '/rpc' (no '/**') covers
		// '/rpc/anything' the same way '/rpc/**' did before.
		proxyTable: {
			'/current-user': 'http://localhost:9000',
			'/login': 'http://localhost:9000',
			'/logout': 'http://localhost:9000',
			'/rpc': 'http://localhost:9000'
		}
	}
};
