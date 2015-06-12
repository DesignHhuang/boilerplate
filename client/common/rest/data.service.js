
/**
 * Module definition and dependencies
 */
angular.module('Common.REST.Data.Service', [
	'Common.REST.Api.Service'
])

/**
 * Provider definition
 */
.provider('Data', function() {

	/**
	 * Service getter
	 */
	this.$get = function(Api) {

		/**
		 * Created interfaces
		 */
		var interfaces = {};

		/**
		 * Bind an interface for a specific resource to an object
		 */
		var bindInterface = function(resource, obj) {
			for (var method in Api[resource]) {
				if (Api[resource].hasOwnProperty(method)) {
					obj[method] = Api[resource].do.bind(Api[resource], method);
				}
			}
		};

		/**
		 * Data service
		 */
		var Data = {

			/**
			 * New instance
			 */
			new: function(resource, params) {
				return new Api[resource](params);
			},

			/**
			 * Query models
			 */
			query: function(resource, params, raw) {
				return Api[resource].do('query', params, raw);
			},

			/**
			 * Count models
			 */
			count: function(resource, params, raw) {
				return Api[resource].do('count', params, raw);
			},

			/**
			 * Find model by attributes
			 */
			find: function(resource, params, raw) {
				return Api[resource].do('find', params, raw);
			},

			/**
			 * Get model by ID
			 */
			get: function(resource, params, raw) {
				return Api[resource].do('get', params, raw);
			},

			/**
			 * Create model
			 */
			create: function(resource, params, raw) {
				return Api[resource].do('create', params, raw);
			},

			/**
			 * Update model
			 */
			update: function(resource, params, raw) {
				return Api[resource].do('update', params, raw);
			},

			/**
			 * Destroy model
			 */
			destroy: function(resource, params, raw) {
				return Api[resource].do('destroy', params, raw);
			},

			/**
			 * Get interface to a specific resource
			 */
			interface: function(resource) {
				if (!interfaces[resource]) {
					interfaces[resource] = {};
					bindInterface(resource, interfaces[resource]);
				}
				return interfaces[resource];
			},

			/**
			 * Factory for resource handlers
			 */
			factory: function(resource) {

				//Create resource constructor
				var Resource = function(params) {

					//Call $resource constructor
					Api[resource].call(this, params);
				};

				//Copy prototype
				Resource.prototype = Api[resource].prototype;

				//Bind interface to object
				bindInterface(resource, Resource);
				return Resource;
			}
		};

		//Return the service
		return Data;
	};
});
