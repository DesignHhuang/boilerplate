
/**
 * Module definition and dependencies
 */
angular.module('Common.Filters.String.Dasherize.Filter', [])

/**
 * Filter definitions
 */
.filter('dasherize', function() {
	return function(str) {
		return String(str).trim().replace(/([A-Z])/g,"$1").replace(/[-_\s]+/g,"-").toLowerCase();
	};
});
