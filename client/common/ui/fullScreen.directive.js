
/**
 * Module definition and dependencies
 */
angular.module('Common.Ui.FullScreen.Directive', [])

/**
 * Service definition
 */
.factory('FullScreen', function($document, $rootScope) {

	//Get document element
	var document = $document[0];

	//Create service instance
	var FullScreen = {

		/**
		 * Enable full screen on the complete document
		 */
		all: function() {
			FullScreen.enable(document.documentElement);
		},

		/**
		 * Enable full screen on a specific element
		 */
		enable: function(element) {
			if (element.requestFullScreen) {
				element.requestFullScreen();
			}
			else if(element.mozRequestFullScreen) {
				element.mozRequestFullScreen();
			}
			else if(element.webkitRequestFullScreen) {
				element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
			}
			else if (element.msRequestFullscreen) {
				element.msRequestFullscreen();
			}
		},

		/**
		 * Disable full screen
		 */
		disable: function() {
			if (document.cancelFullScreen) {
				document.cancelFullScreen();
			}
			else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			}
			else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			}
			else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			}
		},

		/**
		 * Check to see if full screen is enabled
		 */
		isEnabled: function() {
			var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
			return fullscreenElement;
		},

		/**
		 * Check to see if full screen mode is supported
		 */
		isSupported: function() {
			return document.documentElement.requestFullScreen || document.documentElement.mozRequestFullScreen || document.documentElement.webkitRequestFullScreen || document.documentElement.msRequestFullscreen;
		}
	};

	//Return the instance
	return FullScreen;
})

/**
 * Directive
 */
.directive('fullscreen', function($rootScope, FullScreen) {
	return {
		link: function (scope, element, attrs) {

			//Watch for changes on scope if model is provided
			if (attrs.fullscreen) {
				scope.$watch(attrs.fullscreen, function(value) {
					var isEnabled = FullScreen.isEnabled();
					if (value && !isEnabled) {
						FullScreen.enable(element[0]);
						element.addClass('full-screen');
					}
					else if (!value && isEnabled) {
						FullScreen.cancel();
						element.removeClass('full-screen');
					}
				});
				element.on('fullscreenchange webkitfullscreenchange mozfullscreenchange', function() {
					if (!FullScreen.isEnabled()){
						scope.$evalAsync(function() {
							scope[attrs.fullscreen] = false;
							element.removeClass('full-screen');
						});
					}
				});
			}
		}
	};
});
