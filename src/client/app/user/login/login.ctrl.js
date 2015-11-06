
/**
 * Module definition and dependencies
 */
angular.module('App.User.Login.Controller', [])

/**
 * Controller
 */
.controller('UserLoginCtrl', function(
  $scope, $state, $injector, Auth, Login, App
) {

  var oAuth = null;

  /**
   * Forgot password
   */
  $scope.forgotPassword = function() {
    $state.go('user.password.forgot');
  };

  /**
   * Register
   */
  $scope.register = function() {
    $state.go('user.register');
  };

  /**
   * Cancel oAuth
   */
  $scope.cancelOAuth = function() {
    oAuth.cancel();
    $scope.oAuthStatus = '';
    $scope.oAuthError = '';
  };

  /**
   * Validity reset for server errors
   */
  $scope.resetValidity = function() {
    $scope.loginForm.email.$setValidity('suspended', true);
    $scope.loginForm.password.$setValidity('credentials', true);
  };

  /**
   * Login with credentials
   */
  $scope.loginWithCredentials = function(credentials, remember) {

    //Must be validated
    if ($scope.loginForm.$invalid) {
      return;
    }

    //Toggle flag
    $scope.isLoggingIn = true;

    //Login with credentials
    Login.withCredentials(credentials, remember).then(function() {
      Login.redirect(App.state.home);
    }, function(error) {
      switch (error.code) {
        case 'INVALID_CREDENTIALS':
          $scope.loginForm.password.$setValidity('credentials', false);
          break;
        case 'USER_SUSPENDED':
          $scope.loginForm.email.$setValidity('suspended', false);
          break;
      }
    }).finally(function() {
      $scope.isLoggingIn = false;
    });
  };

  /**
   * Login with oAuth
   */
  $scope.loginWithOAuth = function(provider, usePopup) {

    //Initialize oAuth scope vars
    $scope.oAuthProvider = provider;
    $scope.oAuthStatus = 'init';
    $scope.oAuthError = '';

    //Authenticate using redirection
    if (!usePopup) {
      $scope.oAuthStatus = 'redirect';
      oAuth.redirect(provider);
      return;
    }

    //Update status
    $scope.oAuthStatus = 'popup';

    //Authenticate using popup
    oAuth.popup(provider).then(function(oAuthData) {

      //Update status
      $scope.oAuthStatus = 'login';

      //Login with oAuth
      Login.withOAuth(oAuth.token(), oAuthData).then(function() {

        //Success
        $scope.oAuthStatus = 'success';

        //Redirect, with home state as fallback state
        Login.redirect(App.state.home);

      }, function(error) {

        //Handle errors
        switch (error.code) {

          //No user associated yet with this external account
          case 'NOT_ASSOCIATED':

            //Set status
            $scope.oAuthStatus = 'fetch';

            //Obtain user data
            oAuth.api().me().then(function(userData) {

              //Set status
              $scope.oAuthStatus = 'connect';

              //Go to user connect page
              $state.go('user.connect', {
                provider: provider,
                user: userData
              });
            });
            break;

          //Any other errors can't be recovered from
          default:
            $scope.oAuthStatus = 'error';
            $scope.oAuthError = 'Could not log you in';
            break;
        }
      });
    }, function(reason) {

      //Check reason
      switch (reason) {

        //Cancelled by user
        case 'oAuth.cancelled':
        case 'oAuth.popupClosed':
          $scope.oAuthStatus = '';
          $scope.oAuthError = '';
          break;

        //Invalid provider
        case 'oAuth.invalidProvider':
          $scope.oAuthStatus = 'error';
          $scope.oAuthError = 'Invalid or unknown provider';
          break;

        //Other errors
        default:
          $scope.oAuthStatus = 'error';
          $scope.oAuthError = reason;
      }

    }, function(progress) {

      //Update status
      if (progress) {
        $scope.oAuthStatus = 'validate';
      }
    });
  };

  /*****************************************************************************
   * Initialization
   ***/

  //Credentials
  $scope.credentials = {};
  $scope.remember = false;

  //Flags
  $scope.isLoggingIn = false;

  //Initialize oAuth scope vars
  $scope.oAuthProvider = '';
  $scope.oAuthStatus = '';
  $scope.oAuthError = '';
});
