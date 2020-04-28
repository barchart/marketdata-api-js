<!-- releases_open -->

## 5.0.1
**Functionally identical to 4.1.1. Major version bumped in strict compliance with [semver](https://semver.org/) standards**

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

* Added formal documentation
  * Documentation published to [GitHub Pages](https://barchart.github.io/marketdata-api-js/#/)
  * Removed wiki documents from GitHub (replaced by documentation)
* Updated, corrected and modernized JDSoc comments
* Added ```lib/connection/ConnectionEventType``` as an alternative to literal ```String``` values

## 4.0.18
**Added better support for timezones.**

* Exchange timezones are now downloaded on ```Connection.connect```.
* Existing ```Quote.time``` and ```Quote.lastUpdate``` properties remain unchanged. These ```Date``` objects are still misleading. They are populated with hours, minutes, and seconds from DDF; however the timzeone of the local computer is incorrectly assumed.
* Additional ```Quote.timeUtc``` and ```Quote.lastUpdateUtc``` properties have been added. These ```Dates``` represent the actual and correct times of the the events (using the timezone of the local computer).
* The ```format/quote``` function now accepts a fourth ```timezone``` parameter allowing the date/time to be shown in any desired timezone.

## 4.0.3
**Features from the deprecated [@barchart/marketdata-utilities-js](https://github.com/barchart/marketdata-utilities-js) library have been incorporated here. As a result, several breaking changes have been introduced.**

* Many objects and functions have been renamed or moved
  * The ```Connection``` class was moved
* The library now includes features from @barchart/marketdata-utilities-js
  * Utilities have been placed in the ```/lib/utilities```folder
  * Utilities are now exported as pure functions -- with no object wrappers
* All ```index.js``` files were removed -- explicit imports are now required
* Bower is no longer supported -- the ```bower.json```file was removed

<!-- releases_close -->

## Prior

Any release prior to major version four is unsupported. Please upgrade as soon as possible.