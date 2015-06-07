'use strict';

/**
 * Global environment configuration
 */
module.exports = {

  /**
   * App settings
   */
	app: {
		name: 'MyApp',
    title: 'MyApp'
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
		options: {
			stream: 'access.log'
		}
	},

  /**
   * Assets
   */
	assets: {
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
		css: [
			'public/css/*.css'
		],
		js: [
			'client/app/**/*.js',
      'client/common/**/*.js',
      '!client/app/**/*.spec.js',
      '!client/common/**/*.spec.js'
		],
		tests: [
			'client/vendor/angular-mocks/angular-mocks.js',
      'client/app/**/*.spec.js',
      'client/common/**/*.spec.js'
		]
	}
};
