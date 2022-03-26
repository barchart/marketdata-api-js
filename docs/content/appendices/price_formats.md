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

The same is true for [`Quote`](/content/sdk/lib-marketstate?id=quote) quote class.

> Recall the Quote class is used to track the current state of an instrument. It mutates to reflect new information as market data messages are received. Read more in the [Key Concepts: Data Structures](/content/concepts/data_structures?id=quotes).

Many of the properties of a ```Quote``` object are numbers. Here are a few examples:

* [lastPrice](/content/sdk/lib-marketstate?id=quotelastprice)
* [bidPrice](/content/sdk/lib-marketstate?id=quotebidprice)
* [bidSize](/content/sdk/lib-marketstate?id=quotebidsize)

## Decimal Formatting

Generally speaking, we convert numbers for presentation purposes. This is a very common practice. In most cases, we simply restrict the number of decimal places that are shown. Sometimes, special characters, like commas, are used to separate thousands. In other cases, parenthesis may be used to represent negative values.

#### Example

Regardless, let's assume that the last trade price for an instrument was _fifteen dollars the thirty cents_. The ```Quote.lastPrice``` value might be:

* `15.3`
* `15.300000000000004`
* `15.299999999999999`

Regardless of the floating point value, we want to display these values, with two decimal places, as the literal string ```"15.30"```.

#### Formatting Rules

This SDK maintains a set of rules to determine the generally accepted method of formatting prices. 

These rules differ from one asset class to another — a US equity (e.g. [AAPL](https://www.barchart.com/stocks/quotes/AAPL/overview)) is typically displayed with two decimal places and a foreign exchange quote (e.g. [^EURUSD](https://www.barchart.com/forex/quotes/%5EEURUSD/overview)) is typically displayed with five decimal places. See the [Price Formatting: Unit Codes](/content/appendices/price_formats?id=unit-codes) section below for more information.

Furthermore, this SDK also contains a set of functions used to format numbers for presentation, using the aforementioned rules. See the [Price Formatting: Formatting Functions](/content/appendices/price_formats?id=formatting-functions) section below for more information.

## Fractional Formatting

In some cases, it is customary to represent the decimal component of a price as a fraction. For example, we could use halves, quarters, or eighths; as follows:

* the decimal value of ```15.50``` could be represented as ```15 1/2``` or
* the decimal value of ```15.50``` could be represented as ```15 2/4``` or
* the decimal value of ```15.50``` could be represented as ```15 4/8```

#### Tick Notation

Using tick notation, the fraction's numerator is displayed; however, the fraction's denominator is not displayed. Instead, the fraction's denominator is implied. Tick notation is combines an integer with a fractional numerator, separating the components with a tick (or a dash). 

Using tick notation, we could represent the decimal value of `15.50` in different, but equivalent, ways:

* tick notation in _halves_ would be ```15`1``` — the denominator of ```2``` is implied, and
* tick notation in _quarters_ would be ```15`2``` — the denominator of ```4``` is implied, and
* tick notation in _eighths_ would be ```15`4``` — the denominator of ```8``` is implied

Obviously, ambiguity is introduced because the denominator is not shown. It is impossible to know whether ```15`2``` represents the decimal value of ```15.50``` or ```15.25``` without also knowing the implied context — quarters or eighths. How is this ambiguity resolved?  When a price is quoted using tick notation, the asset being quoted dictates the context. For example, corn futures are always priced in eighths.

> To derive a decimal value from tick notation, you must know the asset being quoted (e.g. corn, soybeans, etc).

## Unit Codes

## Formatting Functions






