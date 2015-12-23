
/**
 * Module definition and dependencies
 */
angular.module('Shared.Conditional.Filter', [])

/**
 * Filter definitions
 */
.filter('conditional', function() {
  return function(boolean, whenTrue, whenFalse) {
    return !!boolean ? whenTrue : whenFalse;
  };
});
