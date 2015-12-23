
/**
 * Module definition and dependencies
 */
angular.module('Shared.Text.TrustHtml.Filter', [])

/**
 * Filter definitions
 */
.filter('trustHtml', function($sce) {
  return $sce.trustAsHtml;
});
