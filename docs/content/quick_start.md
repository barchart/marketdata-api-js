## Setup

This SDK has been published to Node Package Manager (NPM). The package is named *@barchart/marketdata-api-js* and can be installed as follows:

    npm install @barchart/marketdata-api-js -S

If you aren't using NPM, you can download the SDK directly from GitHub at https://github.com/barchart/marketdata-api-js.

## Connecting to Barchart

Before you can subscribe to market data, you'll need to establish a WebSocket connection to Barchart's quote servers.

Barchart does not permit anonymous connections to its systems. Please contact solutions@barchart.com to *obtain a free username and password*.

### From a Web Browser

By default, the SDK will assume it's running in a web browser and it will attempt to use the browser's native WebSocket support.

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

### From Node.js

Running the SDK in Node.js is identical to running it in a web browser -- with one exception. You need to provide a tool for creating WebSocket connections to the *Connection.connect* function. So, make one slight change to the [Web Browser](#from-a-web-browser) code, as follows:

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

## Subscribing to Price Updates

## Examples

### Web Browsers

A simple, single-page HTML application demonstrates the capabilities of this SDK in the browser.

You can load the application by launching:

    ./example/browser/example.html

Or, the application is also hosted here:

https://examples.aws.barchart.com/marketdata-api-js/example.html

### Node.js

A simple Node.js script illustrates the basic concepts of the SDK. You can find it in the *example/node* folder.

First, make sure required dependencies are installed:

    > npm install

Then, execute the example script, as follows:

    > node ./example/node/example.js {host} {username} {password} {comma-delimited symbol list}