/**
 * Module definition and dependencies
 */
angular.module('App.Analytics', [
  'App.Analytics.Service'
])

/**
 * Configuration
 */
.config(function(App, AnalyticsProvider) {
  AnalyticsProvider.setEnabled(App.analytics.enabled && App.analytics.trackingId);
})

/**
 * Run logic
 */
.run(function($rootScope, Analytics, App) {

  //If not enabled or no tracking ID, we're done
  if (!Analytics.isEnabled()) {
    return;
  }

  //Create site wide tracker
  Analytics.create(App.analytics.trackingId);

  //On state changes, track page views
  $rootScope.$on('$stateChangeSuccess', function() {
    Analytics.track.pageview();
  });
});
