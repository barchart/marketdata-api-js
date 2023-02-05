## Contents {docsify-ignore}

* [XmlParser](#XmlParser) 

* [XmlParserFactory](#XmlParserFactory) 

* [XmlParserFactoryForBrowsers](#XmlParserFactoryForBrowsers) 

* [XmlParserFactoryForNode](#XmlParserFactoryForNode) 


* * *

## XmlParser :id=xmlparser
> The abstract definition for an object that parses XML and
> outputs a duck-typed XML document. It is unlikely that SDK
> consumers will need to implement this class.

**Kind**: global abstract class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/utilities/xml/XmlParser  
**File**: /lib/utilities/xml/XmlParser.js  

* *[XmlParser](#XmlParser)*
    * _instance_
        * *[.parse(text)](#XmlParserparse) ⇒ <code>\*</code>*
        * **[._parse(text)](#XmlParser_parse) ⇒ <code>\*</code>**


* * *

### xmlParser.parse(text) :id=xmlparserparse
> Accepts a string and returns a (duck-typed) XML document.

**Kind**: instance method of [<code>XmlParser</code>](#XmlParser)  
**Returns**: <code>\*</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| text | <code>String</code> | 


* * *

### xmlParser.\_parse(text) :id=xmlparser_parse
**Kind**: instance abstract method of [<code>XmlParser</code>](#XmlParser)  
**Returns**: <code>\*</code>  
**Access**: protected  

| Param | Type |
| --- | --- |
| text | <code>String</code> | 


* * *

## XmlParserFactory :id=xmlparserfactory
> An abstract definition for an factory that builds [XmlParser](/content/sdk/lib-utilities-xml?id=xmlparser)
> instances. It is unlikely that SDK consumers will need to implement
> this class.

**Kind**: global abstract class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/utilities/xml/XmlParserFactory  
**File**: /lib/utilities/xml/XmlParserFactory.js  

* * *

### xmlParserFactory.build() :id=xmlparserfactorybuild
> Returns a new [XmlParser](/content/sdk/lib-utilities-xml?id=xmlparser) instance.

**Kind**: instance abstract method of [<code>XmlParserFactory</code>](#XmlParserFactory)  
**Returns**: [<code>XmlParser</code>](#XmlParser)  
**Access**: public  

* * *

## XmlParserFactoryForBrowsers :id=xmlparserfactoryforbrowsers
> An implementation of [XmlParserFactory](/content/sdk/lib-utilities-xml?id=xmlparserfactory) for use with web browsers. Pass
> an instance of this class to the [Connection.connect](#connectionconnect) function when operating
> in a web browser.

**Kind**: global class  
**Extends**: [<code>XmlParserFactory</code>](#XmlParserFactory)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/utilities/xml/XmlParserFactoryForBrowsers  
**File**: /lib/utilities/xml/XmlParserFactoryForBrowsers.js  

* * *

### xmlParserFactoryForBrowsers.build() :id=xmlparserfactoryforbrowsersbuild
> Returns a new [XmlParser](/content/sdk/lib-utilities-xml?id=xmlparser) instance suitable for use
> with a web browser.

**Kind**: instance method of [<code>XmlParserFactoryForBrowsers</code>](#XmlParserFactoryForBrowsers)  
**Overrides**: [<code>build</code>](#XmlParserFactorybuild)  
**Returns**: [<code>XmlParser</code>](#XmlParser)  
**Access**: public  

* * *

## XmlParserFactoryForNode :id=xmlparserfactoryfornode
> An implementation of [XmlParserFactory](/content/sdk/lib-utilities-xml?id=xmlparserfactory) for use by Node.js servers. Pass
> an instance of this class to the [Connection.connect](#connectionconnect) function when
> operating in Node.js.

**Kind**: global class  
**Extends**: [<code>XmlParserFactory</code>](#XmlParserFactory)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/utilities/xml/XmlParserFactoryForNode  
**File**: /lib/utilities/xml/XmlParserFactoryForNode.js  

* * *

### xmlParserFactoryForNode.build() :id=xmlparserfactoryfornodebuild
> Returns a new [XmlParser](/content/sdk/lib-utilities-xml?id=xmlparser) instance suitable for use
> within a Node.js environment.

**Kind**: instance method of [<code>XmlParserFactoryForNode</code>](#XmlParserFactoryForNode)  
**Overrides**: [<code>build</code>](#XmlParserFactorybuild)  
**Returns**: [<code>XmlParser</code>](#XmlParser)  
**Access**: public  

* * *

