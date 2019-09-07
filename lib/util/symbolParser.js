module.exports = (() => {
	'use strict';

	const alternateFuturesMonths = {
		A: 'F',
		B: 'G',
		C: 'H',
		D: 'J',
		E: 'K',
		I: 'M',
		L: 'N',
		O: 'Q',
		P: 'U',
		R: 'V',
		S: 'X',
		T: 'Z'
	};

	const futuresMonthNumbers = {
		F: 1,
		G: 2,
		H: 3,
		J: 4,
		K: 5,
		M: 6,
		N: 7,
		Q: 8,
		U: 8,
		V: 10,
		X: 11,
		Z: 12
	};

	const predicates = { };

	predicates.bats = /^(.*)\.BZ$/i;
	predicates.percent = /(\.RT)$/;

	const types = { };

	types.forex = /^\^([A-Z]{3})([A-Z]{3})$/i;
	types.futures = { };
	types.futures.spread =/^_S_/i;
	types.futures.concrete = /^([A-Z][A-Z0-9\$\-!\.]{0,2})([A-Z]{1})([0-9]{4}|[0-9]{1,2})$/i;
	types.futures.alias = /^([A-Z][A-Z0-9\$\-!\.]{0,2})(\*{1})([0-9]{1})$/i;
	types.futures.options = { };
	types.futures.options.short = /^([A-Z][A-Z0-9\$\-!\.]?)([A-Z])([0-9]{1,4})([A-Z])$/i;
	types.futures.options.long = /^([A-Z][A-Z0-9\$\-!\.]{0,2})([A-Z])([0-9]{1,4})\|(\-?[0-9]{1,5})(C|P)$/i;
	types.futures.options.historical = /^([A-Z][A-Z0-9\$\-!\.]{0,2})([A-Z])([0-9]{2})([0-9]{1,5})(C|P)$/i;
	types.indicies = { };
	types.indicies.external = /^\$(.*)$/i;
	types.indicies.sector = /^\-(.*)$/i;
	types.indicies.cmdty = /^(.*)\.CM$/i;

	const parsers = [ ];

	parsers.push((symbol) => {
		let definition = null;

		if (types.futures.spread.test(symbol)) {
			definition = { };

			definition.symbol = symbol;
			definition.type = 'future_spread';
		}

		return definition;
	});

	parsers.push((symbol) => {
		let definition = null;

		const match = symbol.match(types.futures.concrete);

		if (match !== null) {
			definition = { };

			definition.symbol = symbol;
			definition.type = 'future';

			definition.dynamic = false;
			definition.root = match[1];
			definition.month = match[2];
			definition.year = getFuturesYear(match[3]);
		}

		return definition;
	});

	parsers.push((symbol) => {
		let definition = null;

		const match = symbol.match(types.futures.alias);

		if (match !== null) {
			definition = { };

			definition.symbol = symbol;
			definition.type = 'future';

			definition.dynamic = true;
			definition.root = match[1];
			definition.dynamicCode = match[3];
		}

		return definition;
	});

	parsers.push((symbol) => {
		let definition = null;

		if (types.forex.test(symbol)) {
			definition = { };

			definition.symbol = symbol;
			definition.type = 'forex';
		}

		return definition;
	});

	parsers.push((symbol) => {
		let definition = null;

		if (types.indicies.external.test(symbol)) {
			definition = { };

			definition.symbol = symbol;
			definition.type = 'index';
		}

		return definition;
	});

	parsers.push((symbol) => {
		let definition = null;

		if (types.indicies.sector.test(symbol)) {
			definition = { };

			definition.symbol = symbol;
			definition.type = 'sector';
		}

		return definition;
	});
	
	parsers.push((symbol) => {
		let definition = null;
		
		const match = symbol.match(types.futures.options.short);

		if (match !== null) {
			definition = { };
			
			const putCallCharacterCode = match[4].charCodeAt(0);
			const putCharacterCode = 80;
			const callCharacterCode = 67;
			
			let optionType;
			let optionYearDelta;
			
			if (putCallCharacterCode < putCharacterCode) {
				optionType = 'call';
				optionYearDelta = putCallCharacterCode - callCharacterCode;
			} else {
				optionType = 'put';
				optionYearDelta = putCallCharacterCode - putCharacterCode;
			}
			
			definition.symbol = symbol;
			definition.type = 'future_option';

			definition.option_type = optionType;
			definition.strike = parseInt(match[3]);

			definition.root = match[1];
			definition.month = match[2];
			definition.year = getCurrentYear() + optionYearDelta;
		}

		return definition;
	});

	parsers.push((symbol) => {
		let definition = null;

		const match = symbol.match(types.futures.options.long) || symbol.match(types.futures.options.historical);

		if (match !== null) {
			definition = { };
			
			definition.symbol = symbol;
			definition.type = 'future_option';

			definition.option_type =  match[5] === 'C' ? 'call' : 'put';
			definition.strike = parseInt(match[4]);
			
			definition.root = match[1];
			definition.month = getFuturesMonth(match[2]);
			definition.year = getFuturesYear(match[3]);
		}

		return definition;
	});

	const converters = [ ];

	converters.push((symbol) => {
		let converted = null;

		if (symbolParser.getIsFuture(symbol) && symbolParser.getIsConcrete(symbol)) {
			converted = symbol.replace(/(.{1,3})([A-Z]{1})([0-9]{3}|[0-9]{1})?([0-9]{1})$/i, '$1$2$4') || null;
		}

		return converted;
	});

	converters.push((symbol) => {
		let converted = null;

		if (symbolParser.getIsFutureOption(symbol)) {
			const definition = symbolParser.parseInstrumentType(symbol);

			const putCallCharacter = getPutCallCharacter(definition.option_type);

			if (definition.root.length < 3) {
				const putCallCharacterCode = putCallCharacter.charCodeAt(0);

				converted = `${definition.root}${definition.month}${definition.strike}${String.fromCharCode(putCallCharacterCode + definition.year - getCurrentYear())}`;
			} else {
				converted = `${definition.root}${definition.month}${getYearDigits(definition.year, 1)}|${definition.strike}${putCallCharacter}`;
			}
		}

		return converted;
	});

	converters.push((symbol) => {
		return symbol;
	});

	function getCurrentMonth() {
		const now = new Date();

		return now.getMonth() + 1;
	}

	function getCurrentYear() {
		const now = new Date();

		return now.getFullYear();
	}

	function getYearDigits(year, digits) {
		const yearString = year.toString();

		return yearString.substring(yearString.length - digits, yearString.length);
	}

	function getFuturesMonthNumber(monthString) {

	}

	function getFuturesMonth(monthString) {
		return alternateFuturesMonths[monthString] || monthString;
	}
	
	function getFuturesYear(yearString) {
		const currentYear = getCurrentYear();

		let year = parseInt(yearString);

		if (year < 10) {
			const bump = (year < currentYear % 10) ? 1 : 0;

			year = Math.floor(currentYear / 10) * 10 + year + (bump * 10);
		} else if (year < 100) {
			year = Math.floor(currentYear / 100) * 100 + year;

			if (year < currentYear) {
				const alternateYear = year + 100;

				if (currentYear - year > alternateYear - currentYear) {
					year = alternateYear;
				}
			}
		}

		return year;
	}

	function getPutCallCharacter(optionType) {
		if (optionType === 'call') {
			return 'C';
		} else if (optionType === 'put') {
			return 'P';
		} else {
			return null;
		}
	}

	const symbolParser = {
		/**
		 * Returns a simple instrument definition with the terms that can be
		 * gleaned from a symbol. If no specifics can be determined from the
		 * symbol, a null value is returned.
		 *
		 * @public
		 * @param {String} symbol
		 * @returns {Object|null}
		 */
		parseInstrumentType: (symbol) => {
			if (typeof symbol !== 'string') {
				return null;
			}

			let definition = null;

			for (let i = 0; i < parsers.length && definition === null; i++) {
				const parser = parsers[i];

				definition = parser(symbol);
			}

			return definition;
		},

		/**
		 * Translates a symbol into a form suitable for use with JERQ (i.e. our quote "producer").
		 *
		 * @public
		 * @param {String} symbol
		 * @return {String|null}
		 */
		getProducerSymbol: (symbol) => {
			if (typeof symbol !== 'string') {
				return null;
			}

			let converted = null;

			for (let i = 0; i < converters.length && converted === null; i++) {
				const converter = converters[i];

				converted = converter(symbol);
			}

			return converted;
		},

		/**
		 * Attempts to convert database format of futures options to pipeline format
		 * (e.g. ZLF320Q -> ZLF9|320C)
		 *
		 * @public
		 * @param {String} symbol
		 * @returns {String|null}
		 */
		getFuturesOptionPipelineFormat: (symbol) => {
			const definition = symbolParser.parseInstrumentType(symbol);

			let formatted = null;
			
			if (definition.type === 'future_option') {
				const putCallCharacter = getPutCallCharacter(definition.option_type);

				formatted = `${definition.root}${definition.month}${getYearDigits(definition.year, 1)}|${definition.strike}${putCallCharacter}`;
			}
			
			return formatted;
		},

		/**
		 * Returns true if the symbol is not an alias to another symbol; otherwise
		 * false.
		 *
		 * @public
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		getIsConcrete: (symbol) => {
			return typeof(symbol) === 'string' && !types.futures.alias.test(symbol);
		},

		/**
		 * Returns true if the symbol is an alias for another symbol; otherwise false.
		 *
		 * @public
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		getIsReference: (symbol) => {
			return typeof(symbol) === 'string' && types.futures.alias.test(symbol);
		},

		/**
		 * Returns true if the symbol represents futures contract; false otherwise.
		 *
		 * @public
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		getIsFuture: (symbol) => {
			return typeof(symbol) === 'string' && (types.futures.concrete.test(symbol) || types.futures.alias.test(symbol));
		},

		/**
		 * Returns true if the symbol represents futures spread; false otherwise.
		 *
		 * @public
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		getIsFutureSpread: (symbol) => {
			return typeof(symbol) === 'string' && types.futures.spread.test(symbol);
		},

		/**
		 * Returns true if the symbol represents an option on a futures contract; false
		 * otherwise.
		 *
		 * @public
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		getIsFutureOption: (symbol) => {
			return typeof(symbol) === 'string' && (types.futures.options.short.test(symbol) ||  types.futures.options.long.test(symbol) || types.futures.options.historical.test(symbol));
		},

		/**
		 * Returns true if the symbol represents a foreign exchange currency pair;
		 * false otherwise.
		 *
		 * @public
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		getIsForex: (symbol) => {
			return typeof(symbol) === 'string' && types.forex.test(symbol);
		},

		/**
		 * Returns true if the symbol represents an external index (e.g. Dow Jones
		 * Industrials); false otherwise.
		 *
		 * @public
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		getIsIndex: (symbol) => {
			return typeof(symbol) === 'string' && types.indicies.external.test(symbol);
		},

		/**
		 * Returns true if the symbol represents an internally-calculated sector
		 * index; false otherwise.
		 *
		 * @public
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		getIsSector: (symbol) => {
			return typeof(symbol) === 'string' && types.indicies.sector.test(symbol);
		},

		/**
		 * Returns true if the symbol represents an internally-calculated, cmdty-branded
		 * index; false otherwise.
		 *
		 * @public
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		getIsCmdty: (symbol) => {
			return typeof(symbol) === 'string' && types.indicies.cmdty.test(symbol);
		},

		/**
		 * Returns true if the symbol is listed on the BATS exchange; false otherwise.
		 *
		 * @public
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		getIsBats: (symbol) => {
			return typeof(symbol) === 'string' && predicates.bats.test(symbol);
		},

		/**
		 * Returns true if the symbol has an expiration and the symbol appears
		 * to be expired (e.g. a future for a past year).
		 *
		 * @public
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		getIsExpired: (symbol) => {
			const definition = symbolParser.parseInstrumentType(symbol);

			let returnVal = false;

			if (definition !== null && definition.year && definition.month) {
				const currentYear = getCurrentYear();

				if (definition.year < currentYear) {
					returnVal = true;
				} else if (definition.year === currentYear && futuresMonthNumbers.hasOwnProperty(definition.month)) {
					const currentMonth = getCurrentMonth();
					const futuresMonth = futuresMonthNumbers[definition.month];

					if (currentMonth > futuresMonth) {
						returnVal = true;
					}
				}
			}

			return returnVal;
		},

		/**
		 * Returns true if prices for the symbol should be represented as a percentage; false
		 * otherwise.
		 *
		 * @public
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		displayUsingPercent: (symbol) => {
			return typeof(symbol) === 'string' && predicates.percent.test(symbol);
		}
	};

	return symbolParser;
})();