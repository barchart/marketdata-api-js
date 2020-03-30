<!-- releases_open -->
## 4.0.23

**No functional changes.**

* Added formal documentation
  * Documentation published to [GitHub Pages](https://barchart.github.io/marketdata-api-js/#/)
  * Removed GitHub all wiki documents
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

* Many object and functions have been renamed or moved
  * The ```Connection``` class was moved
* The library now includes features from @barchart/marketdata-utilities-js
  * Utilities have been placed in the ```/lib/utilities```folder
  * Utilities are now exported as pure functions -- with no object wrappers
* All ```index.js``` files were removed -- explicit imports are now required
* Bower is no longer supported -- the ```bower.json```file was removed

<!-- releases_close -->

## Prior

Any release prior to major version four is unsupported. Please upgrade as soon as possible.