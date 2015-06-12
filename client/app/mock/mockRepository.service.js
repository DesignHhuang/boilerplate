
/**
 * Module definition and dependencies
 */
angular.module('MyApp.Mock.Repository.Service', [
	'Common.Utility.Storage.Service'
])

/**
 * Service definition
 */
.factory('MockRepository', function(Storage) {

	/**
	 * Class definitions
	 */
	var MockRepository = {

		//Storage key and items
		storageKey: '',
		defaultItems: [],
		items: [],

		/**
		 * Initialization
		 */
		init: function(storageKey, defaultItems) {

			//Set storage key and remember default items
			this.storageKey = storageKey || '';
			this.defaultItems = defaultItems;

			//Load items
			this.loadItems();
		},

		/*****************************************************************************
		 * Items management
		 ***/

		/**
		 * Get all items
		 */
		getItems: function() {
			return this.items;
		},

		/**
		 * Set all items
		 */
		setItems: function(items) {
			this.items = items;
			this.storeItems();
		},

		/**
		 * Store items
		 */
		storeItems: function() {
			this.toStorage(this.storageKey, this.items);
		},

		/**
		 * Load items
		 */
		loadItems: function() {
			this.items = this.fromStorage(this.storageKey, this.defaultItems);
		},

		/**
		 * Refresh items
		 */
		refreshItems: function() {
			this.clearStorage(this.storageKey);
			this.loadItems();
		},

		/*****************************************************************************
		 * Storage helpers
		 ***/

		/**
		 * Store mock data in local storage
		 */
		toStorage: function(key, value) {
			if (!key) {
				console.warn('Key required for storing in storage');
				return;
			}
			Storage.set('mock.' + key, value);
		},

		/**
		 * Obtain mock data from local storage
		 */
		fromStorage: function(key, defaultValue) {
			if (!key) {
				console.warn('Key required for obtaining from storage');
				return defaultValue || [];
			}
			return Storage.get('mock.' + key) || defaultValue;
		},

		/**
		 * Erase mock data in local storage
		 */
		clearStorage: function(key) {
			Storage.remove('mock.' + key);
		},

		/*****************************************************************************
		 * Filtering helpers
		 ***/

		/**
		 * Find items by given params
		 */
		getFilteredList: function(params, strict, asReference) {

			//If no parameters were given, return all data
			if (!angular.isObject(params)) {
				if (asReference) {
					return this.items;
				}
				return angular.copy(this.items);
			}

			//Initialize list
			var list = [];

			//Find matching item(s)
			for (var i = 0; i < this.items.length; i++) {

				//Match state
				var matches = true;

				//Loop params
				for (var key in params) {

					//Strict filtering must have all parameter properties present
					if ((strict && !angular.isDefined(this.items[i][key])) || (angular.isDefined(this.items[i][key]) && this.items[i][key] !== params[key])) {
						matches = false;
						break;
					}
				}

				//If the item matches the params, add it to the list (cloned)
				if (matches) {
					if (asReference) {
						list.push(this.items[i]);
					}
					else {
						list.push(angular.copy(this.items[i]));
					}
				}
			}

			//Return list
			return list;
		},

		/**
		 * Check if an item exists by params
		 */
		existsByParams: function(params) {

			//Validate params
			if (!angular.isObject(params)) {
				return false;
			}

			//Find matching items
			for (var i = 0; i < this.items.length; i++) {

				//Match state
				var matches = true;

				//Loop params
				for (var key in params) {
					if (!angular.isDefined(this.items[i][key]) || this.items[i][key] !== params[key]) {
						matches = false;
						break;
					}
				}

				//If matches, the item exists
				if (matches) {
					return true;
				}
			}

			//No matches found
			return false;
		},

		/**
		 * Check if an item exists by property
		 */
		existsByProperty: function(property, value) {
			for (var i = 0; i < this.items.length; i++) {
				if (angular.isDefined(this.items[i][property]) && this.items[i][property] === value) {
					return true;
				}
			}
			return false;
		},

		/**
		 * Find a specfic item by params
		 */
		findByParams: function(params, asReference) {

			//Query for matching ID
			var list = this.getFilteredList(params, false, asReference);

			//No items?
			if (list.length === 0) {
				return null;
			}

			//Return first item
			return list[0];
		},

		/**
		 * Find a specfic item by property
		 */
		findByProperty: function(property, value, asReference) {

			//Create filter params object
			var params = {};
			params[property] = value;

			//Find by params now
			return this.findByParams(params, asReference);
		},

		/*****************************************************************************
		 * Other helpers
		 ***/

		/**
		 * Helper to generate a new auto incremented ID
		 */
		autoIncrementId: function() {
			var max = 0;
			for (var i = 0; i < this.items.length; i++) {
				if (this.items[i].id > max) {
					max = this.items[i].id;
				}
			}
			return max + 1;
		},

		/**
		 * Check if an item's property matches a specific value
		 */
		matchesProperty: function(item, matchProperty, matchValue) {
			return (angular.isDefined(item[matchProperty]) && item[matchProperty] === matchValue);
		}
	};

	//Return
	return MockRepository;
});
