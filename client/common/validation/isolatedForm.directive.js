
/**
 * Module definition and dependencies
 */
angular.module('Common.Validation.IsolatedForm.Directive', [])

/**
 * Directive
 */
.directive('isolatedForm', function($animate) {
	return {
		restrict: 'A',
		require: '?form',
		link: function (scope, element, attrs, ngModel) {

			//Must have model controller
			if (!ngModel) {
				return;
			}

			//Copy the controller
			var ngModelCopy = {};
			angular.copy(ngModel, ngModelCopy);

			//Get the parent element of the form
			var parent = element.parent().controller('form');

			//Remove parent link to the controller
			parent.$removeControl(ngModel);

			//Replace form controller with an isolated version
			var ngModelIsolated = {
				$setValidity: function (validationToken, isValid, control) {
					ngModelCopy.$setValidity(validationToken, isValid, control);
					parent.$setValidity(validationToken, true, ngModel);
				},
				$setDirty: function () {
					$animate.removeClass(element, 'ng-pristine');
					$animate.addClass(element, 'ng-dirty');
					ngModel.$dirty = true;
					ngModel.$pristine = false;
				},
				$setSubmitted: function() {
					$animate.addClass(element, 'ng-submitted');
					ngModel.$submitted = true;
				}
			};

			//Extend the controller now
			angular.extend(ngModel, ngModelIsolated);
		}
	};
});
