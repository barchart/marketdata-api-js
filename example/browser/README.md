**Breaking Changes**

* Changed the behavior of the SDK in different environments. In a web browser, fewer third-party dependencies are required (reducing the overall footprint when tree-shaking tools are used). However, this change breaks Node.js consumers. For Node.js, an instance of the `EnvironmentForNode` must now be passed to the `Connection` constructor. Alternately, an instance of `XmlParserFactoryForNode` may be passed to the `Connection.connect` function.
* Changed the signature of the `utilities/parsers/ddf` function. It is unlikely that SDK consumers call this function directly. However, if this function is used, an `XmlParser` instance must now me passed the to function.

**Technical Enhancements**

* The [`@xmldom/xmldom`](https://github.com/xmldom/xmldom) dependency is now only used when operating in Node.js. Consequently, tree-shaking tools may now exclude this dependency.