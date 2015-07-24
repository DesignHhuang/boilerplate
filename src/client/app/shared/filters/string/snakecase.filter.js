
/**
 * Module definition and dependencies
 */
angular.module('Filters.String.Snakecase.Filter', [
  'Convert.Service'
])

/**
 * Filter definitions
 */
.filter('snakecase', function($convert) {
  return $convert.string.toSnakeCase;
});
