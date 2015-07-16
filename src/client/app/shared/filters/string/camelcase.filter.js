
/**
 * Module definition and dependencies
 */
angular.module('Filters.String.Camelcase.Filter', [
  'Utility.Convert.Service'
])

/**
 * Filter definitions
 */
.filter('camelcase', function($convert) {
  return $convert.string.toCamelCase;
});
