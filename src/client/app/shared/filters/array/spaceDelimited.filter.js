
/**
 * Module definition and dependencies
 */
angular.module('Shared.Array.SpaceDelimited.Filter', [])

/**
 * Filter definition
 */
.filter('spaceDelimited', function() {
  return function(array) {
    if (!angular.isArray(array)) {
      return '';
    }
    return array.join(' ');
  };
});
