
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
  'App.User.Service'
])

/**
 * Config
 */
.config(function($stateProvider, $apiProvider, UserProvider) {

  //Default user data
  UserProvider.setDefaultData({
    name: ''
  });

  //Register endpoint
  $apiProvider.registerEndpoint('user', {
    model: 'UserModel',
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
.run(function($rootScope, $state, $log, $q, App, Auth, User, Login) {

  //Expose user and auth service in root scope
  $rootScope.User = User;
  $rootScope.Auth = Auth;

  /**
   * Global logout helper
   */
  $rootScope.doLogout = function() {
    Auth.logout();
  };

  /**
   * Global login helper, optionally specify redirect state name/params
   */
  $rootScope.doLogin = function(redirectState, redirectParams) {

    //Not logged in yet?
    if (!Auth.isAuthenticated()) {
      return Login.now(redirectState, redirectParams);
    }

    //Already logged in, redirect to redirect state
    if (redirectState) {
      $log.log('Already authenticated, going to redirect state', redirectState);
      $state.go(redirectState, redirectParams || {});
    }
    else {
      $log.log('Already authenticated');
    }
  };

  /**
   * Listen for authentication events
   */
  $rootScope.$on('auth.status', function(event, auth) {

    //If authenticated, all is well
    if (auth.isAuthenticated) {
      return;
    }

    //If this was a user initiated logout, go to the home page
    if (auth.isUserInitiated) {
      $log.log('User initiated logout, going to home page.');
      return $state.go(App.state.home);
    }

    //If the current state requires authentication, browse away from it,
    //do a login and remember where the user was
    if (auth.isInitial && $state.current.auth === true) {
      $log.warn(
        'State', $state.current.name, 'requires authentication.',
        'Going to login.'
      );
      $state.go(App.state.home);
      return Login.now($state.current.name, $state.params);
    }

    //Otherwise, if this wasn't the initial auth cycle, prompt login as this
    //is most likely triggered by a 401 response
    if (!auth.isInitial) {
      $log.log('Not authenticated anymore, going to login.');
      Login.now();
    }

    //If this was the initial auth cycle, we defer handling of non-authenticated
    //cases to the $stateChangeStart event handler below.
  });

  /**
   * Listen for states that require authentication
   */
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {

    //Authentication required for this state?
    if (toState.auth === true) {

      //Are we verifying authentication? Await the result, then try again
      if (Auth.isVerifying()) {
        event.preventDefault();
        $log.log('State', toState.name, 'requires authentication, awaiting server verify.');
        return Auth.verify().finally(function() {
          $state.go(toState.name, toParams);
        });
      }

      //Not authenticated?
      if (!Auth.isAuthenticated()) {
        event.preventDefault();
        $log.warn('State', toState.name, 'requires authentication.');
        Login.now(toState.name, toParams);

        //If no from-state is present, navigate to the home state.
        //This is to capture cases when a user accesses an authentication required
        //page directly. Otherwise, navigation is simply prevented and the current
        //page the user was on remains visible.
        if (fromState.name === '') {
          $state.go(App.state.home);
        }
      }
    }
  });
});
