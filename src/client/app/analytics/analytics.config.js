/**
 * Module definition and dependencies
 */
angular.module('App.Analytics', [])

/**
 * Run logic
 */
.run(function($rootScope, $window, $location) {

  //On state changes, trigger a page view
  $rootScope.$on('$stateChangeSuccess', function() {
    if ($window.ga) {
      $window.ga('send', 'pageview', {
        page: $location.url()
      });
    }
  });
});
