## Setup

This SDK has been published to Node Package Manager (NPM). The package is named *@barchart/marketdata-api-js* and can be installed as follows:

```shell
npm install @barchart/marketdata-api-js -S
```

If you aren't using NPM, you can download the SDK directly from GitHub at https://github.com/barchart/marketdata-api-js.

## Connecting

Before you can subscribe to market data, you'll need to establish a WebSocket connection to Barchart's quote servers.

Barchart does not permit anonymous connections to its systems. Please contact solutions@barchart.com to *obtain a free username and password*.

### From a Web Browser

By default, the SDK will assume it's running in a web browser and it will attempt to use the browser's native WebSocket support.

```js
const Connection = require('@barchart/marketdata-api-js/lib/connection/Connection');

connection = new Connection();

connection.on('events', (data) => {
	if (data.event === 'login success') {
		console.log('You are logged in.');
	} else if (data.event === 'login fail') {
		console.log('You are not logged in. Please check your credentials');
	}
});

const server = 'qsws-us-e-02.aws.barchart.com';
const username = 'contact solutions@barchart.com for your free username and password';
const password = 'contact solutions@barchart.com for your free username and password';

connection.connect(server, username, password);
```

### From Node.js

Running the SDK in Node.js is identical to running it in a web browser -- with one exception. You need to provide a *WebSocketAdapterFactory* to the *Connection.connect* function. Connect as follows:

```js
const Connection = require('@barchart/marketdata-api-js/lib/connection/Connection');
const WebSocketFactory = require('@barchart/marketdata-api-js/lib/connection/adapter/WebSocketAdapterFactoryForNode');

connection = new Connection();

connection.on('events', (data) => {
	if (data.event === 'login success') {
		console.log('You are logged in.');
	} else if (data.event === 'login fail') {
		console.log('You are not logged in. Please check your credentials');
	}
});

const server = 'qsws-us-e-02.aws.barchart.com';
const username = 'contact solutions@barchart.com for your free username and password';
const password = 'contact solutions@barchart.com for your free username and password';

connection.connect(server, username, password, new WebSocketFactory());
```

## Subscribing

After a connection has been established, let's subscribe to the Level I data for Apple stock, as follows:

```js
const symbol = 'AAPL';

let previousPrice = null;

const handleMarketUpdate = (message) => {
	const price = connection.getMarketState().getQuote(symbol).lastPrice;

	if (previousPrice !== price) {
		console.log(`${symbol} price changed from ${previousPrice} to ${price}`);

		previousPrice = price;
	}
};

connection.on('marketUpdate', handleMarketUpdate, symbol);
```

## Demos

Two pre-built applications should provide some insight into the features and usage of the SDK.

### Web Browsers

A single-page HTML application allows users to enter symbols, subscribe to Level I data, unsubscribe, and observe data changes on screen.

You can find the source code in the */example/browser* folder. The application is also hosted here:

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