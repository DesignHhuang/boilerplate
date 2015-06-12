
/**
 * Module definition and dependencies
 */
angular.module('Common.Events.DetectScrolling.Directive', [])

/**
 * Directive
 */
.directive('detectScrolling', function($rootScope) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {

			//Attach event to element
			element.on('scroll', function() {
				var scrollOffset = 0;
				if (angular.isDefined(element[0].scrollTop)) {
					scrollOffset = element[0].scrollTop;
				}
				else if (element[0].context && angular.isDefined(element[0].context.scrollTop)) {
					scrollOffset = element[0].context.scrollTop;
				}

				//Broadcast event
				scope.$apply(function() {
					scope.isScrolling = (scrollOffset > 0);
					$rootScope.$broadcast('detectedScrolling', scrollOffset, element);
				});
			});
		}
	};
});
