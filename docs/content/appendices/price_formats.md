## Numeric Values

**All numbers received and stored by SDK use the double-precision floating point [primitive](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)** which is native to JavaScript. 

Many of the properties of the event `Object` passed to the [MarketUpdateCallback](/content/sdk/lib-connection?id=callbacksmarketupdatecallback) are numbers. For example, look at the `tradePrice` and `tradeSize` property values in the following example:

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

The same is true for [`Quote`](/content/sdk/lib-marketstate?id=quote) class.

> Recall the Quote class is used to track the current state of an instrument. It mutates to reflect new information as market data messages are received. Read more in the [Key Concepts: Data Structures](/content/concepts/data_structures?id=quotes).

Many instance properties of a ```Quote``` class are numbers. Here are a few examples:

* [lastPrice](/content/sdk/lib-marketstate?id=quotelastprice)
* [bidPrice](/content/sdk/lib-marketstate?id=quotebidprice)
* [bidSize](/content/sdk/lib-marketstate?id=quotebidsize)

## Decimal Formatting

Generally speaking, we convert numbers for presentation purposes. This is a very common practice. In most cases, we simply restrict the number of decimal places that are shown. Sometimes, special characters, like commas, are used to separate thousands. In other cases, parenthesis may be used to represent negative values.

### Decimal Formatting Basics

Regardless, let's assume that the last price for an instrument was _fifteen dollars the fifty cents_. In theory, the numeric value of the ```Quote.lastPrice``` property could be:

* `15.5`
* `15.500000000000004`
* `15.499999999999999`

Regardless of the floating point value, we want to display these values, with two decimal places, as the literal string ```"15.50"```.

### Decimal Formatting Rules

This SDK maintains a set of rules to determine the generally accepted method of formatting prices. 

These rules differ from one asset class to another — a US equity (e.g. [AAPL](https://www.barchart.com/stocks/quotes/AAPL/overview)) is typically displayed with two decimal places and a foreign exchange quote (e.g. [^EURUSD](https://www.barchart.com/forex/quotes/%5EEURUSD/overview)) is typically displayed with five decimal places. See the [Price Formatting: Unit Codes](/content/appendices/price_formats?id=unit-codes) section below for more information.

Furthermore, this SDK also contains a set of functions used to format numbers for presentation, using the aforementioned rules. See the [Price Formatting: Formatting Functions](/content/appendices/price_formats?id=formatting-functions) section below for more information.

## Fractional Formatting

In some cases, it is customary to represent the decimal component of a price as a fraction. Here are three different — and equivalent —  we could represent a decimal value:

* the decimal value of ```15.50``` could be represented as ```15 and 4/8``` or
* the decimal value of ```15.50``` could be represented as ```15 and 8/16``` or
* the decimal value of ```15.50``` could be represented as ```15 and 16/32```

With that said, most fractional prices are formatted using _tick notation_ instead of actual fractions.

### Tick Notation (Basics)

Tick notation combines the whole number potion of a value with its fractional numerator, separating the components with a backtick (or a single quote or a dash). The fraction's numerator is displayed; however, the fraction's denominator is not displayed. _Instead, the fraction's denominator is implied._

For example, we could represent the decimal value of `15.50` using tick notation in different, but equivalent, ways, depending on the denominator:

* tick notation in _eighths_ would be ```15`4``` — where a denominator of ```8``` in the fraction ```4/8``` is implied, and
* tick notation in _sixteenths_ would be ```15`8``` — where a denominator of ```16``` in the fraction ```8/16``` is implied, and
* tick notation in _thirty-seconds_ would be ```15`16``` — where a denominator of ```32``` in the fraction ```16/32``` is implied, etc.

All of these cases, the implied denominator represents the number of discreet steps — or _ticks_ — in pricing that exist between two consecutive whole numbers. 

**Tick Notation in Eighths**

For example, when pricing in _eighths_, there are eight discrete price points between eleven and twelve:

| Tick Notation | Integer Value | Tick | Fraction Numerator | Fraction Denominator (implied) | Decimal Calculation |
|---:|---:|---:|---:|---:|---:|
| ```11`0``` | ```11``` | ```0``` | 0 | 8 | 11 + (0 / 8) = 11.000 |
| ```11`1``` | ```11``` | ```1``` | 1 | 8 | 11 + (1 / 8) = 11.125 |
| ```11`2``` | ```11``` | ```2``` | 2 | 8 | 11 + (2 / 8) = 11.250 |
| ```11`3``` | ```11``` | ```3``` | 3 | 8 | 11 + (3 / 8) = 11.375 |
| ```11`4``` | ```11``` | ```4``` | 4 | 8 | 11 + (4 / 8) = 11.500 |
| ```11`5``` | ```11``` | ```5``` | 5 | 8 | 11 + (5 / 8) = 11.625 |
| ```11`6``` | ```11``` | ```6``` | 6 | 8 | 11 + (6 / 8) = 11.750 |
| ```11`7``` | ```11``` | ```7``` | 7 | 8 | 11 + (7 / 8) = 11.875 |
| ```12`0``` | ```12``` | ```0``` | 0 | 8 | 12 + (0 / 8) = 12.000 |

**Tick Notation in Sixteenths**

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

> For _sixteenths_, notice the tick value used two digits, including a leading zero, when appropriate. For, _eighths_, only one tick digit was required. This will become important later.

In the previous examples, the tick values were sequential. For _eighths_ the sequence was:

```{ 0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, ... }```

For _sixteenths_ the sequence was:

```{ 00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 00, 01, 02, ... }```

However, ticks are not always sequential.

### Tick Notation (Derivation)

Before continuing, let's examine a question that's been glossed over in the previous examples:

**QUESTION: Given a decimal-formatted price, how do we calculate the tick value?**

1. Determine the fractional value of tick, dividing one by the total number of ticks.
2. Divide the decimal component of the price by the previous result.

For example, assuming a price value of `11.9375`, ticks are calculated as follows:

* In _sixteenths_, the tick value is ```15``` using ```0.9375 / ( 1 / 16) = 15```,
* In _thirty-seconds_, the tick value is ```30``` using ```0.9375 / ( 1 / 32) = 30```,
* In _sixty-fourths_, the tick value is ```60``` using ```0.9375 / ( 1 / 64) = 60```,
* etc ...

Using this equation, here is an abbreviated table showing derivation ticks for _sixty-fourths_:

|  Price | Decimal Component | Tick Formula | Formula Result | Tick | Tick-Formatted Price |
|---:|---:|---:|---:|---:|---:|
| 11.000000 | 0.000000 | 0.000000 / (1 / 64) | 0 | ```00``` | ```11`00``` |
| 11.015625 | 0.015625 | 0.015625 / (1 / 64) | 1 | ```01``` | ```11`01``` |
| 11.031250 | 0.031250 | 0.031250 / (1 / 64) | 2 | ```02``` | ```11`02``` |
| ... | ... | ... |  | ... | ... |
| 11.953125 | 0.953125 | 0.953125 / (1 / 64) | 61 | ```61``` | ```11`61``` |
| 11.968750 | 0.968750 | 0.968750 / (1 / 64) | 62 | ```62``` | ```11`62``` |
| 11.984375 | 0.984375 | 0.984375 / (1 / 64) | 63 | ```63``` | ```11`63``` |

### Tick Notation (Fractions of Fractions)

As mentioned earlier, ticks are not always sequential. This is because we may choose to subdivide a tick.

Consider sixty-four discrete price steps within a whole number. In previous examples sixty-four ticks would be used. However, instead of _sixty-fourths_, it is mathematically equivalent to use _thirty-seconds_ and _halves of thirty-seconds_.

| Sixty-Fourths | Equation (64ths) | Thirty-Seconds | Halves of Thirty-Seconds | Equation (32nds and Halves) |
|:---:|---:|:---:|:---:|---:|
| 1 | 1/64 = 0.015625 | 0 | 1 | 0/32 + (1/2 * 1/32) = 0.015625 |
| 2 | 2/64 = 0.031250 | 1 | 0 | 1/32 + (0/2 * 1/32) = 0.031250 |
| 3 | 3/64 = 0.046875 | 1 | 1 | 2/32 + (1/2 * 1/32) = 0.046875 |
| 4 | 4/64 = 0.062500 | 2 | 0 | 2/32 + (0/2 * 1/32) = 0.062500 |
| 5 | 5/64 = 0.078125 | 2 | 1 | 2/32 + (1/2 * 1/32) = 0.078125 |
| 6 | 6/32 = 0.093750 | 3 | 0 | 3/32 + (0/2 * 1/32) = 0.093750 |
| 7 | ... |  |  | ... |

### Supported Tick Notations

In actual practice, there are seven common tick notation schemes:


## Unit Codes

## Formatting Functions

Obviously, ambiguity is introduced because the denominator is not shown. It is impossible to know whether ```15`2``` represents the decimal value of ```15.50``` or ```15.25``` without also knowing the implied context — quarters or eighths. How is this ambiguity resolved?  When a price is quoted using tick notation, the asset being quoted dictates the context. For example, corn futures are always priced in eighths.

> To derive a decimal value from tick notation, you must know the asset being quoted (e.g. corn, soybeans, etc).






