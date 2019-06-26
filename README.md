# @barchart/marketdata-api-js
## JavaScript library for subscribing to streaming market data from [Barchart](https://www.barchart.com)

Include streaming market data in your applications. Asset classes include equities, futures, and forex. Delayed and realtime data feeds are available.

All you need is a username/password from Barchart, and your app can be live within a matter of minutes. To obtain your credentials, please contact solutions@barchart.com


## Supported Environments

* *Modern Browsers* -- First, an assumption is made that WebSockets are supported. Second, ES6 is used, so transpilation (with the appropriate polyfills) is recommended.
* *Node.js* -- Node.js does not natively support WebSockets. So, third-party library called [WS](https://github.com/websockets/ws) is used to connect to Barchart servers.

## Examples

### Browser

Open the following file in your browser:

    ./example/browser/example.html
    
Or, the visit the hosted version of the example page:

- [https://examples.aws.barchart.com/marketdata-api-js/example.html](https://examples.aws.barchart.com/marketdata-api-js/example.html)

### Node.js

Ensure you're running a recent version of Node.js (e.g. 8.1.0) and run the [example script](https://github.com/barchart/marketdata-api-js/blob/master/example/node/example.js) as follows:

    > node examples/browser/example.js {host} {username} {password} {comma-delimited symbol list}

## Documentation

### Wiki

[Read the Wiki for full documentation](https://github.com/barchart/marketdata-api-js/wiki)


### Code Documentation

[JSDoc](http://usejsdoc.org/) is used to document the source code. HTML documentation can be generated (into a "docs" folder), as follows:

	> gulp document