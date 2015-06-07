
/**
 * Module definition and dependencies
 */
angular.module('Common.Google.Service', [])

/**
 * Wrapper for google maps API
 */
.factory('Google', function($window) {
	if (!$window.google) {
		throw 'Global `google` variable missing. Make sure to include the relevant external Google script(s).';
	}
	return $window.google;
});