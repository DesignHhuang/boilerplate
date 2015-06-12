
/**
 * Module definition and dependencies
 */
angular.module('MyApp', [

	//Angular
	'ngAnimate',
	'ngSanitize',
	'ngMessages',

	//3rd party
	'ui.router',

	//Templates
	'Templates',

	//Mock backend
	'MyApp.Mock.Backend',

	//Core modules
	'MyApp.Env',
	'MyApp.Config',
	'MyApp.Errors',
	'MyApp.Controller',
	'MyApp.Nav',

	//App modules
	'MyApp.Home',
	'MyApp.User',
	'MyApp.Secure'
])

/**
 * App constant
 */
.constant('MyApp', {
	name: 'MyApp',
	title: 'My Application',
	version: '1.0.0'
})

/**
 * Technical configuration
 */
.config(function(
	$urlRouterProvider, $locationProvider, MyApp, Env, StorageProvider,
	ApiProvider, LoginProvider, AuthProvider, oAuthGoogleProvider
) {

	//Enable HTML 5 mode browsing and set default route
	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');

	//Storage settings
	StorageProvider.setPrefix(MyApp.id.toLowerCase());

	//API base url
	ApiProvider.setBaseURL(Env.api.baseUrl);

	//Login behaviour
	LoginProvider.usingModal(false);

	//Authentication configuration
	AuthProvider.setClientIdentifier(MyApp.id);
	AuthProvider.setAuthEndpoint(Env.api.baseUrl + 'user/login');
	AuthProvider.setStorageMode('session');

	//oAuth configuration, Google specific
	oAuthGoogleProvider.setPopupCallbackUrl(Env.site.baseUrl + 'oAuthCallback');
	oAuthGoogleProvider.setRedirectCallbackUrl(Env.site.baseUrl + 'oAuthRedirect/google');
	oAuthGoogleProvider.setClientId(Env.oAuth.Google.clientId);
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
.run(function($rootScope, MyApp, Env) {

	//Set app and environment constants in root scope
	$rootScope.MyApp = MyApp;
	$rootScope.Env = Env;

	//Listen for authentication events
	$rootScope.$on('auth.authenticated', function(event, auth) {

	});
});
