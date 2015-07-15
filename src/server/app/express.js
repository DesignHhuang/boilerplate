'user strict';

/**
 * External dependencies
 */
var express = require('express');
var path = require('path');
//var http = require('http');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

/**
 * Application dependencies
 */
//var db = require('app/db');
var config = require('app/config');
var logger = require('common/request/logger');
var globber = require('common/utility/globber');

/**
 * Define mime types
 */
express.static.mime.define({
  'application/json': ['map']
});

/**
 * Export module
 */
module.exports = function() {

  //Initialize express app
  var app = express();

  //Set local application variables
  app.locals.name = config.app.name;

  //Pass the request url to environment locals
  app.use(function(req, res, next) {
    res.locals.url = req.protocol + '://' + req.headers.host + req.url;
    next();
  });

  //Compression
  app.use(compression({
    level: 3,
    filter: function(req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    }
  }));

  //Use morgan to log access
  app.use(morgan(logger.format(), logger.options()));

  //Parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  //Parse application/json
  app.use(bodyParser.json());
  app.use(bodyParser.json({
    type: 'application/vnd.api+json'
  }));

  //Use method overriding in case only POST/GET allowed
  app.use(methodOverride('X-HTTP-Method-Override'));

  //Set static folder
  app.use(express.static(path.resolve('./public')));

  /*app.get('/', function (req, res) {
    res.send('Heers');
  });*/

  /*app.use(function(err, req, res, next) {

    //If the error object doesn't exists
    if (!err) {
      return next();
    }

    //Log it
    console.error(err.stack);

    //Error page
    res.status(500).render('500', {
      error: err.stack
    });
  });*/

  //Send all other requests to Angular
  app.all('/*', function(req, res) {
    res.sendFile(path.resolve('./public/index.html'));
  });

  //Error handling
  app.use(function(/*err, req, res, next*/) {
    //See http://expressjs.com/guide/error-handling.html
  });

  //Return express server instance
  return app;
};
