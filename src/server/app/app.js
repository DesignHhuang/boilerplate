'use strict';

/**
 * External dependencies
 */
var path = require('path');
var i18n = require('i18n');
var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var serveStatic = require('serve-static');
var cookieParser = require('cookie-parser');

/**
 * Application dependencies
 */
var db = require('app/db.js');
var auth = require('app/auth.js');
var config = require('app/config.js');
var router = require('app/router.js');

/**
 * Error handling middleware
 */
var normalizeError = require('app/error/middleware/normalizeError.js');
var logError = require('app/error/middleware/logError.js');
var storeError = require('app/error/middleware/storeError.js');
var sendError = require('app/error/middleware/sendError.js');

/**
 * Export module
 */
module.exports = function() {

  //Initialize express app
  var app = express();

  //Setup database
  db(app);

  //Compression
  app.use(compression({
    level: 3,
    filter: function(req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    }
  }));

  //Parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  //Parse application/json
  app.use(bodyParser.json());
  app.use(bodyParser.json({
    type: 'application/vnd.api+json'
  }));

  //Add cookie parser middleware
  app.use(cookieParser());

  //Configure i18n and use 'accept-language' header to guess language settings
  i18n.configure(config.i18n);
  app.use(i18n.init);

  //Set static folders
  app.use(serveStatic(path.resolve('./public')));
  app.use(serveStatic(path.resolve('./data')));

  //Load authentication
  auth(app);

  //Load router
  router(app);

  //Error handlers
  app.use([
    normalizeError,
    logError,
    storeError,
    sendError
  ]);

  //Return express server instance
  return app;
};
