# @barchart/marketdata-api-js
## JavaScript library for accessing streaming market data from [Barchart](https://www.barchart.com)

Include streaming market data in your applications. Asset classes include equities, futures, and forex.

All you need is a username/password from Barchart and your app can be live within a matter of minutes. To obtain your credentials, please contact solutions@barchart.com. (Depending on your access level, and the symbol observed, feeds may be realtime or delayed).

## Supported Environments

* *Browsers* - Your target browser must support WebSockets (which all modern Browsers do). Also, the source code is written using ES6, so transpilation (with appropriate polyfills) is recommended before distribution.
* *Node.js* - Node.js does not natively support WebSockets. So, third-party library called [WS](https://github.com/websockets/ws) is used to connect to Barchart's servers.

## Examples

### Browser

Open the following file in your browser:

    ./example/browser/example.html
    
Or, visit the hosted page at:

- [https://examples.aws.barchart.com/marketdata-api-js/example.html](https://examples.aws.barchart.com/marketdata-api-js/example.html)

### Node.js

Ensure you're running a recent version of Node.js (e.g. v10.16.0) and execute the [example script](https://github.com/barchart/marketdata-api-js/blob/master/example/node/example.js) as follows:

    > node example/node/example.js {host} {username} {password} {comma-delimited symbol list}

## Documentation

### Wiki

[Read the Wiki for full documentation](https://github.com/barchart/marketdata-api-js/wiki)


### Code

[JSDoc](http://usejsdoc.org/) is used to document the source code. HTML documentation can be generated (into a "docs" folder), as follows:

	> gulp document