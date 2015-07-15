
/**
 * Module definition and dependencies
 */
angular.module('App.Error', [
  'App.Error.HttpInterceptor.Service'
])

/**
 * Configuration
 */
.config(function($provide) {

  //Exception handling
  $provide.decorator('$exceptionHandler', ['$log', '$delegate', function($log, $delegate) {
    return function(exception, cause) {
      $delegate(exception, cause);
    };
  }]);
})

/**
 * Run logic
 */
.run(function($rootScope, $log, App) {

  //Log state changes
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams) {
    $log.log('STATE:', toState.name, Object.keys(toParams).length ? toParams : '');
  });
});
