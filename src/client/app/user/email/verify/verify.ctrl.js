
/**
 * Module definition and dependencies
 */
angular.module('App.User.Email.Verify.Controller', [])

/**
 * Controller
 */
.controller('UserEmailVerifyCtrl', function($scope, $state, User) {

  //Flags
  $scope.isVerified = false;
  $scope.isInvalid = false;

  //Must have token
  if (!$state.params.token) {
    $scope.isInvalid = true;
    return;
  }

  //Verify token
  User.verifyEmail($state.params.token).then(function() {
    $scope.isVerified = true;
  }, function() {
    $scope.isInvalid = true;
  });
});
