
/**
 * Module definition and dependencies
 */
angular.module('Common.Filters.Text.Nl2br.Filter', [])

/**
 * Filter definitions
 */
.filter('nl2br', function() {
	return function(text) {
		return String(text).replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />');
	};
});
