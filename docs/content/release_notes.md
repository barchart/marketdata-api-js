# Release Notes

## 5.27.1
**Bug Fixes**

* Updated the [`@xmldom/xmldom`](https://github.com/xmldom/xmldom) library, addressing [security vulnerability](https://github.com/xmldom/xmldom/issues/436).

## 5.27.0
**New Features**

* Added `SymbolParser.getIsGrainBid` function.
* Added out-of-band profile extension data for grain bid instruments.


## 5.26.0
**New Features**

* Added `previousPriceChange` and `previousPriceChangePercent` attributes to the `Quote` object.

## 5.25.1
**Bug Fixes**

* Corrected failure to update `Quote` object when the timestamp of a refresh message cannot be parsed (DDF `2/1`, `2/2`, `2/3` and `2/4` messages).

## 5.25.0
**New Features**

* Updated logic to explicitly assign the `Profile.asset` property for `AssetClass.CMDTY_STATS` instruments. 

**Bug Fixes**

* Fixed `AssetClass.parse` function.
* Fixed `utilities/format/quote.js`, preventing an error from being thrown when (a) the `timezone` argument is specified, and (b) the `quote` argument's `timeUtc` attribute is missing.


## 5.24.0
**New Features**

* Updated quote "extension" logic to add `Quote.currentDate` and `Quote.previousDate` attributes for cmdtyStats instruments. See the [`setExtendedQuoteMode`](https://docs.barchart.com/marketdata-api-js/#/content/sdk/lib-connection?id=connectionsetextendedquotemode) function.

## 5.23.0
**New Features**

* Enhanced `Profile` extension data for futures options, adding expiration `month` and `year` attributes.
* Exposed `SymbolParser.getFuturesYear` as a public function.

## 5.22.0
**New Features**

* Enhanced `Profile` extension data for futures options, adding the underlying instrument's `root`, `month`, and `year` attributes.

## 5.21.1
**Bug Fixes**

* Fixed issue which triggered the level one market data callback when a cumulative volume update was processed. In other words, the [`MarketUpdateCallback`](https://docs.barchart.com/marketdata-api-js/#/content/sdk/lib-connection?id=callbacksmarketupdatecallback) subscription handler (passed to the [`Connection.on`](https://docs.barchart.com/marketdata-api-js/#/content/sdk/lib-connection?id=connectionon) function) will no longer receive `REFRESH_CUMULATIVE_VOLUME` messages. 

## 5.21.0
**New Features**

* Added additional profile "extension" attributes for futures options (e.g. strike, underlying, etc).

## 5.20.0
**New Features**

* Added additional attributes to profile "extension" for C3 instruments.

**Other**

* Switched to a new remote API for C3 profile "extension" data.

## 5.19.1
**Bug Fixes**

* Adjusted the logic used by the `SymbolParser.parseInstrumentType` function to infer the expiration year of futures contracts and futures options based solely on a symbol (e.g. ZCZ19). In previous versions, given a two-digit number (e.g. 19), a year in the current century or the next century would be returned (e.g. 2019 or 2119). In this version, a 100-year window is used, interpreting a two-digit number as a year up to 25 years in the future, or alternatively up to 75 years in the past. Assuming the current year is 2022, the 100-year window will range from 1948 to 2047. 

## 5.19.0
**New Features**

* Added extended profile attributes for [commodity statistics](https://www.barchart.com/cmdty/data/stats) (a.k.a. cmdtyStats).

## 5.18.0
**New Features**

* Updated the ```Profile``` class to use the ```cmdtyView``` price formatter, by default. This formatter uses special tick notations for options on treasury futures (```ZB```, ```ZT```, ```ZF```, ```ZN``` roots), as specified by the CME, overriding the default tick notation specified in ```UnitCode``` rules.

**Other**

* Completed the [Appendix: Price Formats](https://docs.barchart.com/marketdata-api-js/#/content/appendices/price_formats) section of the documentation.

## 5.17.1
**Other**

* Added [Appendix: Price Formats](https://docs.barchart.com/marketdata-api-js/#/content/appendices/price_formats) section to documentation, including extensive discussion of fractional tick price formatting.
* Updated documentation, making minor corrections.

## 5.17.0
**New Features**

* Added support for OHLC messages (DDF record=2 and subrecord=6). These message were previously ignored. Now, when an OHLC message is received, the `Quote` object will be updated and the `MarketUpdateCallback` will be triggered.

**Other**

* Replaced several instances of the JavaScript [equality operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality) with the [strict equality operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality).

## 5.16.4
**Bug Fixes**

* Fixed failure to attempt reconnection (when JERQ drops connection before inbound control messages are processed).

**Other**

* Fixed login screen of single-page example application. The login screen no longer remains locked after failure (e.g. bad password).
* Corrected unit tests for some symbol conversions (where the output changes based on the current year).
* Added additional debug-level logging for inbound JERQ control messages.
* Added documentation, explicitly stating that reconnect attempts will continue until `Connection.disconnect` is invoked.


## 5.16.3
**Bug Fixes**

* Improved previous fix for detection of expiration of cash contracts (e.g. `ESY00`).

## 5.16.2
**Technical Enhancements**

* Switched the [`xmldom`](https://www.npmjs.com/package/xmldom) library to the [`@xmldom/xmldom`](https://www.npmjs.com/package/@xmldom/xmldom) library, resolving security issue present in version 0.6.0 of [`xmldom`](https://www.npmjs.com/package/xmldom). 

## 5.16.1
**Bug Fixes**

* The `SymbolParser.parseInstrumentType` function now identifies "cash" futures contracts as expiring in the future (e.g. `ESY00` now "expires" in the year 2100, instead of 2000).
* The `SymbolParser.getIsExpired` function now indicates that "cash" futures contracts are not expired (e.g. `ESY00` is not expired).

## 5.16.0
**New Features**

* Added the `SymbolParser.getIsCrypto` function.

## 5.15.1
**Other**

* Merged code from branch. No functional changes. Merged code was included in previous release.

## 5.15.0
**New Features**

* Added `Quote.priceChange` and `Quote.priceChangePercent` properties. The values of these properties are derived. The derivation logic preserves figures from the previous trading day until a trade occurs in the current trading day.

**Bug Fixes**

* Updated the DDF message parser to read the _previousPrice_ value from the _previous_ session during pre-market hours.

**Other**

* Removed some undocumented features.


## 5.14.1
**Bug Fixes**

* Extended the "special case" formatting rules for options of certain futures roots (ZB, ZT, ZF, and ZN). This only applies to the custom formatter for [cmdtyView](https://www.barchart.com/cmdty/trading/cmdtyview).

## 5.14.0
**New Features**

* In some cases, the default price formatting rules (based on the `UnitCode` class) need to be tweaked. In a prior version, we added the `Profile.setPriceFormatterCustom` function which allows the consumer to specify their own price-formatting delegate. This version adds an implementation of that delegate that is intended for use with the [cmdtyView](https://www.barchart.com/cmdty/trading/cmdtyview) product.

## 5.13.1
**Bug Fixes**

* Corrected signature of `formatFraction` function, removing unused parameter.

## 5.13.0
**New Features**

* Added the `formatFraction` function which converts numbers into fractional notation (e.g. 12-213) directly — without requiring a `UnitCode` reference.

**Other**

* Refactored the `formatPrice` function to use the new `formatFraction` function.

## 5.12.0
**New Features**

* Added the `AssetClass` enumeration to describe instrument types (e.g. stocks, futures, options, etc).
* Added the `Profile.asset` property which references an `AssetClass` item, assuming the asset class can be inferred from the instrument's symbol. 
* Added the `Profile.setPriceFormatterCustom` function which allows the consumer to specify their own price format function, completely overriding the default price formatting logic.

## 5.11.0
**New Features**

* Added `Quote.refresh` property to hold the most recent DDF refresh message.

**Bug Fixes**

* Adjusted `Quoute.message` property to hold the most recent DDF message (regardless of type).

## 5.10.0
**New Features**

* Added `Connection.setExtendedQuoteMode` function which causes additional `Quote` properties to be populated.
* Added `Quote.contractHigh` and `Quote.contractLow` properties, which are populated in "extended" quote mode.
* Added `SymbolParser.getFuturesExplicitFormat` function.
* Added undocumented functions for interacting with a replay server.

**Bug Fixes**

* Suppressed requests to download out-of-band profile data, if the data has already been downloaded.

**Technical Enhancements**

* Updated the [`ws`](https://www.npmjs.com/package/ws) library from version 7.0.1 to 7.4.6.
* Updated the [`xmldom`](https://www.npmjs.com/package/xmldom) library from version 0.1.27 to 0.6.0.
* Corrected unit tests for `SymbolParser.getIsPit` function.

**Other**

* Renamed the `ConnectionBase.connect` function's `server` parameter to `hostname` and added the `Connection.getHostname` function.
* Added a Node.js script which captures market data feed messages to a file (for diagnostic purposes).
* Added a Node.js script which replays market data feed messages from a file (for diagnostic purposes).

## 5.9.0
**New Features**

* Added `convert/monthCodeToName.js` and `convert/monthCodeToName.js` functions.

**Bug Fixes**

* Updated `monthCodes.getCodeToNameMap` and `monthCodes.getCodeToNumberMap` functions to return copied objects, thereby protecting internal state from consumers.

## 5.8.1
**Bug Fixes**

* Fixed `SymbolParser.parseInstrumentType` handling of futures expiring between the year 2000 and 2009. Prior to the fix, a symbol `ZCH08` would have had its year set to 2028 instead of 2008. Please note that this is different from the `ZCH8` which does imply year 2028.


## 5.8.0
**New Features**

* Added utility function — called `SymbolParser.getIsPit` — to detect pit-traded instruments.

## 5.7.5
**Bug Fixes**

* Updated `SymbolParser.getIsEquityOption` and `SymbolParser.parseInstrumentType` functions to recognize equity option symbols which include a dot character in the underlying equity (e.g. `BRK.B|20210205|170.00C` or `BRK.B2|20210205|170.00C`).

## 5.7.4
**Technical Enhancements**

* Upgraded the [`axios`](https://github.com/axios/axios) dependency to version 0.21.1. No functional changes are included in this release.

## 5.7.3
**Technical Enhancements**

* Upgraded the [`@barchart/common-js`](https://github.com/barchart/common-js) dependency to version 4.0.0. No functional changes are included in this release.

## 5.7.2
**Technical Enhancements**

* Add `.npmignore` file to reduce size of NPM package. The `docs`, `test`, and `example` folders are no longer included in the published package.

## 5.7.1
**No Functional Changes**

* Minor improvements to documentation.

## 5.7.0
**Configuration Changes**

* Any quote for a cmdtyStats instrument (e.g. `AE030UBX.CS`) is now sourced from JERQ (instead of OnDemand).

## 5.6.0
**New Features**

* Added ```SymbolParser.getIsCmdtyStats``` function.

**Configuration Changes**

* Any quote for an internally-generated [cmdty](https://www.barchart.com/cmdty) instrument (e.g. `HOPAW001009.CM`) is now sourced from JERQ (instead of OnDemand).
* Any quote for an externally-generated [cmdty](https://www.barchart.com/cmdty) instrument (e.g. `MER001.CP`) is now sourced from JERQ (instead of OnDemand).
* Any quote for a cmdtyStats instrument (e.g. `AE030UBX.CS`) is sourced from OnDemand (this is unchanged from previous versions).

## 5.5.0
**Configuration Changes**

* Quotes for [Platts](https://www.spglobal.com/platts/en) instruments are sourced from JERQ (instead of OnDemand).
* Symbols for [Platts](https://www.spglobal.com/platts/en) instruments now support `.PT` suffix (in addition to `PLATTS:` prefix).

## 5.4.0
**New Features**

* Added ```SymbolParser.getIsCanadianFund``` function.

## 5.3.0
**New Features**

* Added ```SymbolParser.getIsPlatts``` function.
* Added ```SymbolParser.getIsC3``` function.

**Bug Fixes**

* Price formatting for [cmdty](https://www.barchart.com/cmdty) instruments has been corrected.

**Configuration Changes**

* Quotes for [Commodity3](https://www.commodity3.com/) instruments are sourced from JERQ instead of OnDemand.
* Quotes for [cmdty](https://www.barchart.com/cmdty) instruments are now sourced from a different OnDemand endpoint.

## 5.2.3
**Other**

* Updated SDK documentation. Described additional properties on ```Quote``` object.

## 5.1.3
* Use ```try/catch``` when parsing snapshot results. Problem with one snapshot won't affect other snapshots.

## 5.1.0
* Add ```Quote.previousSettlementPrice``` property.

## 5.0.2
* Corrected parsing logic for equity option symbols where underlying stock is listed on the Toronto Stock Exchange.
* Updated documentation format (particularly, the [SDK Reference](https://barchart.github.io/marketdata-api-js/#/content/sdk_reference) section).

## 5.0.1
**Functionally identical to 4.1.1. Major version bumped in strict compliance with [semver](https://semver.org/) standards.**

* Any breaking change should be a new major version (read more [here](https://semver.org/#if-even-the-tiniest-backwards-incompatible-changes-to-the-public-api-require-a-major-version-bump-wont-i-end-up-at-version-4200-very-rapidly)).
* A minor version with breaking changes should be re-released as a major version (read more [here](https://semver.org/#what-do-i-do-if-i-accidentally-release-a-backwards-incompatible-change-as-a-minor-version)).

## 4.1.1
**Refactor price formatting and parsing. As a result, breaking changes may have been introduced.**

* The price format function has refactored.
  * Function signature is unchanged.
  * Function behavior has changed.
    * A string is always returned.
    * Passing a non-numeric value will yield a zero-length string.
    * Passing an invalid unit code will yield a zero-length string.
* The price parse function has been refactored.
  * Function signature was expanded.
    * New arguments were appended. The same values used to format a value should be used when parsing.
      * fractionSeparator
      * specialFractions
      * thousandsSeparator
  * Function behavior has changed.
    * Passing a value which cannot be parsed will yield Number.NaN.
    * Passing an invalid unit code will yield Number.NaN.
* A formal enumeration, called UnitCode, was added.


## 4.0.25
* Added parsing logic for equity options.

## 4.0.24
**No functional changes.**

* Added package-lock.json file. Public libraries should lock dependencies.
* Added continuous integration use AWS CodeBuild.

## 4.0.23
**No functional changes.**

* Added formal documentation.
  * Documentation published to [GitHub Pages](https://barchart.github.io/marketdata-api-js/#/).
  * Removed wiki documents from GitHub (replaced by documentation).
* Updated, corrected and modernized JDSoc comments.
* Added ```lib/connection/ConnectionEventType``` as an alternative to literal ```String``` values.

## 4.0.18
**Added better support for timezones.**

* Exchange timezones are now downloaded on ```Connection.connect```.
* Existing ```Quote.time``` and ```Quote.lastUpdate``` properties remain unchanged. These ```Date``` objects are still misleading. They are populated with hours, minutes, and seconds from DDF; however the timzeone of the local computer is incorrectly assumed.
* Additional ```Quote.timeUtc``` and ```Quote.lastUpdateUtc``` properties have been added. These ```Dates``` represent the actual and correct times of the the events (using the timezone of the local computer).
* The ```format/quote``` function now accepts a fourth ```timezone``` parameter allowing the date/time to be shown in any desired timezone.

## 4.0.3
**Features from the deprecated [@barchart/marketdata-utilities-js](https://github.com/barchart/marketdata-utilities-js) library have been incorporated here. As a result, several breaking changes have been introduced.**

* Many objects and functions have been renamed or moved.
  * The ```Connection``` class was moved.
* The library now includes features from @barchart/marketdata-utilities-js.
  * Utilities have been placed in the ```/lib/utilities```folder.
  * Utilities are now exported as pure functions -- with no object wrappers.
* All ```index.js``` files were removed -- explicit imports are now required.
* Bower is no longer supported -- the ```bower.json```file was removed.
