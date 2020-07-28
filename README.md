# @barchart/marketdata-api-js

[![AWS CodeBuild](https://codebuild.us-east-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiY1VDTWRsRHkwK0NRYnJNZk95WjVEMzR3QW9EbUtTRG9yNExRSk0yVTI1MEtWWGlDOXUvQU1xTmNuTUxNd0REZ1VlZkc2WXRPMXZ2SWpOSW83UkdYc3c4PSIsIml2UGFyYW1ldGVyU3BlYyI6IjhUTXBaL1E4RW5WRGlKTjIiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)](https://github.com/barchart/marketdata-api-js)

### Overview

[Barchart](https://www.barchart.com) offers an exhaustive array of market data for multiple asset classes from exchanges around the world. **This SDK enables your applications to consume real-time market data**, as follows:

* A WebSocket connection is established between your application and Barchart's quote servers.
  * Your application sends subscription requests for individual symbols.
  * Your application receives a stream of market data for subscribed symbols.

### Documentation

Complete documentation for this SDK can be found here:

http://barchart.github.io/marketdata-api-js/

### Demos

Working demos are available for web browser and Node.js environments. Please refer to the [documentation](https://barchart.github.io/marketdata-api-js/#/content/quick_start?id=demos).

### Package Managers

This library has been published as a public package to NPM as [@barchart/marketdata-api-js](https://www.npmjs.com/package/@barchart/marketdata-api-js).

 ```sh
 npm install @barchart/marketdata-api-js -S
```

### Build

Source code is written in [ES2018](https://en.wikipedia.org/wiki/ECMAScript#9th_Edition_%E2%80%93_ECMAScript_2018). Consequently, transpilation (or polyfill use) is recommended for use in web browsers.
