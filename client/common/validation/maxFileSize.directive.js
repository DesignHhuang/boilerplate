
/**
 * Module definition and dependencies
 */
angular.module('Common.Validation.MaxFileSize.Directive', [])

/**
 * Directive
 */
.directive('maxFileSize', function() {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, ngModel) {

			//Get max file size
			var maxSize = parseInt(attrs.maxFileSize);

			//Add validator
			ngModel.$validators.fileSize = function(modelValue, viewValue) {

				//No max size limit?
				if (maxSize === 0) {
					return true;
				}

				//Get files list
				var model = modelValue || viewValue;
				if (!model.files) {
					return true;
				}

				//Loop and check each file
				for (var i = 0; i < model.files.length; i++) {
					if (model.files[i].size && model.files[i].size > maxSize) {
						return false;
					}
					if (model.files[i].fileSize && model.files[i].fileSize > maxSize) {
						return false;
					}
				}

				//By default, pass through
				return true;
			};
		}
	};
});
