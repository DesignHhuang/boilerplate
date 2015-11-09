
/**
 * Module definition and dependencies
 */
angular.module('App.User.Profile.Controller', [
  'App.User.UserExists.Directive',
  'Validation.Match.Directive'
])

/**
 * Controller
 */
.controller('UserProfileCtrl', function(
  $scope, $state, User
) {

  //Copy user model (otherwise changes would be immediately reflected everywhere)
  $scope.user = angular.copy(User.current);

  //Flags
  $scope.isSubmitting = false;
  $scope.isSendingVerificationMail = false;

  /**
   * Save
   */
  $scope.save = function(user) {

    //Must be validated
    if ($scope.profileForm.$invalid) {
      return;
    }

    //Toggle flag
    $scope.isSubmitting = true;
    $scope.error = null;

    //Update user details
    user.save().then(function(user) {

      //Pass data on to current user model now, and create a fresh copy for our scope
      User.current.fromObject(user.toObject());
      $scope.user = angular.copy(User.current);
    }, function(error) {

      //Ignore 401's
      if (error.status === 401) {
        return;
      }

      //Set error
      $scope.error = error;

      //Process validation errors
      if (error.status === 422) {
        if (error.data.fields) {
          for (var field in error.data.fields) {
            if (error.data.fields.hasOwnProperty(field) && $scope.profileForm[field]) {
              var type = error.data.fields[field].type;
              $scope.profileForm[field].$setValidity(type, false);
            }
          }
        }
      }
    }).finally(function() {
      $scope.isSubmitting = false;
    });
  };

  /**
   * Resend verification email
   */
  $scope.resendVerificationEmail = function() {

    //Resend verification email
    $scope.isSendingVerificationMail = true;
    User.sendVerificationEmail().then(function() {

    }).finally(function() {
      $scope.isSendingVerificationMail = false;
    });
  };
});
