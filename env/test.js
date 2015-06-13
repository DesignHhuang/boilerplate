'use strict';

/**
 * Extend development environment
 */
var _ = require('lodash');
var dev = require('./development');

/**
 * Test environment configuration (extend development environment)
 */
module.exports = _.merge(dev, {

});
