
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
				if (typeof element[0].scrollTop != 'undefined') {
					scrollOffset = element[0].scrollTop;
				}
				else if (element[0].context && element[0].context.scrollTop != 'undefined') {
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
