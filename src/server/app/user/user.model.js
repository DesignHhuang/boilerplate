'use strict';

/**
 * External dependencies
 */
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

/**
 * Application dependencies
 */
var config = require('app/config.js');
var BCRYPT_ROUNDS = config.bcrypt.rounds;

/**
 * User schema
 */
var UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  isSuspended: {
    type: Boolean,
    default: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  roles: {
    type: [{
      type: String,
      enum: ['user', 'admin']
    }],
    default: ['user']
  },
  usedTokens: [String]
});

/**
 * Pre save hook to hash passwords
 */
UserSchema.pre('save', function(next) {

  //Check if password modified and present
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  //Get self
  var self = this;

  //Generate salt
  bcrypt.genSalt(BCRYPT_ROUNDS, function(error, salt) {
    if (error) {
      return next(error);
    }

    //Hash password
    bcrypt.hash(self.password, salt, function(error, hash) {
      if (error) {
        return next(error);
      }

      //Set hashed password
      self.password = hash;
      next();
    });
  });
});

/**
 * Virtual properties
 */
UserSchema.virtual('emailWithName').get(function() {
  if (!this.email) {
    return '';
  }
  if (!this.name) {
    return this.email;
  }
  return this.name + ' <' + this.email + '>';
});

/**
 * Password validation helper
 */
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(error, isMatch) {
    if (error) {
      return cb(error);
    }
    cb(null, isMatch);
  });
};

/**
 * Has role checker
 */
UserSchema.methods.hasRole = function(role) {
  return this.roles.indexOf(role) !== -1;
};

/**
 * Add a user role
 */
UserSchema.methods.addRole = function(role) {
  if (this.roles.indexOf(role) === -1) {
    this.roles.push(role);
  }
};

/**
 * Get claims
 */
UserSchema.methods.getClaims = function() {
  return {
    id: this._id.toString(),
    roles: this.roles
  };
};

/**
 * Find users by ID and populates data as needed
 */
UserSchema.statics.findByIdAndPopulate = function(id) {
  return this.findById(id);
};

/**
 * Find users by email and populates data as needed
 */
UserSchema.statics.findByEmailAndPopulate = function(email) {
  return this.findOne({
    email: email
  });
};

/**
 * Transformation to JSON
 */
UserSchema.options.toJSON = {
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;

    //Delete authentication related data
    delete ret.password;
    delete ret.roles;
    delete ret.usedTokens;
  }
};

/**
 * Export model
 */
module.exports = mongoose.model('User', UserSchema);
