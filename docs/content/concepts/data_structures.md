## Fundamentals

As you establish subscriptions, market data begins streaming. The SDK processes the stream and builds an in-memory cache of state. This in-memory cache consists of:

* [Profiles](#profiles) are general descriptions of symbols.
* [Quotes](#quotes) track Level I market data subscriptions.
* [Books](#books) track Level II market data subscriptions.
* [Cumulative Volume Containers](#cumulative-volume) track the cumulative volume subscription.

#### Accessing State

The [```lib/marketState/MarketState```](/content/sdk/lib-marketstate?id=marketstate) is the repository for state. The SDK maintains a single instance which can be accessed from the ```Connection``` instance, as follows:

```js
const state = connection.getMarketState();
```

## Profiles

A [```lib/marketState/Profile```](/content/sdk/lib-marketstate?id=profile) defines an instrument and has properties like *name*, *exchange*, etc. A ```Profile``` tells us how to format prices for the instrument. A ```Profile``` tells us the expiration date for some instruments (e.g. futures contracts).

You can access a ```Profile``` as follows:

```js
connection.getMarketState().getProfile('AAPL')
	.then((profile) => {
		console.log(JSON.stringify(profile, null, 2));
	});
```

Notice ```MarketState.getProfile``` returns asynchronously -- this allows the SDK to download information that hasn't already been cached.  No market data subscription is required.

**Note**: Additional out-of-band data will be downloaded if you invoke ```Connection.setExtendedProfileMode``` passing a ```true``` value immediately after your ```Connection``` has been instantiated.

## Quotes

After the server acknowledges a ```SubscriptionType.MarketUpdate``` subscription, a [```lib/marketState/Quote```](/content/sdk/lib-marketstate?id=marketstate) instance is created. With each new message received, the ```Quote``` instance is updated.

The ```Quote``` contains the following types of information:

* Last trade price
* Last trade size
* Last trade time
* Total volume for the current session
* More ...

You can access a ```Quote``` as follows:

```js
const quote = connection.getMarketState().getQuote('AAPL');

if (quote) {
	console.log(JSON.stringify(quote, null, 2);
} else {
	console.log('A "marketUpdate" subscription has not established, or the server has not yet responded');
}
```

## Books

After the server acknowledges a ```SubscriptionType.MarketDepth``` subscription, an anonymous ```Object``` conforming to the [```Schema.Book```](content/sdk/lib-marketstate?id=schemabook) contract is stored. The ```Book``` is updated as new messages are received from the server.

You can access a ```Book``` as follows:

```js
const quote = connection.getMarketState().getBook('ESM0');

if (quote) {
	console.log(JSON.stringify(quote, null, 2);
} else {
	console.log('A "marketUpdate" subscription has not established, or the server has not yet responded');
}

```

## Cumulative Volume

After a ```SubscriptionType.CumulativeVolume``` subscription is established and the SDK receives data from the server, a [```/lib/marketState/CumulativeVolume```](/content/sdk/lib-marketstate?id=cumulativevolume) instance is created.

You can access a ```CumulativeVolume``` instance as follows:

```js
connection.getMarketState().getCumulativeVolume('AAPL')
	.then((profile) => {
		console.log(JSON.stringify(profile, null, 2));
	});
```

Notice ```MarketState.getCumulativeVolume``` returns asynchronously. If you have recently subscribed, response will wait until the SDK receives data from the server.