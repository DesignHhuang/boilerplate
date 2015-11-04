
/**
 * Module definition and dependencies
 */
angular.module('App.User.Password.Forgot.Controller', [])

/**
 * Controller
 */
.controller('UserPasswordForgotCtrl', function(
  $scope, $state, User
) {

  //Credentials
  $scope.credentials = {};

  //State flags
  $scope.isSubmitting = false;
  $scope.isSubmitted = false;

  /**
   * Submit request
   */
  $scope.forgotPassword = function(credentials) {

    //Must be validated
    if ($scope.forgotPasswordForm.$invalid) {
      return;
    }

    //Mark as submitting
    $scope.isSubmitting = true;
    $scope.error = null;

    //Send request
    User.forgotPassword(credentials).then(function() {
      $scope.isSubmitted = true;
      $scope.credentials = {};
    }, function(error) {

      //Set error
      $scope.error = error;

      //Process validation errors
      if (error.status === 422) {
        if (error.data.fields) {
          for (var field in error.data.fields) {
            if (error.data.fields.hasOwnProperty(field) && $scope.forgotPasswordForm[field]) {
              var type = error.data.fields[field].type;
              $scope.forgotPasswordForm[field].$setValidity(type, false);
            }
          }
        }
      }
    }).finally(function() {
      $scope.isSubmitting = false;
    });
  };
});
