'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('config')
const webpack = require('webpack')
const vueLoaderConfig = require('./vue-loader.conf')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function resolve (dir) {
	return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
	test: /\.(js|vue)$/,
	loader: 'eslint-loader',
	enforce: 'pre',
	exclude: /node_modules/,
	include: [resolve('src')],
	options: {
		formatter: require('eslint-friendly-formatter'),
		emitWarning: !config.dev.showEslintErrorsInOverlay,
		configFile: path.join(__dirname, '../.eslintrc.js')
	}
})

const webpackConfig = {
	context: path.resolve(__dirname, '../'),
	// Entry points are defined below
	entry: {
		app: './src/app/app.js'
	},
	output: {
		path: config.build.assetsRoot,
		filename: '[name].js',
		publicPath: process.env.NODE_ENV === 'production'
		  ? config.build.assetsPublicPath
		  : config.dev.assetsPublicPath
	},
	// plugins: [commonsPlugin],
	resolve: {
		modules: [ 'node_modules', path.resolve(__dirname, 'node_modules')],
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'@': resolve('src'),
			'App': path.resolve(__dirname, '../src/app'),
			'Locale': path.resolve(__dirname, '../src/locale'),

			// Common assets for this project
			'Common': path.resolve(__dirname, '../src/common'),

			// 'Components': resolve(config.commonAssets.components),
			'Css': path.resolve(__dirname, '../src/css'),
			'Img': path.resolve(__dirname, '../src/img')
		}
	},
	module: {
		rules: [
			...(config.dev.useEslint ? [createLintingRule()] : []),
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: vueLoaderConfig
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [resolve('src')],
				exclude: /node_modules/
			},
			{
				test: /\.pug/,
				loaders: ['html-loader', 'pug-html-loader']
			},
			{
				test: /\.html/,
				loaders: ['html-loader']
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000, // Convert images < 10kb to base64 strings
					name: utils.assetsPath('img/[name].[hash:7].[ext]')
				}
			},
			// {
			// 	test: /\.(png|jpg|gif)$/,
			// 	use: [
			// 		{
			// 			loader: 'file-loader',
			// 			options: {}
			// 		}
			// 	]
			// },
			// {
			//   test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
			//   loader: 'url-loader',
			//   options: {
			//     limit: 10000,
			//     name: utils.assetsPath('media/[name].[hash:7].[ext]')
			//   }
			// },
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
				}
			}
		]
	},
	node: {
		// prevent webpack from injecting useless setImmediate polyfill because Vue
		// source contains it (although only uses it if it's native).
		setImmediate: false,
		// prevent webpack from injecting mocks to Node native modules
		// that does not make sense for the client
		dgram: 'empty',
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
		child_process: 'empty'
	}
}

// If common path is defined, also search imports in common node modules
// if (config.commonPath !== '') {
// 	webpackConfig.resolve.modules.push(resolve(path.join(config.commonPath,'node_modules')))
// }

module.exports = webpackConfig
