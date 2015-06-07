
/**
 * Module definition and dependencies
 */
angular.module('Common.Filters.Text.Markdown.Filter', [])

/**
 * Filter definitions
 */
.filter('markdown', function() {
	return function(text) {
		if (text && angular.isFunction(marked)) {
			return marked(text);
		}
		return text;
	};
});
