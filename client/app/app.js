
/**
 * Module definition and dependencies
 */
angular.module('App', [

	//Angular
	'ngAnimate',
	'ngSanitize',
	'ngMessages',

	//3rd party
	'ui.router',

	//Mock backend
	'App.Mock.Backend',

	//Core modules
	'App.Env',
	'App.Config',
	'App.Errors',
	'App.Controller',
	'App.Nav',
	'App.Templates',

	//App modules
	'App.Home',
	'App.User',
	'App.Secure'
])

/**
 * Technical configuration
 */
.config(function(
	$urlRouterProvider, $locationProvider, App, StorageProvider,
	ApiProvider, LoginProvider, AuthProvider, oAuthGoogleProvider
) {

	//Enable HTML 5 mode browsing and set default route
	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');

	//Storage settings
	StorageProvider.setPrefix(App.name.toLowerCase());

	//API base url
	ApiProvider.setBaseURL(App.api.baseUrl);

	//Login behaviour
	LoginProvider.usingModal(false);

	//Authentication configuration
	AuthProvider.setClientIdentifier(App.name);
	AuthProvider.setAuthEndpoint(App.api.baseUrl + 'user/login');
	AuthProvider.setStorageMode('session');

	//oAuth configuration, Google specific
	oAuthGoogleProvider.setPopupCallbackUrl(App.baseUrl + 'oAuthCallback');
	oAuthGoogleProvider.setRedirectCallbackUrl(App.baseUrl + 'oAuthRedirect/google');
	oAuthGoogleProvider.setClientId(App.oAuth.Google.clientId);
	oAuthGoogleProvider.setScopes([
		'email', 'profile'
	]);
})

/**
 * Rootscope extension
 */
.run(function($rootScope) {

	/**
	 * Fields error state checker
	 */
	$rootScope.hasError = function(field, form) {
		if (!form.$submitted && !field.$dirty) {
			return false;
		}
		return field.$invalid;
	};

	/**
	 * Fields success state checker
	 */
	$rootScope.hasSuccess = function(field, form) {
		return field.$valid && field.$dirty;
	};

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
})

/**
 * Run logic
 */
.run(function($rootScope, App) {

	//Set app constant in rootscope
	$rootScope.App = App;

	//Listen for authentication events
	$rootScope.$on('auth.authenticated', function(event, auth) {

	});
});
