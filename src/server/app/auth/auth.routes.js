'use strict';

/**
 * External dependencies
 */
var express = require('express');

/**
 * User routes
 */
module.exports = function(app) {

  //Get controllers and middleware
  var authCtrl = require('app/auth/auth.ctrl.js');
  var ensureAuthenticated = require('app/auth/middleware/ensureAuthenticated.js');

  //Create new router
  var router = express.Router();

  //Define routes
  router.get('/verify', ensureAuthenticated, authCtrl.verify);
  router.get('/forget', authCtrl.forget);
  router.post('/token', authCtrl.token);

  //Register router
  app.use('/auth', router);
};
