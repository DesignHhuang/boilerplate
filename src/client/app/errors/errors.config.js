
/**
 * Module definition and dependencies
 */
angular.module('App.Errors', [
  'App.Errors.Logger.Service',
  'App.Errors.HttpInterceptor.Service'
])

/**
 * Configuration
 */
.config(function($provide) {

  //Exception handling
  $provide.decorator('$exceptionHandler', ['Logger', '$delegate', function(Logger, $delegate) {
    return function(exception, cause) {
      $delegate(exception, cause);
    };
  }]);
})

/**
 * Run logic
 */
.run(function($rootScope, App, Logger) {

  //Log state changes
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams) {
    Logger.log('STATE:', toState.name, Object.keys(toParams).length ? toParams : '');
  });
});
