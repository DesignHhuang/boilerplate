
/**
 * Module definition and dependencies
 */
angular.module('MyApp.Nav.Controller', [
	'Common.Events.DetectWindowScrolling.Directive'
])

/**
 * Controller
 */
.controller('NavCtrl', function($scope, $window) {

	//Remember current page
	var currentPage;

	//Flags
	$scope.isScrolled = isScrolled();
	$scope.isMobile = isMobile();
	$scope.isMenuVisible = false;

	/*****************************************************************************
	 * Helpers
	 ***/

	/**
	 * Is mobile check helper
	 */
	function isMobile() {
		return ($window.innerWidth < 768);
	}

	/**
	 * Is scrolled check helper
	 */
	function isScrolled() {
		return (currentPage != 'home' || $window.pageYOffset > ($window.innerWidth * 0.05));
	}

	/*****************************************************************************
	 * Event listeners
	 ***/

	/**
	 * Listen for state changes
	 */
	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

		//Get to and from parent states
		var toPage = toState.name.split('.')[0],
			fromPage = fromState.name.split('.')[0];

		//Remember current page
		currentPage = toPage;

		//Went to different main page? Scroll to top
		if (toPage != fromPage) {
			$window.scrollTo(0, 0);
		}

		//Toggle is scrolled flag
		$scope.isScrolled = isScrolled();
	});

	/**
	 * Listen for scroll events
	 */
	$scope.$on('detectedScrolling', function(event, scrollOffset) {
		$scope.isScrolled = isScrolled();
	});

	/**
	 * On window resize, hide menu
	 */
	angular.element($window).on('resize', function() {
		$scope.isMenuVisible = false;
	});

	/*****************************************************************************
	 * Scope methods
	 ***/

	/**
	 * Menu toggler
	 */
	$scope.toggleMenu = function(show) {
		if (angular.isDefined(show)) {
			$scope.isMenuVisible = !!show;
		}
		else {
			$scope.isMenuVisible = !$scope.isMenuVisible;
		}
	};
});
