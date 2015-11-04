
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
  'Api.Service',
  'Log.Service',
  'Convert.Service',
  'Storage.Service',

  //Core modules
  'App.Env',
  'App.Nav',
  'App.Auth',
  'App.Error',
  'App.Analytics',
  'App.Templates',
  'App.Controller',

  //App modules
  'App.Home',
  'App.User',

  //Shared modules
  'Decorators.DuplicateRequestsFilter',
  'Directives.ngModel.Directive'
])

/**
 * Application configuration
 */
.config(function(
  $locationProvider, $urlRouterProvider, $httpProvider, $stateProvider,
  $apiProvider, $storageProvider, $logProvider,
  App, Env
) {

  //Enable HTML 5 mode browsing and set default route
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');

  //Disable legacy $http promise methods
  $httpProvider.useLegacyPromiseExtensions = false;

  //Abstract app state definition
  $stateProvider.state('app', {
    url: '',
    abstract: true,
    template: '<ui-view />',
    resolve: {}
  });

  //Configure API
  $apiProvider.setBaseUrl(App.api.baseUrl);
  $apiProvider.setVerbose(false);

  //Configure storage
  $storageProvider.setPrefix(App.name);

  //Disable all console logging in production
  if (Env.isProduction) {
    $logProvider.disable('all');
  }
})

/**
 * Run logic
 *
 * The $state service is injected here to fix an issue with the route not being loaded
 * initially. See https://github.com/angular-ui/ui-router/issues/2051
 */
.run(function($rootScope, App, $state) {
  $state = $state;
  $rootScope.App = App;
});
