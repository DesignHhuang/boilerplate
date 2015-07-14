
/**
 * Module definition and dependencies
 */
angular.module('App', [

  //Angular & 3rd party
  'ngAnimate',
  'ngSanitize',
  'ngMessages',
  'ui.router',

  //Common modules
  'Angular.ScopeExtension',

  //Core modules
  'App.Env',
  'App.Errors',
  'App.Analytics',
  'App.Templates',
  'App.Controller',

  //App modules
  'App.Nav',
  'App.Home'
])

/**
 * Application configuration
 */
.config(function($locationProvider, $urlRouterProvider) {

  //Enable HTML 5 mode browsing and set default route
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
})

/**
 * Run logic
 *
 * The $state service is injected here to fix a strange issue with the route
 * not being loaded initially. See https://github.com/angular-ui/ui-router/issues/2051
 */
.run(function($rootScope, App, $state) {
  $rootScope.App = App;
});
