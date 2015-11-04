/**
 * Module definition and dependencies
 */
angular.module('App.Analytics.Service', [])

/**
 * Provider definition
 */
.provider('Analytics', function AnalyticsProvider() {

  /**
   * Enabled flag
   */
  this.isEnabled = true;

  /**
   * Set default data
   */
  this.setEnabled = function(isEnabled) {
    this.isEnabled = !!isEnabled;
  };

  /**
   * Service getter
   */
  this.$get = function($window, $location) {

    //Check if enabled
    var isEnabled = this.isEnabled;

    /**
     * Initialize google analytics queue
     */
    $window.ga = $window.ga || function() {
      ($window.ga.q = $window.ga.q || []).push(arguments);
    };
    $window.ga.l = +new Date();

    /**
     * GA wrapper function
     */
    function ga() {
      if (isEnabled) {
        $window.ga.apply(undefined, arguments);
      }
    }

    /**
     * Class definition
     */
    var Analytics = {

      /**
       * Enable analytics in realtime
       */
      enable: function() {
        isEnabled = true;
      },

      /**
       * Disable analytics in realtime
       */
      disable: function() {
        isEnabled = false;
      },

      /**
       * Check if enabled
       */
      isEnabled: function() {
        return isEnabled;
      },

      /**
       * Create interface
       */
      create: function(trackingId, name, config) {
        ga('create', angular.extend({
          trackingId: trackingId,
          cookieDomain: 'auto',
          name: name
        }, config || {}));
      },

      /**
       * Set interface
       */
      set: {

        /**
         * Set app name
         */
        appName: function(name) {
          ga('set', 'appName', name);
        },

        /**
         * Set app ID
         */
        appId: function(id) {
          ga('set', 'appId', id);
        },

        /**
         * Set app version
         */
        appVersion: function(version) {
          ga('set', 'appVersion', version);
        },

        /**
         * Set user ID
         */
        userId: function(userId) {
          ga('set', 'userId', userId);
        },

        /**
         * Set data source
         */
        dataSource: function(dataSource) {
          ga('set', 'dataSource', dataSource);
        },

        /**
         * Set screen name
         */
        screenName: function(screenName) {
          ga('set', 'screenName', screenName);
        },

        /**
         * Set document title
         */
        documentTitle: function(title) {
          ga('set', 'title', title);
        },

        /**
         * Set hostname
         */
        hostname: function(hostname) {
          ga('set', 'hostname', hostname);
        },

        /**
         * Set page
         */
        page: function(page) {
          ga('set', 'page', page);
        },

        /**
         * Campaign name
         */
        campaignName: function(name) {
          ga('set', 'campaignName', name);
        },

        /**
         * Campaign ID
         */
        campaignId: function(id) {
          ga('set', 'campaignId', id);
        },

        /**
         * Campaign source
         */
        campaignSource: function(source) {
          ga('set', 'campaignSource', source);
        },

        /**
         * Campaign medium
         */
        campaignMedium: function(medium) {
          ga('set', 'campaignMedium', medium);
        },

        /**
         * Campaign keyword
         */
        campaignKeyword: function(keyword) {
          ga('set', 'campaignKeyword', keyword);
        },

        /**
         * Campaign content
         */
        campaignContent: function(content) {
          ga('set', 'campaignContent', content);
        },

        /**
         * Set user language
         */
        language: function(language) {
          ga('set', 'language', language);
        },

        /**
         * Set document encoding
         */
        encoding: function(encoding) {
          ga('set', 'encoding', encoding);
        },

        /**
         * Anonymize sender's IP address
         */
        anonymizeIp: function(anonymizeIp) {
          ga('set', 'anonymizeIp', !!anonymizeIp);
        }
      },

      /**
       * Tracking interface
       */
      track: {

        /**
         * Register a pageview
         */
        pageview: function(page) {
          ga('send', {
            hitType: 'pageview',
            page: page || $location.url()
          });
        },

        /**
         * Register a screenview
         */
        screenview: function(screenName) {
          ga('send', {
            hitType: 'screenview',
            screenName: screenName
          });
        },

        /**
         * Register an event
         */
        event: function(category, action, label, value) {
          ga('send', {
            hitType: 'event',
            eventCategory: category,
            eventAction: action,
            eventLabel: label,
            eventValue: value
          });
        },

        /**
         * Register a social hit
         */
        social: function(network, action, target) {
          ga('send', {
            hitType: 'social',
            socialNetwork: network,
            socialAction: action,
            socialTarget: target
          });
        },

        /**
         * Register an exception
         */
        exception: function(description, isFatal) {
          ga('send', {
            hitType: 'exception',
            exDescription: description,
            exFatal: !!isFatal
          });
        },

        /**
         * Register a timing hit
         */
        timing: function(category, variable, value, label) {
          ga('send', {
            hitType: 'timing',
            timingCategory: category,
            timingVar: variable,
            timingValue: value,
            timingLabel: label
          });
        }
      }
    };

    //Return
    return Analytics;
  };
});
