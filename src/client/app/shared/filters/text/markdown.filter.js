
/**
 * Module definition and dependencies
 */
angular.module('Filters.Text.Markdown.Filter', [])

/**
 * Filter definitions
 */
.filter('markdown', function($window) {
  return function(text) {
    if (text && angular.isFunction($window.marked)) {
      return $window.marked(text);
    }
    return text;
  };
});
