## Setup

This SDK is a public package on NPM (Node Package Manager). It can be installed as follows:

```shell
npm install @barchart/marketdata-api-js -S
```

Alternately, you can download the SDK directly from GitHub at https://github.com/barchart/marketdata-api-js.

## Connecting

Before you can subscribe to market data, you'll need to establish a WebSocket connection to Barchart's quote servers.

Barchart does not permit anonymous connections. **Contact Barchart at solutions@barchart.com or (866) 333-7587 to obtain the correct hostname and a free username/password.**

### From a Web Browser

By default, the SDK will assume it's running in a web browser and it will attempt to use the browser's native WebSocket support.

```javascript
const Connection = require('@barchart/marketdata-api-js/lib/connection/Connection');

connection = new Connection();

connection.on('events', (data) => {
	if (data.event === 'login success') {
		console.log('You are logged in.');
	} else if (data.event === 'login fail') {
		console.log('You are not logged in. Please check your credentials');
	}
});

const server = 'wsqs-cf.aws.barchart.com';
const username = 'contact solutions@barchart.com for your free username and password';
const password = 'contact solutions@barchart.com for your free username and password';

connection.connect(server, username, password);
```

### From Node.js

Running the SDK in Node.js is identical to running it in a web browser — with one exception. You need to provide a [WebSocketAdapterFactory](/content/sdk/lib-connection-adapter?id=websocketadapterfactory) implementation to the [Connection.connect](/content/sdk/lib-connection?id=connectionconnect) function. 

An implementation, called [WebSocketAdapterFactoryForNode](/content/sdk/lib-connection-adapter?id=websocketadapterfactoryfornode),  is included with the SDK that uses the [```ws```](https://www.npmjs.com/package/ws) library internally. Here is a usage example:

```javascript
const Connection = require('@barchart/marketdata-api-js/lib/connection/Connection');
const WebSocketFactory = require('@barchart/marketdata-api-js/lib/connection/adapter/WebSocketAdapterFactoryForNode');

connection = new Connection();

connection.on('events', (event) => {
	if (event.event === 'login success') {
		console.log('You are logged in.');
	} else if (event.event === 'login fail') {
		console.log('You are not logged in. Please check your credentials');
	}
});

const server = 'wsqs-cf.aws.barchart.com';
const username = 'contact solutions@barchart.com for your free username and password';
const password = 'contact solutions@barchart.com for your free username and password';

connection.connect(server, username, password, new WebSocketFactory());
```

## Subscribing

After a connection has been established, let's subscribe to the Level I data for Apple's stock, as follows:

```javascript
let previousPrice = null;

const handleMarketUpdate = (event) => {
	const price = connection.getMarketState().getQuote(event.symbol).lastPrice;

	if (previousPrice !== price) {
		console.log(`${symbol} price changed from ${previousPrice} to ${price}`);

		previousPrice = price;
	}
};

connection.on('marketUpdate', handleMarketUpdate, 'AAPL');
```

## Demos

Two sample applications were built with this SDK. They could provide some insight into SDK features and usage.

### Web Browsers

A single-page HTML application allows you to enter symbols, subscribe to Level I data, unsubscribe from to Level I data, and observe data changes on screen.

You can find the source code here:

* /example/browser/example.html
* /example/browser/js/startup.js

The application is also hosted at:

https://examples.aws.barchart.com/marketdata-api-js/example.html

### Node.js

A simple Node.js script connects to the backend, subscribes to Level I data, and prints price changes to the console. You can find the source code in the */example/node* folder.

To run the script, make sure required dependencies are installed:

```shell
npm install
```

Then, execute it, as follows:

```shell
node ./example/node/example.js {host} {username} {password} {comma-delimited symbol list}
```