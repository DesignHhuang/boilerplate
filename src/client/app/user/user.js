
/**
 * Module definition and dependencies
 */
angular.module('App.User', [
  'App.User.Register',
  'App.User.Login',
  'App.User.Connect',
  'App.User.Profile',
  'App.User.Email',
  'App.User.Password',
  'App.User.Model',
  'App.User.UserStore.Service',
  'App.User.UserExists.Directive'
])

/**
 * Config
 */
.config(function($stateProvider, $apiProvider, UserProvider) {

  //Configure user model
  UserProvider.setDefaultData({
    name: ''
  });

  //Register endpoint
  $apiProvider.registerEndpoint('user', {
    model: 'User',
    url: 'user',
    params: null,
    actions: {
      me: {
        url: 'me'
      },
      create: {
        method: 'POST'
      },
      update: {
        method: 'PUT'
      },
      query: {
        method: 'GET',
        isArray: true
      },
      sendVerificationEmail: {
        method: 'GET',
        url: 'verifyEmail'
      },
      verifyEmail: {
        method: 'POST',
        url: 'verifyEmail'
      },
      forgotPassword: {
        method: 'POST',
        url: 'forgotPassword'
      },
      resetPassword: {
        method: 'POST',
        url: 'resetPassword'
      },
      exists: {
        method: 'POST',
        url: 'exists',
        model: false
      }
    }
  });

  //State definition
  $stateProvider.state('user', {
    parent: 'app',
    url: '',
    abstract: true,
    template: '<ui-view/>'
  });
})

/**
 * Run logic
 */
.run(function($rootScope, $state, $log, UserStore, Auth, Login) {

  /**
   * User logout helper
   */
  $rootScope.doLogout = function() {
    Auth.logout();
  };

  /**
   * User login helper, optionally specify redirect state name/params
   */
  $rootScope.doLogin = function(redirectState, redirectParams) {
    if (!Auth.isAuthenticated()) {
      return Login.now(redirectState, redirectParams);
    }
    if (redirectState) {
      $state.go(redirectState, redirectParams || {});
    }
  };

  /**
   * Listen for authentication status changes
   */
  $rootScope.$on('auth.status', function(event, auth) {

    //If we became authenticated all is well
    if (auth.isAuthenticated) {
      UserStore.findAuthenticatedUser();
      return;
    }

    //Clear user data
    UserStore.clearUser();

    //If we logged out manually, we redirect the user to the login page
    if (auth.isUserInitiated) {
      $log.log('User logged out manually, going to login');
      return Login.now();
    }

    //If we were authenticated, but are no longer, and if the current state requires
    //authentication, we need to browse away from it and go to login
    if ($state.current.auth === true) {
      $log.warn('State', $state.current.name, 'requires authentication, need to login again.');
      return Login.now($state.current.name, $state.params);
    }
  });

  /**
   * Listen for states that require authentication
   */
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {

    //Authentication required for this state?
    if (toState.auth === true) {

      //Are we verifying authentication? Await the result, then try again
      if (Auth.isVerifying()) {
        event.preventDefault();
        $log.warn('State', toState.name, 'requires authentication, awaiting server verify.');
        return Auth.verify().finally(function() {
          $state.go(toState.name, toParams);
        });
      }

      //Are we refreshing?
      else if (Auth.isRefreshing()) {
        event.preventDefault();
        $log.warn('State', toState.name, 'requires authentication, awaiting server refresh.');
        return Auth.refresh().finally(function() {
          $state.go(toState.name, toParams);
        });
      }

      //Not authenticated?
      if (!Auth.isAuthenticated()) {
        event.preventDefault();
        $log.warn('State', toState.name, 'requires authentication.');
        return Login.now(toState.name, toParams);
      }

      //Admin required?
      if (toState.admin === true && !Auth.isAdmin()) {
        event.preventDefault();
        $log.warn('State', toState.name, 'requires admin role.');
        return;
      }
    }
  });

  /**
   * Prevent user arriving on a auth required state unauthenticated
   */
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams) {
    if (toState.auth === true && !Auth.isAuthenticated()) {
      $log.warn('State', toState.name, 'requires authentication.');
      Login.now(toState.name, toParams);
    }
  });
});
