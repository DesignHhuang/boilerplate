
/**
 * Module definition and dependencies
 */
angular.module('App.Nav.Menu.Service', [])

/**
 * Simple menu service
 */
.factory('Menu', function(App) {
  return {
    main: [
      {
        sref: App.state.home,
        title: 'home'
      }
    ]
  };
});
