
/**
 * Module definition and dependencies
 */
angular.module('Filters.Text.TrustHtml.Filter', [])

/**
 * Filter definitions
 */
.filter('trustHtml', function($sce) {
  return $sce.trustAsHtml;
});
