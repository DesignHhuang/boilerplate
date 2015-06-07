
/**
 * Module definition and dependencies
 */
angular.module('Common.Filters.Text.TrustHtml.Filter', [])

/**
 * Filter definitions
 */
.filter('trustHtml', function($sce) {
	return $sce.trustAsHtml;
});
