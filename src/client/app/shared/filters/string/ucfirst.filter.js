
/**
 * Module definition and dependencies
 */
angular.module('Filters.String.UcFirst.Filter', [
  'Utility.Convert.Service'
])

/**
 * Filter definitions
 */
.filter('ucfirst', function($convert) {
  return $convert.string.toUcFirst;
});
