#Example Proxy Server For Historical Data

A proxy server for HTTP requests to [Barchart's](https://www.barchart.com) historical data servers, built with []Node.js](https://nodejs.org/en/).


## Why

Browser-based applications that need historical data are bound by the [Same Origin Policy](https://en.wikipedia.org/wiki/Same-origin_policy). Furthermore, Barchart's historical data servers do not support [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing). Consequently, any browser-based application must implement a proxy server. This is a working example.
 
 
## Roadmap

We are investigating two alternatives:

* Add CORS support to the historical data servers, eliminating the need for this type of proxy server, or
* Hosting a proxy server, eliminating the need for clients to host a proxy server.


# Prerequisites

Ensure that Node.js (version 6, or later) is installed on your machine.


# Demonstration

First, open a command prompt and make sure your in the following directory:

    /{this-project}/proxies/node

Then, download the required dependencies to run the server:

    > npm install
    
Next, start the server (hardcoded to run on port 8080):

    > node app.js
    
Now, the following console output should appear:

    [INFO] app - Starting a proxy server for Barchart Historical Data
    [INFO] app - Initializing Express middleware.
    [INFO] app - Configuring Express to apply CORS headers to all requests.
    [INFO] app - Configuring Express to proxy requests for historical data.
    [INFO] app - Starting started on port 8080.


# Testing

Now, you can make requests for historical data. Navigate the the following URL:

http://localhost:8080/proxies/historicaldata/?username=your-username&password=your-password&symbol=TSLA&interval=daily&start=20170101&end=20110131
