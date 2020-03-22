## Overview

### Start/Stop

The ```Connection.on``` function is used to establish new subscriptions. Conversely, the ```Connection.off``` function is used to stop existing subscriptions.

The ```Connection.on``` requires a subscription type, a callback, and in some cases, and a symbol (sometimes). Here is the function's signature:

	connection.on(subscriptionType, handler, [symbol]);

The function signature for ```Connection.off``` is the same. It requires that you store and pass the *same* function reference used to establish the original subscription. Here is the function's signature:

	connection.off(subscriptionType, handler, [symbol]);

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

Every subscription requires a callback -- a function the SDK invokes each time new data is available. When you start a start a subscription, you must supply a callback. When you stop the subscription, you must supply the *same* callback.

### Symbols

For market data subscriptions, you must supply a symbol. A symbol is a ```String``` which references an instrument. For example, AAPL is the symbol for Apple's common stock.

The symbol for Apple common stock is widely accepted. However, in some cases, symbols are not universal. In these cases, Barchart defines their own *symbology*; here are some examples:

* Forex - Begins with a caret (e.g. ^EURUSD)
* Indices - Begins with a dollar sign (e.g. $SPX -- the S&P 500)

## Subscriptions

### Timestamp

The *timestamp* subscription is the simple. The callback should accept a ```Date``` argument, as follows:

	const timestampHandler = (date) => {
		console.log(`Server time is ${date.getHours()}:${date.getMinutes()}`);
	};

	connection.on(SubscriptionType.Timestamp, timestampHandler);

Remember, you need to pass a reference to the *same* event handler to successfully unsubscribe:

	connection.off(SubscriptionType.Timestamp, timestampHandler);

### SDK Events

The *events* subscription provides information about the state of the connection.



### Level I Market Data

### Level II Market Data

### Cumulative Volume

