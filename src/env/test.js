'use strict';

/**
 * Extend development environment
 */
var obj = require('obj-tools');
var dev = require('./development');

/**
 * Environment configuration (test)
 */
module.exports = obj.merge(dev, {

});
