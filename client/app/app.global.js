
/***********************************************************************************************
 * Backwards browser compatibility
 ***/

/**
 * Keys method for Object class
 */
if (!Object.keys) {
	Object.keys = function (o) {
		var a = [], k;
		for (k in o) {
			if (o.hasOwnProperty(k)) {
				a.push(k);
			}
		}
		return a;
	};
}