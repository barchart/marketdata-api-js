## Overview

### Start/Stop

The ```Connection.on``` function is used to establish a new subscription(s). The ```Connection.off``` function is used to stop existing subscriptions.

The ```Connection.on``` requires an subscription type, a callback, and in some cases, and a symbol (sometimes), having the following signature:

	connection.on(subscriptionType, handler, symbol);

### Subscription Types

Subscription types are passed as ```String``` values. These values are enumerated in the ```lib/connection/SubscriptionType``` object. There are five types of subscription, grouped into two categories:

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

The symbol for Apple common stock is widely accepted. However, in some cases, symbols are less widely accepted. In these cases, Barchart defines their own *symbology*; here are some examples:

* Forex - Begins with a caret (e.g. ^EURUSD)
* Indicies - Begins with a dollar sign (e.g. $SPX for the S&P 500)

Consult Barc≠ for more information regarding symbols.

## Subscription Types

### Timestamp

### SDK Events

### Level I Market Data

### Level II Market Data

### Cumulative Volume

