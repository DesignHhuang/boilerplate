
/**
 * Module definition and dependencies
 */
angular.module('Shared.String.Camelcase.Filter', [
  'Convert.Service'
])

/**
 * Filter definitions
 */
.filter('camelcase', function($convert) {
  return $convert.string.toCamelCase;
});
