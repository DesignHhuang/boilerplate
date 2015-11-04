
/**
 * Module definition and dependencies
 */
angular.module('App.User.Password', [
  'App.User.Password.Forgot',
  'App.User.Password.Reset'
])

/**
 * Config
 */
.config(function($stateProvider) {

  //State definition
  $stateProvider.state('user.password', {
    url: '/password',
    abstract: true,
    template: '<ui-view/>'
  });
});
