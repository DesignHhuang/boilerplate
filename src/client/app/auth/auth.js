
/**
 * Module definition and dependencies
 */
angular.module('App.Auth', [
  'App.Auth.Service',
  'App.Auth.Model',
  'App.Auth.AuthInterceptor'
])

/**
 * Config
 */
.config(function($httpProvider, $apiProvider, AuthProvider, ENV) {

  //Add auth interceptor (must be before the error interceptor)
  $httpProvider.interceptors.unshift('AuthInterceptor');

  //Configure auth provider
  AuthProvider.setClientIdentifier(ENV.auth.clientIdentifier);
  AuthProvider.setRefreshEnabled(true);
  AuthProvider.setVerifyAgainstServer(true);
  AuthProvider.setStorageEngine('local');

  //Register token endpoint
  $apiProvider.registerEndpoint('auth', {
    url: 'auth',
    actions: {
      token: {
        url: 'token',
        method: 'POST',
        model: false,
        ignore401Intercept: true
      },
      verify: {
        url: 'verify',
        method: 'GET',
        model: false,
        ignore401Intercept: true
      },
      forget: {
        url: 'forget',
        method: 'GET',
        model: false,
        ignore401Intercept: true
      }
    }
  });
})

/**
 * Run logic
 */
.run(function($rootScope, Auth) {

  /**
   * Global is authenticated helper
   */
  $rootScope.isAuthenticated = function() {
    return Auth.isAuthenticated();
  };
});
