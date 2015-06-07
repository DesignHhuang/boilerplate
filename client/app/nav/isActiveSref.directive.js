
/**
 * Module definition and dependencies
 */
angular.module('MyApp.Nav.IsActiveSref.Directive', [])

/**
 * Directive
 */
.directive('isActiveSref', function($state) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {

			//Get sref
            var sref = attrs.uiSref,
                base = sref.split('.')[0];

            //Apply active class on state changes
            scope.$on('$stateChangeSuccess', function(event, toState) {
                if (toState.name.split('.')[0] == base) {
                    element.addClass('active');
                }
                else {
                    element.removeClass('active');
                }
            });
		}
	};
});
