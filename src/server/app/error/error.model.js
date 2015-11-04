'use strict';

/**
 * External dependencies
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Error schema
 */
var ErrorSchema = new Schema({
  name: {
    type: String
  },
  code: {
    type: String
  },
  message: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  data: {},
  stack: {},
  request: {},
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

/**
 * Transformation to JSON
 */
ErrorSchema.options.toJSON = {
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
};

/**
 * Export model
 */
module.exports = mongoose.model('Error', ErrorSchema);
