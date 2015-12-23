
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

  //Decorators
  'Shared.DuplicateRequestsFilter.Decorator'
])

/**
 * Application configuration
 */
.config(function(
  $locationProvider, $urlRouterProvider, $httpProvider, $stateProvider,
  $apiProvider, $storageProvider, $logProvider, ENV
) {

  //Enable HTML 5 mode browsing and set default route
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');

  //Disable legacy $http promise methods
  $httpProvider.useLegacyPromiseExtensions = false;

  //Configure API
  $apiProvider.setBaseUrl(ENV.api.baseUrl);
  $apiProvider.setVerbose(ENV.api.verbose);
  $apiProvider.setEnforceDataFormat(ENV.api.enforceDataFormat);

  //Configure storage
  $storageProvider.setPrefix(ENV.app.name);

  //Disable all console logging in production
  if (ENV.isProduction) {
    $logProvider.disable('all');
  }

  //App base state, for the actual application (e.g. when logged in)
  $stateProvider.state('app', {
    url: '',
    abstract: true,
    templateUrl: 'app.html',
    controller: 'AppCtrl',
    resolve: {
      user: function(UserStore) {
        return UserStore.getUserPromise();
      }
    }
  });
})

/**
 * Run logic
 *
 * The $state service was injected here to fix an issue with the route not being loaded
 * initially. See https://github.com/angular-ui/ui-router/issues/2051
 */
.run(function($rootScope, $state, $log, ENV) {

  //Expose app config in rootscope
  $rootScope.App = ENV.app;

  /**
   * Prevent navigation to certain states from initial requests (e.g. browser refresh)
   */
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
    if (toState.notInitial && !fromState.name) {
      event.preventDefault();
      $log.warn('State', toState.name, 'cant be accessed directly.');
      $state.go('home');
    }
  });
});
