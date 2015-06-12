
/**
 * Module definition and dependencies
 */
angular.module('App.User.Service', [
	'Common.REST.Api.Service',
	'Common.Utility.Storage.Service'
])

/**
 * Register with API
 */
.run(function(Api) {
	Api.register({
		resource: 'user',
		actions: {

			//Fetch the data of the currently logged in user
			me: {
				method: 'GET',
				url: 'me/'
			},

			//Create new user
			create: {
				method: 'POST',
				url:	'/'
			},

			//Update existing user
			update: {
				method: 'PUT',
				url:	'/'
			},

			//Check if user exists based on given data
			exists: {
				method: 'POST',
				url:	'exists/'
			}
		}
	});
})

/**
 * Provider definition
 */
.provider('User', function UserProvider() {

	/**
	 * Default data
	 */
	var defaultData = {};

	/**
	 * Set default data
	 */
	this.setDefaultData = function(data) {
		defaultData = angular.copy(data);
	};

	/**
	 * Service getter
	 */
	this.$get = function($rootScope, $q, $window, Api, Storage, Auth) {

		/**
		 * Store user data in storage
		 */
		var storeUserData = function(data) {
			Storage.set('userData', data, Auth.getStorageMode());
		};

		/**
		 * Clear user data from storage
		 */
		var clearUserData = function() {
			Storage.remove('userData', Auth.getStorageMode());
		};

		/**
		 * Get user data from storage
		 */
		var getUserData = function() {
			return Storage.get('userData', Auth.getStorageMode()) || {};
		};

		/**
		 * User service
		 */
		var User = {

			/**
			 * Exposed data object
			 */
			data: {},

			/**
			 * Load user data
			 */
			load: function(data) {
				User.data = angular.extend({}, defaultData, data);
				storeUserData(User.data);
				$rootScope.$broadcast('user.dataLoaded', User.data);
			},

			/**
			 * Reset user data back to defaults
			 */
			reset: function() {
				User.data = angular.copy(defaultData);
				storeUserData(User.data);
				$rootScope.$broadcast('user.dataLoaded', User.data);
			},

			/**
			 * Check if there is user data loaded
			 */
			isLoaded: function() {
				return (JSON.stringify(User.data) !== JSON.stringify(defaultData));
			},

			/**
			 * Authenticated check (using Auth service)
			 */
			isAuthenticated: function() {
				return Auth.isAuthenticated();
			},

			/**
			 * Admin check (using Auth service)
			 */
			isAdmin: function() {
				return Auth.hasRole('admin');
			},

			/**
			 * User presence check (authenticated and with data)
			 */
			isPresent: function() {
				return this.isAuthenticated() && this.isLoaded();
			},

			/**
			 * Fetch logged in user data from the server
			 */
			me: function() {

				//Refresh user data
				return Api.user.do('me').then(function(data) {
					User.load(data);
					return data;
				}, function(response) {
					User.reset();
					return $q.reject(response.data);
				});
			},

			/**
			 * Create a new user
			 */
			create: function(data) {

				//Initialize new user and save with given data
				return Api.user.do('create', data).then(function(data) {
					User.load(data);
					return data;
				}, function(response) {
					return $q.reject(response.data);
				});
			},

			/**
			 * Update user
			 */
			update: function(data) {

				//Initialize new user and save with given data
				return Api.user.do('update', data).then(function(data) {
					User.load(data);
					return data;
				}, function(response) {
					return $q.reject(response.data);
				});
			},

			/**
			 * Check if a user exists by given data
			 */
			exists: function(data) {

				//Create deferred
				var deferred = $q.defer();

				//Check using the API
				Api.user.do('exists', data).then(function(data) {
					deferred.resolve(data.id);
				}).catch(function(data) {
					deferred.reject();
				});

				//Return promise
				return deferred.promise;
			}
		};

		//Set initial user data
		User.load(getUserData());

		/**
		 * Listen for authentication events
		 */
		$rootScope.$on('auth.authenticated', function(event, auth) {
			if (auth.isAuthenticated) {
				User.me();
			}
			else {
				User.reset();
			}
		});

		/**
		 * Listen for storage events
		 */
		angular.element($window).on('storage', function() {
			$rootScope.$apply(function() {
				User.load(getUserData());
			});
		});

		//Return
		return User;
	};
});
