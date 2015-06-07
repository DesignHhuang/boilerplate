
/**
 * Module definition and dependencies
 */
angular.module('Common.REST.Api.Service', [
	'ngResource'
])

/**
 * Provider definition
 */
.provider('Api', function ApiProvider() {

	//Base URL
	var baseUrl = '/';

	//Default ID property
	var idProp = 'id';

	//Default params
	var defaultParams = {
		id: '@id'
	};

	//Default actions
	var defaultActions = {

		//Query models
		query: {
			method: 'GET',
			isArray: true
		},

		//Count models
		count: {
			method: 'GET',
			url: 'count/'
		},

		//Find model by attributes
		find: {
			method: 'GET',
			url: 'find/',
			isArray: false
		},

		//Get model by ID
		get: {
			method: 'GET'
		},

		//Create model
		create: {
			method: 'POST'
		},

		//Update model
		update: {
			method: 'PUT'
		},

		//Destroy model
		destroy: {
			method: 'DELETE'
		}
	};

	//Array parameter joining
	var joinArrayParams = true,
		joinArrayParamsWith = ',';

	/**
	 * Set base URL
	 */
	this.setBaseURL = function(url) {
		baseUrl = url;
	};

	/**
	 * Set ID property
	 */
	this.setIdProp = function(prop) {
		idProp = prop;
		if (defaultParams.id) {
			defaultParams.id = '@' + prop;
		}
	};

	/**
	 * Set default params
	 */
	this.setDefaultParams = function(params) {
		defaultParams = params;
	};

	/**
	 * Set default actions
	 */
	this.setDefaultActions = function(actions) {
		defaultActions = actions;
	};

	/**
	 * Set array param joining behaviour
	 */
	this.joinArrayParams = function(join, joinWith) {
		joinArrayParams = join;
		if (angular.isString(joinWith)) {
			joinArrayParamsWith = joinWith;
		}
	};

	/**
	 * Service getter
	 */
	this.$get = function($resource, $http) {

		/**
		 * Url concatenation helper
		 */
		var concatUrl = function(a, b) {
			return (a+'/'+b).replace(/([^:])\/\//g, '$1/');
		};

		/**
		 * API call helper
		 */
		var apiCall = function(method, params, raw) {

			//Parameter juggling
			if (params === true || params === false) {
				raw = params;
				params = {};
			}

			//Concatenate array parameters?
			if (joinArrayParams) {
				for (var p in params) {
					if (angular.isArray(params[p])) {
						params[p] = params[p].join(joinArrayParamsWith);
					}
				}
			}

			//Call method
			var result = this[method](params);

			//Return as promise or raw result
			return (!raw && result.$promise) ? result.$promise : result;
		};

		/**
		 * API singleton
		 */
		var Api = {

			/**
			 * Register a new endpoint
			 */
			register: function(config) {

				//If string given, create default configuration
				if (angular.isString(config)) {
          			config = {
            			resource: config
          			};
 				}

 				//Must have resource
 				if (!config.resource) {
 					throw "Must specify at least a resource when registering a new API endpoint.";
 				}

 				//Set default URL if none given
 				if (!config.url) {
 					config.url = concatUrl(config.resource, ':id');
 				}

 				//Initialize parameters and actions if needed
 				config.params = config.params || {};
 				config.actions = config.actions || {};

 				//Unless this is an external endpoint, set our defaults
 				if (!config.external) {

 					//Prepend base URL
 					config.url = concatUrl(baseUrl, config.url);

 					//Copy default params and actions
 					var params = angular.copy(defaultParams),
 						actions = angular.copy(defaultActions);

 					//Convert params if array given
 					if (angular.isArray(config.params)) {
 						var paramsObject = {};
 						for (var p = 0; p < config.params.length; p++) {
 							paramsObject[config.params[p]] = '@' + config.params[p];
 						}
 						config.params = paramsObject;
 					}

 					//Extend config with them
 					config.params = angular.extend(params, config.params);
 					config.actions = angular.extend(actions, config.actions);

 					//Process actions
 					angular.forEach(config.actions, function(action, key) {

 						//Remove action if empty
 						if (!action) {
 							delete config.actions[key];
 							return;
 						}

 						//Prepend config URL
 						if (action.url && angular.isString(action.url)) {
 							config.actions[key].url = concatUrl(config.url, action.url);
 						}
 					});
 				}

 				//Create resource
 				Api[config.resource] = $resource(config.url, config.params, config.actions);

 				//Bind apiCall method
 				Api[config.resource].do = function(method, params, raw) {
 					return apiCall.call(Api[config.resource], method, params, raw);
 				};

				//Overwrite prototype $save method to allow for differentiation between create and update
				if (!config.external && Api[config.resource].update && Api[config.resource].create) {
					Api[config.resource].prototype.$save = function(params, success, error) {

						//Result
						var result;

						//Create or update
						if (this[idProp]) {
							result = Api[config.resource].update.call(this, params, this, success, error);
						}
						else {
							result = Api[config.resource].create.call(this, params, this, success, error);
						}

						//Return promise or result
						return result.$promise || result;
					};
				}
 			}
		};

		//Return
		return Api;
	};
});
