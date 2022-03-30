## Fundamentals

The [```lib/connection/Connection```](/content/sdk/lib-connection?id=connection) class is central to the SDK's object model. It allows you to:

* Open and close WebSocket connections to Barchart's servers,
* Subscribe to and unsubscribe from market data streams,
* Automatically track market state, and
* Access the current market state

The [```Connection```](/content/sdk/lib-connection?id=connection) class constructor does not accept any arguments:

```javascript
const connection = new Connection();
```

In general, you'll want to treat the [```Connection```](/content/sdk/lib-connection?id=connection) as a singleton. Only one instance is needed. In fact, Barchart's servers reject simultaneous connections using the same credentials.

## Monitoring

After you create a connection, you'll probably want to monitor the state of the connection. Additional details can be found in [System Status](/content/concepts/subscriptions?id=system-status) subscription documentation. Here's the short version:

```javascript
const eventsHandler = (data) => {
	// Invoked when connection state changes
}

connection.on(SubscriptionType.Events, eventsHandler);
```

## Opening

Calling [```Connection.connect```](/content/sdk/lib-connection?id=connectionconnect) opens a network connection and attempts to authenticate the user. The function requires a hostname for Barchart's servers and credentials.

**Contact Barchart at solutions@barchart.com or (866) 333-7587 to obtain the correct hostname and a free username/password.**

**IMPORTANT NOTE:** Once [```Connection.connect```](/content/sdk/lib-connection?id=connectionconnect) is called, the SDK will repeatedly attempt to connect and authenticate — even if the credentials are incorrect. To stop repeated connection attempts, the [```Connection.disconnect```](/content/sdk/lib-connection?id=connectiondisconnect) function must be called.

You'll also need to provide a strategy for creating WebSocket connections. Depending on your environment, different strategies are used. Two implementations exist in the SDK:

* [```lib/connection/adapter/WebSocketAdapterFactoryForBrowsers```](/content/sdk/lib-connection-adapter?id=websocketadapterfactoryforbrowsers) - For web browsers (default)
* [```lib/connection/adapter/WebSocketAdapterFactoryForNode```](/content/sdk/lib-connection-adapter?id=websocketadapterfactoryfornode) - For Node.js

By default, the [```Connection```](/content/sdk/lib-connection?id=connection) class assumes you're running in a web browser. However, there is nothing wrong with being explicit; connect as follows:

```javascript
connection.connect(host, username, password, new WebSocketAdapterFactoryForBrowsers());
```

Or:

```javascript
connection.connect(host, username, password, new WebSocketAdapterFactoryForNode());
```

## Closing

Closing a connection is simple:

```javascript
connection.disconnect();
```

This causes the WebSocket connection to be severed. It also stops any further reconnect attempts abd clears **all** existing market data subscriptions.

## Reconnecting

Unexpected network conditions may cause the WebSocket connection to close. When this happens, a **Disconnect** event will be generated (see the [System Status](/content/concepts/subscriptions?id=system-status) subscription). The SDK will **automatically** begin attempting to reestablish the connection. To stop reconnection attempts, invoke the [```Connection.disconnect```](/content/sdk/lib-connection?id=connectiondisconnect) function.

Once the connection is reestablished, a **LoginSuccess** event will be generated and subscriptions will be automatically restarted. However, market state should be considered outdated until you receive the first notification for each subscription.

To abort the automated reconnection process, simply call the [```Connection.disconnect```](/content/sdk/lib-connection?id=connectiondisconnect) function.