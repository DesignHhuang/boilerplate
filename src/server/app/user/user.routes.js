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
  var userCtrl = require('app/user/user.ctrl.js');
  var ensureAuthenticated = require('app/auth/middleware/ensureAuthenticated.js');
  var ensureAdmin = require('app/auth/middleware/ensureAdmin.js');
  var findUserByEmail = userCtrl.findUserByEmail;

  //Create new router
  var router = express.Router();

  //Define routes
  router.get('/', ensureAuthenticated, ensureAdmin, userCtrl.query);
  router.post('/', userCtrl.create);
  router.put('/', ensureAuthenticated, userCtrl.update);
  router.get('/me', ensureAuthenticated, userCtrl.me);
  router.post('/exists', userCtrl.exists);
  router.post('/verifyEmail', userCtrl.verifyEmail);
  router.get('/verifyEmail', ensureAuthenticated, userCtrl.sendVerificationEmail);
  router.post('/forgotPassword', findUserByEmail, userCtrl.sendPasswordResetMail);
  router.post('/resetPassword', userCtrl.resetPassword);

  //Register router
  app.use('/user', router);
};
