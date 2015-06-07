
/**
 * Module definition and dependencies
 */
angular.module('Common.Filters.Conditional.Filter', [])

/**
 * Filter definitions
 */
.filter('conditional', function() {
	return function(b, t, f) {
		return b ? t : f;
	};
});
