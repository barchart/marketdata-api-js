## Price Formatting



## Logging

By default, log statements are written to the ```Console```. However, it is possible to customize logging behavior via the [```lib/logging/LoggerFactory```](/content/sdk/lib-logging?id=loggerfactory) class. Any customization must occur before instantiating a ```Connection``` (because the SDK will cache ```Logger``` instances).

#### Mute Logs

```javascript
LoggerFactory.configureForSilence();

const connection = new Connection();
```

#### Custom Logging

To exert complete control over logging, implement the [```lib/logging/LoggerProvider```](/content/sdk/lib-logging?id=loggerprovider) class and pass it to ```LoggerFactory.configure``` function.

```
class MyLogger extends Logger {
	constructor() {
		super();
	}
}

class MyLoggerProvider extends LoggerProvider {
	constructor() {
		super();
	}

	getLogger(category) {
		return new MyLogger();
	}
}

LoggerFactory.configure(new MyLoggerProvider());

const connection = new Connection();
```

You can find an example in the Node.js sample code. You'll see a ```LoggingProvider``` implemented to use [log4js](https://www.npmjs.com/package/log4js) here:

> /example/node/logging/CustomLoggingProvider.js

## Utilities

This SDK also contains a number of "pure" utility functions. For example, functions to format prices in a human-readable fashion exist. Many of the functions are undocumented because the average SDK user will not require them. Browse the source code in */lib/utilities/* if you're curious.

