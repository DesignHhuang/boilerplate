
/**
 * Module definition and dependencies
 */
angular.module('App.User.Connect.Controller', [])

/**
 * Controller
 */
.controller('UserConnectCtrl', function(
  $scope, $state, $timeout, App, User, Login, oAuth
) {

  //Must have valid provider and user data
  if (
    !$state.params.provider || !$state.params.user ||
    ($state.params.provider !== oAuth.provider())
  ) {
    $state.go(App.home);
    return;
  }

  //Set oAuth provider name and user data in scope
  $scope.oAuthProvider = $state.params.provider;
  $scope.user = $state.params.user;

  /**
   * Connect
   */
  $scope.connect = function(user) {

    //Must be validated
    if ($scope.connectForm.$invalid) {
      return;
    }

    //Get oAuth data
    var oAuthData = oAuth.data();
    delete oAuthData.raw;

    //Extend user data with oAuth data
    user = angular.extend(oAuthData, user);

    //Toggle flag
    $scope.isSaving = false;
    $scope.error = null;

    //Connect user
    User.create(user).then(function(data) {

      //Toggle flag
      $scope.isConnected = true;

      //Token present?
      if (data.token) {

        //Try to login with token
        Login.withToken(data.token).catch(function() {

          //Prompt to login manually
          $timeout(function() {
            $scope.doLogin();
          }, 2000);
        });
        return;
      }

      //Prompt to login
      $timeout(function() {
        $scope.doLogin();
      }, 2000);

    }, function(error) {

      //Set error
      $scope.error = error;

      //Process validation errors
      if (error) {
        switch (error.code) {
          case Error.NOT_VALIDATED:

            break;
        }
      }
    }).finally(function() {
      $scope.isSaving = false;
    });
  };
});
