## Basics

As you establish subscriptions, market data begins streaming. The SDK processes the stream and builds an in-memory cache of state. This in-memory cache consists of:

* [Profiles](#profiles) are general descriptions of symbols.
* [Quotes](#quotes) track Level I market data subscriptions.
* [Books](#books) track Level II market data subscriptions.
* [Cumulative Volume Containers](#cumulative-volume) track the cumulative volume subscription.

#### Accessing State

The [```lib/marketState/MarketState```](/content/sdk/lib-marketstate?id=marketstate) is the repository for state. The SDK maintains a single instance which can be accessed from the [```Connection```](/content/sdk/lib-connection?id=connection) instance, as follows:

```javascript
const state = connection.getMarketState();
```

## Profiles

A [```lib/marketState/Profile```](/content/sdk/lib-marketstate?id=profile) defines an instrument and has properties like *symbol*, *name*, and *exchange*. A [```Profile```](/content/sdk/lib-marketstate?id=profile) tells us how to [format prices](/content/appendices/price_formats?id=formatting-functions) for the instrument. A [```Profile```](/content/sdk/lib-marketstate?id=profile) tells us the expiration date for some instruments (e.g. futures contracts).

You can access a [```Profile```](/content/sdk/lib-marketstate?id=profile) as follows:

```javascript
connection.getMarketState().getProfile('AAPL')
	.then((profile) => {
		console.log(JSON.stringify(profile, null, 2));
	});
```

> Notice [```MarketState.getProfile```](/content/sdk/lib-marketstate?id=marketstategetprofile) returns asynchronously — this allows the SDK to download information that hasn't already been cached.  No market data subscription is required.

> Additional out-of-band data will be downloaded if you invoke [```Connection.setExtendedProfileMode```](/content/sdk/lib-connection?id=connectionsetextendedprofilemode) — passing a ```true``` value — immediately after your [```Connection```](/content/sdk/lib-connection?id=connection) has been instantiated.

## Quotes

After the server acknowledges a [```SubscriptionType.MarketUpdate```](/content/sdk/lib-connection?id=enumssubscriptiontype) subscription, a [```lib/marketState/Quote```](/content/sdk/lib-marketstate?id=quote) instance is created. With each new message received, the [```Quote```](/content/sdk/lib-marketstate?id=quote) instance is updated.

A [```Quote```](/content/sdk/lib-marketstate?id=quote) instance contains the following types of information:

* Last trade price
* Last trade size
* Last trade time
* Total volume for the current session
* More ...

You can access a [```Quote```](/content/sdk/lib-marketstate?id=quote) instance for a symbol, as follows:

```javascript
const quote = connection.getMarketState().getQuote('AAPL');

if (quote) {
	console.log(JSON.stringify(quote, null, 2);
} else {
	console.log('A "marketUpdate" subscription has not established, or the server has not yet responded');
}
```

## Books

After the server acknowledges a [```SubscriptionType.MarketDepth```](/content/sdk/lib-connection?id=enumssubscriptiontype) subscription, an anonymous ```Object``` conforming to the [```Schema.Book```](content/sdk/lib-marketstate?id=schemabook) contract is stored. The [```Book```](content/sdk/lib-marketstate?id=schemabook) is updated as new messages are received from the server.

You can access a [```Book```](content/sdk/lib-marketstate?id=schemabook) as follows:

```javascript
const book = connection.getMarketState().getBook('ESM0');

if (book) {
	console.log(JSON.stringify(book, null, 2);
} else {
	console.log('A "marketUpdate" subscription has not bee established, or the server has not yet responded');
}
```

## Cumulative Volume

After a [```SubscriptionType.CumulativeVolume```](/content/sdk/lib-connection?id=enumssubscriptiontype) subscription is established and the SDK receives data from the server, a [```/lib/marketState/CumulativeVolume```](/content/sdk/lib-marketstate?id=cumulativevolume) instance is created.

You can access a [```CumulativeVolume```](/content/sdk/lib-marketstate?id=cumulativevolume) instance as follows:

```javascript
connection.getMarketState().getCumulativeVolume('AAPL')
	.then((cumulativeVolume) => {
		console.log(JSON.stringify(cumulativeVolume, null, 2));
	});
```

> Notice [```MarketState.getCumulativeVolume```](/content/sdk/lib-marketstate?id=marketstategetcumulativevolume) returns asynchronously. If you have recently subscribed, response will wait until the SDK receives data from the server.