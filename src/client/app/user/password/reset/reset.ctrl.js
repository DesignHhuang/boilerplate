
/**
 * Module definition and dependencies
 */
angular.module('App.User.Password.Reset.Controller', [])

/**
 * Controller
 */
.controller('UserPasswordResetCtrl', function(
  $scope, $state, User
) {

  //State flags
  $scope.isSubmitting = false;
  $scope.isSubmitted = false;
  $scope.isInvalidToken = false;

  //Must have token
  if (!$state.params.token) {
    $scope.isInvalidToken = true;
    return;
  }

  //Credentials
  $scope.credentials = {
    token: $state.params.token
  };

  /**
   * Submit request
   */
  $scope.resetPassword = function(credentials) {

    //Must be validated
    if ($scope.resetPasswordForm.$invalid) {
      return;
    }

    //Mark as submitting
    $scope.isSubmitting = true;
    $scope.error = null;

    //Send request
    User.resetPassword(credentials).then(function() {
      $scope.isSubmitted = true;
      $scope.credentials = {};
    }, function(error) {

      //Invalid token
      if (error.code === 'INVALID_TOKEN') {
        $scope.isInvalidToken = true;
        return;
      }

      //Set error
      $scope.error = error;

      //Process validation errors
      if (error.status === 422) {
        if (error.data.fields) {
          for (var field in error.data.fields) {
            if (error.data.fields.hasOwnProperty(field) && $scope.resetPasswordForm[field]) {
              var type = error.data.fields[field].type;
              $scope.resetPasswordForm[field].$setValidity(type, false);
            }
          }
        }
      }
    }).finally(function() {
      $scope.isSubmitting = false;
    });
  };
});
