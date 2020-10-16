# Release Notes

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
