## SymbolParser :id=symbolparser
**Kind**: global class  
**Access**: public  
>Static utilities for parsing symbols.


* [SymbolParser](#SymbolParser)
    * [.parseInstrumentType(symbol)](#SymbolParser.parseInstrumentType) ⇒ <code>Object</code> \| <code>null</code>
    * [.getProducerSymbol(symbol)](#SymbolParser.getProducerSymbol) ⇒ <code>String</code> \| <code>null</code>
    * [.getFuturesOptionPipelineFormat(symbol)](#SymbolParser.getFuturesOptionPipelineFormat) ⇒ <code>String</code> \| <code>null</code>
    * [.getIsConcrete(symbol)](#SymbolParser.getIsConcrete) ⇒ <code>Boolean</code>
    * [.getIsReference(symbol)](#SymbolParser.getIsReference) ⇒ <code>Boolean</code>
    * [.getIsFuture(symbol)](#SymbolParser.getIsFuture) ⇒ <code>Boolean</code>
    * [.getIsFutureSpread(symbol)](#SymbolParser.getIsFutureSpread) ⇒ <code>Boolean</code>
    * [.getIsFutureOption(symbol)](#SymbolParser.getIsFutureOption) ⇒ <code>Boolean</code>
    * [.getIsForex(symbol)](#SymbolParser.getIsForex) ⇒ <code>Boolean</code>
    * [.getIsIndex(symbol)](#SymbolParser.getIsIndex) ⇒ <code>Boolean</code>
    * [.getIsSector(symbol)](#SymbolParser.getIsSector) ⇒ <code>Boolean</code>
    * [.getIsCmdty(symbol)](#SymbolParser.getIsCmdty) ⇒ <code>Boolean</code>
    * [.getIsBats(symbol)](#SymbolParser.getIsBats) ⇒ <code>Boolean</code>
    * [.getIsExpired(symbol)](#SymbolParser.getIsExpired) ⇒ <code>Boolean</code>
    * [.displayUsingPercent(symbol)](#SymbolParser.displayUsingPercent) ⇒ <code>Boolean</code>


* * *

### SymbolParser.parseInstrumentType(symbol) :id=symbolparserparseinstrumenttype
**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

>Returns a simple instrument definition with the terms that can be
gleaned from a symbol. If no specifics can be determined from the
symbol, a null value is returned.


* * *

### SymbolParser.getProducerSymbol(symbol) :id=symbolparsergetproducersymbol
**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

>Translates a symbol into a form suitable for use with JERQ (i.e. the quote "producer").


* * *

### SymbolParser.getFuturesOptionPipelineFormat(symbol) :id=symbolparsergetfuturesoptionpipelineformat
**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

>Attempts to convert database format of futures options to pipeline format
(e.g. ZLF320Q -> ZLF9|320C)


* * *

### SymbolParser.getIsConcrete(symbol) :id=symbolparsergetisconcrete
**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

>Returns true if the symbol is not an alias to another symbol; otherwise
false.


* * *

### SymbolParser.getIsReference(symbol) :id=symbolparsergetisreference
**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

>Returns true if the symbol is an alias for another symbol; false otherwise.


* * *

### SymbolParser.getIsFuture(symbol) :id=symbolparsergetisfuture
**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

>Returns true if the symbol represents futures contract; false otherwise.


* * *

### SymbolParser.getIsFutureSpread(symbol) :id=symbolparsergetisfuturespread
**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

>Returns true if the symbol represents futures spread; false otherwise.


* * *

### SymbolParser.getIsFutureOption(symbol) :id=symbolparsergetisfutureoption
**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

>Returns true if the symbol represents an option on a futures contract; false
otherwise.


* * *

### SymbolParser.getIsForex(symbol) :id=symbolparsergetisforex
**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

>Returns true if the symbol represents a foreign exchange currency pair;
false otherwise.


* * *

### SymbolParser.getIsIndex(symbol) :id=symbolparsergetisindex
**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

>Returns true if the symbol represents an external index (e.g. Dow Jones
Industrials); false otherwise.


* * *

### SymbolParser.getIsSector(symbol) :id=symbolparsergetissector
**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

>Returns true if the symbol represents an internally-calculated sector
index; false otherwise.


* * *

### SymbolParser.getIsCmdty(symbol) :id=symbolparsergetiscmdty
**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

>Returns true if the symbol represents an internally-calculated, cmdty-branded
index; false otherwise.


* * *

### SymbolParser.getIsBats(symbol) :id=symbolparsergetisbats
**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

>Returns true if the symbol is listed on the BATS exchange; false otherwise.


* * *

### SymbolParser.getIsExpired(symbol) :id=symbolparsergetisexpired
**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

>Returns true if the symbol has an expiration and the symbol appears
to be expired (e.g. a future for a past year).


* * *

### SymbolParser.displayUsingPercent(symbol) :id=symbolparserdisplayusingpercent
**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

>Returns true if prices for the symbol should be represented as a percentage; false
otherwise.


* * *

