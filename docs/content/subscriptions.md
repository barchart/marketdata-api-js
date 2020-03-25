## Fundamentals

### Start/Stop

The ```Connection.on``` function is used to establish new subscriptions. Conversely, the ```Connection.off``` function is used to stop existing subscriptions.

The ```Connection.on``` requires a subscription type, a callback, and in some cases, and a symbol (sometimes). Here is the function's signature:

```js
connection.on(subscriptionType, handler, symbol);
```

The function signature for ```Connection.off``` is the same. It requires that you store and pass the *same* function reference used to establish the original subscription. Here is the function's signature:

```js
connection.off(subscriptionType, handler, symbol);
```

### Subscription Types

A subscription type is a ```String``` value. The possible values are enumerated in the ```lib/connection/SubscriptionType``` object. There are five types of subscription, grouped into two categories:

* **Metadata**
  * *timestamp* - Current time on Barchart's network
  * *events* - Network and system related notifications (e.g. login success)
* **Market Data**
  * *marketUpdate* - Level I market data (e.g. latest trades, best prices)
  * *marketDepth* - Level II market data (e.g. the order book)
  * *cumulativeVolume* - Daily summation of quantity traded at every price level

Metadata subscriptions *do not* require a symbol to be provided. Market data subscriptions *do*.

### Callbacks

Every subscription requires a callback -- a function the SDK invokes each time new data is available. When you start a start a subscription, you must supply a callback. Again, when you stop the subscription, you must supply the *same* callback.

### Symbols

For market data subscriptions, you must supply a symbol. A symbol is a ```String``` which references an instrument. For example, AAPL is the symbol for Apple's common stock.

The symbol for Apple common stock is widely accepted. However, in some cases, symbols are not universal. In these cases, Barchart defines their own *symbology*; here are some examples:

* Forex - Begins with a caret (e.g. ^EURUSD)
* Indices - Begins with a dollar sign (e.g. $SPX -- the S&P 500)

## Heartbeat

The ```SubscriptionType.Timestamp``` subscription is the simple.

#### Callback

The callback should expect a ```Date``` argument.

#### Example

```js
const timestampHandler = (date) => {
	console.log(`Server time is ${date.getHours()}:${date.getMinutes()}`);
};

connection.on(SubscriptionType.Timestamp, timestampHandler);
```

Remember, the *same* event handler must be used to unsubscribe:

```js
connection.off(SubscriptionType.Timestamp, timestampHandler);
```

## System Status

The ```SubscriptionType.Events``` subscription notifies you when the state of your ```Connection``` changes.

#### Callback

The callback should expect a JavaScript ```Object``` with a single ```String``` property, as follows:

```js
{
	event: 'login success'
}
```

Possible ```String``` values of the ```event``` property are:

* *login success* - Generated after calling ```Connection.connect```, remote server accepted credentials
* *login fail* - Generated after calling ```Connection.connect```, remote server rejected credentials
* *disconnecting* - Generated after calling ```Connection.disconnect```
* *disconnect* - Generated after loss of connection -- whether intentional or not
* *feed paused* - Generated after calling ```Connection.pause```
* *feed resumed* - Generated after calling ```Connection.resume```

#### Example

```js
const eventsHandler = (data) => {
	console.log(data.event);
};

connection.on(SubscriptionType.Events, eventsHandler);
```

Unsubscribe as follows:

```js
connection.off(SubscriptionType.Events, eventsHandler);
```

## Level I Market Data

A ```SubscriptionType.MarketUpdate``` subscription gives you market events as they occur (e.g. trade, top of book changed, etc).

#### Callback

The callback receives an ```Object``` representing a market event. See the [Data Structures Section](/content/data_structures?id=market-updates) for a complete schema.

Regardless, here is an sample market update for a *trade* event:

```js
{ 
	message: '\u00012AAPL,7\u0002AQ1525517,100,O@\u0003\u0014TCYO[LÞ\u0003\n',
	type: 'TRADE',
	record: '2',
	symbol: 'AAPL',
	subrecord: '7',
	unitcode: 'A',
	exchange: 'Q',
	delay: 15,
	tradePrice: 255.17,
	tradeSize: 100,
	day: 'O',
	session: '@',
	time: 2020-03-25T20:27:12.990Z
}
```

In addition to providing your callback with market updates, the SDK independently maintains state for each symbol using instances of the ```lib/marketState/Quote``` class. These steps are followed when processing Level I market data:

1. Market data event is received from server.
2. Market data event is parsed, producing a market update ```Object```.
3. Appropriate ```Quote``` instance is updated, based on the market update ```Object```.
4. Your callback is invoked and passed the market update ```Object``` (from step 2).

#### Examples

Here are two strategies for processing callback notifications:

1. Process the market update ```Object``` (maintaining your own state), or
2. Query the ```Quote``` instance (relying on the SDK to maintain state).

```js
const handleUsingEvent = (data) => {
	if (data.type === 'TRADE') {
		console.log(`${data.symbol} just traded for ${data.tradePrice}`);
	}
};

const handleUsingQuote = (data) => {
	if (data.symbol) {
		const quote = connection.getMarketState().getQuote(data.symbol);

		console.log(`${quote.symbol} recently traded for ${quote.tradePrice}`;
	}
};

connection.on(SubscriptionType.MarketUpdate, 'AAPL', handleUsingEvent);
connection.on(SubscriptionType.MarketUpdate, 'AAPL', handleUsingQuote);
```

As before, unsubscribe using the original callback references:

```js
connection.off(SubscriptionType.MarketUpdate, 'AAPL', handleUsingEvent);
connection.off(SubscriptionType.MarketUpdate, 'AAPL', handleUsingQuote);
```

## Level II Market Data

A ```SubscriptionType.MarketDepth``` subscription gives you a snapshot of the aggregated order book, each time the book changes.

#### Callback

The callback receives an ```Object``` with:

* a property called *bids* which is an ordered ```Array``` of ```BookPriceLevel``` objects, and
* a property called *asks* which is an ordered ```Array``` of ```BookPriceLevel``` objects.

Each ```BookPriceLevel``` has a *price* and a *size* property, as follows:

```js
	{
		price: 255.17,
		size: 1200
	}
```

The SDK does not attempt to maintain book state and each time your callback is invoked, a completely new ```Object``` is passed.

#### Examples

```js
const handleMarketDepth = (book) => {
	book.asks.forEach((level) => {
		console.log(`${level.size} unit(s) are available at ${level.price}`);
	});

	book.bids.forEach((level) => {
		console.log(`${level.size} unit(s) are wanted at ${level.price}`);
	});
};

connection.on(SubscriptionType.MarketDepth, handleMarketDepth, 'ESM0');
```

Unsubscribe as follows:

```js
connection.off(SubscriptionType.MarketDepth, handleMarketDepth, 'ESM0');
```

## Cumulative Volume

#### Callback

#### Examples