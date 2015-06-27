
/**
 * Module definition and dependencies
 */
angular.module('Angular.ScopeExtension', [])

/**
 * Rootscope extension
 */
.run(function($rootScope) {

  /**
   * Listen on many
   */
  $rootScope.$onMany = function(events, fn) {
    if (!angular.isArray(events)) {
      events = events.split(',');
    }
    for (var i = 0; i < events.length; i++) {
      this.$on(events[i].trim(), fn);
    }
  };

  /**
   * Safe apply function
   */
  $rootScope.$applySafe = function(func) {
    if ($rootScope.$$phase) {
      func();
      return;
    }
    $rootScope.$apply(function() {
      func();
    });
  };
});
