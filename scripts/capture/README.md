# @barchart/marketdata-api-js/scripts/capture

A simple Node.js script which captures the raw market data feed (in the DDF protocol) to a file.

### Usage

This script accepts four parameters:

* Hostname - A Barchart JERQ market data service which supports WebSocket connections (e.g.  qsws-us-e-02.aws.barchart.com).
* Username - Your username.
* Password - Your password.
* Symbols - A comma-delimited list of symbols.

```shell
node capture.js qsws-us-e-02.aws.barchart.com bri cmdty \$M1LX
```