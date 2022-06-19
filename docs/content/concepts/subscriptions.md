## Basics

Once you've connected, you're ready to subscribe to market data.

### Start/Stop

The [```Connection.on```](/content/sdk/lib-connection?id=connectionon) function is used to establish new subscriptions. Conversely, the [```Connection.off```](/content/sdk/lib-connection?id=connectionoff) function is used to stop existing subscriptions.

The [```Connection.on```](/content/sdk/lib-connection?id=connectionon) function requires a *subscription type*, a *callback*, and in some cases, and a *symbol*. Here's the function signature:

```javascript
connection.on(subscriptionType, handler, symbol);
```

The signature for [```Connection.off```](/content/sdk/lib-connection?id=connectionoff) is identical. The *callback* parameter must be a reference to the **same** function which was originally passed to the [```Connection.on```](/content/sdk/lib-connection?id=connectionon) function. Here's the signature:

```javascript
connection.off(subscriptionType, handler, symbol);
```

### Subscription Types

A subscription type is a ```String``` value. The possible values are enumerated in the [```lib/connection/SubscriptionType```](/content/sdk/lib-connection?id=enumssubscriptiontype) object. There are five types of subscription, grouped into two categories:

* **Metadata**
  * [Heartbeat](#heartbeat) - Current time on Barchart's network
  * [System Events](#system-status) - Network and system related notifications (e.g. login success)
* **Market Data**
  * [Level I](#level-i-market-data) - Latest trades, best prices
  * [Level II](#level-ii-market-data) - Order book with aggregate sizes
  * [Cumulative Volume](#cumulative-volume) - Volume traded at every price level

Metadata subscriptions *do not* require a symbol to be provided. Market data subscriptions *do*.

### Callbacks

Every subscription requires a callback -- a function the SDK invokes each time new data is available. When you start a start a subscription, you must supply a callback. When you stop the subscription, you must supply the *same* callback.

### Symbols

For market data subscriptions, you must supply a symbol. A symbol is a ```String``` used to reference to a unique instrument. For example, ```"AAPL"``` is the symbol for Apple's common stock.

Apple's stock symbol is widely accepted. However, in some cases, symbols are not universal. In these cases, Barchart defines their own *symbology*; here are some examples:

* Forex - Begins with a caret (e.g. ```"^EURUSD"``` — Euro/US Dollar)
* Indices - Begins with a dollar sign (e.g. ```"$SPX"``` — S&P 500)

## Heartbeat

The [```SubscriptionType.Timestamp```](/content/sdk/lib-connection?id=enumssubscriptiontype) — or ```"timestamp"``` — subscription is the simple. The server sends its timestamp every second.

#### Callback

The callback expects a ```Date``` argument. See [```Callbacks.TimestampCallback```](/content/sdk/lib-connection?id=callbackstimestampcallback) for a formal description of the callback.

#### Example

```javascript
const timestampHandler = (event) => {
	console.log(`Server time is ${event.getHours()}:${event.getMinutes()}`);
};

connection.on(SubscriptionType.Timestamp, timestampHandler);
```

Remember, the *same* event handler must be used to unsubscribe:

```javascript
connection.off(SubscriptionType.Timestamp, timestampHandler);
```

## System Status

The [```SubscriptionType.Events```](/content/sdk/lib-connection?id=enumssubscriptiontype) — or ```"events"``` — subscription notifies you when the status of your ```Connection``` changes.

#### Callback

The callback should expect a JavaScript ```Object``` with a single ```String``` property, as follows:

```javascript
{
	event: 'login success'
}
```

See [```lib/connection/ConnectionEventType```](/content/sdk/lib-connection?id=enumsconnectioneventtype) for a listing of possible values for the *event* property and [```Callbacks.EventsCallback```](/content/sdk/lib-connection?id=callbackseventscallback) for a formal description of the callback.

#### Example

```javascript
const eventsHandler = (event) => {
	console.log(event.event);
};

connection.on(SubscriptionType.Events, eventsHandler);
```

Unsubscribe as follows:

```javascript
connection.off(SubscriptionType.Events, eventsHandler);
```

## Level I Market Data

A [```SubscriptionType.MarketUpdate```](/content/sdk/lib-connection?id=enumssubscriptiontype) — or ```"marketUpdate"``` — subscription notifies you of market-related events as they occur (e.g. trade, top of book changed, etc).

#### Availability

Level I market data is available for all symbols.

#### Callback

The callback receives an ```Object``` representing a market update event. Here an example *trade* event:

```javascript
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
	time: '2020-03-25T20:27:12.990Z'
}
```

See [```Callbacks.MarketUpdateCallback```](/content/sdk/lib-connection?id=callbacksmarketupdatecallback) for a formal description of the callback.

#### State Tracking

In addition to providing your callback with market updates, the SDK independently maintains state for each symbol using instances of the [```lib/marketState/Quote```](/content/sdk/lib-marketstate?id=quote) class. The SDK followed these steps:

1. Level I market data event is received from server.
2. Level I market data event is parsed, producing a market update ```Object```.
3. The appropriate [```Quote```](/content/sdk/lib-marketstate?id=quote) instance is updated, based on the market update ```Object```.
4. Your callback is invoked and passed the market update ```Object``` (from step 2).

#### Examples

Here are two strategies for processing callback notifications:

1. Process the market update ```Object``` (maintaining your own state), or
2. Query the [```Quote```](/content/sdk/lib-marketstate?id=quote) instance (relying on the SDK to maintain state).

```javascript
const handleUsingEvent = (event) => {
	if (event.type === 'TRADE') {
		console.log(`${event.symbol} just traded for ${event.tradePrice}`);
	}
};

const handleUsingQuote = (event) => {
	const quote = connection.getMarketState().getQuote(event.symbol);

	console.log(`${quote.symbol} recently traded for ${quote.tradePrice}`;
};

connection.on(SubscriptionType.MarketUpdate, 'AAPL', handleUsingEvent);
connection.on(SubscriptionType.MarketUpdate, 'AAPL', handleUsingQuote);
```

As before, unsubscribe using the original callback references:

```javascript
connection.off(SubscriptionType.MarketUpdate, 'AAPL', handleUsingEvent);
connection.off(SubscriptionType.MarketUpdate, 'AAPL', handleUsingQuote);
```

## Level II Market Data

A [```SubscriptionType.MarketDepth```](/content/sdk/lib-connection?id=enumssubscriptiontype) — or ```"marketDepth"``` — subscription gives you a snapshot of the order book, aggregated by price level.

#### Availability

Level II market data is available for futures contracts.

#### Callback

The callback receives an ```Object``` with:

* An ordered ```Array``` of [```MarketDepthLevel```](/content/sdk/lib-connection?id=schemamarketdepthlevel) objects called *bids*, and
* An ordered ```Array``` of [```MarketDepthLevel```](/content/sdk/lib-connection?id=schemamarketdepthlevel) objects called *asks*.

```javascript
	{
		bids: [ ],
		asks: [ ]
	}
```

Each [```MarketDepthLevel```](/content/sdk/lib-connection?id=schemamarketdepthlevel) has a *price* and a *size* property, as follows:

```javascript
	{
		price: 255.17,
		size: 1200
	}
```

See [```Callbacks.MarketDepthCallback```](/content/sdk/lib-connection?id=callbacksmarketdepthcallback) for a formal description of the callback.

#### Examples

```javascript
const handleMarketDepth = (event) => {
	event.asks.forEach((level) => {
		console.log(`${level.size} unit(s) are available at ${level.price}`);
	});

	event.bids.forEach((level) => {
		console.log(`${level.size} unit(s) are wanted at ${level.price}`);
	});
};

connection.on(SubscriptionType.MarketDepth, handleMarketDepth, 'ESM0');
```

Unsubscribe as follows:

```javascript
connection.off(SubscriptionType.MarketDepth, handleMarketDepth, 'ESM0');
```

## Cumulative Volume

A [```SubscriptionType.CumulativeVolume```](/content/sdk/lib-connection?id=enumssubscriptiontype) — or ```"cumulativeVolume"``` — subscription reports the total volume traded, at each price level, for the current trading session.

#### Availability

Cumulative market volume data is only available for futures contracts.

#### Callback

The callback receives an ```Object``` with several notable properties:

The **event** property is a ```String``` having one of two possible values:

  * *update* - Indicates the volume at one price level has changed (or a new price level has been added).
  * *reset* - Indicates the entire structure has been cleared, leaving no price levels.

The **price** property is a ```Number``` indicating the price level which changed. This property does not exist for *reset* events.

The **volume** property is a ```Number``` indicating the current aggregate volume at the given **price** level.  This property does not exist for *reset* events.

The **container** property is an instance of the [```lib/marketState/CumulativeVolume```](/content/sdk/lib-marketstate?id=cumulativevolume) class. It tracks the current volume traded for all price levels.

See [```Callbacks.CumulativeVolumeCallback```](/content/sdk/lib-connection?id=callbackscumulativevolumecallback) for a formal description of the callback.

#### Examples

```javascript
const handleCumulativeVolume = (event) => {
	if (event.event === 'update') {
		console.log(`Volume at ${event.price} increased to ${event.volume} for ${event.container.symbol}`;
	} else if (event.event === 'reset') {
		console.log(`Volume statistics for ${event.container.symbol} has been cleared`;
	}
};

connection.on(SubscriptionType.CumulativeVolume, handleCumulativeVolume, 'ESM0');
```

Unsubscribe as follows:

```javascript
connection.off(SubscriptionType.CumulativeVolume, handleCumulativeVolume, 'ESM0');
```