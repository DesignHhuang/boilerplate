
/**
 * Module definition and dependencies
 */
angular.module('Filters.Boolean.Filter', [])

/**
 * Filter definitions
 */
.filter('boolean', function() {
  return function(b) {
    return (
      b === true || b === 1 || b === '1' ||
      (angular.isString(b) && b.toLowerCase() === 'true')
    );
  };
});
