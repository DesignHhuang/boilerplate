'use strict';

/**
 * Get package info
 */
var pkg = require('../package.json');

/**
 * Shared environment configuration
 */
module.exports = {

  /**
   * App settings
   */
	app: {
		name: pkg.name,
		version: pkg.version,
    title: 'My Application',
		baseUrl: '/',
		api: {
			baseUrl: '/api/v1/'
		},
		oAuth: {
			Google: {
				clientId: ''
			}
		}
	},

  /**
   * Log settings
   */
	log: {
		format: 'combined',
		path: './log'
	},

	/**
	 * Paths
	 */
	paths: {
		public: 'public',
		client: 'client',
		server: 'server'
	},

  /**
   * Asset defintions
   */
	assets: {
		server: {
			js: {
				app: [
					'server/app/**/*.js',
					'server/app/**/*.json',
					'server/common/**/*.js',
					'server/common/**/*.json',
				  '!server/app/**/*.spec.js',
		      '!server/common/**/*.spec.js'
				],
				tests: [
					'server/app/**/*.spec.js',
		      'server/common/**/*.spec.js'
				]
			}
		},
		client: {
			js: {
				app: [
					'client/app/**/*.js',
		      'client/common/**/*.js',
		      '!client/app/**/*.spec.js',
		      '!client/common/**/*.spec.js'
				],
				tests: [
		      'client/app/**/*.spec.js',
		      'client/common/**/*.spec.js'
				],
				karma: [
					'client/vendor/angular-mocks/angular-mocks.js'
				],
				vendor: [
					'client/vendor/angular/angular.js',
	        'client/vendor/angular-animate/angular-animate.js',
	        'client/vendor/angular-cookies/angular-cookies.js',
	        'client/vendor/angular-messages/angular-messages.js',
	        'client/vendor/angular-mocks/angular-mocks.js',
					'client/vendor/angular-resource/angular-resource.js',
	        'client/vendor/angular-sanitize/angular-sanitize.js',
	        'client/vendor/angular-touch/angular-touch.js',
					'client/vendor/angular-ui-router/release/angular-ui-router.js'
				]
			},
			coffee: [
				'client/app/**/*.coffee',
				'client/common/**/*.coffee'
			],
			html: [
				'client/app/**/*.html',
		    'client/common/**/*.html'
			],
			scss: {
				app: [
					'client/app/**/*.scss'
				],
				main: 'client/app/app.scss'
			},
			css: {
				app: [],
				vendor: []
			},
			static: [
				'client/static/**/*',
				'!client/static/index.html'
			],
			index: 'client/static/index.html'
		}
	}
};