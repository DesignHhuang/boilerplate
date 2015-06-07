'user strict';

/**
 * Module dependencies
 */
var express = require('express');
var path = require('path');
var http = require('http');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var config = require('config/config');
var logger = require('app/logger/logger');

/**
 * Module export
 */
module.exports = function(db) {

  //Initialize express app
	var app = express();

  //Set local application variables
  app.locals.name = config.app.name;
	app.locals.title = config.app.title;

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

  //Logger
  app.use(morgan(logger.getLogFormat(), logger.getLogOptions()));

  //Request body parsing
  app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
  //app.use(methodOverride());

  //Set static folder
	//app.use(express.static(path.resolve('./public')));

	app.get('/', function (req, res) {
  	res.send('Heers');
	});

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

  //Assume 404 since no middleware responded
	app.use(function(req, res) {
		res.status(404).render('404', {
			url: req.originalUrl,
			error: 'Not Found'
		});
	});

  //Return express server instance
  return app;
};
