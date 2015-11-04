
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
  $scope, $state, $modal, User, ngToast
) {

  //Copy user model
  $scope.user = angular.copy(User);
  $scope.$on('user.loaded', function(even, user) {
    $scope.user = angular.copy(user);
  });

  //Flags
  $scope.isSaving = false;
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
    $scope.isSaving = true;
    $scope.error = null;

    //Update user details
    user.save().then(function() {
      User.fromObject(user.toObject());
      ngToast.success('Your details have been saved');
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
      $scope.isSaving = false;
    });
  };

  /**
   * Resend verification email
   */
  $scope.resendVerificationEmail = function() {

    //Resend verification email
    $scope.isSendingVerificationMail = true;
    User.sendVerificationEmail().then(function() {
      $modal.open({
        templateUrl: 'shared/modals/alert.html',
        controller: 'ModalAlertCtrl',
        size: 'sm',
        resolve: {
          options: function() {
            return {
              alert: 'A new verification email has been sent to your email address.',
              title: 'Email sent',
              buttonLabel: 'Ok'
            };
          }
        }
      });
    }).finally(function() {
      $scope.isSendingVerificationMail = false;
    });
  };
});
