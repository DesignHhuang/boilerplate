
/**
 * Module definition and dependencies
 */
angular.module('Common.Filters.String.UcFirst.Filter', [])

/**
 * Filter definitions
 */
.filter('ucfirst', function() {
	return function(text) {
		if (!text) {
			return text;
		}
		text = String(text);
		return text[0].toUpperCase() + text.substring(1);
	};
});
