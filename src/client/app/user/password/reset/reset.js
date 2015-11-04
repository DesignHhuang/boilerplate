
/**
 * Module definition and dependencies
 */
angular.module('App.User.Password.Reset', [
  'App.User.Password.Reset.Controller'
])

/**
 * Config
 */
.config(function($stateProvider) {

  //State definition
  $stateProvider.state('user.password.reset', {
    url: '/reset/:token',
    controller: 'UserPasswordResetCtrl',
    templateUrl: 'user/password/reset/reset.html'
  });
});
