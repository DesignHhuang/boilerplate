
/**
 * Module definition and dependencies
 */
angular.module('Common.Layout.IsOverflowing.Directive', [])

/**
 * Directive
 */
.directive('isOverflowing', function() {

	/**
	 * Helper to determine if overflowing
	 */
	function isOverflowing(element) {

		//Remember current overflow, and set to hidden
		var curOverflow = element[0].style.overflow;
		element[0].style.overflow = 'hidden';

		//Determine if overflowing and set back to original value
		var overflowing = element[0].clientWidth < element[0].scrollWidth || element[0].clientHeight < element[0].scrollHeight;
		element[0].style.overflow = curOverflow;

		//Return
		return overflowing;
	}

	/**
	 * Directive
	 */
	return {
		link: function(scope, element, attrs) {

			//Determine overflow class
			var overflowClass = attrs.checkOverflow || 'overflowing';

			//Watch content
			scope.$watch(function() {
				return element[0].text;
			}, function() {
				if (isOverflowing(element)) {
					element.addClass(overflowClass);
				}
				else {
					element.removeClass(overflowClass);
				}
			});
		}
	};
});
