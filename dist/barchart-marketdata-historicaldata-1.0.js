(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.Barchart||(g.Barchart = {}));g=(g.RealtimeData||(g.RealtimeData = {}));g.HistoricalData = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function() {
    'use strict';

    var provider = {
        getInstance: function() {
            var instance = window.$ || window.jQuery || window.jquery;

            if (!instance) {
                throw new Error('jQuery is required for the browser-based version of Barchart utilities.');
            }

            provider.getInstance = function() {
                return instance;
            };

            return instance;
        }
    };

    return provider;
}();
},{}],2:[function(require,module,exports){
var HistoricalDataProvider = require('./http/HistoricalDataProvider');

module.exports = function() {
	'use strict';

	return HistoricalDataProvider;
}();
},{"./http/HistoricalDataProvider":4}],3:[function(require,module,exports){
var Class = require('class.extend');

module.exports = function() {
	'use strict';

	return Class.extend({
		init: function() {

		},

		getHistoricalData: function(parameters, callback) {
			return this._getHistoricalData(parameters, callback);
		},

		_getHistoricalData: function(parameters, callback) {
			return null;
		},

		toString: function() {
			return '[HistoricalDataProviderBase]';
		}
	});
}();
},{"class.extend":6}],4:[function(require,module,exports){
var HistoricalDataProviderBase = require('./../../HistoricalDataProviderBase');

var jQueryProvider = require('./../../../common/jQuery/jQueryProvider');

module.exports = function() {
	'use strict';

	var $ = jQueryProvider.getInstance();

	return HistoricalDataProviderBase.extend({
		init: function() {

		},

		_getHistoricalData: function(params, callback) {
			$.ajax({
				url : 'proxies/historicaldata',
				dataType : 'text',
				data : params
			}).done(function(json) {
				return callback(json);
			});
		},

		toString: function() {
			return '[HistoricalDataProvider]';
		}
	});
}();
},{"./../../../common/jQuery/jQueryProvider":1,"./../../HistoricalDataProviderBase":3}],5:[function(require,module,exports){
var HistoricalDataProvider = require('./../connection/HistoricalDataProvider');

module.exports = function() {
	'use strict';

	return HistoricalDataProvider;
}();
},{"./../connection/HistoricalDataProvider":2}],6:[function(require,module,exports){
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  this.Class = function(){};

  // Create a new Class that inherits from this class
  Class.extend = function(className, prop) {
    if(prop == undefined) {
        prop = className;
       className = "Class";
    }

    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;

            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];

            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }

    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    var func = new Function(
        "return function " + className + "(){ }"
    )();
    Class.prototype.constructor = func;

    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
  };

  //I only added this line
  module.exports = Class;
})();

},{}]},{},[5])(5)
});