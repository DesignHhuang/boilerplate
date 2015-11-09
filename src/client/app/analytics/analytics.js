/**
 * Module definition and dependencies
 */
angular.module('App.Analytics', [
  'App.Analytics.Service'
])

/**
 * Configuration
 */
.config(function(ENV, AnalyticsProvider) {
  AnalyticsProvider.setEnabled(ENV.analytics.enabled && ENV.analytics.trackingId);
})

/**
 * Run logic
 */
.run(function($rootScope, Analytics, ENV) {

  //If not enabled or no tracking ID, we're done
  if (!Analytics.isEnabled()) {
    return;
  }

  //Create site wide tracker
  Analytics.create(ENV.analytics.trackingId);

  //On state changes, track page views
  $rootScope.$on('$stateChangeSuccess', function() {
    Analytics.track.pageview();
  });
});
