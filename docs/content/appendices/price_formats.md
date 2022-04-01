## Numeric Values

**All numbers received and stored by the SDK use the double-precision floating point [primitive](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)** which is native to JavaScript. 

Many of the properties of the event `Object` passed to the [MarketUpdateCallback](/content/sdk/lib-connection?id=callbacksmarketupdatecallback) are numbers. For example, look at the `tradePrice` and `tradeSize` property values:

```javascript
const handleMarketUpdate = (event) => {
	if (event.type === 'TRADE') {
		console.log(typeof event.tradePrice); // prints "number"
		console.log(typeof event.tradeSize); // prints "number"
	}

	if (event.type === 'TOB') {
		console.log(typeof event.bidPrice); // prints "number"
		console.log(typeof event.bidSize); // prints "number"
	}
};

connection.on(SubscriptionType.MarketUpdate, 'AAPL', handleMarketUpdate)
```

The same is true for the [`Quote`](/content/sdk/lib-marketstate?id=quote) class. Many instance properties of a ```Quote``` class are numbers. Here are a few examples:

* [lastPrice](/content/sdk/lib-marketstate?id=quotelastprice)
* [bidPrice](/content/sdk/lib-marketstate?id=quotebidprice)
* [bidSize](/content/sdk/lib-marketstate?id=quotebidsize)

> Recall the Quote class is used to track the current state of an instrument. It mutates to reflect new information as market data messages are received. Read more in the [Key Concepts: Data Structures](/content/concepts/data_structures?id=quotes).

## Decimal Formatting

Generally speaking, we convert numbers for presentation purposes. This is a very common practice. In most cases, we simply restrict the number of decimal places that are shown. Sometimes, special characters, like commas, are used to separate thousands. In other cases, parenthesis may be used to represent negative values.

### Decimal Formatting Basics

Regardless, let's assume that the last price for an instrument was _fifteen dollars the fifty cents_. In theory, the numeric value of the ```Quote.lastPrice``` property could be:

* `15.5`
* `15.500000000000004`
* `15.499999999999999`

Regardless of the floating point value, we want to display anny of these values with two decimal places, as the literal string ```"15.50"```.

### Decimal Formatting Rules

The SDK maintains a set of rules to determine the generally accepted method of formatting prices. 

These rules differ from one asset class to another — a US equity (e.g. [AAPL](https://www.barchart.com/stocks/quotes/AAPL/overview)) is typically displayed with two decimal places and a foreign exchange quote (e.g. [^EURUSD](https://www.barchart.com/forex/quotes/%5EEURUSD/overview)) is typically displayed with five decimal places. See the [Price Formatting: Unit Codes](/content/appendices/price_formats?id=unit-codes) section below for more information.

Furthermore, this SDK also contains a set of functions used to format numbers for presentation, using the aforementioned rules. See the [Price Formatting: Formatting Functions](/content/appendices/price_formats?id=formatting-functions) section for more information.

## Fractional Formatting

In some cases, it is customary to represent the decimal component of a price as a fraction. Here are three different — and equivalent —  ways the decimal value of ```15.5``` could be represented:

* the decimal value of ```15.50``` could be represented as ```15 and 4/8``` or
* the decimal value of ```15.50``` could be represented as ```15 and 8/16``` or
* the decimal value of ```15.50``` could be represented as ```15 and 16/32```

With that said, most fractional prices are formatted using _tick notation_ instead of actual fractions.

## Tick Notation (Basics)

Tick notation combines the whole number portion of a value with its fractional numerator, separating the two components with a backtick (or a single quote or a dash). The fraction's numerator is displayed; however, the fraction's denominator is not displayed. _Instead, the fraction's denominator is implied._

For example, we could represent the decimal value of `15.50` using tick notation in different ways, depending on the denominator:

* tick notation in _eighths_ would be ```15`4``` — where a denominator of ```8``` in the fraction ```4/8``` is implied, and
* tick notation in _sixteenths_ would be ```15`8``` — where a denominator of ```16``` in the fraction ```8/16``` is implied, and
* tick notation in _thirty-seconds_ would be ```15`16``` — where a denominator of ```32``` in the fraction ```16/32``` is implied, etc.

All of these cases, the implied denominator represents the number of discreet steps — or _ticks_ — in pricing that exist between two consecutive whole numbers. 

#### Tick Notation in Eighths

For example, when pricing in _eighths_, there are eight discrete price points between eleven and twelve:

| Tick Notation | Integer Value | Tick | Fraction Numerator | Fraction Denominator (implied) | Decimal Calculation |
|---:|---:|---:|---:|---:|---:|
| ```11`0``` | ```11``` | &nbsp; ```0``` | 0 | 8 | &nbsp;&nbsp; 11 + (0 / 8) = 11.000 |
| ```11`1``` | ```11``` | &nbsp; ```1``` | 1 | 8 | &nbsp;&nbsp; 11 + (1 / 8) = 11.125 |
| ```11`2``` | ```11``` | &nbsp; ```2``` | 2 | 8 | &nbsp;&nbsp; 11 + (2 / 8) = 11.250 |
| ```11`3``` | ```11``` | &nbsp; ```3``` | 3 | 8 | &nbsp;&nbsp; 11 + (3 / 8) = 11.375 |
| ```11`4``` | ```11``` | &nbsp; ```4``` | 4 | 8 | &nbsp;&nbsp; 11 + (4 / 8) = 11.500 |
| ```11`5``` | ```11``` | &nbsp; ```5``` | 5 | 8 | &nbsp;&nbsp; 11 + (5 / 8) = 11.625 |
| ```11`6``` | ```11``` | &nbsp; ```6``` | 6 | 8 | &nbsp;&nbsp; 11 + (6 / 8) = 11.750 |
| ```11`7``` | ```11``` | &nbsp; ```7``` | 7 | 8 | &nbsp;&nbsp; 11 + (7 / 8) = 11.875 |
| ```12`0``` | ```12``` | &nbsp; ```0``` | 0 | 8 | &nbsp;&nbsp; 12 + (0 / 8) = 12.000 |

#### Tick Notation in Sixteenths

Similarly, when pricing in _sixteenths_, there are sixteen discrete prices between eleven and twelve:

| Tick Notation | Integer Value | Tick | Fraction Numerator | Fraction Denominator (implied) | Decimal Calculation |
|---:|---:|---:|---:|---:|---:|
| ```11`00``` | ```11``` | ```00``` | 0 | 16 | 11 + (0 / 16) = 11.0000 |
| ```11`01``` | ```11``` | ```01``` | 1 | 16 | 11 + (1 / 16) = 11.0625 |
| ```11`02``` | ```11``` | ```02``` | 2 | 16 | 11 + (2 / 16) = 11.1250 |
| ```11`03``` | ```11``` | ```03``` | 3 | 16 | 11 + (3 / 16) = 11.1875 |
| ```11`04``` | ```11``` | ```04``` | 4 | 16 | 11 + (4 / 16) = 11.2500 |
| ```11`05``` | ```11``` | ```05``` | 5 | 16 | 11 + (5 / 16) = 11.3125 |
| ```11`06``` | ```11``` | ```06``` | 6 | 16 | 11 + (6 / 16) = 11.3750 |
| ```11`07``` | ```11``` | ```07``` | 7 | 16 | 11 + (7 / 16) = 11.4375 |
| ```11`08``` | ```11``` | ```08``` | 8 | 16 | 11 + (8 / 16) = 11.5000 |
| ```11`09``` | ```11``` | ```09``` | 9 | 16 | 11 + (9 / 16) = 11.5625 |
| ```11`10``` | ```11``` | ```10``` | 10 | 16 | 11 + (10 / 16) = 11.6250 |
| ```11`11``` | ```11``` | ```11``` | 11 | 16 | 11 + (11 / 16) = 11.6875 |
| ```11`12``` | ```11``` | ```12``` | 12 | 16 | 11 + (12 / 16) = 11.7500 |
| ```11`13``` | ```11``` | ```13``` | 13 | 16 | 11 + (13 / 16) = 11.8125 |
| ```11`14``` | ```11``` | ```14``` | 14 | 16 | 11 + (14 / 16) = 11.8750 |
| ```11`15``` | ```11``` | ```15``` | 15 | 16 | 11 + (15 / 16) = 11.9375 |
| ```12`00``` | ```12``` | ```00``` | 0 | 16 | 12 + (0 / 16) = 12.0000 |

> For _sixteenths_, notice the tick value uses two digits, including a leading zero, when appropriate. For _eighths_, only one tick digit was required. This will become important later.

In the previous examples, the tick values were sequential. For _eighths_ the sequence was:

```{ 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, ... }```

For _sixteenths_ the sequence was:

```{ 00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 00, 01, 02, ... }```

However, ticks are not always sequential. Continue reading for an explanation.

## Tick Notation (Derivation)

Before continuing, let's examine a question that's been glossed over in the previous examples:

**QUESTION: Given a decimal-formatted price, how do we calculate the tick value?**

1. Determine the fractional value of the tick by dividing one by the total number of ticks.
2. Divide the decimal component of the price by the previous result.

For example, assuming a price value of `11.9375`, ticks are calculated as follows:

* In _sixteenths_, the tick value is ```15``` using ```0.9375 / ( 1 / 16) = 15```, or
* In _thirty-seconds_, the tick value is ```30``` using ```0.9375 / ( 1 / 32) = 30```, or
* In _sixty-fourths_, the tick value is ```60``` using ```0.9375 / ( 1 / 64) = 60```, etc.

Using this equation, here are (abbreviated) tables showing derivation ticks in _thirty-seconds_ and _sixty-fourths_:

#### Tick Notation in Thirty-Seconds

| Price | Decimal Component | Tick Formula | Formula Result | Tick | Tick-Formatted Price |
|---:|---:|---:|---:|---:|---:|
| &nbsp; 11.00000 | 0.00000 | &nbsp; 0.00000 / (1 / 32) | 0 | ```00``` | ```11`00``` |
| &nbsp; 11.03125 | 0.03125 | &nbsp; 0.03125 / (1 / 32) | 1 | ```01``` | ```11`01``` |
| &nbsp; 11.06250 | 0.06250 | &nbsp; 0.06250 / (1 / 32) | 2 | ```02``` | ```11`02``` |
| &nbsp; ... | ... | &nbsp;  ... | ... | ... | ... |
| &nbsp; 11.90625 | 0.90625 | &nbsp; 0.90625 / (1 / 32) | 29 | ```29``` | ```11`29``` |
| &nbsp; 11.93750 | 0.93750 | &nbsp; 0.93750 / (1 / 32) | 30 | ```30``` | ```11`30``` |
| &nbsp; 11.96875 | 0.96875 | &nbsp; 0.96875 / (1 / 32) | 31 | ```31``` | ```11`31``` |

#### Tick Notation in Sixty-Fourths

|  Price | Decimal Component | Tick Formula | Formula Result | Tick | Tick-Formatted Price |
|---:|---:|---:|---:|---:|---:|
| 11.000000 | 0.000000 | 0.000000 / (1 / 64) | 0 | ```00``` | ```11`00``` |
| 11.015625 | 0.015625 | 0.015625 / (1 / 64) | 1 | ```01``` | ```11`01``` |
| 11.031250 | 0.031250 | 0.031250 / (1 / 64) | 2 | ```02``` | ```11`02``` |
| ... | ... | ... |  ... | ... | ... |
| 11.953125 | 0.953125 | 0.953125 / (1 / 64) | 61 | ```61``` | ```11`61``` |
| 11.968750 | 0.968750 | 0.968750 / (1 / 64) | 62 | ```62``` | ```11`62``` |
| 11.984375 | 0.984375 | 0.984375 / (1 / 64) | 63 | ```63``` | ```11`63``` |

## Tick Notation (Fractions of Fractions)

As mentioned earlier, ticks are not always sequential. This is because we may choose to _subdivide_ a tick.

Consider sixty-four discrete price steps within a whole number. In previous examples, sixty-four ticks would be used. However, instead of _sixty-fourths_, it is mathematically equivalent to use _thirty-seconds_ and _halves of thirty-seconds_.

| Sixty-Fourths | Equation (64ths) |  | Thirty-Seconds | Halves | Equation (32nds and Halves) |
|:---:|---:|---|:---:|:---:|---|
| 1 | 1/64 = 0.015625 | &larr; same as &rarr; | 0 | 1 | 0/32 + (1/2 * 1/32) = 0.015625 |
| 2 | 2/64 = 0.031250 | &larr; same as &rarr; | 1 | 0 | 1/32 + (0/2 * 1/32) = 0.031250 |
| 3 | 3/64 = 0.046875 | &larr; same as &rarr; | 1 | 1 | 1/32 + (1/2 * 1/32) = 0.046875 |
| 4 | 4/64 = 0.062500 | &larr; same as &rarr; | 2 | 0 | 2/32 + (0/2 * 1/32) = 0.062500 |
| 5 | 5/64 = 0.078125 | &larr; same as &rarr; | 2 | 1 | 2/32 + (1/2 * 1/32) = 0.078125 |
| 6 | 6/32 = 0.093750 | &larr; same as &rarr; | 3 | 0 | 3/32 + (0/2 * 1/32) = 0.093750 |
| 7 | ... |  | ... | ... | ... |

#### Tick Notation in Halves of Thirty-Seconds

Here, we calculate tick values in _havles of thirty-seconds_. Notice three significant differences, when compared with the calculations for _sixty-fourths_:

1. Even though there are sixty-four discrete steps, the formula's divisor is 32.
2. Because the formula's divisor is 32, the formula result isn't always a whole number.
3. To derive the tick, we use the digits from the formula's result — without the decimal point.

| Price | Decimal Component | Tick Formula | Formula Result | Tick | Tick-Formatted Price |
|---:|---:|---:|---:|---:|---:|
| 11.000000 | 0.000000 | 0.000000 / (1 / 32) | [0]0.0 | ```000``` | ```11`000``` |
| 11.015625 | 0.015625 | 0.015625 / (1 / 32) | [0]0.5 | ```005``` | ```11`005``` |
| 11.031250 | 0.031250 | 0.031250 / (1 / 32) | [0]1.0 | ```010``` | ```11`010``` |
| 11.046875 | 0.046875 | 0.046875 / (1 / 32) | [0]1.5 | ```015``` | ```11`015``` |
| 11.062500 | 0.062500 | 0.062500 / (1 / 32) | [0]2.0 | ```020``` | ```11`020``` |
| 11.078125 | 0.078125 | 0.078125 / (1 / 32) | [0]2.5 | ```025``` | ```11`025``` |
| ... | ... | ... | ... | ... | ... |
| 11.953125 | 0.953125 | 0.953125 / (1 / 32) | 30.5 | ```305``` | ```11`305``` |
| 11.968750 | 0.968750 | 0.968750 / (1 / 32) | 31.0 | ```310``` | ```11`310``` |
| 11.984375 | 0.984375 | 0.984375 / (1 / 32) | 31.5 | ```315``` | ```11`315``` |

So, for _halves of thirty-seconds_, the repeating sequence of ticks is:

```{ 000, 005, 010, 015, 020, 025, 030, 035, 040, 045, 050, 055, 060, 065, 070, 075, 080, 085, 090, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 000, 005, 010, ... }```

> Looking at the sequence closely, note the two leading digits represent the number of thirty-second ticks. When the final digit is a ```5```, another half of a thirty-second is added. Why does ```5``` represent one half? Because one half, in decimal form, is ```0.5```.

#### Tick Notation in Quarters of Thirty-Seconds

One final twist exists remains. In the previous example using _halves of thirty-seconds_, the result of the tick derivation used up to three digits too (e.g. ```31.5```) and the tick was represented with three digits (e.g. ```0`315```). However, in the final case, the right-most digit of the tick derivation may be excluded from the tick notation.

Consider the more exotic case of _quarters of thirty-seconds_. In this case, the trailing ```5``` may be omitted, as noted by square brackets.

| Price | Decimal Component | Tick Formula | Formula Result | Tick | Tick-Formatted Price |
|---:|---:|---:|---:|---:|---:|
| 11.0000000 | 0.0000000 | 0.0000000 / (1 / 32) | 00.0[0] | ```000``` | ```11`000``` |
| 11.0078125 | 0.0078125 | 0.0078125 / (1 / 32) | 00.2[5] | ```002``` | ```11`002``` |
| 11.0156250 | 0.0156250 | 0.0156250 / (1 / 32) | 00.5[0] | ```005``` | ```11`005``` |
| 11.0234375 | 0.0234375 | 0.0234375 / (1 / 32) | 00.7[5] | ```007``` | ```11`007``` |
| 11.0312500 | 0.0312500 | 0.0312500 / (1 / 32) | 01.0[0] | ```010``` | ```11`010``` |
| 11.0390625 | 0.0390625 | 0.0390625 / (1 / 32) | 01.2[5] | ```012``` | ```11`012``` |
| ... | ... | ... | ... | ... | ... |
| 11.9843750 | 0.9843750 | 0.9843750 / (1 / 32) | 31.5[0] | ```315``` | ```11`315``` |
| 11.9921875 | 0.9921875 | 0.9921875 / (1 / 32) | 31.7[5] | ```317``` | ```11`317``` |

> In other words, the result of the tick derivation may require up to four digits to represent in decimal form (e.g. ```31.75```); however, only the first three digits are included in the tick notation (e.g. ```317```).

## Tick Notation (Ambiguity)

Obviously, ambiguity is introduced because the denominator is not shown. It is impossible to know whether ```15`02``` represents the decimal value of ```15.0625``` or ```15.03125``` without also knowing the implied context — _thirty-seconds_ or _sixty-fourths_, respectively. 

How is this ambiguity resolved? When a price is quoted using tick notation, the asset being quoted dictates the context. For example, corn futures are always priced in _eighths_.

> To derive a decimal value from tick notation, you must know the asset being quoted (e.g. corn, soybeans, etc).

## Unit Codes

A "unit code" is a concept designed by Barchart to describe generally-accepted methods for formatting prices in decimals or ticks. Barchart assigns a unit code to every instrument. Here are some examples:

* Most US equities use unit code ```"A"``` which specifies use of two decimal places (e.g. [AAPL](https://www.barchart.com/stocks/quotes/AAPL/overview)).
* Most foreign exchange quotes use unit code ```"D"``` which specifies use of five decimal places (e.g. [^EURUSD](https://www.barchart.com/forex/quotes/%5EEURUSD/overview)).
* Corn futures contract use unit code ```"2"``` which specifies tick notation in _eighths_ (e.g. [ZC*0](https://www.barchart.com/futures/quotes/ZC*0/overview)).

#### Unit Code Rules

There are fourteen distinct unit codes:

| Unit Code | Decimal Places | Example | Tick Notation Method | Discreet Ticks | Example (maximum tick) |
|:---:|---:|---:|:---:|---:|---:|
| ```"2"``` | 3 | 11.000 | [_eighths_](/content/appendices/price_formats?id=tick-notation-in-eighths) | 8 | ```0`7``` |
| ```"3"``` | 4 | 11.0000 | [_sixteenths_](/content/appendices/price_formats?id=tick-notation-in-sixteenths) | 16 | ```0`15``` |
| ```"4"``` | 5 | 11.00000 | [_thirty-seconds_](/content/appendices/price_formats?id=tick-notation-in-thirty-seconds) | 32 | ```0`31``` |
| ```"5"``` | 6 | 11.000000 | [_halves of thirty-seconds_](/content/appendices/price_formats?id=tick-notation-in-halves-of-thirty-seconds) | 64 | ```0`315``` |
| ```"6"``` | 7 | 11.0000000 | [_quarters of thirty-seconds_](/content/appendices/price_formats?id=tick-notation-in-quarters-of-thirty-seconds) | 128 | ```0`317``` |
| ```"7"``` | 8 | 11.00000000 | _eighths of thirty-seconds_ | 256 | ```0`318``` |
| ```"8"``` | 0 | 11 | n/a | -- | -- |
| ```"9"``` | 1 | 11.0 | n/a | -- | -- |
| ```"A"``` | 2 | 11.00 | n/a | -- | -- |
| ```"B"``` | 3 | 11.000 | n/a | -- | -- |
| ```"C"``` | 4 | 11.0000 | n/a | -- | -- |
| ```"D"``` | 5 | 11.00000 | n/a | -- | -- |
| ```"E"``` | 6 | 11.000000 | n/a | -- | -- |
| ```"F"``` | 7 | 11.0000000 | n/a | -- | -- |

In the SDK, refer to the [```UnitCode```](/content/sdk/lib-utilities-data?id=unitcode) enumeration. However, the [```Profile.unitCode```](/content/sdk/lib-marketstate?id=profileunitcode) property is a single character string.

#### Base Codes (Alternative to Unit Codes)

A parallel concept called a  "base code" exists. A "base code" is a number; whereas a "unit code" is a single character string. These terms are often used interchangeably. Here is the mapping:

| Unit Code (```String```) | Base Code (```Number```) |
|:---:|:---:|
| ```"2"``` | ```-1``` |
| ```"3"``` | ```-2``` |
| ```"4"``` | ```-3``` |
| ```"5"``` | ```-4``` |
| ```"6"``` | ```-5``` |
| ```"7"``` | ```-6``` |
| ```"8"``` | ```0``` |
| ```"9"``` | ```1``` |
| ```"A"``` | ```2``` |
| ```"B"``` | ```3``` |
| ```"C"``` | ```4``` |
| ```"D"``` | ```5``` |
| ```"E"``` | ```6``` |
| ```"F"``` | ```7``` |

## Formatting Functions

In order to generate a price-formatted string, two pieces of information are required:

* The numeric value of the price to be formatted (e.g. ```15.5```)
* The formatting rules applicable to the instrument, in the form of a unit code (e.g. ```A``` or ```2```)

> See the [previous section](/content/appendices/price_formats?id=unit-codes) for a discussion of unit codes.

#### Using Profiles

Since a [```Profile```](/content/concepts/data_structures?id=profiles) instance encapsulates metadata regarding an instrument, it includes the instrument's unit code. Consequently, we can pass a numeric price value to the [```Profile.formatPrice```](/content/sdk/lib-marketstate?id=profileformatprice) function, and expect the correct formatting rules to be applied.

Here, we use the [```Profile```](/content/concepts/data_structures?id=profiles) for ```AAPL``` to format a fictitious price of ```123.5```: 

```javascript
const symbol = 'AAPL';

connection.getMarketState().getProfile(symbol)
	.then((p) => {
		const formatted = profile.formatPrice(123.5);

		console.log(`The price of [ ${p.name} ] is [ ${formatted} ] because [ ${p.symbol} ] uses unit code [ ${p.unitCode} ]`);
	});
```

The output would be:

```text
The price of [ Apple Inc ] is [ 123.50 ] because [ AAPL ] uses unit code [ A ]
```

If we substituted different symbols — for example  ```ZCK2```, ```ZNM2```, and```^USDCAD```  — we'd see the following output:

```text
The price of [ Corn ] is [ 123-4 ] because [ ZCK2 ] uses unit code [ 2 ]
The price of [ 10-Year T-Note ] is [ 123-160 ] because [ ZNM2 ] uses unit code [ 5 ]
The price of [ U.S. Dollar/Canadian Dollar ] is [ 123.50000 ] because [ ^USDCAD ] uses unit code [ D ]
```

#### Overriding Unit Code Rules

In some rare cases, it might be desirable to override the rules stored within the [```UnitCode```](/content/sdk/lib-utilities-data?id=unitcode) enumeration. To do this, implement your own [```CustomPriceFormatterCallback```](/content/sdk/lib-marketstate?id=callbackscustompriceformattercallback) function and pass it to the [```Profile.setPriceFormatterCustom```](/content/sdk/lib-marketstate?id=profilesetpriceformattercustom) function.

Your custom [```CustomPriceFormatterCallback```](/content/sdk/lib-marketstate?id=callbackscustompriceformattercallback) will be used in place of the default logic when [```Profile.formatPrice```](/content/sdk/lib-marketstate?id=profileformatprice) is called. [```CustomPriceFormatterCallback```](/content/sdk/lib-marketstate?id=callbackscustompriceformattercallback) takes accepts three arguments and returns a string:

1. The ```price``` to format — as a number.
2. The ```unitCode``` which would normally be used — as a string.
3. The ```profile``` of the instrument being formatted — an instance of the [```Profile```](/content/sdk/lib-marketstate?id=profile) class.

In some rare cases, an instrument's unit code may not correspond with the desired rules formatting rules and the use of a custom formatter becomes necessary. Consider this case:

#### Using Pure Functions

In some cases, a [```Profile```](/content/concepts/data_structures?id=profiles) instance might not be available. In these cases, raw price formatting functions can be found here:

* [```lib/utilities/format/decimal```](/content/sdk/lib-utilities-format?id=functionsformatdecimal)
* [```lib/utilities/format/fraction```](/content/sdk/lib-utilities-format?id=functionsformatfraction)

However, the rules for formatting (e.g. number of discrete ticks or number of tick digits to show) must be supplied as arguments to these functions.

Here is an example of decimal formatting:

```javascript
const formatDecimal = require('@barchart/marketdata-api-js/lib/utilities/format/decimal');

const price = 123.5;
const decimals = 3;

const formatted = formatDecimal(price, decimals);

console.log(`Formatted [ ${price} ] as [ ${formatted} ] using [ ${decimals} ] decimal place(s)`);
```

output:

```text
Formatted [ 123.5 ] as [ 123.500 ] using [ 3 ] decimal place(s)
```

Here is an example of tick notation:

```javascript
const formatTick = require('@barchart/marketdata-api-js/lib/utilities/format/fraction');

const price = 123.5;
const tickFactor = 16;
const tickDigits = 2;
const tickSeparator = '`';

const formatted = formatTick(price, tickFactor, tickDigits, tickSeparator);

console.log(`Formatted [ ${price} ] as [ ${formatted} ] using [ ${tickFactor} ] discrete tick(s), showing [ ${tickDigits} ] digits`);
```

output:

```text
Formatted [ 123.5 ] as [ 123`08 ] using [ 16 ] discrete tick(s), showing [ 2 ] digits
```

