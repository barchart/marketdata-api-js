## Purpose

**This SDK enables your JavaScript applications to consume real-time market data**, as follows:

* A WebSocket connection is established between your application and Barchart's quote servers, then
* Your application requests market data for one or more symbols, then
* Your application receives a market data stream for subscribed symbols.

## Market Data Catalog

[Barchart](https://www.barchart.com) offers streaming market data for a wide range of asset classes which trade on exchanges around the world. Review our website for details:

* [Barchart Market Data Catalog](https://www.barchart.com/solutions/data/market)
* [Barchart Streaming Services](https://www.barchart.com/solutions/services/stream)

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

Sometimes referred to as "market depth," this subscription will aggregate open, unfilled orders on both sides of the market. In other words, this subscription provides the total quantity available for purchase (or sale) at various price points.

**Cumulative Volume Data**

This subscription provides the total volume traded (i.e. size) at each discrete price level during the current day.

## Supported Environments

#### Web Browsers

This SDK can be distributed as part of your browser-based applications. Your target browser(s) must support WebSockets (which all modern browsers do). Also, since the source code is written in [ES2018](https://en.wikipedia.org/wiki/ECMAScript#9th_Edition_%E2%80%93_ECMAScript_2018), transpilation is recommended.

#### Node.js

Node.js is fully-supported.

#### Other

This SDK can only be used within a JavaScript environment. Other environments are supported (e.g. Java, .NET, Go, etc). Read the [Streaming Services](https://www.barchart.com/solutions/services/stream) page of our website for more details.







