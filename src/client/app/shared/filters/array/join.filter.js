
/**
 * Module definition and dependencies
 */
angular.module('Shared.Array.Join.Filter', [])

/**
 * Filter definitions
 */
.filter('join', function() {
  return function(array, glue) {
    if (!angular.isArray(array)) {
      return '';
    }
    if (typeof glue !== 'string') {
      glue = '';
    }
    return array.join(glue);
  };
});
