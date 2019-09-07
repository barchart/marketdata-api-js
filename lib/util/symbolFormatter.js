module.exports = (() => {
	'use strict';

	return {
		format: (symbol) => {
			if (symbol !== null && typeof symbol === 'string') {
				return symbol.toUpperCase();
			} else {
				return symbol;
			}
 		}
	};
})();