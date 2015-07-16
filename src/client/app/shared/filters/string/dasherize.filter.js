
/**
 * Module definition and dependencies
 */
angular.module('Filters.String.Dasherize.Filter', [
  'Utility.Convert.Service'
])

/**
 * Filter definitions
 */
.filter('dasherize', function($convert) {
  return $convert.string.toDasherized;
});
