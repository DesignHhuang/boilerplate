
/**
 * Module definition and dependencies
 */
angular.module('App.User.Password.Forgot', [
  'App.User.Password.Forgot.Controller'
])

/**
 * Config
 */
.config(function($stateProvider) {

  //State definition
  $stateProvider.state('user.password.forgot', {
    url: '/forgot',
    controller: 'UserPasswordForgotCtrl',
    templateUrl: 'user/password/forgot/forgot.html'
  });
});
