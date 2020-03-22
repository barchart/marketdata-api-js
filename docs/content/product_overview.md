**This SDK enables your applications to consume real-time market data**, as follows:

* A **WebSocket connection** is established between your application and Barchart's quote servers.
  * Your application sends subscription requests for individual symbols.
  * Your application receives a stream of market data for subscribed symbols.

## Market Data Catalog

Barchart offers an exhaustive array of market data for multiple asset classes from exchanges around the world.

#### Asset Classes

* Equities
* Exchange Traded Funds
* Futures Contracts
* Foreign Exchange (Forex)
* Cryptocurrencies
* Indices (Industry Standard)
* Indices (Barchart Proprietary)

#### Exchanges

Market data from virtually every exchange across the globe is available.

#### Data Formats

**Level I Data**

Sometimes referred to as "top of book," this subscription will provide the most recent:

* Trade Price,
* Trade Size,
* Best Bid Price (and aggregate bid quantity),
* Best Ask Price (and aggregate ask quantity)

**Level II Data**

Sometimes referred to as "market depth," this subscription will aggregate open, unfilled orders on both sides of the market. In other words, this subscription will tell us the total quantity that can be bought or sold at any given price.

**Cumulative Volume Data**

This subscription provides the total volume of trades (i.e. size) which has occurred at each discrete price level for the current day.

## Supported Environments

#### Web Browsers

This SDK can be distributed as part of your browser-based applications. Consequently, your target browsers must support WebSockets (which all modern browsers do). Also, since the SDK's source code is written in ES6, transpilation (with appropriate polyfills) is recommended before distribution.

#### Node.js

Node.js is fully-supported.

#### Other

This SDK can only be used within a JavaScript environment. Other environments are supported (e.g. Java, .NET, Go, etc). Contact contact solutions@barchart.com for more details.







