
/**
 * Module definition and dependencies
 */
angular.module('MyApp.Mock.Service', [
	'Common.Utility.Url.Service'
])

/**
 * Mock helpers service
 */
.factory('Mock', function(Url) {
	return {

		/**
		 * Error data generator
		 */
		errorData: function(code, message, data) {

			//No code? Can't make error
			if (!code) {
				return {};
			}

			//Create initial data object
			var error = {
				code: code,
				message: message || ''
			};

			//Append data if present
			if (angular.isObject(data)) {
				error.data = data;
			}

			//Return
			return error;
		},

		/**
		 * Create ID regex
		 */
		idRegex: function(apiBasePath) {
			return new RegExp(apiBasePath.replace(/\//g, '\\/') + '\/\\d+');
		},

		/**
		 * Create query regex
		 */
		queryRegex: function(apiBasePath) {
			return new RegExp(apiBasePath.replace(/\//g, '\\/') + '(?:\\?.*)?$');
		},

		/**
		 * Get ID from URL
		 */
		idFromUrl: function(url, apiBasePath) {
			apiBasePath = apiBasePath || '';
			return parseInt(url.replace(apiBasePath + '/', ''));
		},

		/**
		 * Get params from URL
		 */
		paramsFromUrl: function(url, apiBasePath) {
			apiBasePath = apiBasePath || '';
			var urlEncodedArgs = apiBasePath ? url.substr(apiBasePath.length + 1) : url;
			return Url.fromQueryString(urlEncodedArgs);
		}
	};
});