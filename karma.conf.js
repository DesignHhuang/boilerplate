
/**
 * Read assets from our configuration
 */
var assets = require('./config').assets;

/**
 * Karma configuration
 */
module.exports = function(config) {
  config.set({

    //Base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    //Frameworks to use (see https://npmjs.org/browse/keyword/karma-adapter)
    frameworks: ['jasmine'],

    //List of files / patterns to load in the browser
    files: [
      assets.client.js.vendor,
      assets.client.js.karma,
      assets.client.js.app
    ],

    //List of files to exclude
    exclude: [

    ],

    //Preprocessors (see https://npmjs.org/browse/keyword/karma-preprocessor)
    preprocessors: {

    },

    //Test results reporter to use (see https://npmjs.org/browse/keyword/karma-reporter)
    reporters: ['dots'],

    //Web server port
    port: 9876,

    //Web server URL root
    urlRoot: 	'/',

    //Enable / disable colors in the output (reporters and logs)
    colors: true,

    //Level of logging
    logLevel: config.LOG_INFO,

    //Enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    //Start these browsers (see https://npmjs.org/browse/keyword/karma-launcher)
    browsers: [
      'PhantomJS'
    ],

    //Continuous integration mode
    singleRun: false
  });
};
