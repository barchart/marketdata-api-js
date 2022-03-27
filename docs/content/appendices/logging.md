## Default Logging

By default, log statements are written to the [```console```](https://developer.mozilla.org/en-US/docs/Web/API/console) object.

## Custom Logging

To exert complete control over logging, implement the abstract [```lib/logging/LoggerProvider```](/content/sdk/lib-logging?id=loggerprovider) class and pass an instance to ```LoggerFactory.configure``` function. This must occur before instantiating a ```Connection``` (because the SDK caches ```Logger``` instances).

```javascript
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

## Mute Logs

```javascript
LoggerFactory.configureForSilence();

const connection = new Connection();
```
