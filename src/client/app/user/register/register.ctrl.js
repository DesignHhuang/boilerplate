
/**
 * Module definition and dependencies
 */
angular.module('App.User.Register.Controller', [
  'App.User.UserExists.Directive',
  'Validation.Match.Directive'
])

/**
 * Controller
 */
.controller('UserRegisterCtrl', function($scope, $state, $timeout, Login) {

  //Flags
  $scope.isRegistered = false;
  $scope.isSaving = false;
  $scope.isLoggingIn = false;
  $scope.isLoggedIn = false;
  $scope.needsManualLogin = false;

  /**
   * Register
   */
  $scope.register = function(User) {

    //Must be validated
    if ($scope.registerForm.$invalid) {
      return;
    }

    //Toggle flag and reset error
    $scope.isSaving = false;
    $scope.error = null;

    //Register user
    User.save().then(function(data) {

      //Toggle flags
      $scope.isRegistered = true;

      //Access token present?
      if (data.accessToken) {
        $scope.isLoggingIn = true;
        return Login.withToken(data.accessToken).then(function() {
          $scope.isLoggedIn = true;
        }, function() {
          $scope.needsManualLogin = true;
        }).finally(function() {
          $scope.isLoggingIn = false;
        });
      }

      //Otherwise, prompt to login
      $scope.needsManualLogin = true;
    }, function(error) {

      //Set error
      $scope.error = error;

      //Process validation errors
      if (error.status === 422) {
        if (error.data.fields) {
          for (var field in error.data.fields) {
            if (error.data.fields.hasOwnProperty(field) && $scope.registerForm[field]) {
              var type = error.data.fields[field].type;
              $scope.registerForm[field].$setValidity(type, false);
            }
          }
        }
      }
    }).finally(function() {
      $scope.isSaving = false;
    });
  };
});
