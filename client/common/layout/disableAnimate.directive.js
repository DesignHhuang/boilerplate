
/**
 * Module definition and dependencies
 */
angular.module('Common.Layout.DisableAnimate.Directive', [])

/**
 * Animate disabler
 */
.directive('disableAnimate', function($animate) {
	return function(scope, element) {
		$animate.enabled(false, element);
	};
});
