
/**
 * Module definition and dependencies
 */
angular.module('App.Home', [
  'App.Home.Controller'
])

/**
 * Config
 */
.config(function($stateProvider) {

  //State definition
  $stateProvider.state('home', {
    url: '/',
    controller: 'HomeCtrl',
    templateUrl: 'home/home.html'
  });
});
