
/**
 * Module definition and dependencies
 */
angular.module('App.User.Email', [
  'App.User.Email.Verify'
])

/**
 * Config
 */
.config(function($stateProvider) {

  //State definition
  $stateProvider.state('user.email', {
    url: '/email',
    abstract: true,
    template: '<ui-view/>'
  });
});
