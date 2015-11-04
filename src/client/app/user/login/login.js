
/**
 * Module definition and dependencies
 */
angular.module('App.User.Login', [
  'App.User.Login.Service',
  'App.User.Login.Controller'
])

/**
 * Config
 */
.config(function($stateProvider) {

  //State definition
  $stateProvider.state('user.login', {
    url: '/login',
    controller: 'UserLoginCtrl',
    templateUrl: 'user/login/login.html'
  });
});
