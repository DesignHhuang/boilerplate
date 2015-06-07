
/**
 * Module definition and dependencies
 */
angular.module('Common.Filters.Text.HTMLEntities.Filter', [])

/**
 * Filter definitions
 */
.filter('htmlentities', function() {
	return function(text) {
		return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	};
});
