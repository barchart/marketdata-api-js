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

### Tick Notation (Method 1)

Tick notation (method 1) combines the whole number potion of a value with its fractional numerator, separating the components with a backtick (or a single quote or a dash). The fraction's numerator is displayed; however, the fraction's denominator is not displayed. Instead, the fraction's denominator is implied. 

For example, we could represent the decimal value of `15.50` using tick notation (method 1) in different, but equivalent, ways, depending on the denominator:

* tick notation in _eighths_ would be ```15`4``` — where a denominator of ```8``` in the fraction ```4/8``` is implied, and
* tick notation in _sixteenths_ would be ```15`8``` — where a denominator of ```16``` in the fraction ```8/16``` is implied, and
* tick notation in _thirty-seconds_ would be ```15`16``` — where a denominator of ```32``` in the fraction ```16/32``` is implied, etc.

All of these cases, the implied denominator represents the number of discreet steps — or _ticks_ — in pricing that exist between two consecutive whole numbers. 

**Tick Notation (method 1) in Eighths**

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

**Tick Notation (method 1) in Sixteenths**

Similarly, when pricing in _sixteenths_, there are sixteen discrete prices between eleven and twelve:

| Tick Notation | Integer Value | Tick | Fraction Numerator | Fraction Denominator (implied) | Decimal Calculation |
|---|---:|---:|---:|---:|---:|
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

> For _sixteenths_, notice the tick uses two digits, including a leading zero, when appropriate. For, _eighths_, only one tick digit was required.

In the previous examples, the tick values were sequential. For _eighths_ the sequence was:

```{ 0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, ... }```

For _sixteenths_ the sequence was:

```{ 00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 00, 01, 02, ... }```

However, ticks are not always sequential. This is because there is a second method to derive tick values.

### Tick Notation (Method 2)

Tick notation (method 2) allows a tick to be further subdivided. This method is best described by example.

Consider sixty-four discrete price points within a whole number. Using method 1:

* The decimal value of `0.015625` is equivalent to the fraction 1/64, where the tick would be `01`,
* The decimal value of `0.031250` is equivalent to the fraction 2/64, where the tick would be `02`,
* The decimal value of `0.046875` is equivalent to the fraction 3/64, where the tick would be `03`, ...
* The decimal value of `0.968750` is equivalent to the fraction 62/64, where the tick would be `62`, 
* The decimal value of `0.984375` is equivalent to the fraction 63/64, where the tick would be `63`

Alternately, using method 2, we could divide sixty-four discrete price points into thirty seconds _and_ halves of thirty-seconds, as follows:

* A decimal value of `0.015625` is equivalent to 0/32 + 1/2 of 1/32,
* A decimal value of `0.031250` is equivalent to 1/32 + 0/2 of 1/32,
* A decimal value of `0.046875` is equivalent to 1/32 + 1/2 of 1/32, ...
* A decimal value of `0.968750` is equivalent to 31/32 + 0/2 of 1/32,
* A decimal value of `0.984375` is equivalent to 31/32 + 1/2 of 1/32

When we subdivide a tick, we represent the numerator of the fraction as a decimal value. Again, using _halves_ of _thirty-seconds_, we could represent the same values as follows:

* A decimal value of `0.015625` is equivalent to 0.5/32,
* A decimal value of `0.031250` is equivalent to 1.0/32
* A decimal value of `0.046875` is equivalent to 1.5/32, ...
* A decimal value of `0.968750` is equivalent to 31.0/32,
* A decimal value of `0.984375` is equivalent to 31.5/32

Using method 2, we take the _decimal_ formatted numerator and display its digits as follows:

**Tick Notation (method 2) in Halves of Thirty-Seconds**









### Supported Tick Notations

In actual practice, there are seven common tick notation schemes:


## Unit Codes

## Formatting Functions

Obviously, ambiguity is introduced because the denominator is not shown. It is impossible to know whether ```15`2``` represents the decimal value of ```15.50``` or ```15.25``` without also knowing the implied context — quarters or eighths. How is this ambiguity resolved?  When a price is quoted using tick notation, the asset being quoted dictates the context. For example, corn futures are always priced in eighths.

> To derive a decimal value from tick notation, you must know the asset being quoted (e.g. corn, soybeans, etc).






