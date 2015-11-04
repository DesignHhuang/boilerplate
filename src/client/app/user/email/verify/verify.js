
/**
 * Module definition and dependencies
 */
angular.module('App.User.Email.Verify', [
  'App.User.Email.Verify.Controller'
])

/**
 * Config
 */
.config(function($stateProvider) {

  //State definition
  $stateProvider.state('user.email.verify', {
    parent: 'user',
    url: '^/email/verify/:token',
    controller: 'UserEmailVerifyCtrl',
    templateUrl: 'user/email/verify/verify.html'
  });
});
