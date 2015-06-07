
/**
 * Module definition and dependencies
 */
angular.module('Common.Events.DetectWindowScrolling.Directive', [])

/**
 * Directive
 */
.directive('detectWindowScrolling', function($window, $rootScope) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			angular.element($window).on('scroll resize', function() {
				scope.$apply(function() {
					scope.isScrolling = ($window.pageYOffset > 0);
					$rootScope.$broadcast('detectedScrolling', $window.pageYOffset, $window);
				});
			});
		}
	};
});
