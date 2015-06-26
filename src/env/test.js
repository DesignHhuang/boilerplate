'use strict';

/**
 * Extend development environment
 */
var obj = require('obj-tools');
var dev = require('./development');

/**
 * Test environment configuration (extend development environment)
 */
module.exports = obj.merge(dev, {

});
