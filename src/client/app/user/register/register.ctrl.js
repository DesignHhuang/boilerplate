
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
.controller('UserRegisterCtrl', function(
  $scope, $state, $timeout, Login, User, ENV
) {

  //Set copy of user model in scope
  $scope.user = angular.copy(User.current);

  //Flags
  $scope.isRegistered = false;
  $scope.isSubmitting = false;
  $scope.isLoggingIn = false;
  $scope.isLoggedIn = false;
  $scope.needsManualLogin = false;

  //Password min length
  $scope.passwordMinLength = ENV.registration.passwordMinLength;

  /**
   * Validity checks
   */
  $scope.isInvalidName = function() {
    return ($scope.registerForm.$submitted && $scope.registerForm.email.$invalid);
  };
  $scope.isInvalidEmail = function() {
    return ($scope.registerForm.$submitted && $scope.registerForm.email.$invalid);
  };
  $scope.isInvalidPassword = function() {
    return ($scope.registerForm.$submitted && $scope.registerForm.password.$invalid);
  };
  $scope.isInvalidPasswordConfirm = function() {
    return ($scope.registerForm.$submitted && $scope.registerForm.passwordConfirm.$invalid);
  };

  /**
   * Submit registration
   */
  $scope.submit = function(user) {

    //Must be validated
    if ($scope.registerForm.$invalid) {
      return;
    }

    //Toggle flag and reset error
    $scope.isSubmitting = false;
    $scope.error = null;

    //Register user
    user.save().then(function(user) {

      //Toggle flags
      $scope.isRegistered = true;

      //Pass data on to current user model now
      User.current.fromObject(user.toObject());

      //Access token present?
      if (user.accessToken) {
        $scope.isLoggingIn = true;
        return Login.withToken(user.accessToken).then(function() {
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
      $scope.isSubmitting = false;
    });
  };
});
