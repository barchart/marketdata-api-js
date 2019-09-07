let convert = require('./../../../lib/util/convert');

describe('When converting a baseCode to a unitCode', () => {
	it('-1 should translate to "2"', () => {
		expect(convert.baseCodeToUnitCode(-1)).toEqual('2');
	});

	it('-2 should translate to "3"', () => {
		expect(convert.baseCodeToUnitCode(-2)).toEqual('3');
	});

	it('-3 should translate to "4"', () => {
		expect(convert.baseCodeToUnitCode(-3)).toEqual('4');
	});

	it('-4 should translate to "5"', () => {
		expect(convert.baseCodeToUnitCode(-4)).toEqual('5');
	});

	it('-5 should translate to "6"', () => {
		expect(convert.baseCodeToUnitCode(-5)).toEqual('6');
	});

	it('-6 should translate to "7"', () => {
		expect(convert.baseCodeToUnitCode(-6)).toEqual('7');
	});

	it('0 should translate to "8"', () => {
		expect(convert.baseCodeToUnitCode(0)).toEqual('8');
	});

	it('1 should translate to "9"', () => {
		expect(convert.baseCodeToUnitCode(1)).toEqual('9');
	});

	it('2 should translate to "A"', () => {
		expect(convert.baseCodeToUnitCode(2)).toEqual('A');
	});

	it('3 should translate to "B"', () => {
		expect(convert.baseCodeToUnitCode(3)).toEqual('B');
	});

	it('4 should translate to "C"', () => {
		expect(convert.baseCodeToUnitCode(4)).toEqual('C');
	});

	it('5 should translate to "D"', () => {
		expect(convert.baseCodeToUnitCode(5)).toEqual('D');
	});

	it('6 should translate to "E"', () => {
		expect(convert.baseCodeToUnitCode(6)).toEqual('E');
	});

	it('7 should translate to "F"', () => {
		expect(convert.baseCodeToUnitCode(7)).toEqual('F');
	});

	it('"-1" should translate to 0', () => {
		expect(convert.baseCodeToUnitCode("-1")).toEqual(0);
	});

	it('A null value should translate to 0', () => {
		expect(convert.baseCodeToUnitCode(null)).toEqual(0);
	});

	it('An undefined value should translate to 0', () => {
		expect(convert.baseCodeToUnitCode(undefined)).toEqual(0);
	});
});

describe('When converting a unitCode to a baseCode', () => {
	it('"2" should translate to -1', () => {
		expect(convert.unitCodeToBaseCode("2")).toEqual(-1);
	});

	it('"3" should translate to -2', () => {
		expect(convert.unitCodeToBaseCode("3")).toEqual(-2);
	});

	it('"4" should translate to -3', () => {
		expect(convert.unitCodeToBaseCode("4")).toEqual(-3);
	});

	it('"5" should translate to -4', () => {
		expect(convert.unitCodeToBaseCode("5")).toEqual(-4);
	});

	it('"6" should translate to -5', () => {
		expect(convert.unitCodeToBaseCode("6")).toEqual(-5);
	});

	it('"7" should translate to -6', () => {
		expect(convert.unitCodeToBaseCode("7")).toEqual(-6);
	});

	it('"8" should translate to 0', () => {
		expect(convert.unitCodeToBaseCode("8")).toEqual(0);
	});

	it('"9" should translate to 1', () => {
		expect(convert.unitCodeToBaseCode("9")).toEqual(1);
	});

	it('"A" should translate to 1', () => {
		expect(convert.unitCodeToBaseCode("A")).toEqual(2);
	});

	it('"B" should translate to 3', () => {
		expect(convert.unitCodeToBaseCode("B")).toEqual(3);
	});

	it('"C" should translate to 4', () => {
		expect(convert.unitCodeToBaseCode("C")).toEqual(4);
	});

	it('"D" should translate to 5', () => {
		expect(convert.unitCodeToBaseCode("D")).toEqual(5);
	});

	it('"E" should translate to 6', () => {
		expect(convert.unitCodeToBaseCode("E")).toEqual(6);
	});

	it('"F" should translate to 6', () => {
		expect(convert.unitCodeToBaseCode("F")).toEqual(7);
	});

	it('2 should translate to ', () => {
		expect(convert.unitCodeToBaseCode(2)).toEqual(0);
	});

	it('A null value should translate to 0', () => {
		expect(convert.unitCodeToBaseCode(null)).toEqual(0);
	});

	it('An undefined value should translate to 0', () => {
		expect(convert.unitCodeToBaseCode(undefined)).toEqual(0);
	});
});

describe('When converting a date instance to a day code', () => {
	it('"Jan 1, 2016" should translate to 1', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 1))).toEqual('1');
	});

	it('"Jan 2, 2016" should translate to 2', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 2))).toEqual('2');
	});

	it('"Jan 3, 2016" should translate to 3', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 3))).toEqual('3');
	});

	it('"Jan 4, 2016" should translate to 4', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 4))).toEqual('4');
	});

	it('"Jan 5, 2016" should translate to 5', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 5))).toEqual('5');
	});

	it('"Jan 6, 2016" should translate to 6', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 6))).toEqual('6');
	});

	it('"Jan 7, 2016" should translate to 7', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 7))).toEqual('7');
	});

	it('"Jan 8, 2016" should translate to 8', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 8))).toEqual('8');
	});

	it('"Jan 9, 2016" should translate to 9', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 9))).toEqual('9');
	});

	it('"Jan 10, 2016" should translate to 0', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 10))).toEqual('0');
	});

	it('"Jan 11, 2016" should translate to A', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 11))).toEqual('A');
	});

	it('"Jan 12, 2016" should translate to B', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 12))).toEqual('B');
	});

	it('"Jan 13, 2016" should translate to C', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 13))).toEqual('C');
	});

	it('"Jan 14, 2016" should translate to D', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 14))).toEqual('D');
	});

	it('"Jan 15, 2016" should translate to E', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 15))).toEqual('E');
	});

	it('"Jan 16, 2016" should translate to F', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 16))).toEqual('F');
	});

	it('"Jan 17, 2016" should translate to G', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 17))).toEqual('G');
	});

	it('"Jan 18, 2016" should translate to H', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 18))).toEqual('H');
	});

	it('"Jan 19, 2016" should translate to I', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 19))).toEqual('I');
	});

	it('"Jan 20, 2016" should translate to J', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 20))).toEqual('J');
	});

	it('"Jan 21, 2016" should translate to K', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 21))).toEqual('K');
	});

	it('"Jan 22, 2016" should translate to L', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 22))).toEqual('L');
	});

	it('"Jan 23, 2016" should translate to M', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 23))).toEqual('M');
	});

	it('"Jan 24, 2016" should translate to N', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 24))).toEqual('N');
	});

	it('"Jan 25, 2016" should translate to O', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 25))).toEqual('O');
	});

	it('"Jan 26, 2016" should translate to P', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 26))).toEqual('P');
	});

	it('"Jan 27, 2016" should translate to Q', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 27))).toEqual('Q');
	});

	it('"Jan 28, 2016" should translate to R', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 28))).toEqual('R');
	});

	it('"Jan 29, 2016" should translate to S', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 29))).toEqual('S');
	});

	it('"Jan 30, 2016" should translate to T', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 30))).toEqual('T');
	});

	it('"Jan 31, 2016" should translate to U', () => {
		expect(convert.dateToDayCode(new Date(2016, 0, 31))).toEqual('U');
	});

	it('A null value should translate to a null value', () => {
		expect(convert.dateToDayCode(null)).toEqual(null);
	});

	it('A undefined value should translate to a null value', () => {
		expect(convert.dateToDayCode(null)).toEqual(null);
	});
});

describe('When converting a dayCode to number', () => {
	it('"1" should translate to 1', () => {
		expect(convert.dayCodeToNumber("1")).toEqual(1);
	});

	it('"2" should translate to 2', () => {
		expect(convert.dayCodeToNumber("2")).toEqual(2);
	});

	it('"3" should translate to 3', () => {
		expect(convert.dayCodeToNumber("3")).toEqual(3);
	});

	it('"4" should translate to 4', () => {
		expect(convert.dayCodeToNumber("4")).toEqual(4);
	});

	it('"5" should translate to 5', () => {
		expect(convert.dayCodeToNumber("5")).toEqual(5);
	});

	it('"6" should translate to 6', () => {
		expect(convert.dayCodeToNumber("6")).toEqual(6);
	});

	it('"7" should translate to 7', () => {
		expect(convert.dayCodeToNumber("7")).toEqual(7);
	});

	it('"8" should translate to 8', () => {
		expect(convert.dayCodeToNumber("8")).toEqual(8);
	});

	it('"9" should translate to 9', () => {
		expect(convert.dayCodeToNumber("9")).toEqual(9);
	});

	it('"0" should translate to 10', () => {
		expect(convert.dayCodeToNumber("0")).toEqual(10);
	});

	it('"A" should translate to 11', () => {
		expect(convert.dayCodeToNumber("A")).toEqual(11);
	});

	it('"a" should translate to 11', () => {
		expect(convert.dayCodeToNumber("a")).toEqual(11);
	});

	it('"B" should translate to 12', () => {
		expect(convert.dayCodeToNumber("B")).toEqual(12);
	});

	it('"b" should translate to 12', () => {
		expect(convert.dayCodeToNumber("b")).toEqual(12);
	});

	it('"C" should translate to 13', () => {
		expect(convert.dayCodeToNumber("C")).toEqual(13);
	});

	it('"c" should translate to 13', () => {
		expect(convert.dayCodeToNumber("c")).toEqual(13);
	});

	it('"D" should translate to 14', () => {
		expect(convert.dayCodeToNumber("D")).toEqual(14);
	});

	it('"d" should translate to 14', () => {
		expect(convert.dayCodeToNumber("d")).toEqual(14);
	});

	it('"E" should translate to 15', () => {
		expect(convert.dayCodeToNumber("E")).toEqual(15);
	});

	it('"e" should translate to 15', () => {
		expect(convert.dayCodeToNumber("e")).toEqual(15);
	});

	it('"F" should translate to 16', () => {
		expect(convert.dayCodeToNumber("F")).toEqual(16);
	});

	it('"f" should translate to 16', () => {
		expect(convert.dayCodeToNumber("f")).toEqual(16);
	});

	it('"G" should translate to 17', () => {
		expect(convert.dayCodeToNumber("G")).toEqual(17);
	});

	it('"g" should translate to 17', () => {
		expect(convert.dayCodeToNumber("g")).toEqual(17);
	});

	it('"H" should translate to 18', () => {
		expect(convert.dayCodeToNumber("H")).toEqual(18);
	});

	it('"h" should translate to 18', () => {
		expect(convert.dayCodeToNumber("h")).toEqual(18);
	});

	it('"I" should translate to 19', () => {
		expect(convert.dayCodeToNumber("I")).toEqual(19);
	});

	it('"i" should translate to 19', () => {
		expect(convert.dayCodeToNumber("i")).toEqual(19);
	});

	it('"J" should translate to 20', () => {
		expect(convert.dayCodeToNumber("J")).toEqual(20);
	});

	it('"j" should translate to 20', () => {
		expect(convert.dayCodeToNumber("j")).toEqual(20);
	});

	it('"K" should translate to 21', () => {
		expect(convert.dayCodeToNumber("K")).toEqual(21);
	});

	it('"k" should translate to 21', () => {
		expect(convert.dayCodeToNumber("k")).toEqual(21);
	});

	it('"L" should translate to 22', () => {
		expect(convert.dayCodeToNumber("L")).toEqual(22);
	});

	it('"l" should translate to 22', () => {
		expect(convert.dayCodeToNumber("l")).toEqual(22);
	});

	it('"M" should translate to 23', () => {
		expect(convert.dayCodeToNumber("M")).toEqual(23);
	});

	it('"m" should translate to 23', () => {
		expect(convert.dayCodeToNumber("m")).toEqual(23);
	});

	it('"N" should translate to 24', () => {
		expect(convert.dayCodeToNumber("N")).toEqual(24);
	});

	it('"n" should translate to 24', () => {
		expect(convert.dayCodeToNumber("n")).toEqual(24);
	});

	it('"O" should translate to 25', () => {
		expect(convert.dayCodeToNumber("O")).toEqual(25);
	});

	it('"o" should translate to 25', () => {
		expect(convert.dayCodeToNumber("o")).toEqual(25);
	});

	it('"P" should translate to 26', () => {
		expect(convert.dayCodeToNumber("P")).toEqual(26);
	});

	it('"p" should translate to 26', () => {
		expect(convert.dayCodeToNumber("p")).toEqual(26);
	});

	it('"Q" should translate to 27', () => {
		expect(convert.dayCodeToNumber("Q")).toEqual(27);
	});

	it('"q" should translate to 27', () => {
		expect(convert.dayCodeToNumber("q")).toEqual(27);
	});

	it('"R" should translate to 28', () => {
		expect(convert.dayCodeToNumber("R")).toEqual(28);
	});

	it('"r" should translate to 28', () => {
		expect(convert.dayCodeToNumber("r")).toEqual(28);
	});

	it('"S" should translate to 29', () => {
		expect(convert.dayCodeToNumber("S")).toEqual(29);
	});

	it('"s" should translate to 29', () => {
		expect(convert.dayCodeToNumber("s")).toEqual(29);
	});

	it('"T" should translate to 30', () => {
		expect(convert.dayCodeToNumber("T")).toEqual(30);
	});

	it('"t" should translate to 30', () => {
		expect(convert.dayCodeToNumber("t")).toEqual(30);
	});

	it('"U" should translate to 31', () => {
		expect(convert.dayCodeToNumber("U")).toEqual(31);
	});

	it('"u" should translate to 31', () => {
		expect(convert.dayCodeToNumber("u")).toEqual(31);
	});

	it('A null value should translate to a null value', () => {
		expect(convert.dayCodeToNumber(null)).toEqual(null);
	});

	it('A undefined value should translate to a null value', () => {
		expect(convert.dayCodeToNumber(null)).toEqual(null);
	});

	it('A zero-length string should translate to a null value', () => {
		expect(convert.dayCodeToNumber('')).toEqual(null);
	});
});

describe('When day number to a dayCode', () => {
	it('1 should translate to "1"', () => {
		expect(convert.numberToDayCode(1)).toEqual("1");
	});

	it('2 should translate to "2"', () => {
		expect(convert.numberToDayCode(2)).toEqual("2");
	});

	it('3 should translate to "3"', () => {
		expect(convert.numberToDayCode(3)).toEqual("3");
	});

	it('4 should translate to "4"', () => {
		expect(convert.numberToDayCode(4)).toEqual("4");
	});

	it('5 should translate to "5"', () => {
		expect(convert.numberToDayCode(5)).toEqual("5");
	});

	it('6 should translate to "6"', () => {
		expect(convert.numberToDayCode(6)).toEqual("6");
	});

	it('7 should translate to "7"', () => {
		expect(convert.numberToDayCode(7)).toEqual("7");
	});

	it('8 should translate to "8"', () => {
		expect(convert.numberToDayCode(8)).toEqual("8");
	});

	it('9 should translate to "9"', () => {
		expect(convert.numberToDayCode(9)).toEqual("9");
	});

	it('0 should translate to "0"', () => {
		expect(convert.numberToDayCode(10)).toEqual("0");
	});

	it('11 should translate to "A"', () => {
		expect(convert.numberToDayCode(11)).toEqual("A");
	});

	it('12 should translate to "B"', () => {
		expect(convert.numberToDayCode(12)).toEqual("B");
	});

	it('13 should translate to "C"', () => {
		expect(convert.numberToDayCode(13)).toEqual("C");
	});

	it('14 should translate to "D"', () => {
		expect(convert.numberToDayCode(14)).toEqual("D");
	});

	it('15 should translate to "E"', () => {
		expect(convert.numberToDayCode(15)).toEqual("E");
	});

	it('16 should translate to "F"', () => {
		expect(convert.numberToDayCode(16)).toEqual("F");
	});

	it('17 should translate to "G"', () => {
		expect(convert.numberToDayCode(17)).toEqual("G");
	});

	it('18 should translate to "H"', () => {
		expect(convert.numberToDayCode(18)).toEqual("H");
	});

	it('19 should translate to "I"', () => {
		expect(convert.numberToDayCode(19)).toEqual("I");
	});

	it('20 should translate to "J"', () => {
		expect(convert.numberToDayCode(20)).toEqual("J");
	});

	it('21 should translate to "K"', () => {
		expect(convert.numberToDayCode(21)).toEqual("K");
	});

	it('22 should translate to "L"', () => {
		expect(convert.numberToDayCode(22)).toEqual("L");
	});

	it('23 should translate to "M"', () => {
		expect(convert.numberToDayCode(23)).toEqual("M");
	});

	it('24 should translate to "N"', () => {
		expect(convert.numberToDayCode(24)).toEqual("N");
	});

	it('25 should translate to "O"', () => {
		expect(convert.numberToDayCode(25)).toEqual("O");
	});

	it('26 should translate to "P"', () => {
		expect(convert.numberToDayCode(26)).toEqual("P");
	});

	it('27 should translate to "Q"', () => {
		expect(convert.numberToDayCode(27)).toEqual("Q");
	});

	it('28 should translate to "R"', () => {
		expect(convert.numberToDayCode(28)).toEqual("R");
	});

	it('29 should translate to "S"', () => {
		expect(convert.numberToDayCode(29)).toEqual("S");
	});

	it('30 should translate to "T"', () => {
		expect(convert.numberToDayCode(30)).toEqual("T");
	});

	it('31 should translate to "U"', () => {
		expect(convert.numberToDayCode(31)).toEqual("U");
	});
	
	it('A null value should translate to a null value', () => {
		expect(convert.numberToDayCode(null)).toEqual(null);
	});

	it('A undefined value should translate to a null value', () => {
		expect(convert.numberToDayCode(null)).toEqual(null);
	});
});
