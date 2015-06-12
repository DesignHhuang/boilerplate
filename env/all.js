'use strict';

/**
 * Get package info
 */
var pkg = require('../package.json');

/**
 * Global environment configuration
 */
module.exports = {

  /**
   * App settings
   */
	app: {
		name: pkg.name,
		version: pkg.version,
    title: 'MyApp',
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
   * Server settings
   */
	server: {
    port: process.env.PORT || 8080,
  },

  /**
   * Log settings
   */
	log: {
		format: 'combined',
		path: './log'
	},

  /**
   * Assets
   */
	assets: {

		//App assets
		app: {
			js: [
				'client/app/**/*.js',
	      'client/common/**/*.js',
	      '!client/app/**/*.spec.js',
	      '!client/common/**/*.spec.js'
			],
			html: [
				'client/app/**/*.html',
		    'client/common/**/*.html'
			],
			tests: [
				'client/vendor/angular-mocks/angular-mocks.js',
	      'client/app/**/*.spec.js',
	      'client/common/**/*.spec.js'
			],
			scss: [
				'client/app/app.scss'
			],
			static: [
				'client/static/**/*',
				'!client/static/README.md'
			]
		},

		//Vendor assets
		vendor: {
			css: [

      ],
			js: [
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

		//Watch assets
		watch: {
			js: [
				'client/app/**/*.js',
		    'client/common/**/*.js',
		    'client/app/**/*.html',
		    'client/common/**/*.html'
			],
			scss: [
				'client/app/**/*.scss'
			]
		}
	}
};
