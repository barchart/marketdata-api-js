module.exports = (() => {
	'use strict';

	/**
	 * Formats a string (by capitalizing it). If anything other than a string
	 * is passed, the argument is returned without modification.
	 * 
	 * @function
	 * @param {String|*} symbol
	 * @returns {String|*}
	 */
	function formatSymbol(symbol) {
		if (symbol !== null && typeof symbol === 'string') {
			return symbol.toUpperCase();
		} else {
			return symbol;
		}
	}

	return formatSymbol;
})();