
/**
 * Module definition and dependencies
 */
angular.module('Common.Filters.String.Snakecase.Filter', [])

/**
 * Filter definitions
 */
.filter('snakecase', function() {
	return function(str) {
		str = String(str).trim();
		str = str[0].toLowerCase() + str.slice(1);
		return str.replace(/([A-Z])/g, function($1) {
			return '_' + $1.toLowerCase();
		});
	};
});
