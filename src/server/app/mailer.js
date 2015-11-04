'use strict';

/**
 * External dependencies
 */
var nodemailer = require('nodemailer');
var sendgrid = require('nodemailer-sendgrid-transport');

/**
 * Application dependencies
 */
var config = require('app/config.js');

/**
 * Create mailer
 */
var mailer = nodemailer.createTransport(sendgrid(config.sendgrid || {}));

/**
 * Export mailer interface (wrapped in promise)
 */
module.exports = {

  /**
   * Helper to concatenate name and email address
   */
  concatNameEmail: function(name, email) {
    return name + ' <' + email + '>';
  },

  /**
   * Send mail
   */
  sendMail: function(email) {
    return new Promise(function(fulfill, reject) {
      mailer.sendMail(email, function(error) {
        if (error) {
          return reject(error);
        }
        fulfill();
      });
    });
  }
};
