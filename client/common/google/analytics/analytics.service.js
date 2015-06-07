
/**
 * Module definition and dependencies
 */
angular.module('Common.Google.Analytics.Service', [])

/**
 * Run logic
 */
.run(function($rootScope, $location, $window) {

	//On state changes, trigger a page view
	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
		if ($window.ga) {
			$window.ga('send', 'pageview', {
				page: $location.url()
			});
		}
	});
});
