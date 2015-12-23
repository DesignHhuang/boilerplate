
/**
 * Module definition and dependencies
 */
angular.module('Shared.String.UcFirst.Filter', [
  'Convert.Service'
])

/**
 * Filter definitions
 */
.filter('ucfirst', function($convert) {
  return $convert.string.toUcFirst;
});
