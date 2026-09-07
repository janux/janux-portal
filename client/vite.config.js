import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue2 from '@vitejs/plugin-vue2'
import cfg from 'config'
import lessPluginGlob from 'less-plugin-glob'

// Per-deployment values (dev server host/port, API proxy target, build
// output) live in config/default.js (node-config), same convention as the
// rest of this workspace - see CODE_CONVENTIONS.md.

function resolve (dir) {
	return fileURLToPath(new URL(dir, import.meta.url))
}

export default defineConfig({
	base: cfg.get('build.assetsPublicPath'),
	plugins: [
		vue2()
	],
	resolve: {
		// janux-people/janux-authorize are 'file:../server/vendor/...'
		// symlinks pointing outside node_modules. With this off (Vite's
		// default), Rollup resolves them to their realpath, which no
		// longer matches commonjsOptions' default /node_modules/ include
		// pattern - their named CJS exports then go undetected.
		preserveSymlinks: true,
		// webpack's old default extensions list included '.vue'; Vite's
		// doesn't, and a few imports (e.g. './login-component') rely on it.
		extensions: ['.mjs', '.js', '.vue', '.json'],
		alias: {
			'@': resolve('./src'),
			App: resolve('./src/app'),
			Locale: resolve('./src/locale'),
			Common: resolve('./src/common'),
			Css: resolve('./src/css'),
			Img: resolve('./src/img')
		}
	},
	css: {
		preprocessorOptions: {
			less: {
				plugins: [lessPluginGlob]
			}
		}
	},
	server: {
		host: cfg.get('dev.host'),
		port: cfg.get('dev.port'),
		proxy: cfg.get('dev.proxyTable')
	},
	build: {
		outDir: cfg.get('build.outDir'),
		sourcemap: cfg.get('build.productionSourceMap')
	},
	test: {
		environment: 'jsdom',
		include: ['test/**/*.spec.js'],
		// test/common/security/**: pre-existing AngularJS specs (module(),
		// inject(), $httpBackend) left over from the janux-auth-seed
		// predecessor of this Vue app. They test code that no longer
		// exists this way and were never runnable under karma either -
		// angular-mocks was never a listed dependency. Not wired into
		// vitest; rewriting them for the current Vue code is separate,
		// unstarted work.
		exclude: ['**/node_modules/**', 'test/common/**']
	}
})
