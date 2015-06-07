
/**
 * Module definition and dependencies
 */
angular.module('Common.Layout.BackgroundImage.Directive', [])

/**
 * Directive definition
 */
.directive('backgroundImage', function($document, $animate) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			attrs.$observe('backgroundImage', function(src) {

				//Add loading class and reset background image
				element.addClass('loading').css({
					'background-image': null
				});

				//Create image element
				var img = $document[0].createElement('img');

				//Append onload event
				img.onload = function() {

					//Remove loading class using the animate service (to trigger CSS animations) and set source
					$animate.removeClass(element, 'loading');
					element.css({
						'background-image': 'url(' + this.src + ')'
					});
				};

				//Set source on image now
				img.src = src;
			});
		}
	};
});
