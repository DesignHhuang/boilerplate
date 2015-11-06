'use strict';

/**
 * External dependencies
 */
var chalk = require('chalk');

/**
 * Application dependencies
 */
var ValidationError = require('app/error/types/validationError.js');
var BadRequestError = require('app/error/types/badRequestError.js');
var NotFoundError = require('app/error/types/notFoundError.js');
var ServerError = require('app/error/types/serverError.js');
var tokenizer = require('app/shared/utility/tokenizer.js');
var mailer = require('app/mailer.js');
var config = require('app/config.js');
var User = require('app/user/user.model.js');

/**
 * Generate verification email
 */
function sendVerificationEmail(req, res) {

  //Generate a mail verification token
  var token = tokenizer.generate('verifyEmail', {
    id: req.user.id
  });

  //Create data for i18n
  var data = {
    link: config.app.baseUrl + '/verifyEmail/' + token
  };

  //Create email (TODO: html email should be in a template)
  var email = {
    to: req.user.email,
    from: config.mailer.from.noreply,
    subject: res.__('user.verification.mail.subject'),
    text: res.__('user.verification.mail.text', data),
    html: res.__('user.verification.mail.html', data)
  };

  //Send mail
  return mailer.sendMail(email);
}

/**
 * User controller
 */
module.exports = {

  /**
   * Get data of authenticated user
   */
  me: function(req, res, next) {

    //Find user again, populating extra data
    User.findById(req.user._id).then(function(user) {
      if (!user) {
        return next(new BadRequestError());
      }
      res.json(user.toJSON());
    }, function(error) {
      next(error);
    });
  },

  /**
   * Create user
   */
  create: function(req, res, next) {

    //Get user data
    var data = req.body;

    //Create user
    User.create(data).then(function(user) {

      //Store in request
      req.user = user;

      //Send verification email (allow failure at this stage)
      sendVerificationEmail(req, res).catch(function(error) {
        console.warn(chalk.yellow('Email verification error:', error));
      });

      //Generate access token for immediate login
      user.accessToken = tokenizer.generate('access', user.toJSON());
      user.save().then(function(user) {

        //Convert to json
        var userJson = user.toJSON();

        //Manually append access token now to allow the user to login,
        //because the model deletes it from JSON form by default
        userJson.accessToken = user.accessToken;
        res.status(201).json(userJson);
      }, function(error) {
        next(error);
      });
    }, function(error) {
      next(new ValidationError(error));
    });
  },

  /**
   * Update user
   */
  update: function(req, res, next) {

    //Get user data and user
    var data = req.body;
    var user = req.user;

    //Update data
    var cantUpdate = ['roles', 'isSuspended', 'isEmailVerified'];
    for (var key in data) {
      if (data.hasOwnProperty(key) && cantUpdate.indexOf(key) === -1) {
        user[key] = data[key];
      }
    }

    //Save user
    user.save().then(function(user) {
      res.json(user.toJSON());
    }, function(error) {
      next(new ValidationError(error));
    });
  },

  /**
   * Exists check
   */
  exists: function(req, res, next) {
    User.find(req.body).limit(1).then(function(users) {
      res.json({exists: users.length > 0});
    }, function(error) {
      next(error);
    });
  },

  /**
   * Query users
   */
  query: function(req, res, next) {
    User.find({
      roles: 'user'
    }).then(function(users) {
      res.json(users);
    }, function(error) {
      next(error);
    });
  },

  /**
   * Send password reset mail
   */
  sendPasswordResetMail: function(req, res, next) {

    //Generate a password reset token
    var token = tokenizer.generate('resetPassword', {
      id: req.user.id
    });

    //Create data for i18n
    var data = {
      link: config.app.baseUrl + '/resetPassword/' + token,
      validity: Math.floor(config.token.types.resetPassword.expiration / 3600)
    };

    //Create email (TODO: html email should be in a template)
    var email = {
      to: req.user.email,
      from: config.mailer.from.noreply,
      subject: res.__('user.resetPassword.mail.subject'),
      text: res.__('user.resetPassword.mail.text', data),
      html: res.__('user.resetPassword.mail.html', data)
    };

    //Send mail
    mailer.sendMail(email).then(function() {
      res.end();
    }, function(error) {
      next(new ServerError(error));
    });
  },

  /**
   * Reset password
   */
  resetPassword: function(req, res, next) {

    //Validate token
    tokenizer.validate('resetPassword', req.body.token, function(error, payload) {

      //Failed to validate token or no ID present?
      if (error || !payload.id) {
        return next(new ValidationError('INVALID_TOKEN', 'Invalid token'));
      }

      //Find user
      User.findById(payload.id).then(function(user) {

        //No user?
        if (!user) {
          return next(new ValidationError('INVALID_TOKEN', 'Invalid token'));
        }

        //Update password and save user
        user.password = req.body.password;
        user.save().then(function() {

          //Create email (TODO: html email should be in a template)
          var email = {
            to: user.email,
            from: config.mailer.from.noreply,
            subject: res.__('user.resetPasswordConfirm.mail.subject'),
            text: res.__('user.resetPasswordConfirm.mail.text'),
            html: res.__('user.resetPasswordConfirm.mail.html')
          };

          //Send confirmation mail (allow failure)
          mailer.sendMail(email);
          res.end();
        }, function(error) {
          next(new ValidationError(error));
        });
      });
    });
  },

  /**
   * Send verification email
   */
  sendVerificationEmail: function(req, res, next) {

    //Send mail
    sendVerificationEmail(req, res).then(function() {
      res.end();
    }, function(error) {
      next(new ServerError(error));
    });
  },

  /**
   * Verify sent email verification token
   */
  verifyEmail: function(req, res, next) {
    tokenizer.validate('verifyEmail', req.body.token, function(error, payload) {

      //Failed to validate token or no ID present?
      if (error || !payload.id) {
        return next(new ValidationError('INVALID_TOKEN', 'Invalid token'));
      }

      //Find user and update
      User.findOneAndUpdate({
        _id: payload.id
      }, {
        isEmailVerified: true
      }).then(function() {
        res.json({isValid: true});
      }, function() {
        next(new ValidationError('INVALID_TOKEN', 'Invalid token'));
      });
    });
  },

  /**
   * Find by email
   */
  findUserByEmail: function(req, res, next) {

    //No email?
    if (!req.body.email) {
      return next(new NotFoundError());
    }

    //Find by email
    User.findOne({
      email: req.body.email
    }).then(function(user) {

      //Not found?
      if (!user) {
        return next(new NotFoundError());
      }

      //Save in request and proceed to next middleware
      req.user = user;
      next();
    }, function(error) {
      next(error);
    });
  }
};
