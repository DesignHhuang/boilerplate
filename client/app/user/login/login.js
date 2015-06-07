
/**
 * Module definition and dependencies
 */
angular.module('MyApp.User.Login', [
	'MyApp.User.Login.Service',
	'MyApp.User.Login.Controller',
	'MyApp.User.Login.oAuthRedirect',
	'Common.Authentication.Auth.Service',
	'Common.Authentication.oAuth.Service',
	'Common.Authentication.oAuth.Google.Service'
])

/**
 * Config
 */
.config(function($stateProvider) {

	//State definition
	$stateProvider.state('user.login', {
		url:			'/login',
		controller:		'UserLoginCtrl',
		templateUrl:	'user/login/login.html'
	});
})

/**
 * Run logic
 */
.run(function($rootScope, $state, MyApp, Auth, Login) {

	/**
	 * Global logout helper
	 */
	$rootScope.doLogout = function() {
		if (Auth.isAuthenticated()) {
			Auth.logout();
		}
	};

	/**
	 * Global login helper, optionally specify redirect state name/params
	 */
	$rootScope.doLogin = function(redirectState, redirectParams) {

		//Already logged in?
		if (Auth.isAuthenticated()) {
			if (redirectState) {
				$state.go(redirectState, redirectParams || {});
			}
			return;
		}

		//Login
		Login.now(redirectState, redirectParams);
	};

	/**
	 * Listen for authentication events
	 */
	$rootScope.$on('auth.authenticated', function(event, auth) {

		//If authenticated, all is well
		if (auth.isAuthenticated) {
			return;
		}

		//If this was a user initiated logout, go to the home state
		if (auth.isUserInitiated) {
			$state.go('home');
			return;
		}

		//If the current state requires authentication, browse away from it,
		//then do a login and remember where the user was
		if ($state.current.auth === true) {
			$state.go('home');
			Login.now($state.current.name, $state.params);
		}

		//Otherwise, if this wasn't the initial auth cycle, prompt login as this
		//is most likely triggered by a 401 response
		else if (!auth.isInitial) {
			Login.now();
		}
	});

	/**
	 * Listen for states that require authentication
	 */
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

		//Authentication required for this state?
		if (toState.auth === true && toState.name != 'user.login' && !Auth.isAuthenticated()) {

			//Don't navigate to this state and show the login modal
			event.preventDefault();
			Login.now(toState.name, toParams);

			//If no from-state is present, navigate to home state
			if (fromState.name === "") {
				$state.go('home');
			}
		}
	});
});
