
/**
 * Module definition and dependencies
 */
angular.module('Shared.String.Dasherize.Filter', [
  'Convert.Service'
])

/**
 * Filter definitions
 */
.filter('dasherize', function($convert) {
  return $convert.string.toDasherized;
});
