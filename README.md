Barchart Marketdata API for Javascript
======================================

Include streaming delayed or realtime stocks, futures, and forex data in your HTML5
application. All you need is a username/password from Barchart, and your app can
be live within a matter of minutes. Our simple API also has access to historical and
time series data.

To create a client and connect to the data server, simply do this:
(Note: to obtain a free testing username/password, please contact solutions@barchart.com)

You will need to include the following scripts:
```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>

<script src="barchart-realtimedata-connection-1.0.js"></script>
<script src="barchart-realtimedata-historicaldata-1.0.js"></script>
<script src="barchart-realtimedata-util-1.0.js"></script>
<script src="barchart-realtimedata-marketstate-1.0.js"></script>
<script src="barchart-realtimedata-messageparser-1.0.js"></script>
```

Then, create a client, and request an array of symbols.
```js
var client = new Barchart.RealtimeData.Connection();
client.connect('qsws-us-e-01.aws.barchart.com', username, password);
client.requestSymbols(['AAPL', 'GOOG']);
```

There are some events that you can register to listen. These are:
* events - Network events, such as connected, disconnected, etc.
* marketUpdate - Market updates. This will be the core of most of your code.
* marketDepth - Book messages (available for futures only at this time)
* timestamp - The Barchart network time beacon


events
------
```js
client.on('events', function(info) {
    console.log(info);
});
```


marketDepth
-----------
```js
client.on(
	'marketDepth',
	function(message) {
		console.log(message);
	},
	'AAPL'
);


marketUpdate
------------
```js
client.on(
	'marketUpdate',
	function(message) {
		console.log(message);
	},
	'AAPL'
);
```

timestamp
---------
```js
client.on('timestamp', function(timestamp) {
	console.log('Timestamp: ' + timestamp);
});
```

