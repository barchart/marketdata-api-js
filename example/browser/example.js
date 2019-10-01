(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const version = require('./../../../lib/meta').version;

const Connection = require('./../../../lib/connection/Connection'),
      retrieveConcreteSymbol = require('./../../../lib/connection/snapshots/symbols/retrieveConcrete');

const formatTime = require('./../../../lib/utilities/format/time');

module.exports = (() => {
  'use strict';

  var PageModel = function () {
    var that = this;
    var connection = null;
    that.server = ko.observable('qsws-us-e-02.aws.barchart.com');
    that.username = ko.observable('');
    that.password = ko.observable('');
    that.symbol = ko.observable('');
    that.symbolFocus = ko.observable(false);
    that.mode = ko.observable('Streaming');
    that.activeTemplate = ko.observable('disconnected-template');
    that.version = ko.observable(version);
    that.connected = ko.observable(false);
    that.connecting = ko.observable(false);
    that.paused = ko.observable(false);
    that.canConnect = ko.computed(function () {
      return !that.connecting() && !that.connected();
    });
    that.canDisconnect = ko.computed(function () {
      return that.connected();
    });
    that.canPause = ko.computed(function () {
      return !that.paused();
    });
    that.canResume = ko.computed(function () {
      return that.paused();
    });
    that.canReset = ko.computed(function () {
      var connected = that.connected();
      var activeTemplate = that.activeTemplate();
      return connected && activeTemplate !== 'grid-template';
    });
    that.rows = ko.observableArray();
    that.item = ko.observable(null);
    that.profile = ko.observable(null);

    var handleEvents = function (data) {
      if (data.event) {
        var event = data.event;

        if (event === 'login success') {
          that.connecting(false);
          that.connected(true);
          that.showGrid();
        } else if (event === 'feed paused') {
          that.paused(true);
        } else if (event === 'feed resumed') {
          that.paused(false);
        }

        toastr.info(data.event);
      }
    };

    that.itemDisplay = ko.computed(function () {
      var item = that.item();

      if (item && item.quote()) {
        return JSON.stringify(item.quote(), null, 2);
      } else {
        return null;
      }
    });
    that.profileDisplay = ko.computed(function () {
      var profile = that.profile();

      if (profile) {
        return JSON.stringify(profile, null, 2);
      } else {
        return 'Loading Profile...';
      }
    });

    that.connect = function () {
      that.disconnect();
      var server = that.server();
      var username = that.username();
      var password = that.password();

      if (!server || !username || !password) {
        return;
      }

      that.connecting(true);

      if (connection) {
        connection.off('events', handleEvents);
      }

      connection = new Connection();
      connection.on('events', handleEvents);
      connection.connect(server, username, password);
    };

    that.disconnect = function () {
      if (connection === null) {
        return;
      }

      connection.disconnect();
      connection = null;
      that.rows.removeAll();
      that.connecting(false);
      that.connected(false);
      that.paused(false);
      that.activeTemplate('disconnected-template');
    };

    that.pause = function () {
      connection.pause();
    };

    that.resume = function () {
      connection.resume();
    };

    that.handleLoginKeypress = function (d, e) {
      if (e.keyCode === 13) {
        that.connect();
      }

      return true;
    };

    that.addSymbol = function () {
      var symbol = that.symbol();

      if (!symbol) {
        return;
      }

      var symbols;

      if (symbol === '#SP500') {
        symbols = SP_500.slice(0, 3);
      } else if (symbol === '#C3') {
        symbols = C3;
      } else if (symbol === '#C3_OLD') {
        symbols = C3_OLD;
      } else if (symbol === '#CMDTY') {
        symbols = CMDTY;
      } else if (symbol === '#CMDTY_OLD') {
        symbols = CMDTY_OLD;
      } else if (symbol === '#PLATTS') {
        symbols = PLATTS;
      } else {
        symbols = [symbol];
      }

      function execute(s) {
        var model = new RowModel(s);

        var handleMarketUpdate = function (message) {
          model.quote(connection.getMarketState().getQuote(s));
        };

        model.setMarketUpdateHandler(handleMarketUpdate);
        connection.on('marketUpdate', handleMarketUpdate, s);
        that.rows.push(model);
      }

      for (var i = 0; i < symbols.length; i++) {
        execute(symbols[i]);
      }

      that.showGrid();
    };

    that.lookupProfile = function () {
      var symbol = that.symbol();

      if (!symbol) {
        return;
      }

      that.showProfile(null);
      retrieveConcreteSymbol(symbol).then(function (resolvedSymbol) {
        return connection.getMarketState().getProfile(resolvedSymbol).then(function (profile) {
          if (that.activeTemplate() === 'profile-template') {
            that.showProfile(profile);
          }
        });
      });
    };

    that.removeSymbol = function (model) {
      if (model.getMarketUpdateHandler()) {
        connection.off('marketUpdate', model.getMarketUpdateHandler(), model.symbol);
      }

      if (model.getCumulativeVolumeHandler()) {
        connection.off('cumulativeVolume', model.getCumulativeVolumeHandler(), model.symbol);
      }

      that.rows.remove(model);
    };

    that.handleSymbolKeypress = function (d, e) {
      if (e.keyCode === 13) {
        that.addSymbol();
      }

      return true;
    };

    that.showGrid = function () {
      that.activeTemplate('grid-template');
      that.item(null);
      that.profile(null);
      that.symbolFocus(true);
    };

    that.showItemDetail = function (model) {
      that.symbol(model.symbol);
      that.item(model);
      that.profile(null);
      that.activeTemplate('grid-item-details');
    };

    that.showProfile = function (profile) {
      that.item(null);
      that.profile(profile);
      that.activeTemplate('profile-template');
    };

    that.showCumulativeVolume = function (model) {
      that.symbol(model.symbol);
      that.item(model);
      that.profile(null);
      that.activeTemplate('grid-cumulative-volume-template');
      var symbol = model.symbol;
      var priceLevels = model.priceLevels;

      if (!model.getCumulativeVolumeHandler()) {
        connection.getMarketState().getCumulativeVolume(symbol).then(function (cumulativeVolume) {
          var items = cumulativeVolume.toArray();

          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            priceLevels.push(new PriceLevelModel(item.price, item.volume));
          }

          model.cumulativeVolumeReady(true);
        });

        var handleCumulativeVolume = function (message) {
          if (!model.cumulativeVolumeReady()) {
            return;
          }

          if (message.event === 'reset') {
            priceLevels.removeAll();
          } else if (message.event === 'update') {
            var firstPriceLevel = null;
            var priceLevel = ko.utils.arrayFirst(priceLevels(), function (item) {
              if (firstPriceLevel === null) {
                firstPriceLevel = item;
              }

              return message.price === item.price();
            }) || null;
            var existing = priceLevel !== null;

            if (existing) {
              priceLevel.volume(message.volume);
            } else {
              priceLevel = new PriceLevelModel(message.price, message.volume);

              if (priceLevels.length === 0 || firstPriceLevel.price() > message.price()) {
                priceLevels.unshift(priceLevel);
              } else {
                priceLevels.push(priceLevel);
              }
            }

            var last = model.priceLevelLast();

            if (last !== null) {
              last.updated(false);
            }

            priceLevel.updated(true);
            model.priceLevelLast(priceLevel);
          }
        };

        model.setCumulativeVolumeHandler(handleCumulativeVolume);
        connection.on('cumulativeVolume', handleCumulativeVolume, symbol);
      }
    };

    that.setStreamingMode = function () {
      that.mode('Streaming');

      if (connection !== null) {
        connection.setPollingFrequency(null);
      }
    };

    that.setPollingMode = function () {
      that.mode('Polling');

      if (connection !== null) {
        connection.setPollingFrequency(5000);
      }
    };

    that.disconnect();
  };

  var RowModel = function (symbol) {
    var that = this;
    that.symbol = symbol;
    that.quote = ko.observable(null);
    that.priceLevels = ko.observableArray();
    that.priceLevelLast = ko.observable(null);
    that.cumulativeVolumeReady = ko.observable(false);
    that.displayTime = ko.computed(function () {
      if (that.quote() === null) {
        return '';
      } else {
        return formatTime(that.quote().time, null, true);
      }
    });
    that.handlers = {};

    that.setMarketUpdateHandler = function (handler) {
      that.handlers.marketUpdate = handler;
    };

    that.getMarketUpdateHandler = function () {
      return that.handlers.marketUpdate;
    };

    that.setCumulativeVolumeHandler = function (handler) {
      that.handlers.cumulativeVolume = handler;
    };

    that.getCumulativeVolumeHandler = function () {
      return that.handlers.cumulativeVolume;
    };
  };

  var PriceLevelModel = function (price, volume) {
    var that = this;
    that.price = ko.observable(price);
    that.volume = ko.observable(volume);
    that.updated = ko.observable(false);
  };

  const SP_500 = ['ABT', 'ABBV', 'ACN', 'ATVI', 'AYI', 'ADBE', 'AMD', 'AAP', 'AES', 'AET', 'AMG', 'AFL', 'A', 'APD', 'AKAM', 'ALK', 'ALB', 'ARE', 'ALXN', 'ALGN', 'ALLE', 'AGN', 'ADS', 'LNT', 'ALL', 'GOOGL', 'GOOG', 'MO', 'AMZN', 'AEE', 'AAL', 'AEP', 'AXP', 'AIG', 'AMT', 'AWK', 'AMP', 'ABC', 'AME', 'AMGN', 'APH', 'APC', 'ADI', 'ANDV', 'ANSS', 'ANTM', 'AON', 'AOS', 'APA', 'AIV', 'AAPL', 'AMAT', 'ADM', 'ARNC', 'AJG', 'AIZ', 'T', 'ADSK', 'ADP', 'AZO', 'AVB', 'AVY', 'BHGE', 'BLL', 'BAC', 'BK', 'BCR', 'BAX', 'BBT', 'BDX', 'BRK.B', 'BBY', 'BIIB', 'BLK', 'HRB', 'BA', 'BWA', 'BXP', 'BSX', 'BHF', 'BMY', 'AVGO', 'BF.B', 'CHRW', 'CA', 'COG', 'CDNS', 'CPB', 'COF', 'CAH', 'CBOE', 'KMX', 'CCL', 'CAT', 'CBG', 'CBS', 'CELG', 'CNC', 'CNP', 'CTL', 'CERN', 'CF', 'SCHW', 'CHTR', 'CHK', 'CVX', 'CMG', 'CB', 'CHD', 'CI', 'XEC', 'CINF', 'CTAS', 'CSCO', 'C', 'CFG', 'CTXS', 'CLX', 'CME', 'CMS', 'COH', 'KO', 'CTSH', 'CL', 'CMCSA', 'CMA', 'CAG', 'CXO', 'COP', 'ED', 'STZ', 'COO', 'GLW', 'COST', 'COTY', 'CCI', 'CSRA', 'CSX', 'CMI', 'CVS', 'DHI', 'DHR', 'DRI', 'DVA', 'DE', 'DLPH', 'DAL', 'XRAY', 'DVN', 'DLR', 'DFS', 'DISCA', 'DISCK', 'DISH', 'DG', 'DLTR', 'D', 'DOV', 'DWDP', 'DPS', 'DTE', 'DRE', 'DUK', 'DXC', 'ETFC', 'EMN', 'ETN', 'EBAY', 'ECL', 'EIX', 'EW', 'EA', 'EMR', 'ETR', 'EVHC', 'EOG', 'EQT', 'EFX', 'EQIX', 'EQR', 'ESS', 'EL', 'ES', 'RE', 'EXC', 'EXPE', 'EXPD', 'ESRX', 'EXR', 'XOM', 'FFIV', 'FB', 'FAST', 'FRT', 'FDX', 'FIS', 'FITB', 'FE', 'FISV', 'FLIR', 'FLS', 'FLR', 'FMC', 'FL', 'F', 'FTV', 'FBHS', 'BEN', 'FCX', 'GPS', 'GRMN', 'IT', 'GD', 'GE', 'GGP', 'GIS', 'GM', 'GPC', 'GILD', 'GPN', 'GS', 'GT', 'GWW', 'HAL', 'HBI', 'HOG', 'HRS', 'HIG', 'HAS', 'HCA', 'HCP', 'HP', 'HSIC', 'HSY', 'HES', 'HPE', 'HLT', 'HOLX', 'HD', 'HON', 'HRL', 'HST', 'HPQ', 'HUM', 'HBAN', 'IDXX', 'INFO', 'ITW', 'ILMN', 'IR', 'INTC', 'ICE', 'IBM', 'INCY', 'IP', 'IPG', 'IFF', 'INTU', 'ISRG', 'IVZ', 'IRM', 'JEC', 'JBHT', 'SJM', 'JNJ', 'JCI', 'JPM', 'JNPR', 'KSU', 'K', 'KEY', 'KMB', 'KIM', 'KMI', 'KLAC', 'KSS', 'KHC', 'KR', 'LB', 'LLL', 'LH', 'LRCX', 'LEG', 'LEN', 'LUK', 'LLY', 'LNC', 'LKQ', 'LMT', 'L', 'LOW', 'LYB', 'MTB', 'MAC', 'M', 'MRO', 'MPC', 'MAR', 'MMC', 'MLM', 'MAS', 'MA', 'MAT', 'MKC', 'MCD', 'MCK', 'MDT', 'MRK', 'MET', 'MTD', 'MGM', 'KORS', 'MCHP', 'MU', 'MSFT', 'MAA', 'MHK', 'TAP', 'MDLZ', 'MON', 'MNST', 'MCO', 'MS', 'MOS', 'MSI', 'MYL', 'NDAQ', 'NOV', 'NAVI', 'NTAP', 'NFLX', 'NWL', 'NFX', 'NEM', 'NWSA', 'NWS', 'NEE', 'NLSN', 'NKE', 'NI', 'NBL', 'JWN', 'NSC', 'NTRS', 'NOC', 'NCLH', 'NRG', 'NUE', 'NVDA', 'ORLY', 'OXY', 'OMC', 'OKE', 'ORCL', 'PCAR', 'PKG', 'PH', 'PDCO', 'PAYX', 'PYPL', 'PNR', 'PBCT', 'PEP', 'PKI', 'PRGO', 'PFE', 'PCG', 'PM', 'PSX', 'PNW', 'PXD', 'PNC', 'RL', 'PPG', 'PPL', 'PX', 'PCLN', 'PFG', 'PG', 'PGR', 'PLD', 'PRU', 'PEG', 'PSA', 'PHM', 'PVH', 'QRVO', 'PWR', 'QCOM', 'DGX', 'Q', 'RRC', 'RJF', 'RTN', 'O', 'RHT', 'REG', 'REGN', 'RF', 'RSG', 'RMD', 'RHI', 'ROK', 'COL', 'ROP', 'ROST', 'RCL', 'CRM', 'SBAC', 'SCG', 'SLB', 'SNI', 'STX', 'SEE', 'SRE', 'SHW', 'SIG', 'SPG', 'SWKS', 'SLG', 'SNA', 'SO', 'LUV', 'SPGI', 'SWK', 'SBUX', 'STT', 'SRCL', 'SYK', 'STI', 'SYMC', 'SYF', 'SNPS', 'SYY', 'TROW', 'TGT', 'TEL', 'FTI', 'TXN', 'TXT', 'TMO', 'TIF', 'TWX', 'TJX', 'TMK', 'TSS', 'TSCO', 'TDG', 'TRV', 'TRIP', 'FOXA', 'FOX', 'TSN', 'UDR', 'ULTA', 'USB', 'UA', 'UAA', 'UNP', 'UAL', 'UNH', 'UPS', 'URI', 'UTX', 'UHS', 'UNM', 'VFC', 'VLO', 'VAR', 'VTR', 'VRSN', 'VRSK', 'VZ', 'VRTX', 'VIAB', 'V', 'VNO', 'VMC', 'WMT', 'WBA', 'DIS', 'WM', 'WAT', 'WEC', 'WFC', 'HCN', 'WDC', 'WU', 'WRK', 'WY', 'WHR', 'WMB', 'WLTW', 'WYN', 'WYNN', 'XEL', 'XRX', 'XLNX', 'XL', 'XYL', 'YUM', 'ZBH', 'ZION', 'ZTS'];
  const C3 = ['AL79MRM1.C3', 'BSP9WGQ1.C3', 'RA10BGM1.C3'];
  const CMDTY = ['BC5L09YB.CS', 'EI3E06EI.CS', 'EI3E06EJ.CS', 'USDA-CORN-COND-EXC-AL-2528.CS', 'EURS-BEET-PRICE-SELL-GBR-33877.CS', 'EUJU0Q51.CS'];
  const C3_OLD = ['C3:AL79MRM1', 'C3:BSP9WGQ1', 'C3:RA10BGM1'];
  const CMDTY_OLD = ['BC5L09YB.CM', 'EI3E06EI.CM', 'EI3E06EJ.CM', 'USDA-CORN-COND-EXC-AL-2528.CM', 'EURS-BEET-PRICE-SELL-GBR-33877.CM', 'EUJU0Q51.CM'];
  const PLATTS = ['PLATTS:RD52017', 'PLATTS:RD5MA17', 'PLATTS:RD52018'];
  $(document).ready(function () {
    var pageModel = new PageModel();
    ko.applyBindings(pageModel, $('body')[0]);
  });
})();

},{"./../../../lib/connection/Connection":2,"./../../../lib/connection/snapshots/symbols/retrieveConcrete":8,"./../../../lib/meta":16,"./../../../lib/utilities/format/time":24}],2:[function(require,module,exports){
const array = require('@barchart/common-js/lang/array'),
      object = require('@barchart/common-js/lang/object');

const ConnectionBase = require('./ConnectionBase'),
      parseMessage = require('./../utilities/parse/ddf/message');

const retrieveSnapshots = require('./snapshots/quotes/retrieveSnapshots'),
      SymbolParser = require('./../utilities/parsers/SymbolParser');

const WebSocketAdapterFactory = require('./adapter/WebSocketAdapterFactory'),
      WebSocketAdapterFactoryForBrowsers = require('./adapter/WebSocketAdapterFactoryForBrowsers');

const LoggerFactory = require('./../logging/LoggerFactory');

module.exports = (() => {
  'use strict';

  const _API_VERSION = 4;
  const state = {
    connecting: 'CONNECTING',
    authenticating: 'LOGGING_IN',
    authenticated: 'LOGGED_IN',
    disconnected: 'DISCONNECTED'
  };
  const ascii = {
    soh: '\x01',
    etx: '\x03',
    lf: '\x0A',
    dc4: '\x14'
  };
  const eventTypes = {
    events: {
      requiresSymbol: false
    },
    marketDepth: {
      requiresSymbol: true
    },
    marketUpdate: {
      requiresSymbol: true
    },
    cumulativeVolume: {
      requiresSymbol: true
    },
    timestamp: {
      requiresSymbol: false
    }
  };
  const _RECONNECT_INTERVAL = 5000;
  const _WATCHDOG_INTERVAL = 10000;
  const regex = {};
  regex.cmdty = {};
  regex.cmdty.short = /^(BC|BE|BL|CA|EI|EU|CF|CB|UD)(.*)(\.CS)$/i;
  regex.cmdty.long = /^(BCSD-|BEA-|BLS-|CANS-|EIA-|EURS-|CFTC-|USCB-|USDA-)/i;
  regex.cmdty.alias = /^(BC|BE|BL|CA|EI|EU|CF|CB|UD|BCSD-|BEA-|BLS-|CANS-|EIA-|EURS-|CFTC-|USCB-|USDA-)(.*)(\.CM)$/i;
  regex.c3 = {};
  regex.c3.symbol = /(\.C3)$/i;
  regex.c3.alias = /^(C3:)$/i;
  regex.other = /:/i;

  function ConnectionInternal(marketState) {
    const __logger = LoggerFactory.getLogger('@barchart/marketdata-api-js');

    const __marketState = marketState;
    let __connectionFactory = null;
    let __connection = null;
    let __connectionState = state.disconnected;
    let __paused = false;
    let __reconnectAllowed = false;
    let __pollingFrequency = null;
    let __watchdogToken = null;
    let __watchdogAwake = false;
    let __inboundMessages = [];
    let __marketMessages = [];
    let __pendingTasks = [];
    let __outboundMessages = [];
    let __knownConsumerSymbols = {};
    let __pendingProfileSymbols = {};
    const __listeners = {
      marketDepth: {},
      marketUpdate: {},
      cumulativeVolume: {},
      events: [],
      timestamp: []
    };
    const __loginInfo = {
      username: null,
      password: null,
      server: null
    };
    let __decoder = null; //
    // Functions used to configure the connection.
    //

    /**
     * Changes the subscription mode to use either "polling" or "streaming" mode. To
     * use "polling" mode, pass the number of milliseconds -- any number less than 1,000
     * will be ignored. To use "streaming" mode, pass a null value or an undefined value.
     *
     * @private
     * @param {Number|undefined|null} pollingFrequency
     */

    function setPollingFrequency(pollingFrequency) {
      if (__paused) {
        resume();
      }

      if (pollingFrequency === null || pollingFrequency === undefined) {
        __logger.log('Connection: Switching to streaming mode.');

        __pollingFrequency = null;
      } else if (typeof pollingFrequency === 'number' && !isNaN(pollingFrequency) && !(pollingFrequency < 1000)) {
        __logger.log('Connection: Switching to polling mode.');

        __pollingFrequency = pollingFrequency;
      }
    } //
    // Functions for connecting to and disconnecting from JERQ, monitoring
    // established connections, and handling involuntary disconnects.
    //

    /**
     * Attempts to establish a connection to JERQ, setting the flag to allow
     * reconnection if an involuntary disconnect occurs.
     *
     * @private
     * @param {String} server
     * @param {String} username
     * @param {String} password
     * @param {WebSocketAdapterFactory} webSocketAdapterFactory
     */


    function initializeConnection(server, username, password, webSocketAdapterFactory) {
      __connectionFactory = webSocketAdapterFactory;
      __reconnectAllowed = true;
      connect(server, username, password);
    }
    /**
     * Disconnects from JERQ, setting the flag to prevent further reconnect attempts and
     * clearing internal subscription state.
     *
     * @private
     */


    function terminateConnection() {
      broadcastEvent('events', {
        event: 'disconnecting'
      });
      __reconnectAllowed = false;
      __loginInfo.username = null;
      __loginInfo.password = null;
      __loginInfo.server = null;
      __knownConsumerSymbols = {};
      __pendingProfileSymbols = {};
      __listeners.marketDepth = {};
      __listeners.marketUpdate = {};
      __listeners.cumulativeVolume = {};
      __listeners.events = [];
      __listeners.timestamp = [];
      __paused = false;
      disconnect();
    }
    /**
     * Attempts to establish a connection to JERQ.
     *
     * @private
     * @param {String} server
     * @param {String} username
     * @param {String} password
     */


    function connect(server, username, password) {
      if (!server) {
        throw new Error('Unable to connect, the "server" argument is required.');
      }

      if (!username) {
        throw new Error('Unable to connect, the "username" argument is required.');
      }

      if (!password) {
        throw new Error('Unable to connect, the "password" argument is required.');
      }

      if (__connection !== null) {
        __logger.warn('Connection: Unable to connect, a connection already exists.');

        return;
      }

      __logger.log('Connection: Initializing.');

      __loginInfo.username = username;
      __loginInfo.password = password;
      __loginInfo.server = server;
      __connectionState = state.disconnected;
      __connection = __connectionFactory.build(`wss://${__loginInfo.server}/jerq`);
      __connection.binaryType = 'arraybuffer';
      __decoder = __connection.getDecoder();

      __connection.onopen = () => {
        __logger.log('Connection: Open event received.');
      };

      __connection.onclose = () => {
        __logger.log('Connection: Close event received.');

        __connectionState = state.disconnected;
        stopWatchdog();
        __connection.onopen = null;
        __connection.onclose = null;
        __connection.onmessage = null;
        __connection = null; // There is a race condition. We enqueue network messages and processes
        // them asynchronously in batches. The asynchronous message processing is
        // done by a function called pumpInboundProcessing. So, it's possible we received
        // a login failure message and enqueued it. But, the websocket was closed
        // before the first invocation of pumpInboundProcessing could process the login
        // failure.

        const loginFailed = __inboundMessages.length > 0 && __inboundMessages[0].indexOf('-') === 0;
        __inboundMessages = [];
        __marketMessages = [];
        __pendingTasks = [];
        __outboundMessages = [];

        if (loginFailed) {
          __logger.warn('Connection: Connection closed before login was processed.');

          broadcastEvent('events', {
            event: 'login fail'
          });
        } else {
          __logger.warn('Connection: Connection dropped.');

          broadcastEvent('events', {
            event: 'disconnect'
          });

          if (__reconnectAllowed) {
            __logger.log('Connection: Scheduling reconnect attempt.');

            const reconnectAction = () => connect(__loginInfo.server, __loginInfo.username, __loginInfo.password);

            const reconnectDelay = _RECONNECT_INTERVAL + Math.floor(Math.random() * _WATCHDOG_INTERVAL);

            setTimeout(reconnectAction, reconnectDelay);
          }
        }
      };

      __connection.onmessage = event => {
        __watchdogAwake = false;
        let message = null;

        if (event.data instanceof ArrayBuffer) {
          message = __decoder.decode(event.data);
        } else {
          message = event.data;
        }

        if (message) {
          __inboundMessages.push(message);
        }
      };

      startWatchdog();
    }
    /**
     * Changes state to disconnected and attempts to drop the websocket
     * connection to JERQ.
     *
     * @private
     */


    function disconnect() {
      __logger.warn('Connection: Disconnecting.');

      __connectionState = state.disconnected;
      stopWatchdog();

      if (__connection !== null) {
        try {
          if (__connection.readyState === __connection.OPEN) {
            __connection.send('LOGOUT\r\n');
          }

          __logger.warn('Connection: Closing connection.');

          __connection.close();
        } catch (e) {
          __logger.warn('Connection: Unable to close connection.');
        }
      }

      __inboundMessages = [];
      __marketMessages = [];
      __pendingTasks = [];
      __outboundMessages = [];
    }

    function pause() {
      if (__paused) {
        __logger.warn('Connection: Unable to pause, feed is already paused.');

        return;
      }

      __logger.log('Connection: Pausing feed.');

      if (__pollingFrequency === null) {
        enqueueStopTasks();
        enqueueHeartbeat();
      }

      __paused = true;
      broadcastEvent('events', {
        event: 'feed paused'
      });
    }

    function resume() {
      if (!__paused) {
        __logger.warn('Connection: Unable to resume, feed is not paused.');

        return;
      }

      __logger.log('Connection: Resuming feed.');

      __paused = false;

      if (__pollingFrequency === null) {
        enqueueGoTasks();
      }

      broadcastEvent('events', {
        event: 'feed resumed'
      });
    }
    /**
     * Starts heartbeat connection monitoring.
     *
     * @private
     */


    function startWatchdog() {
      stopWatchdog();

      __logger.log('Connection: Watchdog started.');

      const watchdogAction = () => {
        if (__watchdogAwake) {
          __logger.log('Connection: Watchdog triggered, connection silent for too long. Triggering disconnect.');

          stopWatchdog();
          disconnect();
        } else {
          __watchdogAwake = true;
        }
      };

      __watchdogToken = setInterval(watchdogAction, _WATCHDOG_INTERVAL);
      __watchdogAwake = true;
    }
    /**
     * Stops heartbeat connection monitoring.
     *
     * @private
     */


    function stopWatchdog() {
      if (__watchdogToken !== null) {
        __logger.log('Connection: Watchdog stopped.');

        clearInterval(__watchdogToken);
      }

      __watchdogAwake = false;
    } //
    // Functions for handling user-initiated requests to start subscriptions, stop subscriptions,
    // and request profiles.
    //

    /**
     * Subscribes to an event (e.g. quotes, heartbeats, connection status, etc), given
     * the event type, a callback, and a symbol (if necessary).
     *
     * @private
     * @param {Subscription.EventType} eventType
     * @param {Function} handler
     * @param {String=} symbol
     */


    function on(eventType, handler, symbol) {
      if (typeof eventType !== 'string') {
        throw new Error('The "eventType" argument must be a string.');
      }

      if (typeof handler !== 'function') {
        throw new Error('The "handler" argument must be a function.');
      }

      if (!eventTypes.hasOwnProperty(eventType)) {
        __logger.log('Consumer: Unable to process "on" event, event type is not recognized.');

        return;
      }

      const eventData = eventTypes[eventType];

      if (eventData.requiresSymbol) {
        if (typeof symbol !== 'string') {
          throw new Error(`The "symbol" argument must be a string for [ ${eventType} ] events.`);
        }

        symbol = symbol.toUpperCase().trim();

        if (!symbol || !(symbol.indexOf(' ') < 0)) {
          __logger.log('Consumer: Unable to process "on" command, the "symbol" argument is invalid.');

          __logger.trace();

          return;
        }
      }

      const addListener = listeners => {
        listeners = listeners || [];
        const add = !listeners.some(candidate => {
          return candidate === handler;
        });
        let updatedListeners;

        if (add) {
          updatedListeners = listeners.slice(0);
          updatedListeners.push(handler);
        } else {
          updatedListeners = listeners;
        }

        return updatedListeners;
      };

      const subscribe = (streamingTaskName, snapshotTaskName, listenerMap, sharedListenerMaps) => {
        const consumerSymbol = symbol;
        const producerSymbol = SymbolParser.getProducerSymbol(consumerSymbol);

        if (SymbolParser.getIsExpired(consumerSymbol)) {
          __logger.warn(`Connection: Ignoring subscription for expired symbol [ ${consumerSymbol} ]`);

          return false;
        }

        addKnownConsumerSymbol(consumerSymbol, producerSymbol);
        const producerListenerExists = getProducerListenerExists(producerSymbol, sharedListenerMaps.concat(listenerMap));
        listenerMap[consumerSymbol] = addListener(listenerMap[consumerSymbol]);

        if (!__paused) {
          if (producerListenerExists) {
            addTask(snapshotTaskName, producerSymbol);
          } else {
            addTask(streamingTaskName, producerSymbol);
          }
        }

        return true;
      };

      switch (eventType) {
        case 'events':
          __listeners.events = addListener(__listeners.events);
          break;

        case 'marketDepth':
          if (subscribe('MD_GO', 'MD_REFRESH', __listeners.marketDepth, [])) {
            if (__marketState.getBook(symbol)) {
              handler({
                type: 'INIT',
                symbol: symbol
              });
            }
          }

          break;

        case 'marketUpdate':
          if (subscribe('MU_GO', 'MU_REFRESH', __listeners.marketUpdate, [__listeners.cumulativeVolume])) {
            if (__marketState.getQuote(symbol)) {
              handler({
                type: 'INIT',
                symbol: symbol
              });
            }
          }

          break;

        case 'cumulativeVolume':
          if (subscribe('MU_GO', 'MU_REFRESH', __listeners.cumulativeVolume, [__listeners.marketUpdate])) {
            __marketState.getCumulativeVolume(symbol, container => {
              container.on('events', handler);
            });
          }

          break;

        case 'timestamp':
          __listeners.timestamp = addListener(__listeners.timestamp);
          break;
      }
    }
    /**
     * Drops a subscription to an event for a specific handler callback. If other
     * subscriptions to the same event (as determined by strict equality of the
     * handler) the subscription will continue to operate for other handlers.
     *
     * @private
     * @param {Subscription.EventType} eventType
     * @param {Function} handler
     * @param {String=} symbol
     */


    function off(eventType, handler, symbol) {
      if (typeof eventType !== 'string') {
        throw new Error('The "eventType" argument must be a string.');
      }

      if (typeof handler !== 'function') {
        throw new Error('The "handler" argument must be a function.');
      }

      if (!eventTypes.hasOwnProperty(eventType)) {
        __logger.log(`Consumer: Unable to process "off" command, event type is not supported [ ${eventType} ].`);

        __logger.trace();

        return;
      }

      const eventData = eventTypes[eventType];

      if (eventData.requiresSymbol) {
        if (typeof symbol !== 'string') {
          throw new Error(`The "symbol" argument must be a string for [ ${eventType} ] events.`);
        }

        symbol = symbol.toUpperCase().trim();

        if (!symbol || !(symbol.indexOf(' ') < 0)) {
          __logger.log('Consumer: Unable to process "off" command, the "symbol" argument is empty.');

          __logger.trace();

          return;
        }
      }

      const removeHandler = listeners => {
        const listenersToFilter = listeners || [];
        return listenersToFilter.filter(candidate => {
          return candidate !== handler;
        });
      };

      const unsubscribe = (stopTaskName, listenerMap, sharedListenerMaps) => {
        const consumerSymbol = symbol;
        const producerSymbol = SymbolParser.getProducerSymbol(consumerSymbol);
        const listenerMaps = sharedListenerMaps.concat(listenerMap);
        let previousProducerListenerExists = getProducerListenerExists(producerSymbol, listenerMaps);
        let currentProducerListenerExists;
        listenerMap[consumerSymbol] = removeHandler(listenerMap[consumerSymbol] || []);

        if (listenerMap[consumerSymbol].length === 0) {
          delete listenerMap[consumerSymbol];
        }

        currentProducerListenerExists = getProducerListenerExists(producerSymbol, listenerMaps);

        if (previousProducerListenerExists && !currentProducerListenerExists && !__paused) {
          addTask(stopTaskName, producerSymbol);

          if (!getProducerSymbolsExist()) {
            enqueueHeartbeat();
          }
        }
      };

      switch (eventType) {
        case 'events':
          __listeners.events = removeHandler(__listeners.events);
          break;

        case 'marketDepth':
          unsubscribe('MD_STOP', __listeners.marketDepth, []);
          break;

        case 'marketUpdate':
          unsubscribe('MU_STOP', __listeners.marketUpdate, [__listeners.cumulativeVolume]);
          break;

        case 'cumulativeVolume':
          unsubscribe('MU_STOP', __listeners.cumulativeVolume, [__listeners.marketUpdate]);

          __marketState.getCumulativeVolume(symbol, container => {
            container.off('events', handler);
          });

          break;

        case 'timestamp':
          __listeners.timestamp = removeHandler(__listeners.timestamp);
          break;
      }
    }
    /**
     * Enqueues a request to retrieve a profile.
     * 
     * @private
     * @param {String} symbol
     */


    function handleProfileRequest(symbol) {
      if (typeof symbol !== 'string') {
        throw new Error('The "symbol" argument must be a string.');
      }

      const consumerSymbol = symbol.toUpperCase().trim();

      if (!consumerSymbol || !(consumerSymbol.indexOf(' ') < 0)) {
        __logger.log('Consumer: Unable to process profile request, the "symbol" argument is empty.');

        __logger.trace();

        return;
      }

      const producerSymbol = SymbolParser.getProducerSymbol(consumerSymbol);
      const pendingConsumerSymbols = __pendingProfileSymbols[producerSymbol] || [];

      if (!pendingConsumerSymbols.some(candidate => candidate === consumerSymbol)) {
        pendingConsumerSymbols.push(consumerSymbol);
      }

      if (!pendingConsumerSymbols.some(candidate => candidate === producerSymbol)) {
        pendingConsumerSymbols.push(producerSymbol);
      }

      __pendingProfileSymbols[producerSymbol] = pendingConsumerSymbols;
      addTask('P_SNAPSHOT', producerSymbol);
    } //
    // Utility functions for managing the "task" queue (e.g. work items that likely
    // trigger outbound messages to JERQ.
    //

    /**
     * Adds a task to a queue for asynchronous processing.
     *
     * @private
     * @param {String} id
     * @param {String|null} symbol
     */


    function addTask(id, symbol) {
      if (__connectionState !== state.authenticated) {
        return;
      }

      const lastIndex = __pendingTasks.length - 1;

      if (!(lastIndex < 0) && __pendingTasks[lastIndex].id === id && symbol !== null) {
        __pendingTasks[lastIndex].symbols.push(symbol);
      } else {
        __pendingTasks.push({
          id: id,
          symbols: [symbol]
        });
      }
    }

    function enqueueHeartbeat() {
      addTask('H_GO', null);
    }
    /**
     * Schedules symbol subscribe tasks for all symbols with listeners, typically
     * used after a reconnect (or in polling mode).
     *
     * @private
     */


    function enqueueGoTasks() {
      const marketUpdateSymbols = getProducerSymbols([__listeners.marketUpdate, __listeners.cumulativeVolume]);
      const marketDepthSymbols = getProducerSymbols([__listeners.marketDepth]);
      marketUpdateSymbols.forEach(symbol => {
        addTask('MU_GO', symbol);
      });
      marketDepthSymbols.forEach(symbol => {
        addTask('MD_GO', symbol);
      });
      const pendingProfileSymbols = array.unique(object.keys(__pendingProfileSymbols).filter(s => !marketUpdateSymbols.some(already => already === s)));
      pendingProfileSymbols.forEach(symbol => {
        addTask('P_SNAPSHOT', symbol);
      });
    }
    /**
     * Schedules symbol unsubscribe tasks for all symbols with listeners.
     *
     * @private
     */


    function enqueueStopTasks() {
      getProducerSymbols([__listeners.marketUpdate, __listeners.cumulativeVolume]).forEach(symbol => {
        addTask('MU_STOP', symbol);
      });
      getProducerSymbols([__listeners.marketDepth]).forEach(symbol => {
        addTask('MD_STOP', symbol);
      });
    } //
    // Functions to process the queue of inbound network messages, authentication handshake
    // messages are handled synchronously. Market-related messages are placed onto a queue
    // for asynchronous processing.
    //

    /**
     * Processes a single inbound message from the network. Any message pertaining
     * to the authentication handshake is intercepted and handled synchronously. 
     * Any message pertaining to market state is placed onto another queue for 
     * asynchronous processing.
     *
     * @private
     * @param {String} message - The message, as received from the network.
     */


    function processInboundMessage(message) {
      if (__connectionState === state.disconnected) {
        __connectionState = state.connecting;
      }

      if (__connectionState === state.connecting) {
        const lines = message.split('\n');

        if (lines.some(line => line == '+++')) {
          __connectionState = state.authenticating;

          __logger.log('Connection: Sending credentials.');

          __connection.send(`LOGIN ${__loginInfo.username}:${__loginInfo.password} VERSION=${_API_VERSION}\r\n`);
        }
      } else if (__connectionState === state.authenticating) {
        const firstCharacter = message.charAt(0);

        if (firstCharacter === '+') {
          __connectionState = state.authenticated;

          __logger.log('Connection: Login accepted.');

          broadcastEvent('events', {
            event: 'login success'
          });

          if (__paused) {
            __logger.log('Connection: Establishing heartbeat only -- feed is paused.');

            enqueueHeartbeat();
          } else {
            __logger.log('Connection: Establishing subscriptions for heartbeat and existing symbols.');

            enqueueHeartbeat();
            enqueueGoTasks();
          }
        } else if (firstCharacter === '-') {
          __logger.log('Connection: Login failed.');

          broadcastEvent('events', {
            event: 'login fail'
          });
          disconnect();
        }
      }

      if (__connectionState === state.authenticated) {
        __marketMessages.push(message);
      }
    }
    /**
     * Drains the queue of inbound network messages and schedules another
     * run. Any error that is encountered triggers a disconnect.
     *
     * @private
     */


    function pumpInboundProcessing() {
      try {
        while (__inboundMessages.length > 0) {
          processInboundMessage(__inboundMessages.shift());
        }
      } catch (e) {
        __logger.warn('Pump Inbound: An error occurred during inbound message queue processing. Disconnecting.', e);

        disconnect();
      }

      setTimeout(pumpInboundProcessing, 125);
    } //
    // Functions to process the queue of market-related messages, updating market
    // state and notifying interested subscribers.
    //

    /**
     * Invokes consumer-supplied callbacks in response to new events (e.g. market
     * state updates, heartbeats, connection status changes, etc).
     *
     * @private
     * @param {String} eventType
     * @param {Object} message
     */


    function broadcastEvent(eventType, message) {
      let listeners;

      if (eventType === 'events') {
        listeners = __listeners.events;
      } else if (eventType === 'marketDepth') {
        listeners = __listeners.marketDepth[message.symbol];
      } else if (eventType === 'marketUpdate') {
        listeners = __listeners.marketUpdate[message.symbol];
      } else if (eventType === 'timestamp') {
        listeners = __listeners.timestamp;
      } else {
        __logger.warn(`Broadcast: Unable to notify subscribers of [ ${eventType} ] event.`);

        listeners = null;
      }

      if (listeners) {
        listeners.forEach(listener => {
          try {
            listener(message);
          } catch (e) {
            __logger.warn(`Broadcast: A consumer-supplied listener for [ ${eventType} ] events threw an error. Continuing.,`, e);
          }
        });
      }
    }
    /**
     * Processes a parsed market message. Updates internal market state and invokes
     * callbacks for interested subscribers.
     * 
     * @private
     * @param {Object} message
     */


    function processMarketMessage(message) {
      __marketState.processMessage(message);

      if (message.type === 'BOOK') {
        broadcastEvent('marketDepth', message);
      } else if (message.type === 'TIMESTAMP') {
        broadcastEvent('timestamp', __marketState.getTimestamp());
      } else {
        broadcastEvent('marketUpdate', message);
      }
    }
    /**
     * Converts a JERQ message into an object suitable for passing to
     * the {@link MarketState#processMessage} function. Then processes and
     * broadcasts the parsed message. Also, if other "consumer" symbols are 
     * aliases of the "producer" symbol in the message, the message is cloned 
     * and processed for the "consumer" symbols alias(es) too.
     * 
     * @private
     * @param {String} message
     */


    function parseMarketMessage(message) {
      try {
        let parsed = parseMessage(message);
        const producerSymbol = parsed.symbol;

        if (parsed.type) {
          if (producerSymbol) {
            let consumerSymbols = __knownConsumerSymbols[producerSymbol] || [];

            if (__pendingProfileSymbols.hasOwnProperty(producerSymbol)) {
              let profileSymbols = __pendingProfileSymbols[producerSymbol] || [];
              consumerSymbols = array.unique(consumerSymbols.concat(profileSymbols));
              delete __pendingProfileSymbols[producerSymbol];
            }

            consumerSymbols.forEach(consumerSymbol => {
              let messageToProcess;

              if (consumerSymbol === producerSymbol) {
                messageToProcess = parsed;
              } else {
                messageToProcess = Object.assign({}, parsed);
                messageToProcess.symbol = consumerSymbol;
              }

              processMarketMessage(messageToProcess);
            });
          } else {
            processMarketMessage(parsed);
          }
        } else {
          __logger.log(message);
        }
      } catch (e) {
        __logger.error(`An error occurred while parsing a market message [ ${message} ]. Continuing.`, e);
      }
    }
    /**
     * Drains the queue of market network messages and schedules another
     * run. Any error encountered triggers a disconnect.
     *
     * @private
     */


    function pumpMarketProcessing() {
      const suffixLength = 9;
      let done = false;

      while (!done) {
        let s = __marketMessages.shift();

        if (!s) {
          done = true;
        } else {
          let skip = false;
          let msgType = 1; // Assume DDF message containing \x03

          let idx = -1;
          let idxETX = s.indexOf(ascii.etx);
          let idxNL = s.indexOf(ascii.lf);

          if (idxNL > -1 && (idxETX < 0 || idxNL < idxETX)) {
            idx = idxNL;
            msgType = 2;
          } else if (idxETX > -1) {
            idx = idxETX;
          }

          if (idx > -1) {
            let epos = idx + 1;

            if (msgType == 1) {
              if (s.length < idx + suffixLength + 1) {
                if (__marketMessages.length > 0) __marketMessages[0] = s + __marketMessages[0];else {
                  __marketMessages.unshift(s);

                  done = true;
                }
                skip = true;
              } else if (s.substr(idx + 1, 1) == ascii.dc4) {
                epos += suffixLength + 1;
              }
            }

            if (!skip) {
              let s2 = s.substring(0, epos);

              if (msgType == 2) {
                s2 = s2.trim();
              } else {
                idx = s2.indexOf(ascii.soh);

                if (idx > 0) {
                  s2 = s2.substring(idx);
                }
              }

              if (s2.length > 0) {
                parseMarketMessage(s2);
              }

              s = s.substring(epos);

              if (s.length > 0) {
                if (__marketMessages.length > 0) {
                  __marketMessages[0] = s + __marketMessages[0];
                } else {
                  __marketMessages.unshift(s);
                }
              }
            }
          } else {
            if (s.length > 0) {
              if (__marketMessages.length > 0) {
                __marketMessages[0] = s + __marketMessages[0];
              } else {
                __marketMessages.unshift(s);

                done = true;
              }
            }
          }
        }

        if (__marketMessages.length === 0) {
          done = true;
        }
      }

      setTimeout(pumpMarketProcessing, 125);
    } //
    // Functions to process the queue of tasks. Tasks define a request to start or
    // stop a symbol subscription (or a profile lookup). Tasks are formatted as 
    // JERQ command strings and placed onto another queue for asynchronous processing.
    //

    /**
     * Used in "polling" mode. The task queue is ignored. However, JERQ formatted command
     * strings, requesting snapshot updates from JERQ, are generated for all existing
     * symbol subscriptions and placed onto a queue for asynchronous processing. Also, 
     * for any symbol not supported by JERQ, out-of-band snapshot requests are made.
     *
     * @private
     */


    function processTasksInPollingMode() {
      if (__connectionState !== state.authenticated || __outboundMessages.length !== 0 || __paused) {
        return;
      }

      __pendingTasks = [];
      const quoteBatches = getSymbolBatches(getProducerSymbols([__listeners.marketUpdate, __listeners.cumulativeVolume]), getIsStreamingSymbol);
      quoteBatches.forEach(batch => {
        __outboundMessages.push(`GO ${batch.map(s => `${s}=sc`).join(',')}`);
      });
      const profileBatches = getSymbolBatches(array.unique(object.keys(__pendingProfileSymbols)).filter(s => !quoteBatches.some(q => q === s)), getIsStreamingSymbol);
      profileBatches.forEach(batch => {
        __outboundMessages.push(`GO ${batch.map(s => `${s}=s`).join(',')}`);
      });
      const bookBatches = getSymbolBatches(getProducerSymbols([__listeners.marketDepth]), getIsStreamingSymbol);
      bookBatches.forEach(batch => {
        __outboundMessages.push(`GO ${batch.map(s => `${s}=b`).join(',')}`);
      });
      const snapshotBatches = getSymbolBatches(getProducerSymbols([__listeners.marketUpdate]), getIsSnapshotSymbol);
      snapshotBatches.forEach(batch => {
        processSnapshots(batch);
      });
    }
    /**
     * Used in "streaming" mode. The task queue is drained and JERQ formatted command
     * strings are generated for each task. These commands placed onto a queue for
     * asynchronous transmission to JERQ. Also, for any symbol not supported by JERQ, 
     * out-of-band snapshot requests are made.
     *
     * @private
     */


    function processTasksInStreamingMode() {
      if (__connectionState !== state.authenticated) {
        return;
      }

      while (__pendingTasks.length > 0) {
        const task = __pendingTasks.shift();

        if (task.callback) {
          task.callback();
        } else if (task.id) {
          let command = null;
          let suffix = null;

          switch (task.id) {
            case 'MD_GO':
              command = 'GO';
              suffix = 'Bb';
              break;

            case 'MU_GO':
              command = 'GO';
              suffix = 'Ssc';
              break;

            case 'MD_REFRESH':
              command = 'GO';
              suffix = 'b';
              break;

            case 'MU_REFRESH':
              command = 'GO';
              suffix = 'sc';
              break;

            case 'P_SNAPSHOT':
              command = 'GO';
              suffix = 's';
              break;

            case 'MD_STOP':
              command = 'STOP';
              suffix = 'Bb';
              break;

            case 'MU_STOP':
              command = 'STOP';
              suffix = 'Ssc';
              break;

            case 'H_GO':
              command = 'GO _TIMESTAMP_';
              suffix = null;
              break;
          }

          if (command === null) {
            __logger.warn('Pump Tasks: An unsupported task was found in the tasks queue.');

            continue;
          }

          if (suffix === null) {
            __outboundMessages.push(command);
          } else {
            let batchSize;

            if (task.id === 'MD_GO' || task.id === 'MD_STOP') {
              batchSize = 1;
            } else {
              batchSize = 250;
            }

            const symbolsUnique = array.unique(task.symbols);
            const symbolsStreaming = symbolsUnique.filter(getIsStreamingSymbol);
            const symbolsSnapshot = symbolsUnique.filter(getIsSnapshotSymbol);

            while (symbolsStreaming.length > 0) {
              const batch = symbolsStreaming.splice(0, batchSize);

              __outboundMessages.push(`${command} ${batch.map(s => `${s}=${suffix}`).join(',')}`);
            }

            if (task.id === 'MU_GO' || task.id === 'MU_REFRESH') {
              while (symbolsSnapshot.length > 0) {
                const batch = symbolsSnapshot.splice(0, batchSize);
                processSnapshots(batch);
              }
            }
          }
        }
      }
    }
    /**
     * Drains the queue of "tasks" and schedules another run. Any error
     * encountered triggers a disconnect.
     *
     * @private
     * @param {Boolean=} polling - Indicates if the previous run used polling mode.
     */


    function pumpTaskProcessing(polling) {
      let pumpDelegate;
      let pumpDelay;

      if (__pollingFrequency === null) {
        pumpDelay = 250;
        pumpDelegate = processTasksInStreamingMode;

        if (polling && !__paused) {
          enqueueGoTasks();
        }
      } else {
        pumpDelay = __pollingFrequency;
        pumpDelegate = processTasksInPollingMode;

        if (!polling) {
          enqueueStopTasks();
          processTasksInStreamingMode();
        }
      }

      let pumpWrapper = () => {
        try {
          pumpDelegate();
        } catch (e) {
          __logger.warn('Pump Tasks: An error occurred during task queue processing. Disconnecting.', e);

          disconnect();
        }

        pumpTaskProcessing(pumpDelegate === processTasksInPollingMode);
      };

      setTimeout(pumpWrapper, pumpDelay);
    } //
    // Functions to process the queue of outbound messages (to JERQ).
    //

    /**
     * Sends outbound messages to JERQ and reschedules another run.
     *
     * @private
     */


    function pumpOutboundProcessing() {
      if (__connectionState === state.authenticated) {
        while (__outboundMessages.length > 0) {
          try {
            const message = __outboundMessages.shift();

            __logger.log(message);

            __connection.send(message);
          } catch (e) {
            __logger.warn('Pump Outbound: An error occurred during outbound message queue processing. Disconnecting.', e);

            disconnect();
            break;
          }
        }
      }

      setTimeout(pumpOutboundProcessing, 200);
    } //
    // Functions used to maintain market state for symbols which are not supported
    // by JERQ.
    //

    /**
     * Makes requests for snapshot updates for a batch of symbols to an out-of-band
     * service (i.e. OnDemand). This function is typically used for symbols that are
     * not supported by JERQ.
     *
     * @private
     * @param {Array<String>} symbols
     */


    function processSnapshots(symbols) {
      if (__connectionState !== state.authenticated || symbols.length === 0) {
        return;
      }

      retrieveSnapshots(symbols, __loginInfo.username, __loginInfo.password).then(quotes => {
        quotes.forEach(message => processMarketMessage(message));
      }).catch(e => {
        __logger.log('Snapshots: Out-of-band snapshot request failed for [ ${symbols.join()} ]', e);
      });
    }
    /**
     * Periodically requests snapshots for existing symbols subscriptions which do not
     * stream through JERQ.
     *
     * @private
     */


    function pumpSnapshotRefresh() {
      if (__connectionState === state.authenticated) {
        try {
          const snapshotBatches = getSymbolBatches(getProducerSymbols([__listeners.marketUpdate]), getIsSnapshotSymbol);
          snapshotBatches.forEach(batch => {
            processSnapshots(batch);
          });
        } catch (e) {
          __logger.warn('Snapshots: An error occurred during refresh processing. Ignoring.', e);
        }
      }

      setTimeout(pumpSnapshotRefresh, 3600000);
    } //
    // Internal utility functions for querying symbol subscriptions.
    //

    /**
     * Returns the number of unique "producer" symbols which have user interest.
     *
     * @private
     * @returns {Number}
     */


    function getProducerSymbolCount() {
      return getProducerSymbols([__listeners.marketUpdate, __listeners.marketDepth, __listeners.cumulativeVolume]).length;
    }
    /**
     * If true, if at least one "producer" symbol has user interest.
     *
     * @private
     * @returns {Boolean}
     */


    function getProducerSymbolsExist() {
      return !(object.empty(__listeners.marketUpdate) && object.empty(__listeners.marketDepth) && object.empty(__listeners.cumulativeVolume));
    }
    /**
     * Extracts all "producer" symbols from an array of listener maps.
     *
     * A listener map is keyed by "consumer" symbol -- the symbol used
     * to establish the subscription (e.g. ESZ18), which is could be an
     * alias for a "producer" symbol (e.g. ESZ8).
     *
     * @private
     * @param {Array<Object>} listenerMaps
     * @returns {Array<String>}
     */


    function getProducerSymbols(listenerMaps) {
      const producerSymbols = listenerMaps.reduce((symbols, listenerMap) => {
        return symbols.concat(object.keys(listenerMap).map(consumerSymbol => SymbolParser.getProducerSymbol(consumerSymbol)));
      }, []);
      return array.unique(producerSymbols);
    }
    /**
     * A predicate that determines if an upstream subscription should
     * exist for a "producer" symbol, based on the consumer symbols in
     * the array of listener maps.
     *
     * A "consumer" symbol (e.g. ESZ18) is the symbol used to establish a
     * subscription with this library and a "producer" symbol (e.g. ESZ8)
     * is used to communicate with upstream services (e.g. JERQ). In other
     * words, a "consumer" symbol could be an alias for a "producer" symbol
     * and multiple "consumer" symbols can exist for a single "producer" symbol.
     *
     * @private
     * @param {String} producerSymbol
     * @param {Array<Object>} listenerMaps
     * @returns {Boolean}
     */


    function getProducerListenerExists(producerSymbol, listenerMaps) {
      const consumerSymbols = __knownConsumerSymbols[producerSymbol] || [];
      return consumerSymbols.some(consumerSymbol => getConsumerListenerExists(consumerSymbol, listenerMaps));
    }
    /**
     * A predicate that determines if an upstream subscription should
     * exist for a "consumer" symbol, based on the consumer symbols in
     * the array of listener maps.
     *
     * A "consumer" symbol (e.g. ESZ18) is the symbol used to establish a
     * subscription with this library and a "producer" symbol (e.g. ESZ8)
     * is used to communicate with upstream services (e.g. JERQ). In other
     * words, a "consumer" symbol could be an alias for a "producer" symbol
     * and multiple "consumer" symbols can exist for a single "producer" symbol.
     *
     * @private
     * @param {String} consumerSymbol
     * @param {Array<Object>} listenerMaps
     * @returns {boolean}
     */


    function getConsumerListenerExists(consumerSymbol, listenerMaps) {
      return listenerMaps.some(listenerMap => listenerMap.hasOwnProperty(consumerSymbol) && listenerMap[consumerSymbol].length !== 0);
    }
    /**
     * Links a "consumer" symbol to a "producer" symbol in the map
     * of known aliases. This map of "known" consumer symbols is
     * keyed by "producer" symbols and has an array of "consumer"
     * symbols as values.
     *
     * A "consumer" symbol (e.g. ESZ18) is the symbol used to establish a
     * subscription with this library and a "producer" symbol (e.g. ESZ8)
     * is used to communicate with upstream services (e.g. JERQ). In other
     * words, a "consumer" symbol could be an alias for a "producer" symbol
     * and multiple "consumer" symbols can exist for a single "producer" symbol.
     *
     * @private
     * @param {String} consumerSymbol
     * @param {String} producerSymbol
     */


    function addKnownConsumerSymbol(consumerSymbol, producerSymbol) {
      if (!__knownConsumerSymbols.hasOwnProperty(producerSymbol)) {
        __knownConsumerSymbols[producerSymbol] = [];
      }

      const consumerSymbols = __knownConsumerSymbols[producerSymbol];

      if (!consumerSymbols.some(candidate => candidate === consumerSymbol)) {
        consumerSymbols.push(consumerSymbol);
      }
    } //
    // Pure utility functions.
    //

    /**
     * Predicate used to determine if a symbol is supported by JERQ (allowing a
     * streaming market data subscription to be established).
     *
     * @private
     * @param {String} symbol
     * @returns {Boolean}
     */


    function getIsStreamingSymbol(symbol) {
      return !getIsSnapshotSymbol(symbol);
    }
    /**
     * Predicate used to determine if a symbol is not supported by JERQ (which
     * requires out-of-band efforts to get market data for the symbol).
     *
     * @private
     * @param {String} symbol
     * @returns {Boolean}
     */


    function getIsSnapshotSymbol(symbol) {
      return regex.cmdty.long.test(symbol) || regex.cmdty.short.test(symbol) || regex.cmdty.alias.test(symbol) || regex.c3.symbol.test(symbol) || regex.c3.alias.test(symbol) || regex.other.test(symbol);
    }
    /**
     * Breaks an array of symbols into multiple array, each containing no more
     * than 250 symbols. Also, symbols are filtered according to a predicate.
     *
     * @private
     * @param {Array<String>} symbols
     * @param {Function} predicate
     * @returns {Array<Array<String>>}
     */


    function getSymbolBatches(symbols, predicate) {
      const candidates = symbols.filter(predicate);
      const partitions = [];

      while (candidates.length !== 0) {
        partitions.push(candidates.splice(0, 250));
      }

      return partitions;
    } //
    // Begin "pumps" which perform repeated processing.
    //


    setTimeout(pumpInboundProcessing, 125);
    setTimeout(pumpOutboundProcessing, 200);
    setTimeout(pumpMarketProcessing, 125);
    setTimeout(pumpTaskProcessing, 250);
    setTimeout(pumpSnapshotRefresh, 3600000);
    return {
      connect: initializeConnection,
      disconnect: terminateConnection,
      pause: pause,
      resume: resume,
      off: off,
      on: on,
      getProducerSymbolCount: getProducerSymbolCount,
      setPollingFrequency: setPollingFrequency,
      handleProfileRequest: handleProfileRequest
    };
  }
  /**
   * Entry point for library. This implementation is intended for browser environments and uses built-in Websocket support.
   *
   * @public
   * @extends {ConnectionBase}
   */


  class Connection extends ConnectionBase {
    constructor() {
      super();
      this._internal = ConnectionInternal(this.getMarketState());
    }

    _connect(webSocketAdapterFactory) {
      this._internal.connect(this.getServer(), this.getUsername(), this.getPassword(), webSocketAdapterFactory === null ? new WebSocketAdapterFactoryForBrowsers() : webSocketAdapterFactory);
    }

    _disconnect() {
      this._internal.disconnect();
    }

    _pause() {
      this._internal.pause();
    }

    _resume() {
      this._internal.resume();
    }

    _on() {
      this._internal.on.apply(this._internal, arguments);
    }

    _off() {
      this._internal.off.apply(this._internal, arguments);
    }

    _getActiveSymbolCount() {
      return this._internal.getProducerSymbolCount();
    }

    _onPollingFrequencyChanged(pollingFrequency) {
      return this._internal.setPollingFrequency(pollingFrequency);
    }

    _handleProfileRequest(symbol) {
      this._internal.handleProfileRequest(symbol);
    }

    toString() {
      return '[WebsocketConnection]';
    }

  }

  return Connection;
})();

},{"./../logging/LoggerFactory":10,"./../utilities/parse/ddf/message":25,"./../utilities/parsers/SymbolParser":28,"./ConnectionBase":3,"./adapter/WebSocketAdapterFactory":5,"./adapter/WebSocketAdapterFactoryForBrowsers":6,"./snapshots/quotes/retrieveSnapshots":7,"@barchart/common-js/lang/array":29,"@barchart/common-js/lang/object":32}],3:[function(require,module,exports){
const MarketState = require('./../marketState/MarketState');

module.exports = (() => {
  'use strict';
  /**
   * Contract for communicating with remove market data servers and
   * querying current market state.
   *
   * @protected
   * @interface
   */

  class ConnectionBase {
    constructor() {
      this._server = null;
      this._username = null;
      this._password = null;
      this._marketState = new MarketState(symbol => this._handleProfileRequest(symbol));
      this._pollingFrequency = null;
    }
    /**
     * Connects to the given server with username and password.
     *
     * @public
     * @param {string} server
     * @param {string} username
     * @param {string} password
     * @param {WebSocketAdapterFactory=} webSocketAdapterFactory
     */


    connect(server, username, password, webSocketAdapterFactory) {
      this._server = server;
      this._username = username;
      this._password = password;

      this._connect(webSocketAdapterFactory || null);
    }
    /**
     * @protected
     * @param {WebSocketAdapterFactory=} webSocketAdapterFactory
     * @ignore
     */


    _connect(webSocketAdapterFactory) {
      return;
    }
    /**
     * Forces a disconnect from the server.
     *
     * @public
     */


    disconnect() {
      this._server = null;
      this._username = null;
      this._password = null;

      this._disconnect();
    }
    /**
     * @protected
     * @ignore
     */


    _disconnect() {
      return;
    }
    /**
     * Causes the market state to stop updating. All subscriptions are maintained.
     *
     * @public
     */


    pause() {
      this._pause();
    }
    /**
     * @protected
     * @ignore
     */


    _pause() {
      return;
    }
    /**
     * Causes the market state to begin updating again (after {@link ConnectionBase#pause} has been called).
     *
     * @public
     */


    resume() {
      this._resume();
    }
    /**
     * @protected
     * @ignore
     */


    _resume() {
      return;
    }
    /**
     * Initiates a subscription to an {@link Subscription.EventType} and
     * registers the callback for notifications.
     *
     * @public
     * @param {Subscription.EventType} eventType
     * @param {function} callback - notified each time the event occurs
     * @param {String=} symbol - A symbol, if applicable, to the given {@link Subscription.EventType}
     */


    on() {
      this._on.apply(this, arguments);
    }
    /**
     * @protected
     * @ignore
     */


    _on() {
      return;
    }
    /**
     * Stops notification of the callback for the {@link Subscription.EventType}.
     * See {@link ConnectionBase#on}.
     *
     * @public
     * @param {Subscription.EventType} eventType - the {@link Subscription.EventType} which was passed to {@link ConnectionBase#on}
     * @param {function} callback - the callback which was passed to {@link ConnectionBase#on}
     * @param {String=} symbol - A symbol, if applicable, to the given {@link Subscription.EventType}
     */


    off() {
      this._off.apply(this, arguments);
    }
    /**
     * @protected
     * @ignore
     */


    _off() {
      return;
    }

    getActiveSymbolCount() {
      return this._getActiveSymbolCount();
    }

    _getActiveSymbolCount() {
      return null;
    }
    /**
     * The frequency, in milliseconds, used to poll for changes to {@link Quote}
     * objects. A null value indicates streaming updates (default).
     *
     * @public
     * @return {number|null}
     */


    getPollingFrequency() {
      return this._pollingFrequency;
    }
    /**
     * Sets the polling frequency, in milliseconds. A null value indicates
     * streaming market updates (where polling is not used).
     *
     * @public
     * @param {number|null} pollingFrequency
     */


    setPollingFrequency(pollingFrequency) {
      if (this._pollingFrequency !== pollingFrequency) {
        if (pollingFrequency && pollingFrequency > 0) {
          this._pollingFrequency = pollingFrequency;
        } else {
          this._pollingFrequency = null;
        }

        this._onPollingFrequencyChanged(this._pollingFrequency);
      }
    }
    /**
     * @protected
     * @ignore
     */


    _onPollingFrequencyChanged(pollingFrequency) {
      return;
    }
    /**
     * @protected
     * @ignore
     */


    _handleProfileRequest(symbol) {
      return;
    }
    /**
     * Returns the {@link MarketState} singleton, which can be used to access {@link Quote}, {@link Profile}, and {@link CumulativeVolume} objects.
     *
     * @return {MarketState}
     */


    getMarketState() {
      return this._marketState;
    }
    /**
     * @public
     * @returns {null|string}
     */


    getServer() {
      return this._server;
    }
    /**
     * @public
     * @returns {null|string}
     */


    getPassword() {
      return this._password;
    }
    /**
     * @public
     * @returns {null|string}
     */


    getUsername() {
      return this._username;
    }

    toString() {
      return '[ConnectionBase]';
    }

  }

  return ConnectionBase;
})();

},{"./../marketState/MarketState":13}],4:[function(require,module,exports){
module.exports = (() => {
  'use strict';
  /**
   * An interface for establishing and interacting with a WebSocket connection.
   *
   * @public
   * @interface
   */

  class WebSocketAdapter {
    constructor(host) {}

    get CONNECTING() {
      return null;
    }

    get OPEN() {
      return null;
    }

    get CLOSING() {
      return null;
    }

    get CLOSED() {
      return null;
    }

    get binaryType() {
      return null;
    }

    set binaryType(value) {
      return;
    }

    get readyState() {
      return null;
    }

    set readyState(value) {
      return;
    }

    get onopen() {
      return null;
    }

    set onopen(callback) {
      return;
    }

    get onclose() {
      return null;
    }

    set onclose(callback) {
      return;
    }

    get onmessage() {
      return null;
    }

    set onmessage(callback) {
      return;
    }

    send(message) {
      return;
    }

    close() {
      return;
    }

    getDecoder() {
      return null;
    }

    toString() {
      return '[WebSocketAdapter]';
    }

  }

  return WebSocketAdapter;
})();

},{}],5:[function(require,module,exports){
module.exports = (() => {
  'use strict';
  /**
   * An interface for creating WebSocket {@link WebSocketAdapter} instances.
   *
   * @public
   * @interface
   */

  class WebSocketAdapterFactory {
    constructor() {}
    /**
     * Returns a new {@link WebSocketAdapter} instance.
     *
     * @public
     * @param {String} host
     * @returns {null}
     */


    build(host) {
      return null;
    }

    toString() {
      return '[WebSocketAdapterFactory]';
    }

  }

  return WebSocketAdapterFactory;
})();

},{}],6:[function(require,module,exports){
const WebSocketAdapter = require('./WebSocketAdapter'),
      WebSocketAdapterFactory = require('./WebSocketAdapterFactory');

const LoggerFactory = require('./../../logging/LoggerFactory');

module.exports = (() => {
  'use strict';

  let __window;

  try {
    __window = window || self || null;
  } catch (e) {
    __window = null;
  }
  /**
   * An implementation of {@link WebSocketAdapterFactory} for use with web browsers.
   *
   * @public
   * @extends {WebSocketAdapterFactory}
   */


  class WebSocketAdapterFactoryForBrowsers extends WebSocketAdapterFactory {
    constructor() {
      super();
      this._logger = LoggerFactory.getLogger('@barchart/marketdata-api-js');
    }

    build(host) {
      if (!__window || !__window.WebSocket) {
        this._logger.warn('Connection: Unable to connect, WebSockets are not supported.');

        return;
      }

      return new WebSocketAdapterForBrowsers(host);
    }

    toString() {
      return '[WebSocketAdapterFactoryForBrowsers]';
    }

  }
  /**
   * A {@link WebSocketAdapter} for use with web browsers.
   * 
   * @private
   * @extends {WebSocketAdapter}
   */


  class WebSocketAdapterForBrowsers extends WebSocketAdapter {
    constructor(host) {
      super(host);
      this._socket = new WebSocket(host);
    }

    get CONNECTING() {
      return WebSocket.CONNECTING;
    }

    get OPEN() {
      return WebSocket.OPEN;
    }

    get CLOSING() {
      return WebSocket.CLOSING;
    }

    get CLOSED() {
      return WebSocket.CLOSED;
    }

    get binaryType() {
      return this._socket.binaryType;
    }

    set binaryType(value) {
      this._socket.binaryType = value;
    }

    get readyState() {
      return this._socket.readyState;
    }

    set readyState(value) {
      this._socket.readyState = value;
    }

    get onopen() {
      return this._socket.onopen;
    }

    set onopen(callback) {
      this._socket.onopen = callback;
    }

    get onclose() {
      return this._socket.onclose;
    }

    set onclose(callback) {
      this._socket.onclose = callback;
    }

    get onmessage() {
      return this._socket.onmessage;
    }

    set onmessage(callback) {
      this._socket.onmessage = callback;
    }

    send(message) {
      this._socket.send(message);
    }

    close() {
      this._socket.close();
    }

    getDecoder() {
      let decoder;

      if (__window) {
        decoder = new __window.TextDecoder();
      } else {
        decoder = {
          decode: data => String.fromCharCode.apply(null, new Uint8Array(data))
        };
      }

      return decoder;
    }

    toString() {
      return '[WebSocketAdapterForBrowsers]';
    }

  }

  return WebSocketAdapterFactoryForBrowsers;
})();

},{"./../../logging/LoggerFactory":10,"./WebSocketAdapter":4,"./WebSocketAdapterFactory":5}],7:[function(require,module,exports){
const axios = require('axios');

const array = require('@barchart/common-js/lang/array'),
      is = require('@barchart/common-js/lang/is');

const convertDateToDayCode = require('../../../utilities/convert/dateToDayCode'),
      convertDayCodeToNumber = require('../../../utilities/convert/dayCodeToNumber'),
      convertBaseCodeToUnitCode = require('../../../utilities/convert/baseCodeToUnitCode');

module.exports = (() => {
  'use strict';

  const regex = {};
  regex.day = /^([0-9]{4}).?([0-9]{2}).?([0-9]{2})$/;
  regex.cmdty = {};
  regex.cmdty.short = /^(BC|BE|BL|CA|EI|EU|CF|CB|UD)(.*)(\.CS)$/i;
  regex.cmdty.long = /^(BCSD-|BEA-|BLS-|CANS-|EIA-|EURS-|CFTC-|USCB-|USDA-)/i;
  regex.cmdty.alias = /^(BC|BE|BL|CA|EI|EU|CF|CB|UD|BCSD-|BEA-|BLS-|CANS-|EIA-|EURS-|CFTC-|USCB-|USDA-)(.*)(\.CM)$/i;
  regex.c3 = {};
  regex.c3.symbol = /(\.C3)$/i;
  regex.c3.alias = /^(C3:)(.*)$/i;
  regex.c3.currencies = {};
  regex.c3.currencies.eur = /^(EUR)\/(.*)$/i;
  regex.c3.currencies.rub = /^(RUB)\/(.*)$/i;
  regex.c3.currencies.uah = /^(UAH)\/(.*)$/i;
  regex.c3.currencies.usd = /^(USD|Usc|\$|)\/(.*)$/i;
  /**
   * Executes an HTTP request for a quote snapshot(s) and returns a
   * promise of quote refresh message(s) (suitable for processing by
   * the {@link MarketState#processMessage} function).
   *
   * @function
   * @param {String|Array<String>} symbols
   * @param {String} username
   * @param {String} password
   * @returns {Promise<Array>}
   */

  function retrieveSnapshots(symbols, username, password) {
    return Promise.resolve().then(() => {
      let symbolsToUse;

      if (is.string(symbols)) {
        symbolsToUse = [symbols];
      } else if (Array.isArray(symbols)) {
        symbolsToUse = symbols;
      } else {
        throw new Error('The "symbols" argument must be a string or an array of strings.');
      }

      if (symbolsToUse.some(s => !is.string(s))) {
        throw new Error('The "symbols" can only contain strings.');
      }

      if (!is.string(username)) {
        throw new Error('The "username" argument must be a string.');
      }

      if (!is.string(password)) {
        throw new Error('The "password" argument must be a string.');
      }

      const aliases = {};
      const getCmdtySymbols = [];
      const getQuoteSymbols = [];
      symbolsToUse.forEach(symbol => {
        const concrete = getConcreteSymbol(symbol);

        if (concrete !== symbol) {
          aliases[concrete] = symbol;
        }

        if (regex.cmdty.long.test(concrete) || regex.cmdty.short.test(concrete)) {
          getCmdtySymbols.push(concrete);
        } else {
          getQuoteSymbols.push(concrete);
        }
      });
      const promises = [];

      if (getCmdtySymbols.length !== 0) {
        promises.push(retrieveSnapshotsUsingGetCmdtyStats(getCmdtySymbols, username, password));
      }

      if (getQuoteSymbols.length !== 0) {
        promises.push(retrieveSnapshotsUsingGetQuote(getQuoteSymbols, username, password));
      }

      if (promises.length === 0) {
        return Promise.resolve([]);
      }

      return Promise.all(promises).then(results => {
        const quotes = array.flatten(results, true);
        quotes.forEach(quote => {
          const concrete = quote.symbol;

          if (aliases.hasOwnProperty(concrete)) {
            quote.symbol = aliases[concrete];
          }
        });
        return quotes;
      });
    });
  }

  const ADDITIONAL_FIELDS = ['exchange', 'bid', 'bidSize', 'ask', 'askSize', 'tradeSize', 'numTrades', 'settlement', 'previousLastPrice'];

  function retrieveSnapshotsUsingGetQuote(symbols, username, password) {
    return Promise.resolve().then(() => {
      const options = {
        url: `https://webapp-proxy.aws.barchart.com/v1/proxies/ondemand/getQuote.json?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&symbols=${encodeURIComponent(symbols.join())}&fields=${encodeURIComponent(ADDITIONAL_FIELDS.join())}`,
        method: 'GET'
      };
      return Promise.resolve(axios(options)).then(response => {
        const results = response.data.results || [];
        const messages = results.map(result => {
          const message = {};
          message.type = 'REFRESH_QUOTE';
          message.symbol = result.symbol.toUpperCase();
          message.name = result.name;
          message.exchange = result.exchange;

          if (result.unitCode !== null) {
            message.unitcode = convertBaseCodeToUnitCode(parseInt(result.unitCode));
          } else {
            message.unitcode = '2';
          }

          message.tradeTime = new Date(result.tradeTimestamp);
          let dayCode;

          if (is.string(result.dayCode) && result.dayCode.length === 1) {
            dayCode = result.dayCode;
          } else {
            dayCode = convertDateToDayCode(message.tradeTime);
          }

          message.day = dayCode;
          message.dayNum = convertDayCodeToNumber(dayCode);
          message.flag = result.flag;
          message.mode = result.mode;
          message.lastPrice = result.lastPrice;
          message.tradeSize = result.tradeSize;
          message.numberOfTrades = result.numTrades;
          message.bidPrice = result.bid;
          message.bidSize = result.bidSize;
          message.askPrice = result.ask;
          message.askSize = result.askSize;
          message.settlementPrice = result.settlement;
          message.previousPrice = result.previousLastPrice;
          message.openPrice = result.open;
          message.highPrice = result.high;
          message.lowPrice = result.low;
          message.volume = result.volume;
          message.lastUpdate = message.tradeTime;

          if (regex.c3.symbol.test(message.symbol)) {
            const c3 = {};
            c3.currency = null;
            c3.delivery = null;

            if (result.commodityDataCurrency) {
              c3.currency = getC3Currency(result.commodityDataCurrency);
            }

            if (result.commodityDataDelivery) {
              c3.delivery = result.commodityDataDelivery;
            }

            message.additional = {
              c3: c3
            };
          }

          return message;
        });
        return messages;
      });
    });
  }

  function retrieveSnapshotsUsingGetCmdtyStats(symbols, username, password) {
    return Promise.resolve().then(() => {
      const options = {
        url: `https://webapp-proxy.aws.barchart.com/v1/proxies/ondemand/getCmdtyQuotes.json?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&symbols=${encodeURIComponent(symbols.join(','))}`,
        method: 'GET'
      };
      return Promise.resolve(axios(options)).then(response => {
        const results = response.data.results || [];
        const messages = symbols.reduce((accumulator, symbol) => {
          const result = results.find(result => result.symbol === symbol || result.shortSymbol === symbol);

          if (!result) {
            return accumulator;
          }

          const match = result.tradeTimestamp.match(regex.day);
          const date = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
          const dayCode = convertDateToDayCode(date);
          const message = {};
          message.type = 'REFRESH_QUOTE';

          if (regex.cmdty.long.test(symbol)) {
            message.symbol = result.symbol.toUpperCase();
          } else {
            message.symbol = result.shortSymbol.toUpperCase();
          }

          message.name = result.shortName;
          message.exchange = 'CSTATS';
          message.unitcode = '2';
          message.day = dayCode;
          message.dayNum = convertDayCodeToNumber(dayCode);
          message.lastPrice = result.lastPrice;

          if (result.previousClose) {
            message.previousPrice = result.previousClose;
          }

          message.lastUpdate = date;
          accumulator.push(message);
          return accumulator;
        }, []);
        return messages;
      });
    });
  }

  function getC3Currency(lotSizeFix) {
    if (regex.c3.currencies.eur.test(lotSizeFix)) {
      return 'EUR';
    } else if (regex.c3.currencies.rub.test(lotSizeFix)) {
      return 'RUB';
    } else if (regex.c3.currencies.uah.test(lotSizeFix)) {
      return 'UAH';
    } else if (regex.c3.currencies.usd.test(lotSizeFix)) {
      return 'USD';
    } else {
      return null;
    }
  }

  function getConcreteSymbol(symbol) {
    if (regex.cmdty.alias.test(symbol)) {
      return symbol.replace(regex.cmdty.alias, '$1$2.CS');
    } else if (regex.c3.alias.test(symbol)) {
      return symbol.replace(regex.c3.alias, '$2.C3');
    } else {
      return symbol;
    }
  }

  return retrieveSnapshots;
})();

},{"../../../utilities/convert/baseCodeToUnitCode":17,"../../../utilities/convert/dateToDayCode":18,"../../../utilities/convert/dayCodeToNumber":19,"@barchart/common-js/lang/array":29,"@barchart/common-js/lang/is":31,"axios":33}],8:[function(require,module,exports){
const axios = require('axios');

const is = require('@barchart/common-js/lang/is');

module.exports = (() => {
  'use strict';
  /**
   * Promise-based utility for resolving symbol aliases (e.g. ES*1 is a reference
   * to the front month for the ES contract -- not a concrete symbol).
   *
   * @function
   * @param {String} symbol - The symbol to lookup (i.e. the alias).
   * @returns {Promise<String>}
   */

  function retrieveConcreteSymbol(symbol) {
    return Promise.resolve().then(() => {
      if (!is.string(symbol)) {
        throw new Error('The "symbol" argument must be a string.');
      }

      if (symbol.length === 0) {
        throw new Error('The "symbol" argument must be at least one character.');
      }

      const options = {
        url: `https://instruments-prod.aws.barchart.com/instruments/${encodeURIComponent(symbol)}`,
        method: 'GET'
      };
      return Promise.resolve(axios(options)).then(response => {
        if (!response.data || !response.data.instrument || !response.data.instrument.symbol) {
          throw new Error(`The server was unable to resolve symbol ${symbol}.`);
        }

        return response.data.instrument.symbol;
      });
    });
  }

  return retrieveConcreteSymbol;
})();

},{"@barchart/common-js/lang/is":31,"axios":33}],9:[function(require,module,exports){
module.exports = (() => {
  'use strict';
  /**
   * An interface for writing log messages.
   *
   * @public
   * @interface
   */

  class Logger {
    constructor() {}
    /**
     * Writes a log message.
     *
     * @public
     */


    log() {
      return;
    }
    /**
     * Writes a log message, at "debug" level.
     *
     * @public
     */


    debug() {
      return;
    }
    /**
     * Writes a log message, at "info" level.
     *
     * @public
     */


    info() {
      return;
    }
    /**
     * Writes a log message, at "warn" level.
     *
     * @public
     */


    warn() {
      return;
    }
    /**
     * Writes a log message, at "error" level.
     *
     * @public
     */


    error() {
      return;
    }

    toString() {
      return '[Logger]';
    }

  }

  return Logger;
})();

},{}],10:[function(require,module,exports){
const Logger = require('./Logger'),
      LoggerProvider = require('./LoggerProvider');

module.exports = (() => {
  'use strict';

  let __provider = null;
  /**
   * Static utilities for interacting with the log system.
   *
   * @public
   * @interface
   */

  class LoggerFactory {
    constructor() {}
    /**
     * Configures the library to write log messages to the console.
     *
     * @public
     * @static
     */


    static configureForConsole() {
      LoggerFactory.configure(new ConsoleLoggerProvider());
    }
    /**
     * Configures the mute all log messages.
     *
     * @public
     * @static
     */


    static configureForSilence() {
      LoggerFactory.configure(new EmptyLoggerProvider());
    }
    /**
     * Configures the library to delegate any log messages to a custom
     * implementation of the {@link LoggerProvider} interface.
     *
     * @public
     * @static
     * @param {LoggerProvider} provider
     */


    static configure(provider) {
      if (__provider === null && provider instanceof LoggerProvider) {
        __provider = provider;
      }
    }
    /**
     * Returns an instance of {@link Logger} for a specific category.
     *
     * @public
     * @static
     * @param {String} category
     * @return {Logger}
     */


    static getLogger(category) {
      if (__provider === null) {
        LoggerFactory.configureForConsole();
      }

      return __provider.getLogger(category);
    }

    toString() {
      return '[LoggerFactory]';
    }

  }

  let __consoleLogger = null;

  class ConsoleLoggerProvider extends LoggerProvider {
    constructor() {
      super();
    }

    getLogger(category) {
      if (__consoleLogger === null) {
        __consoleLogger = new ConsoleLogger();
      }

      return __consoleLogger;
    }

    toString() {
      return '[ConsoleLoggerProvider]';
    }

  }

  class ConsoleLogger extends Logger {
    constructor() {
      super();
    }

    log() {
      console.log.apply(console, arguments);
    }

    trace() {
      console.trace.apply(console, arguments);
    }

    info() {
      console.info.apply(console, arguments);
    }

    warn() {
      console.warn.apply(console, arguments);
    }

    error() {
      console.error.apply(console, arguments);
    }

    toString() {
      return '[ConsoleLogger]';
    }

  }

  let __emptyLogger = null;

  class EmptyLoggerProvider extends LoggerProvider {
    constructor() {
      super();
    }

    getLogger(category) {
      if (__emptyLogger === null) {
        __emptyLogger = new EmptyLogger();
      }

      return __emptyLogger;
    }

    toString() {
      return '[EmptyLoggerProvider]';
    }

  }

  class EmptyLogger extends Logger {
    constructor() {
      super();
    }

    log() {
      return;
    }

    trace() {
      return;
    }

    info() {
      return;
    }

    warn() {
      return;
    }

    error() {
      return;
    }

    toString() {
      return '[ConsoleLogger]';
    }

  }

  return LoggerFactory;
})();

},{"./Logger":9,"./LoggerProvider":11}],11:[function(require,module,exports){
module.exports = (() => {
  'use strict';
  /**
   * An interface for generating {@link Logger} instances.
   *
   * @public
   * @interface
   */

  class LoggerProvider {
    constructor() {}
    /**
     * Returns an instance of {@link Logger}.
     *
     * @public
     * @param {String} category
     * @returns {Logger}
     */


    getLogger(category) {
      return null;
    }

    toString() {
      return '[LoggerProvider]';
    }

  }

  return LoggerProvider;
})();

},{}],12:[function(require,module,exports){
const object = require('@barchart/common-js/lang//object');

const LoggerFactory = require('./../logging/LoggerFactory');

module.exports = (() => {
  'use strict';

  const events = {
    update: 'update',
    reset: 'reset'
  };
  /**
   * @typedef PriceLevel
   * @inner
   * @type Object
   * @property {number} price
   * @property {number} volume
   */

  /**
   * An aggregation of the total volume traded at each price level for a
   * single instrument.
   *
   * @public
   */

  class CumulativeVolume {
    constructor(symbol, tickIncrement) {
      /**
       * @property {string} symbol
       */
      this.symbol = symbol;
      this._tickIncrement = tickIncrement;
      this._handlers = [];
      this._priceLevels = {};
      this._highPrice = null;
      this._lowPrice = null;
      this._logger = LoggerFactory.getLogger('@barchart/marketdata-api-js');
    }
    /**
     * <p>Registers an event handler for a given event.</p>
     * <p>The following events are supported:
     * <ul>
     *   <li>update -- when a new price level is added, or an existing price level mutates.</li>
     *   <li>reset -- when all price levels are cleared.</li>
     * </ul>
     * </p>
     *
     * @ignore
     * @param {string} eventType
     * @param {function} handler - callback notified each time the event occurs
     */


    on(eventType, handler) {
      if (eventType !== 'events') {
        return;
      }

      const i = this._handlers.indexOf(handler);

      if (i < 0) {
        const copy = this._handlers.slice(0);

        copy.push(handler);
        this._handlers = copy;
        this.toArray().forEach(priceLevel => {
          sendPriceVolumeUpdate(this, handler, priceLevel);
        });
      }
    }
    /**
     * Unregisters an event handler for a given event. See {@link CumulativeVolume#on}.
     *
     * @ignore
     * @param {string} eventType - the event which was passed to {@link CumulativeVolume#on}
     * @param {function} handler - the callback which was passed to {@link CumulativeVolume#on}
     */


    off(eventType, handler) {
      if (eventType !== 'events') {
        return;
      }

      const i = this._handlers.indexOf(handler);

      if (!(i < 0)) {
        const copy = this._handlers.slice(0);

        copy.splice(i, 1);
        this._handlers = copy;
      }
    }
    /**
     * @ignore
     */


    getTickIncrement() {
      return this._tickIncrement;
    }
    /**
     * Given a numeric price, returns the volume traded at that price level.
     *
     * @public
     * @param {number} price
     * @returns {number}
     */


    getVolume(price) {
      const priceString = price.toString();
      const priceLevel = this._priceLevels[priceString];

      if (priceLevel) {
        return priceLevel.volume;
      } else {
        return 0;
      }
    }
    /**
     * Increments the volume at a given price level. Used primarily
     * when a trade occurs.
     *
     * @ignore
     * @param {number} price
     * @param {number} volume - amount to add to existing cumulative volume
     */


    incrementVolume(price, volume) {
      if (this._highPrice && this._lowPrice) {
        if (price > this._highPrice) {
          for (let p = this._highPrice + this._tickIncrement; p < price; p += this._tickIncrement) {
            broadcastPriceVolumeUpdate(this, this._handlers, addPriceVolume(this._priceLevels, p.toString(), p));
          }

          this._highPrice = price;
        } else if (price < this._lowPrice) {
          for (let p = this._lowPrice - this._tickIncrement; p > price; p -= this._tickIncrement) {
            broadcastPriceVolumeUpdate(this, this._handlers, addPriceVolume(this._priceLevels, p.toString(), p));
          }

          this._lowPrice = price;
        }
      } else {
        this._lowPrice = this._highPrice = price;
      }

      let priceString = price.toString();
      let priceLevel = this._priceLevels[priceString];

      if (!priceLevel) {
        priceLevel = addPriceVolume(this._priceLevels, priceString, price);
      }

      priceLevel.volume += volume;
      broadcastPriceVolumeUpdate(this, this._handlers, priceLevel);
    }
    /**
     * Clears the data structure. Used primarily when a "reset" message
     * is received.
     *
     * @ignore
     */


    reset() {
      this._priceLevels = {};
      this._highPrice = null;
      this._lowPrice = null;

      this._handlers.forEach(handler => {
        handler({
          container: this,
          event: events.reset
        });
      });
    }
    /**
     * Returns an array of all price levels. This is an expensive operation. Observing
     * an ongoing subscription is preferred (see {@link Connection#on}).
     *
     * @return {PriceLevel[]}
     */


    toArray() {
      const array = object.keys(this._priceLevels).map(p => {
        const priceLevel = this._priceLevels[p];
        return {
          price: priceLevel.price,
          volume: priceLevel.volume
        };
      });
      array.sort((a, b) => {
        return a.price - b.price;
      });
      return array;
    }

    dispose() {
      this._priceLevels = {};
      this._highPrice = null;
      this._lowPrice = null;
      this._handlers = [];
    }
    /**
     * Copies the price levels from one {@link CumulativeVolume} instance to
     * a newly {@link CumulativeVolume} created instance.
     *
     * @ignore
     * @param {string} symbol - The symbol to assign to the cloned instance.
     * @param {CumulativeVolume} source - The instance to copy.
     * @return {CumulativeVolume}
     */


    static clone(symbol, source) {
      const clone = new CumulativeVolume(symbol, source.getTickIncrement());
      source.toArray().forEach(priceLevel => {
        clone.incrementVolume(priceLevel.price, priceLevel.volume);
      });
      return clone;
    }

    toString() {
      return '[CumulativeVolume]';
    }

  }

  const sendPriceVolumeUpdate = (container, handler, priceLevel) => {
    try {
      handler({
        container: container,
        event: events.update,
        price: priceLevel.price,
        volume: priceLevel.volume
      });
    } catch (e) {
      this._logger.error('An error was thrown by a cumulative volume observer.', e);
    }
  };

  const broadcastPriceVolumeUpdate = (container, handlers, priceLevel) => {
    handlers.forEach(handler => {
      sendPriceVolumeUpdate(container, handler, priceLevel);
    });
  };

  const addPriceVolume = (priceLevels, priceString, price) => {
    const priceLevel = {
      price: price,
      volume: 0
    };
    priceLevels[priceString] = priceLevel;
    return priceLevel;
  };

  return CumulativeVolume;
})();

},{"./../logging/LoggerFactory":10,"@barchart/common-js/lang//object":32}],13:[function(require,module,exports){
const CumulativeVolume = require('./CumulativeVolume'),
      Profile = require('./Profile'),
      Quote = require('./Quote');

const convertDayCodeToNumber = require('./../utilities/convert/dayCodeToNumber'),
      SymbolParser = require('../utilities/parsers/SymbolParser');

const LoggerFactory = require('./../logging/LoggerFactory');

module.exports = (() => {
  'use strict';

  function MarketStateInternal(handleProfileRequest) {
    const _logger = LoggerFactory.getLogger('@barchart/marketdata-api-js');

    const _book = {};
    const _quote = {};
    const _cvol = {};
    const _profileCallbacks = {};

    let _timestamp;

    const _getOrCreateBook = symbol => {
      let book = _book[symbol];

      if (!book) {
        book = {
          symbol: symbol,
          bids: [],
          asks: []
        };
        const producerSymbol = SymbolParser.getProducerSymbol(symbol);
        const producerBook = _book[producerSymbol];

        if (producerBook) {
          book.bids = producerBook.bids.slice(0);
          book.asks = producerBook.asks.slice(0);
        }

        _book[symbol] = book;
      }

      return book;
    };

    const _getOrCreateCumulativeVolume = symbol => {
      let cv = _cvol[symbol];

      if (!cv) {
        cv = {
          container: null,
          callbacks: []
        };
        const producerSymbol = SymbolParser.getProducerSymbol(symbol);
        const producerCvol = _cvol[producerSymbol];

        if (producerCvol && producerCvol.container) {
          cv.container = CumulativeVolume.clone(symbol, producerCvol.container);
        }

        _cvol[symbol] = cv;
      }

      return cv;
    };

    const _getOrCreateQuote = symbol => {
      let quote = _quote[symbol];

      if (!quote) {
        const producerSymbol = SymbolParser.getProducerSymbol(symbol);
        const producerQuote = _quote[producerSymbol];

        if (producerQuote) {
          quote = Quote.clone(symbol, producerQuote);
        } else {
          quote = new Quote(symbol);
        }

        _quote[symbol] = quote;
      }

      return quote;
    };

    const _getOrCreateProfile = symbol => {
      let p = Profile.Profiles[symbol];

      if (!p) {
        const producerSymbol = SymbolParser.getProducerSymbol(symbol);
        const producerProfile = Profile.Profiles[producerSymbol];

        if (producerProfile) {
          p = new Profile(symbol, producerProfile.name, producerProfile.exchange, producerProfile.unitCode, producerProfile.pointValue, producerProfile.tickIncrement);
        }
      }

      return p;
    };

    const _processMessage = message => {
      const symbol = message.symbol;

      if (message.type === 'TIMESTAMP') {
        _timestamp = message.timestamp;
        return;
      } // Process book messages first, they don't need profiles, etc.


      if (message.type === 'BOOK') {
        const b = _getOrCreateBook(symbol);

        b.asks = message.asks;
        b.bids = message.bids;
        return;
      }

      if (message.type == 'REFRESH_CUMULATIVE_VOLUME') {
        let cv = _getOrCreateCumulativeVolume(symbol);

        let container = cv.container;

        if (container) {
          container.reset();
        } else {
          cv.container = container = new CumulativeVolume(symbol, message.tickIncrement);
          const callbacks = cv.callbacks || [];
          callbacks.forEach(callback => {
            callback(container);
          });
          cv.callbacks = null;
        }

        message.priceLevels.forEach(priceLevel => {
          container.incrementVolume(priceLevel.price, priceLevel.volume);
        });
        return;
      }

      let p = _getOrCreateProfile(symbol);

      if (!p && message.type !== 'REFRESH_QUOTE') {
        _logger.warn('No profile found for ' + symbol);

        _logger.log(message);

        return;
      }

      let q = _getOrCreateQuote(symbol);

      if (!q.day && message.day) {
        q.day = message.day;
        q.dayNum = convertDayCodeToNumber(q.day);
      }

      if (q.day && message.day) {
        const dayNum = convertDayCodeToNumber(message.day);

        if (dayNum > q.dayNum || q.dayNum - dayNum > 5) {
          // Roll the quote
          q.day = message.day;
          q.dayNum = dayNum;
          q.flag = 'p';
          q.bidPrice = 0.0;
          q.bidSize = undefined;
          q.askPrice = undefined;
          q.askSize = undefined;

          if (q.settlementPrice) {
            q.previousPrice = q.settlementPrice;
            q.settlementPrice = undefined;
          } else if (q.lastPrice) {
            q.previousPrice = q.lastPrice;
          }

          q.lastPrice = undefined;
          q.tradePrice = undefined;
          q.tradeSize = undefined;
          q.numberOfTrades = undefined;
          q.openPrice = undefined;
          q.highPrice = undefined;
          q.lowPrice = undefined;
          q.volume = undefined;
        } else if (q.dayNum > dayNum) {
          return;
        }
      } else {
        return;
      }

      const cv = _cvol[symbol];

      switch (message.type) {
        case 'HIGH':
          q.highPrice = message.value;
          break;

        case 'LOW':
          q.lowPrice = message.value;
          break;

        case 'OPEN':
          q.flag = undefined;
          q.openPrice = message.value;
          q.highPrice = message.value;
          q.lowPrice = message.value;
          q.lastPrice = message.value;

          if (cv && cv.container) {
            cv.container.reset();
          }

          break;

        case 'OPEN_INTEREST':
          q.openInterest = message.value;
          break;

        case 'REFRESH_DDF':
          switch (message.subrecord) {
            case '1':
            case '2':
            case '3':
              q.message = message;

              if (message.openPrice === null) {
                q.openPrice = undefined;
              } else if (message.openPrice) {
                q.openPrice = message.openPrice;
              }

              if (message.highPrice === null) {
                q.highPrice = undefined;
              } else if (message.highPrice) {
                q.highPrice = message.highPrice;
              }

              if (message.lowPrice === null) {
                q.lowPrice = undefined;
              } else if (message.lowPrice) {
                q.lowPrice = message.lowPrice;
              }

              if (message.lastPrice === null) {
                q.lastPrice = undefined;
              } else if (message.lastPrice) {
                q.lastPrice = message.lastPrice;
              }

              if (message.bidPrice === null) {
                q.bidPrice = undefined;
              } else if (message.bidPrice) {
                q.bidPrice = message.bidPrice;
              }

              if (message.askPrice === null) {
                q.askPrice = undefined;
              } else if (message.askPrice) {
                q.askPrice = message.askPrice;
              }

              if (message.previousPrice === null) {
                q.previousPrice = undefined;
              } else if (message.previousPrice) {
                q.previousPrice = message.previousPrice;
              }

              if (message.settlementPrice === null) {
                q.settlementPrice = undefined;

                if (q.flag == 's') {
                  q.flag = undefined;
                }
              } else if (message.settlementPrice) {
                q.settlementPrice = message.settlementPrice;
              }

              if (message.volume === null) {
                q.volume = undefined;
              } else if (message.volume) {
                q.volume = message.volume;
              }

              if (message.openInterest === null) {
                q.openInterest = undefined;
              } else if (message.openInterest) {
                q.openInterest = message.openInterest;
              }

              if (message.subsrecord == '1') {
                q.lastUpdate = message.time;
              }

              break;
          }

          break;

        case 'REFRESH_QUOTE':
          p = new Profile(symbol, message.name, message.exchange, message.unitcode, message.pointValue, message.tickIncrement, message.additional || null);

          if (!q.profile) {
            q.profile = p;
          }

          q.message = message;
          q.flag = message.flag;
          q.mode = message.mode;
          q.lastUpdate = message.lastUpdate;
          q.bidPrice = message.bidPrice;
          q.bidSize = message.bidSize;
          q.askPrice = message.askPrice;
          q.askSize = message.askSize;
          q.lastPrice = message.lastPrice;
          q.tradeSize = message.tradeSize;
          q.numberOfTrades = message.numberOfTrades;
          q.previousPrice = message.previousPrice;
          q.settlementPrice = message.settlementPrice;
          q.openPrice = message.openPrice;
          q.highPrice = message.highPrice;
          q.lowPrice = message.lowPrice;
          q.volume = message.volume;
          q.openInterest = message.openInterest;

          if (message.tradeTime) {
            q.time = message.tradeTime;
          } else if (message.timeStamp) {
            q.time = message.timeStamp;
          }

          if (message.blockTrade) q.blockTrade = message.blockTrade;

          if (_profileCallbacks.hasOwnProperty(symbol)) {
            _profileCallbacks[symbol].forEach(profileCallback => {
              profileCallback(p);
            });

            delete _profileCallbacks[symbol];
          }

          break;

        case 'SETTLEMENT':
          q.lastPrice = message.value;
          q.settlement = message.value;

          if (message.element === 'D') {
            q.flag = 's';
          }

          break;

        case 'TOB':
          q.bidPrice = message.bidPrice;
          q.bidSize = message.bidSize;
          q.askPrice = message.askPrice;
          q.askSize = message.askSize;

          if (message.time) {
            q.time = message.time;
          }

          break;

        case 'TRADE':
          q.flag = undefined;
          q.tradePrice = message.tradePrice;
          q.lastPrice = message.tradePrice;

          if (message.tradeSize) {
            q.tradeSize = message.tradeSize;
            q.volume += message.tradeSize;
          }

          q.ticks.push({
            price: q.tradePrice,
            size: q.tradeSize
          });

          while (q.ticks.length > 50) {
            q.ticks.shift();
          }

          if (!q.numberOfTrades) {
            q.numberOfTrades = 0;
          }

          q.numberOfTrades++;

          if (message.time) {
            q.time = message.time;
          }

          if (cv && cv.container && message.tradePrice && message.tradeSize) {
            cv.container.incrementVolume(message.tradePrice, message.tradeSize);
          }

          break;

        case 'TRADE_OUT_OF_SEQUENCE':
          if (message.tradeSize) {
            q.volume += message.tradeSize;
          }

          if (message.session === 'Z') q.blockTrade = message.tradePrice;

          if (cv && cv.container && message.tradePrice && message.tradeSize) {
            cv.container.incrementVolume(message.tradePrice, message.tradeSize);
          }

          break;

        case 'VOLUME':
          q.volume = message.value;
          break;

        case 'VOLUME_YESTERDAY':
          break;

        case 'VWAP':
          q.vwap1 = message.value;
          break;

        default:
          _logger.error('Unhandled Market Message:');

          _logger.log(message);

          break;
      }
    };

    const _getBook = symbol => {
      return _book[symbol];
    };

    const _getCumulativeVolume = (symbol, callback) => {
      let cv = _getOrCreateCumulativeVolume(symbol);

      let promise;

      if (cv.container) {
        promise = Promise.resolve(cv.container);
      } else {
        promise = new Promise(resolveCallback => {
          cv.callbacks.push(resolveCallback);
        });
      }

      return promise.then(cv => {
        if (typeof callback === 'function') {
          callback(cv);
        }

        return cv;
      });
    };

    const _getProfile = (symbol, callback) => {
      let profile = _getOrCreateProfile(symbol);

      let promise;

      if (profile) {
        promise = Promise.resolve(profile);
      } else {
        promise = new Promise(resolveCallback => {
          if (!_profileCallbacks.hasOwnProperty(symbol)) {
            _profileCallbacks[symbol] = [];
          }

          _profileCallbacks[symbol].push(p => resolveCallback(p));

          if (handleProfileRequest && typeof handleProfileRequest === 'function') {
            handleProfileRequest(symbol);
          }
        });
      }

      return promise.then(p => {
        if (typeof callback === 'function') {
          callback(p);
        }

        return p;
      });
    };

    const _getQuote = symbol => {
      return _quote[symbol];
    };

    const _getTimestamp = () => {
      return _timestamp;
    };

    return {
      getBook: _getBook,
      getCumulativeVolume: _getCumulativeVolume,
      getProfile: _getProfile,
      getQuote: _getQuote,
      getTimestamp: _getTimestamp,
      processMessage: _processMessage
    };
  }
  /**
   * @typedef Book
   * @type Object
   * @property {string} symbol
   * @property {Object[]} bids
   * @property {Object[]} asks
   */

  /**
   * <p>Repository for current market state. This repository will only contain
   * data for an instrument after a subscription has been established using
   * the {@link Connection#on} function.</p>
   * <p>Access the singleton instance using the {@link ConnectionBase#getMarketState}
   * function.</p>
   *
   * @public
   */


  class MarketState {
    constructor(handleProfileRequest) {
      this._internal = MarketStateInternal(handleProfileRequest);
    }
    /**
     * @public
     * @param {string} symbol
     * @return {Book}
     */


    getBook(symbol) {
      return this._internal.getBook(symbol);
    }
    /**
     * @public
     * @param {string} symbol
     * @param {function=} callback - invoked when the {@link CumulativeVolume} instance becomes available
     * @returns {Promise} The {@link CumulativeVolume} instance, as a promise
     */


    getCumulativeVolume(symbol, callback) {
      return this._internal.getCumulativeVolume(symbol, callback);
    }
    /**
     * @public
     * @param {string} symbol
     * @param {function=} callback - invoked when the {@link Profile} instance becomes available
     * @returns {Promise} The {@link Profile} instance, as a promise.
     */


    getProfile(symbol, callback) {
      return this._internal.getProfile(symbol, callback);
    }
    /**
     * @public
     * @param {string} symbol
     * @return {Quote}
     */


    getQuote(symbol) {
      return this._internal.getQuote(symbol);
    }
    /**
     * Returns the time the most recent market data message was received.
     *
     * @public
     * @return {Date}
     */


    getTimestamp() {
      return this._internal.getTimestamp();
    }
    /**
     * @ignore
     */


    processMessage(message) {
      return this._internal.processMessage(message);
    }
    /**
     * @ignore
     */


    static get CumulativeVolume() {
      return CumulativeVolume;
    }
    /**
     * @ignore
     */


    static get Profile() {
      return Profile;
    }
    /**
     * @ignore
     */


    static get Quote() {
      return Quote;
    }

    toString() {
      return '[MarketState]';
    }

  }

  return MarketState;
})();

},{"../utilities/parsers/SymbolParser":28,"./../logging/LoggerFactory":10,"./../utilities/convert/dayCodeToNumber":19,"./CumulativeVolume":12,"./Profile":14,"./Quote":15}],14:[function(require,module,exports){
const SymbolParser = require('./../utilities/parsers/SymbolParser'),
      buildPriceFormatter = require('../utilities/format/factories/price');

module.exports = (() => {
  'use strict';

  let profiles = {};
  let formatter = buildPriceFormatter('-', true, ',');
  /**
   * Describes an instrument.
   *
   * @public
   */

  class Profile {
    constructor(symbol, name, exchange, unitCode, pointValue, tickIncrement, additional) {
      /**
       * @property {string} symbol - the instrument's symbol
       */
      this.symbol = symbol;
      /**
       * @property {string} name - the instrument's name
       */

      this.name = name;
      /**
       * @property {string} exchange - the code for the listing exchange
       */

      this.exchange = exchange;
      /**
       * @property {string} unitCode - code used to describe how a price should be formatted
       */

      this.unitCode = unitCode;
      /**
       * @property {string} pointValue - the change in dollar value for a one point change in price
       */

      this.pointValue = pointValue;
      /**
       * @property {number} tickIncrement - the minimum price movement
       */

      this.tickIncrement = tickIncrement;
      const info = SymbolParser.parseInstrumentType(this.symbol);

      if (info) {
        if (info.type === 'future') {
          /**
           * @property {undefined|string} root - he root symbol, if a future; otherwise undefined
           */
          this.root = info.root;
          /**
           * @property {undefined|string} month - the month code, if a future; otherwise undefined
           */

          this.month = info.month;
          /**
           * @property {undefined|number} year - the expiration year, if a symbol; otherwise undefined
           */

          this.year = info.year;
        }
      }

      if (typeof additional === 'object' && additional !== null) {
        for (let p in additional) {
          this[p] = additional[p];
        }
      }

      profiles[symbol] = this;
    }
    /**
     * Given a numeric price, returns a human-readable price.
     *
     * @public
     * @param {number} price
     * @returns {string}
     */


    formatPrice(price) {
      return formatter(price, this.unitCode);
    }
    /**
     * Configures the logic used to format all prices using the {@link Profile#formatPrice} instance function.
     *
     * @public
     * @param {string} fractionSeparator - usually a dash or a period
     * @param {boolean} specialFractions - usually true
     * @param {string=} thousandsSeparator - usually a comma
     */


    static setPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator) {
      formatter = buildPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator);
    }
    /**
     * Alias for {@link Profile.setPriceFormatter} function.
     *
     * @deprecated
     * @public
     * @see {@link Profile.setPriceFormatter}
     */


    static PriceFormatter(fractionSeparator, specialFractions, thousandsSeparator) {
      Profile.setPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator);
    }
    /**
     * @protected
     * @ignore
     */


    static get Profiles() {
      return profiles;
    }

    toString() {
      return '[Profile]';
    }

  }

  return Profile;
})();

},{"../utilities/format/factories/price":22,"./../utilities/parsers/SymbolParser":28}],15:[function(require,module,exports){
module.exports = (() => {
  'use strict';
  /**
   * Current market conditions for an instrument.
   *
   * @public
   * @param {String=} symbol
   */

  class Quote {
    constructor(symbol) {
      /**
       * @property {string} symbol - The instrument's symbol.
       */
      this.symbol = symbol || null;
      /**
       * @property {string} message - last DDF message that caused a mutation to this instance
       */

      this.message = null;
      /**
       * @property {string} flag - market status, will have one of three values: p, s, or undefined
       */

      this.flag = null;
      this.mode = null;
      /**
       * @property {string} day - one character code that indicates day of the month of the current trading session
       */

      this.day = null;
      /**
       * @property {number} dayNum - day of the month of the current trading session
       */

      this.dayNum = 0;
      this.session = null;
      this.lastUpdate = null;
      /**
       * @property {number} bidPrice - top-of-book price on the buy side
       */

      this.bidPrice = null;
      /**
       * @property {number} bidSize - top-of-book quantity on the buy side
       */

      this.bidSize = null;
      /**
       * @property {number} askPrice - top-of-book price on the sell side
       */

      this.askPrice = null;
      /**
       * @property {number} askSize - top-of-book quantity on the sell side
       */

      this.askSize = null;
      /**
       * @property {number} lastPrice - most recent price (not necessarily a trade)
       */

      this.lastPrice = null;
      /**
       * @property {number} tradePrice - most recent trade price
       */

      this.tradePrice = null;
      /**
       * @property {number} tradeSize - most recent trade quantity
       */

      this.tradeSize = null;
      this.numberOfTrades = null;
      this.vwap1 = null; // Exchange Provided

      this.vwap2 = null; // Calculated

      /**
       * @property {number} blockTrade - most recent block trade price
       */

      this.blockTrade = null;
      /**
       * @property {number} settlementPrice
       */

      this.settlementPrice = null;
      this.openPrice = null;
      this.highPrice = null;
      this.lowPrice = null;
      this.volume = null;
      this.openInterest = null;
      /**
       * @property {number} previousPrice - price from the previous session
       */

      this.previousPrice = null;
      this.profile = null;
      this.time = null;
      this.ticks = [];
    }

    static clone(symbol, source) {
      const clone = Object.assign({}, source);
      clone.symbol = symbol;
      return clone;
    }

    toString() {
      return '[Quote]';
    }

  }

  return Quote;
})();

},{}],16:[function(require,module,exports){
module.exports = (() => {
  'use strict';

  return {
    version: '4.0.4'
  };
})();

},{}],17:[function(require,module,exports){
module.exports = (() => {
  'use strict';
  /**
   * Converts a base code into a unit code.
   *
   * @function
   * @param {Number} baseCode
   * @return {String}
   */

  function convertBaseCodeToUnitCode(baseCode) {
    switch (baseCode) {
      case -1:
        return '2';

      case -2:
        return '3';

      case -3:
        return '4';

      case -4:
        return '5';

      case -5:
        return '6';

      case -6:
        return '7';

      case 0:
        return '8';

      case 1:
        return '9';

      case 2:
        return 'A';

      case 3:
        return 'B';

      case 4:
        return 'C';

      case 5:
        return 'D';

      case 6:
        return 'E';

      case 7:
        return 'F';

      default:
        return 0;
    }
  }

  return convertBaseCodeToUnitCode;
})();

},{}],18:[function(require,module,exports){
const convertNumberToDayCode = require('./numberToDayCode');

module.exports = (() => {
  'use strict';
  /**
   * Extracts the day of the month from a {@link Date} instance
   * and returns the day code for the day of the month.
   *
   * @function
   * @param {Date} date
   * @returns {String|null}
   */

  function convertDateToDayCode(date) {
    if (date === null || date === undefined) {
      return null;
    }

    return convertNumberToDayCode(date.getDate());
  }

  return convertDateToDayCode;
})();

},{"./numberToDayCode":20}],19:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');

module.exports = (() => {
  'use strict';
  /**
   * Converts a day code (e.g. "A" ) to a day number (e.g. 11).
   *
   * @function
   * @param {String} dayCode
   * @returns {Number|null}
   */

  function convertDayCodeToNumber(dayCode) {
    if (!is.string(dayCode) || dayCode === '') {
      return null;
    }

    let d = parseInt(dayCode, 31);

    if (d > 9) {
      d++;
    } else if (d === 0) {
      d = 10;
    }

    return d;
  }

  return convertDayCodeToNumber;
})();

},{"@barchart/common-js/lang/is":31}],20:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');

module.exports = (() => {
  'use strict';

  const ASCII_ONE = '1'.charCodeAt(0);
  const ASCII_A = 'A'.charCodeAt(0);
  /**
   * Converts a day number to a single character day code (e.g. 1 is
   * converted to "1" and 10 is converted to "0" and 11 is converted
   * to "A").
   *
   * @function
   * @param {Number} d
   * @returns {String}
   */

  function convertNumberToDayCode(d) {
    if (!is.integer(d)) {
      return null;
    }

    if (d >= 1 && d <= 9) {
      return String.fromCharCode(ASCII_ONE + d - 1);
    } else if (d == 10) {
      return '0';
    } else {
      return String.fromCharCode(ASCII_A + d - 11);
    }
  }

  return convertNumberToDayCode;
})();

},{"@barchart/common-js/lang/is":31}],21:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');

module.exports = (() => {
  'use strict';
  /**
   * Formats a number as a string.
   *
   * @function
   * @param {Number} value
   * @param {Number} digits
   * @param {String=} thousandsSeparator
   * @param {Boolean=} useParenthesis
   * @returns {String}
   */

  function formatDecimal(value, digits, thousandsSeparator, useParenthesis) {
    if (!is.number(value)) {
      return '';
    }

    const applyParenthesis = value < 0 && useParenthesis === true;

    if (applyParenthesis) {
      value = 0 - value;
    }

    let formatted = value.toFixed(digits);

    if (thousandsSeparator && (value < -999 || value > 999)) {
      const length = formatted.length;
      const negative = value < 0;
      let found = digits === 0;
      let counter = 0;
      const buffer = [];

      for (let i = length - 1; !(i < 0); i--) {
        if (counter === 3 && !(negative && i === 0)) {
          buffer.unshift(thousandsSeparator);
          counter = 0;
        }

        const character = formatted.charAt(i);
        buffer.unshift(character);

        if (found) {
          counter = counter + 1;
        } else if (character === '.') {
          found = true;
        }
      }

      if (applyParenthesis) {
        buffer.unshift('(');
        buffer.push(')');
      }

      formatted = buffer.join('');
    } else if (applyParenthesis) {
      formatted = '(' + formatted + ')';
    }

    return formatted;
  }

  return formatDecimal;
})();

},{"@barchart/common-js/lang/is":31}],22:[function(require,module,exports){
const formatPrice = require('./../price');

module.exports = (() => {
  'use strict';
  /**
   * Returns a {@link PriceFormatterFactory~formatPrice} which uses
   * the configuration supplied to this function as parameters.
   *
   * @function
   * @param {String=} fractionSeparator
   * @param {Boolean=} specialFractions
   * @param {String=} thousandsSeparator
   * @param {Boolean=} useParenthesis
   * @returns {PriceFormatterFactory~formatPrice}
   */

  function buildPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator, useParenthesis) {
    return (value, unitcode) => formatPrice(value, unitcode, fractionSeparator, specialFractions, thousandsSeparator, useParenthesis);
  }
  /**
   * Accepts a numeric value and a unit code, and returns a formatted
   * price as a string.
   *
   * @public
   * @callback PriceFormatterFactory~formatPrice
   * @param {Number} value
   * @param {String} unitcode
   * @returns {String}
   */


  return buildPriceFormatter;
})();

},{"./../price":23}],23:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');

const formatDecimal = require('./decimal');

module.exports = (() => {
  'use strict';

  function frontPad(value, digits) {
    return ['000', Math.floor(value)].join('').substr(-1 * digits);
  }

  function getWholeNumberAsString(value, fractionSeparator) {
    const floor = Math.floor(value);

    if (floor === 0 && fractionSeparator === '') {
      return '';
    } else {
      return floor;
    }
  }
  /**
   * Formats a number as a string.
   *
   * @function
   * @param {Number} value
   * @param {String} unitcode
   * @param {String=} fractionSeparator
   * @param {Boolean=} specialFractions
   * @param {String=} thousandsSeparator
   * @param {Boolean=} useParenthesis
   * @returns {String}
   */


  function formatPrice(value, unitcode, fractionSeparator, specialFractions, thousandsSeparator, useParenthesis) {
    if (value === undefined || value === null || is.nan(value) || value === '') {
      return '';
    }

    if (fractionSeparator === '.') {
      switch (unitcode) {
        case '2':
          return formatDecimal(value, 3, thousandsSeparator, useParenthesis);

        case '3':
          return formatDecimal(value, 4, thousandsSeparator, useParenthesis);

        case '4':
          return formatDecimal(value, 5, thousandsSeparator, useParenthesis);

        case '5':
          return formatDecimal(value, 6, thousandsSeparator, useParenthesis);

        case '6':
          return formatDecimal(value, 7, thousandsSeparator, useParenthesis);

        case '7':
          return formatDecimal(value, 8, thousandsSeparator, useParenthesis);

        case '8':
          return formatDecimal(value, 0, thousandsSeparator, useParenthesis);

        case '9':
          return formatDecimal(value, 1, thousandsSeparator, useParenthesis);

        case 'A':
          return formatDecimal(value, 2, thousandsSeparator, useParenthesis);

        case 'B':
          return formatDecimal(value, 3, thousandsSeparator, useParenthesis);

        case 'C':
          return formatDecimal(value, 4, thousandsSeparator, useParenthesis);

        case 'D':
          return formatDecimal(value, 5, thousandsSeparator, useParenthesis);

        case 'E':
          return formatDecimal(value, 6, thousandsSeparator, useParenthesis);

        default:
          return value;
      }
    } else {
      const originalValue = value;
      const absoluteValue = Math.abs(value);
      const negative = value < 0;
      let prefix;
      let suffix;

      if (negative) {
        if (useParenthesis === true) {
          prefix = '(';
          suffix = ')';
        } else {
          prefix = '-';
          suffix = '';
        }
      } else {
        prefix = '';
        suffix = '';
      }

      switch (unitcode) {
        case '2':
          return [prefix, getWholeNumberAsString(absoluteValue, fractionSeparator), fractionSeparator, frontPad((absoluteValue - Math.floor(absoluteValue)) * 8, 1), suffix].join('');

        case '3':
          return [prefix, getWholeNumberAsString(absoluteValue, fractionSeparator), fractionSeparator, frontPad((absoluteValue - Math.floor(absoluteValue)) * 16, 2), suffix].join('');

        case '4':
          return [prefix, getWholeNumberAsString(absoluteValue, fractionSeparator), fractionSeparator, frontPad((absoluteValue - Math.floor(absoluteValue)) * 32, 2), suffix].join('');

        case '5':
          return [prefix, getWholeNumberAsString(absoluteValue, fractionSeparator), fractionSeparator, frontPad(Math.floor(((absoluteValue - Math.floor(absoluteValue)) * (specialFractions ? 320 : 64)).toFixed(1)), specialFractions ? 3 : 2), suffix].join('');

        case '6':
          return [prefix, getWholeNumberAsString(absoluteValue, fractionSeparator), fractionSeparator, frontPad(Math.floor(((absoluteValue - Math.floor(absoluteValue)) * (specialFractions ? 320 : 128)).toFixed(1)), 3), suffix].join('');

        case '7':
          return [prefix, getWholeNumberAsString(absoluteValue, fractionSeparator), fractionSeparator, frontPad((absoluteValue - Math.floor(absoluteValue)) * (specialFractions ? 320 : 256), 3), suffix].join('');

        case '8':
          return formatDecimal(originalValue, 0, thousandsSeparator, useParenthesis);

        case '9':
          return formatDecimal(originalValue, 1, thousandsSeparator, useParenthesis);

        case 'A':
          return formatDecimal(originalValue, 2, thousandsSeparator, useParenthesis);

        case 'B':
          return formatDecimal(originalValue, 3, thousandsSeparator, useParenthesis);

        case 'C':
          return formatDecimal(originalValue, 4, thousandsSeparator, useParenthesis);

        case 'D':
          return formatDecimal(originalValue, 5, thousandsSeparator, useParenthesis);

        case 'E':
          return formatDecimal(originalValue, 6, thousandsSeparator, useParenthesis);

        default:
          return originalValue;
      }
    }
  }

  return formatPrice;
})();

},{"./decimal":21,"@barchart/common-js/lang/is":31}],24:[function(require,module,exports){
module.exports = (() => {
  'use strict';

  function leftPad(value) {
    return ('00' + value).substr(-2);
  }

  function formatTwelveHourTime(t) {
    let hours = t.getHours();
    let period;

    if (hours === 0) {
      hours = 12;
      period = 'AM';
    } else if (hours === 12) {
      hours = hours;
      period = 'PM';
    } else if (hours > 12) {
      hours = hours - 12;
      period = 'PM';
    } else {
      hours = hours;
      period = 'AM';
    }

    return `${leftPad(hours)}:${leftPad(t.getMinutes())}:${leftPad(t.getSeconds())} ${period}`;
  }

  function formatTwelveHourTimeShort(t) {
    let hours = t.getHours();
    let period;

    if (hours === 0) {
      hours = 12;
      period = 'A';
    } else if (hours === 12) {
      hours = hours;
      period = 'P';
    } else if (hours > 12) {
      hours = hours - 12;
      period = 'P';
    } else {
      hours = hours;
      period = 'A';
    }

    return `${leftPad(hours)}:${leftPad(t.getMinutes())}${period}`;
  }

  function formatTwentyFourHourTime(t) {
    return `${leftPad(t.getHours())}:${leftPad(t.getMinutes())}:${leftPad(t.getSeconds())}`;
  }

  function formatTwentyFourHourTimeShort(t) {
    return `${leftPad(t.getHours())}:${leftPad(t.getMinutes())}`;
  }
  /**
   * Formats a {@link Date} instance's time component as a string.
   *
   * @function
   * @param {Date} date
   * @param {String=} timezone
   * @param {Boolean=} useTwelveHourClock
   * @param {Boolean=} short
   * @returns {String}
   */


  function formatTime(date, timezone, useTwelveHourClock, short) {
    if (!date) {
      return '';
    }

    let ft;

    if (useTwelveHourClock) {
      if (short) {
        ft = formatTwelveHourTimeShort;
      } else {
        ft = formatTwelveHourTime;
      }
    } else {
      if (short) {
        ft = formatTwentyFourHourTimeShort;
      } else {
        ft = formatTwentyFourHourTime;
      }
    }

    let formatted = ft(date);

    if (timezone) {
      formatted = `${formatted} ${timezone}`;
    }

    return formatted;
  }

  return formatTime;
})();

},{}],25:[function(require,module,exports){
const xmlDom = require('xmldom');

const parseValue = require('./value'),
      parseTimestamp = require('./timestamp');

module.exports = (() => {
  'use strict';

  class XmlDomParser {
    constructor() {
      this._xmlDomParser = new xmlDom.DOMParser();
    }
    /**
     * Parses an XML document.
     *
     * @public
     * @param {String} textDocument
     * @returns {Object}
     */


    parse(textDocument) {
      if (typeof textDocument !== 'string') {
        throw new Error('The "textDocument" argument must be a string.');
      }

      return this._xmlDomParser.parseFromString(textDocument, 'text/xml');
    }

    toString() {
      return '[XmlDomParser]';
    }

  }
  /**
   * Parses a DDF message, returning a JavaScript object representing the
   * content of the message.
   *
   * @function
   * @param {String} msg
   * @returns {Object}
   */


  function parseMessage(msg) {
    const message = {
      message: msg,
      type: null
    };

    switch (msg.substr(0, 1)) {
      case '%':
        {
          let xmlDocument;

          try {
            const xmlDomParser = new XmlDomParser();
            xmlDocument = xmlDomParser.parse(msg.substring(1));
          } catch (e) {
            xmlDocument = undefined;
          }

          if (xmlDocument) {
            const node = xmlDocument.firstChild;

            switch (node.nodeName) {
              case 'BOOK':
                {
                  message.symbol = node.attributes.getNamedItem('symbol').value;
                  message.unitcode = node.attributes.getNamedItem('basecode').value;
                  message.askDepth = parseInt(node.attributes.getNamedItem('askcount').value);
                  message.bidDepth = parseInt(node.attributes.getNamedItem('bidcount').value);
                  message.asks = [];
                  message.bids = [];
                  let ary1, ary2;

                  if (node.attributes.getNamedItem('askprices') && node.attributes.getNamedItem('asksizes')) {
                    ary1 = node.attributes.getNamedItem('askprices').value.split(',');
                    ary2 = node.attributes.getNamedItem('asksizes').value.split(',');

                    for (let i = 0; i < ary1.length; i++) {
                      message.asks.push({
                        "price": parseValue(ary1[i], message.unitcode),
                        "size": parseInt(ary2[i])
                      });
                    }
                  }

                  if (node.attributes.getNamedItem('bidprices') && node.attributes.getNamedItem('bidsizes')) {
                    ary1 = node.attributes.getNamedItem('bidprices').value.split(',');
                    ary2 = node.attributes.getNamedItem('bidsizes').value.split(',');

                    for (let i = 0; i < ary1.length; i++) {
                      message.bids.push({
                        "price": parseValue(ary1[i], message.unitcode),
                        "size": parseInt(ary2[i])
                      });
                    }
                  }

                  message.type = 'BOOK';
                  break;
                }

              case 'QUOTE':
                {
                  for (let i = 0; i < node.attributes.length; i++) {
                    switch (node.attributes[i].name) {
                      case 'symbol':
                        message.symbol = node.attributes[i].value;
                        break;

                      case 'name':
                        message.name = node.attributes[i].value;
                        break;

                      case 'exchange':
                        message.exchange = node.attributes[i].value;
                        break;

                      case 'basecode':
                        message.unitcode = node.attributes[i].value;
                        break;

                      case 'pointvalue':
                        message.pointValue = parseFloat(node.attributes[i].value);
                        break;

                      case 'tickincrement':
                        message.tickIncrement = parseInt(node.attributes[i].value);
                        break;

                      case 'flag':
                        message.flag = node.attributes[i].value;
                        break;

                      case 'lastupdate':
                        {
                          const v = node.attributes[i].value;
                          message.lastUpdate = new Date(parseInt(v.substr(0, 4)), parseInt(v.substr(4, 2)) - 1, parseInt(v.substr(6, 2)), parseInt(v.substr(8, 2)), parseInt(v.substr(10, 2)), parseInt(v.substr(12, 2)));
                          break;
                        }

                      case 'bid':
                        message.bidPrice = parseValue(node.attributes[i].value, message.unitcode);
                        break;

                      case 'bidsize':
                        message.bidSize = parseInt(node.attributes[i].value);
                        break;

                      case 'ask':
                        message.askPrice = parseValue(node.attributes[i].value, message.unitcode);
                        break;

                      case 'asksize':
                        message.askSize = parseInt(node.attributes[i].value);
                        break;

                      case 'mode':
                        message.mode = node.attributes[i].value;
                        break;
                    }
                  }

                  const sessions = {};

                  for (let j = 0; j < node.childNodes.length; j++) {
                    if (node.childNodes[j].nodeName == 'SESSION') {
                      const s = {};
                      const attributes = node.childNodes[j].attributes;
                      if (attributes.getNamedItem('id')) s.id = attributes.getNamedItem('id').value;
                      if (attributes.getNamedItem('day')) s.day = attributes.getNamedItem('day').value;
                      if (attributes.getNamedItem('last')) s.lastPrice = parseValue(attributes.getNamedItem('last').value, message.unitcode);
                      if (attributes.getNamedItem('previous')) s.previousPrice = parseValue(attributes.getNamedItem('previous').value, message.unitcode);
                      if (attributes.getNamedItem('open')) s.openPrice = parseValue(attributes.getNamedItem('open').value, message.unitcode);
                      if (attributes.getNamedItem('high')) s.highPrice = parseValue(attributes.getNamedItem('high').value, message.unitcode);
                      if (attributes.getNamedItem('low')) s.lowPrice = parseValue(attributes.getNamedItem('low').value, message.unitcode);
                      if (attributes.getNamedItem('tradesize')) s.tradeSize = parseInt(attributes.getNamedItem('tradesize').value);
                      if (attributes.getNamedItem('numtrades')) s.numberOfTrades = parseInt(attributes.getNamedItem('numtrades').value);
                      if (attributes.getNamedItem('settlement')) s.settlementPrice = parseValue(attributes.getNamedItem('settlement').value, message.unitcode);
                      if (attributes.getNamedItem('volume')) s.volume = parseInt(attributes.getNamedItem('volume').value);
                      if (attributes.getNamedItem('openinterest')) s.openInterest = parseInt(attributes.getNamedItem('openinterest').value);

                      if (attributes.getNamedItem('timestamp')) {
                        const v = attributes.getNamedItem('timestamp').value;
                        s.timeStamp = new Date(parseInt(v.substr(0, 4)), parseInt(v.substr(4, 2)) - 1, parseInt(v.substr(6, 2)), parseInt(v.substr(8, 2)), parseInt(v.substr(10, 2)), parseInt(v.substr(12, 2)));
                      }

                      if (attributes.getNamedItem('tradetime')) {
                        const v = attributes.getNamedItem('tradetime').value;
                        s.tradeTime = new Date(parseInt(v.substr(0, 4)), parseInt(v.substr(4, 2)) - 1, parseInt(v.substr(6, 2)), parseInt(v.substr(8, 2)), parseInt(v.substr(10, 2)), parseInt(v.substr(12, 2)));
                      }

                      if (attributes.getNamedItem('blocktrade')) s.blockTrade = parseValue(attributes.getNamedItem('blocktrade').value, message.unitcode);
                      if (s.id) sessions[s.id] = s;
                    }
                  }

                  const premarket = typeof sessions.combined.lastPrice === 'undefined';
                  const postmarket = !premarket && typeof sessions.combined.settlementPrice !== 'undefined';
                  const session = premarket ? sessions.previous : sessions.combined;

                  if (sessions.combined.previousPrice) {
                    message.previousPrice = sessions.combined.previousPrice;
                  } else {
                    message.previousPrice = sessions.previous.previousPrice;
                  }

                  if (session.lastPrice) message.lastPrice = session.lastPrice;
                  if (session.openPrice) message.openPrice = session.openPrice;
                  if (session.highPrice) message.highPrice = session.highPrice;
                  if (session.lowPrice) message.lowPrice = session.lowPrice;
                  if (session.tradeSize) message.tradeSize = session.tradeSize;
                  if (session.numberOfTrades) message.numberOfTrades = session.numberOfTrades;
                  if (session.settlementPrice) message.settlementPrice = session.settlementPrice;
                  if (session.volume) message.volume = session.volume;
                  if (session.openInterest) message.openInterest = session.openInterest;
                  if (session.blockTrade) message.blockTrade = session.blockTrade;
                  if (session.id === 'combined' && sessions.previous.openInterest) message.openInterest = sessions.previous.openInterest;
                  if (session.timeStamp) message.timeStamp = session.timeStamp;
                  if (session.tradeTime) message.tradeTime = session.tradeTime; // 2016/10/29, BRI. We have a problem where we don't "roll" quotes
                  // for futures. For example, LEZ16 doesn't "roll" the settlementPrice
                  // to the previous price -- so, we did this on the open message (2,0A).
                  // Eero has another idea. Perhaps we are setting the "day" improperly
                  // here. Perhaps we should base the day off of the actual session
                  // (i.e. "session" variable) -- instead of taking it from the "combined"
                  // session.

                  if (sessions.combined.day) message.day = session.day;
                  if (premarket && typeof message.flag === 'undefined') message.flag = 'p';
                  const p = sessions.previous;
                  message.previousPreviousPrice = p.previousPrice;
                  message.previousSettlementPrice = p.settlementPrice;
                  message.previousOpenPrice = p.openPrice;
                  message.previousHighPrice = p.highPrice;
                  message.previousLowPrice = p.lowPrice;
                  message.previousTimeStamp = p.timeStamp;

                  if (sessions.combined.day) {
                    const sessionFormT = 'session_' + sessions.combined.day + '_T';

                    if (sessions.hasOwnProperty(sessionFormT)) {
                      const t = sessions[sessionFormT];
                      const lastPriceT = t.lastPrice;

                      if (lastPriceT) {
                        const tradeTimeT = t.tradeTime;
                        const tradeSizeT = t.tradeSize;
                        let sessionIsEvening;

                        if (tradeTimeT) {
                          const noon = new Date(tradeTimeT.getFullYear(), tradeTimeT.getMonth(), tradeTimeT.getDate(), 12, 0, 0, 0);
                          sessionIsEvening = tradeTimeT.getTime() > noon.getTime();
                        } else {
                          sessionIsEvening = false;
                        }

                        message.sessionT = sessionIsEvening;
                        const sessionIsCurrent = premarket || sessionIsEvening;

                        if (sessionIsCurrent) {
                          message.lastPriceT = lastPriceT;
                        }

                        if (premarket || postmarket) {
                          message.session = 'T';

                          if (sessionIsCurrent) {
                            if (tradeTimeT) {
                              message.tradeTime = tradeTimeT;
                            }

                            if (tradeSizeT) {
                              message.tradeSize = tradeSizeT;
                            }
                          }

                          if (premarket) {
                            if (t.volume) {
                              message.volume = t.volume;
                            }

                            if (t.previousPrice) {
                              message.previousPrice = t.previousPrice;
                            }
                          }
                        }
                      }
                    }
                  }

                  message.type = 'REFRESH_QUOTE';
                  break;
                }

              case 'CV':
                {
                  message.type = 'REFRESH_CUMULATIVE_VOLUME';
                  message.symbol = node.attributes.getNamedItem('symbol').value;
                  message.unitCode = node.attributes.getNamedItem('basecode').value;
                  message.tickIncrement = parseValue(node.attributes.getNamedItem('tickincrement').value, message.unitCode);
                  const dataAttribute = node.attributes.getNamedItem('data');

                  if (dataAttribute) {
                    const priceLevelsRaw = dataAttribute.value || '';
                    const priceLevels = priceLevelsRaw.split(':');

                    for (let i = 0; i < priceLevels.length; i++) {
                      const priceLevelRaw = priceLevels[i];
                      const priceLevelData = priceLevelRaw.split(',');
                      priceLevels[i] = {
                        price: parseValue(priceLevelData[0], message.unitCode),
                        volume: parseInt(priceLevelData[1])
                      };
                    }

                    priceLevels.sort(function (a, b) {
                      return a.price - b.price;
                    });
                    message.priceLevels = priceLevels;
                  } else {
                    message.priceLevels = [];
                  }

                  break;
                }

              default:
                console.log(msg);
                break;
            }
          }

          break;
        }

      case '\x01':
        {
          // DDF Messages
          switch (msg.substr(1, 1)) {
            case '#':
              {
                // TO DO: Standardize the timezones for Daylight Savings
                message.type = 'TIMESTAMP';
                message.timestamp = new Date(parseInt(msg.substr(2, 4)), parseInt(msg.substr(6, 2)) - 1, parseInt(msg.substr(8, 2)), parseInt(msg.substr(10, 2)), parseInt(msg.substr(12, 2)), parseInt(msg.substr(14, 2)));
                break;
              }

            case 'C':
            case '2':
              {
                message.record = '2';
                let pos = msg.indexOf(',', 0);
                message.symbol = msg.substring(2, pos);
                message.subrecord = msg.substr(pos + 1, 1);
                message.unitcode = msg.substr(pos + 3, 1);
                message.exchange = msg.substr(pos + 4, 1);
                message.delay = parseInt(msg.substr(pos + 5, 2));

                switch (message.subrecord) {
                  case '0':
                    {
                      // TO DO: Error Handling / Sanity Check
                      const pos2 = msg.indexOf(',', pos + 7);
                      message.value = parseValue(msg.substring(pos + 7, pos2), message.unitcode);
                      message.element = msg.substr(pos2 + 1, 1);
                      message.modifier = msg.substr(pos2 + 2, 1);

                      switch (message.element) {
                        case 'A':
                          message.type = 'OPEN';
                          break;

                        case 'C':
                          if (message.modifier == '1') message.type = 'OPEN_INTEREST';
                          break;

                        case 'D':
                        case 'd':
                          if (message.modifier == '0') message.type = 'SETTLEMENT';
                          break;

                        case 'V':
                          if (message.modifier == '0') message.type = 'VWAP';
                          break;

                        case '0':
                          {
                            if (message.modifier == '0') {
                              message.tradePrice = message.value;
                              message.type = 'TRADE';
                            }

                            break;
                          }

                        case '5':
                          message.type = 'HIGH';
                          break;

                        case '6':
                          message.type = 'LOW';
                          break;

                        case '7':
                          {
                            if (message.modifier == '1') message.type = 'VOLUME_YESTERDAY';else if (message.modifier == '6') message.type = 'VOLUME';
                            break;
                          }
                      }

                      message.day = msg.substr(pos2 + 3, 1);
                      message.session = msg.substr(pos2 + 4, 1);
                      message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
                      break;
                    }

                  case '1':
                  case '2':
                  case '3':
                  case '4':
                    {
                      const ary = msg.substring(pos + 8).split(',');
                      message.openPrice = parseValue(ary[0], message.unitcode);
                      message.highPrice = parseValue(ary[1], message.unitcode);
                      message.lowPrice = parseValue(ary[2], message.unitcode);
                      message.lastPrice = parseValue(ary[3], message.unitcode);
                      message.bidPrice = parseValue(ary[4], message.unitcode);
                      message.askPrice = parseValue(ary[5], message.unitcode);
                      message.previousPrice = parseValue(ary[7], message.unitcode);
                      message.settlementPrice = parseValue(ary[10], message.unitcode);
                      message.volume = ary[13].length > 0 ? parseInt(ary[13]) : undefined;
                      message.openInterest = ary[12].length > 0 ? parseInt(ary[12]) : undefined;
                      message.day = ary[14].substr(0, 1);
                      message.session = ary[14].substr(1, 1);
                      message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
                      message.type = 'REFRESH_DDF';
                      break;
                    }

                  case '7':
                    {
                      let pos2 = msg.indexOf(',', pos + 7);
                      message.tradePrice = parseValue(msg.substring(pos + 7, pos2), message.unitcode);
                      pos = pos2 + 1;
                      pos2 = msg.indexOf(',', pos);
                      message.tradeSize = parseInt(msg.substring(pos, pos2));
                      pos = pos2 + 1;
                      message.day = msg.substr(pos, 1);
                      message.session = msg.substr(pos + 1, 1);
                      message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
                      message.type = 'TRADE';
                      break;
                    }

                  case '8':
                    {
                      let pos2 = msg.indexOf(',', pos + 7);
                      message.bidPrice = parseValue(msg.substring(pos + 7, pos2), message.unitcode);
                      pos = pos2 + 1;
                      pos2 = msg.indexOf(',', pos);
                      message.bidSize = parseInt(msg.substring(pos, pos2));
                      pos = pos2 + 1;
                      pos2 = msg.indexOf(',', pos);
                      message.askPrice = parseValue(msg.substring(pos, pos2), message.unitcode);
                      pos = pos2 + 1;
                      pos2 = msg.indexOf(',', pos);
                      message.askSize = parseInt(msg.substring(pos, pos2));
                      pos = pos2 + 1;
                      message.day = msg.substr(pos, 1);
                      message.session = msg.substr(pos + 1, 1);
                      message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
                      message.type = 'TOB';
                      break;
                    }

                  case 'Z':
                    {
                      let pos2 = msg.indexOf(',', pos + 7);
                      message.tradePrice = parseValue(msg.substring(pos + 7, pos2), message.unitcode);
                      pos = pos2 + 1;
                      pos2 = msg.indexOf(',', pos);
                      message.tradeSize = parseInt(msg.substring(pos, pos2));
                      pos = pos2 + 1;
                      message.day = msg.substr(pos, 1);
                      message.session = msg.substr(pos + 1, 1);
                      message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
                      message.type = 'TRADE_OUT_OF_SEQUENCE';
                      break;
                    }
                }

                break;
              }

            case '3':
              {
                const pos = msg.indexOf(',', 0);
                message.symbol = msg.substring(2, pos);
                message.subrecord = msg.substr(pos + 1, 1);

                switch (message.subrecord) {
                  case 'B':
                    {
                      message.unitcode = msg.substr(pos + 3, 1);
                      message.exchange = msg.substr(pos + 4, 1);
                      message.bidDepth = msg.substr(pos + 5, 1) == 'A' ? 10 : parseInt(msg.substr(pos + 5, 1));
                      message.askDepth = msg.substr(pos + 6, 1) == 'A' ? 10 : parseInt(msg.substr(pos + 6, 1));
                      message.bids = [];
                      message.asks = [];
                      const ary = msg.substring(pos + 8).split(',');

                      for (let i = 0; i < ary.length; i++) {
                        const ary2 = ary[i].split(/[A-Z]/);
                        const c = ary[i].substr(ary2[0].length, 1);
                        if (c <= 'J') message.asks.push({
                          "price": parseValue(ary2[0], message.unitcode),
                          "size": parseInt(ary2[1])
                        });else message.bids.push({
                          "price": parseValue(ary2[0], message.unitcode),
                          "size": parseInt(ary2[1])
                        });
                      }

                      message.type = 'BOOK';
                      break;
                    }

                  default:
                    break;
                }

                break;
              }

            default:
              {
                message.type = 'UNKNOWN';
                break;
              }
          }
        }
    }

    return message;
  }

  return parseMessage;
})();

},{"./timestamp":26,"./value":27,"xmldom":60}],26:[function(require,module,exports){
module.exports = (() => {
  'use strict';
  /**
   * Parses a DDF timestamp.
   *
   * The resulting {@link Date} instance is meant to be a simple container
   * for year, month, day, hour, minute, and second. The timezone is implied
   * (to be the timezone of the exchange on which the associated instrument
   * trades.
   *
   * In other words, while the resulting {@link Date} instance uses the timezone
   * of the local computer -- this is unintended and should not be relied on.
   * So, regardless of whether your computer's timezone is set to Belize or Japan;
   * a quote for IBM, having a date of September 26 at 13:15 refers to September 26
   * at 13:15 in America/New_York not America/Belize or Asia/Tokyo.
   *
   * @function
   * @param {String} bytes
   * @returns {Date}
   */

  function parseTimestamp(bytes) {
    if (bytes.length !== 9) {
      return null;
    }

    const year = bytes.charCodeAt(0) * 100 + bytes.charCodeAt(1) - 64;
    const month = bytes.charCodeAt(2) - 64 - 1;
    const day = bytes.charCodeAt(3) - 64;
    const hour = bytes.charCodeAt(4) - 64;
    const minute = bytes.charCodeAt(5) - 64;
    const second = bytes.charCodeAt(6) - 64;
    const ms = (0xFF & bytes.charCodeAt(7)) + ((0xFF & bytes.charCodeAt(8)) << 8); // 2016/02/17. JERQ is providing us with date and time values that
    // are meant to be interpreted in the exchange's local timezone.
    //
    // This is interesting because different time values (e.g. 14:30 and
    // 13:30) can refer to the same moment (e.g. EST for US equities and
    // CST for US futures).
    //
    // Furthermore, when we use the timezone-sensitive Date object, we
    // create a problem. The represents (computer) local time. So, for
    // server applications, it is recommended that we use UTC -- so
    // that the values (hours) are not changed when JSON serialized
    // to ISO-8601 format. Then, the issue is passed along to the
    // consumer (which must ignore the timezone too).

    return new Date(year, month, day, hour, minute, second, ms);
  }

  return parseTimestamp;
})();

},{}],27:[function(require,module,exports){
module.exports = (() => {
  'use strict';

  const replaceExpressions = {};

  function getReplaceExpression(thousandsSeparator) {
    if (!replaceExpressions.hasOwnProperty(thousandsSeparator)) {
      replaceExpressions[thousandsSeparator] = new RegExp(thousandsSeparator, 'g');
    }

    return replaceExpressions[thousandsSeparator];
  }
  /**
   * Parses DDF price.
   *
   * @function
   * @param {String} bytes
   * @param {String} unitcode
   * @param {String=} thousandsSeparator
   * @returns {Number}
   */


  function parseValue(str, unitcode, thousandsSeparator) {
    if (str.length < 1) {
      return undefined;
    } else if (str === '-') {
      return null;
    }

    if (thousandsSeparator) {
      str = str.replace(getReplaceExpression(thousandsSeparator), '');
    }

    if (!(str.indexOf('.') < 0)) {
      return parseFloat(str);
    }

    const sign = str.substr(0, 1) == '-' ? -1 : 1;

    if (sign === -1) {
      str = str.substr(1);
    }

    switch (unitcode) {
      case '2':
        // 8ths
        return sign * ((str.length > 1 ? parseInt(str.substr(0, str.length - 1)) : 0) + parseInt(str.substr(-1)) / 8);

      case '3':
        // 16ths
        return sign * ((str.length > 2 ? parseInt(str.substr(0, str.length - 2)) : 0) + parseInt(str.substr(-2)) / 16);

      case '4':
        // 32ths
        return sign * ((str.length > 2 ? parseInt(str.substr(0, str.length - 2)) : 0) + parseInt(str.substr(-2)) / 32);

      case '5':
        // 64ths
        return sign * ((str.length > 2 ? parseInt(str.substr(0, str.length - 2)) : 0) + parseInt(str.substr(-2)) / 64);

      case '6':
        // 128ths
        return sign * ((str.length > 3 ? parseInt(str.substr(0, str.length - 3)) : 0) + parseInt(str.substr(-3)) / 128);

      case '7':
        // 256ths
        return sign * ((str.length > 3 ? parseInt(str.substr(0, str.length - 3)) : 0) + parseInt(str.substr(-3)) / 256);

      case '8':
        return sign * parseInt(str);

      case '9':
        return sign * (parseInt(str) / 10);

      case 'A':
        return sign * (parseInt(str) / 100);

      case 'B':
        return sign * (parseInt(str) / 1000);

      case 'C':
        return sign * (parseInt(str) / 10000);

      case 'D':
        return sign * (parseInt(str) / 100000);

      case 'E':
        return sign * (parseInt(str) / 1000000);

      default:
        return sign * parseInt(str);
    }
  }

  return parseValue;
})();

},{}],28:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');

module.exports = (() => {
  'use strict';

  const alternateFuturesMonths = {
    A: 'F',
    B: 'G',
    C: 'H',
    D: 'J',
    E: 'K',
    I: 'M',
    L: 'N',
    O: 'Q',
    P: 'U',
    R: 'V',
    S: 'X',
    T: 'Z'
  };
  const futuresMonthNumbers = {
    F: 1,
    G: 2,
    H: 3,
    J: 4,
    K: 5,
    M: 6,
    N: 7,
    Q: 8,
    U: 9,
    V: 10,
    X: 11,
    Z: 12
  };
  const predicates = {};
  predicates.bats = /^(.*)\.BZ$/i;
  predicates.percent = /(\.RT)$/;
  const types = {};
  types.forex = /^\^([A-Z]{3})([A-Z]{3})$/i;
  types.futures = {};
  types.futures.spread = /^_S_/i;
  types.futures.concrete = /^([A-Z][A-Z0-9\$\-!\.]{0,2})([A-Z]{1})([0-9]{4}|[0-9]{1,2})$/i;
  types.futures.alias = /^([A-Z][A-Z0-9\$\-!\.]{0,2})(\*{1})([0-9]{1,2})$/i;
  types.futures.options = {};
  types.futures.options.short = /^([A-Z][A-Z0-9\$\-!\.]?)([A-Z])([0-9]{1,4})([A-Z])$/i;
  types.futures.options.long = /^([A-Z][A-Z0-9\$\-!\.]{0,2})([A-Z])([0-9]{1,4})\|(\-?[0-9]{1,5})(C|P)$/i;
  types.futures.options.historical = /^([A-Z][A-Z0-9\$\-!\.]{0,2})([A-Z])([0-9]{2})([0-9]{1,5})(C|P)$/i;
  types.indicies = {};
  types.indicies.external = /^\$(.*)$/i;
  types.indicies.sector = /^\-(.*)$/i;
  types.indicies.cmdty = /^(.*)\.CM$/i;
  const parsers = [];
  parsers.push(symbol => {
    let definition = null;

    if (types.futures.spread.test(symbol)) {
      definition = {};
      definition.symbol = symbol;
      definition.type = 'future_spread';
    }

    return definition;
  });
  parsers.push(symbol => {
    let definition = null;
    const match = symbol.match(types.futures.concrete);

    if (match !== null) {
      definition = {};
      definition.symbol = symbol;
      definition.type = 'future';
      definition.dynamic = false;
      definition.root = match[1];
      definition.month = match[2];
      definition.year = getFuturesYear(match[3]);
    }

    return definition;
  });
  parsers.push(symbol => {
    let definition = null;
    const match = symbol.match(types.futures.alias);

    if (match !== null) {
      definition = {};
      definition.symbol = symbol;
      definition.type = 'future';
      definition.dynamic = true;
      definition.root = match[1];
      definition.dynamicCode = match[3];
    }

    return definition;
  });
  parsers.push(symbol => {
    let definition = null;

    if (types.forex.test(symbol)) {
      definition = {};
      definition.symbol = symbol;
      definition.type = 'forex';
    }

    return definition;
  });
  parsers.push(symbol => {
    let definition = null;

    if (types.indicies.external.test(symbol)) {
      definition = {};
      definition.symbol = symbol;
      definition.type = 'index';
    }

    return definition;
  });
  parsers.push(symbol => {
    let definition = null;

    if (types.indicies.sector.test(symbol)) {
      definition = {};
      definition.symbol = symbol;
      definition.type = 'sector';
    }

    return definition;
  });
  parsers.push(symbol => {
    let definition = null;
    const match = symbol.match(types.futures.options.short);

    if (match !== null) {
      definition = {};
      const putCallCharacterCode = match[4].charCodeAt(0);
      const putCharacterCode = 80;
      const callCharacterCode = 67;
      let optionType;
      let optionYearDelta;

      if (putCallCharacterCode < putCharacterCode) {
        optionType = 'call';
        optionYearDelta = putCallCharacterCode - callCharacterCode;
      } else {
        optionType = 'put';
        optionYearDelta = putCallCharacterCode - putCharacterCode;
      }

      definition.symbol = symbol;
      definition.type = 'future_option';
      definition.option_type = optionType;
      definition.strike = parseInt(match[3]);
      definition.root = match[1];
      definition.month = match[2];
      definition.year = getCurrentYear() + optionYearDelta;
    }

    return definition;
  });
  parsers.push(symbol => {
    let definition = null;
    const match = symbol.match(types.futures.options.long) || symbol.match(types.futures.options.historical);

    if (match !== null) {
      definition = {};
      definition.symbol = symbol;
      definition.type = 'future_option';
      definition.option_type = match[5] === 'C' ? 'call' : 'put';
      definition.strike = parseInt(match[4]);
      definition.root = match[1];
      definition.month = getFuturesMonth(match[2]);
      definition.year = getFuturesYear(match[3]);
    }

    return definition;
  });
  const converters = [];
  converters.push(symbol => {
    let converted = null;

    if (SymbolParser.getIsFuture(symbol) && SymbolParser.getIsConcrete(symbol)) {
      converted = symbol.replace(/(.{1,3})([A-Z]{1})([0-9]{3}|[0-9]{1})?([0-9]{1})$/i, '$1$2$4') || null;
    }

    return converted;
  });
  converters.push(symbol => {
    let converted = null;

    if (SymbolParser.getIsFutureOption(symbol)) {
      const definition = SymbolParser.parseInstrumentType(symbol);
      const putCallCharacter = getPutCallCharacter(definition.option_type);

      if (definition.root.length < 3) {
        const putCallCharacterCode = putCallCharacter.charCodeAt(0);
        converted = `${definition.root}${definition.month}${definition.strike}${String.fromCharCode(putCallCharacterCode + definition.year - getCurrentYear())}`;
      } else {
        converted = `${definition.root}${definition.month}${getYearDigits(definition.year, 1)}|${definition.strike}${putCallCharacter}`;
      }
    }

    return converted;
  });
  converters.push(symbol => {
    return symbol;
  });

  function getCurrentMonth() {
    const now = new Date();
    return now.getMonth() + 1;
  }

  function getCurrentYear() {
    const now = new Date();
    return now.getFullYear();
  }

  function getYearDigits(year, digits) {
    const yearString = year.toString();
    return yearString.substring(yearString.length - digits, yearString.length);
  }

  function getFuturesMonth(monthString) {
    return alternateFuturesMonths[monthString] || monthString;
  }

  function getFuturesYear(yearString) {
    const currentYear = getCurrentYear();
    let year = parseInt(yearString);

    if (year < 10) {
      const bump = year < currentYear % 10 ? 1 : 0;
      year = Math.floor(currentYear / 10) * 10 + year + bump * 10;
    } else if (year < 100) {
      year = Math.floor(currentYear / 100) * 100 + year;

      if (year < currentYear) {
        const alternateYear = year + 100;

        if (currentYear - year > alternateYear - currentYear) {
          year = alternateYear;
        }
      }
    }

    return year;
  }

  function getPutCallCharacter(optionType) {
    if (optionType === 'call') {
      return 'C';
    } else if (optionType === 'put') {
      return 'P';
    } else {
      return null;
    }
  }
  /**
   * Static utilities for parsing symbols.
   *
   * @public
   */


  class SymbolParser {
    constructor() {}
    /**
     * Returns a simple instrument definition with the terms that can be
     * gleaned from a symbol. If no specifics can be determined from the
     * symbol, a null value is returned.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Object|null}
     */


    static parseInstrumentType(symbol) {
      if (!is.string(symbol)) {
        return null;
      }

      let definition = null;

      for (let i = 0; i < parsers.length && definition === null; i++) {
        const parser = parsers[i];
        definition = parser(symbol);
      }

      return definition;
    }
    /**
     * Translates a symbol into a form suitable for use with JERQ (i.e. the quote "producer").
     *
     * @public
     * @static
     * @param {String} symbol
     * @return {String|null}
     */


    static getProducerSymbol(symbol) {
      if (!is.string(symbol)) {
        return null;
      }

      let converted = null;

      for (let i = 0; i < converters.length && converted === null; i++) {
        const converter = converters[i];
        converted = converter(symbol);
      }

      return converted;
    }
    /**
     * Attempts to convert database format of futures options to pipeline format
     * (e.g. ZLF320Q -> ZLF9|320C)
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {String|null}
     */


    static getFuturesOptionPipelineFormat(symbol) {
      const definition = SymbolParser.parseInstrumentType(symbol);
      let formatted = null;

      if (definition.type === 'future_option') {
        const putCallCharacter = getPutCallCharacter(definition.option_type);
        formatted = `${definition.root}${definition.month}${getYearDigits(definition.year, 1)}|${definition.strike}${putCallCharacter}`;
      }

      return formatted;
    }
    /**
     * Returns true if the symbol is not an alias to another symbol; otherwise
     * false.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsConcrete(symbol) {
      return is.string(symbol) && !types.futures.alias.test(symbol);
    }
    /**
     * Returns true if the symbol is an alias for another symbol; false otherwise.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsReference(symbol) {
      return is.string(symbol) && types.futures.alias.test(symbol);
    }
    /**
     * Returns true if the symbol represents futures contract; false otherwise.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsFuture(symbol) {
      return is.string(symbol) && (types.futures.concrete.test(symbol) || types.futures.alias.test(symbol));
    }
    /**
     * Returns true if the symbol represents futures spread; false otherwise.
     *
     * @public
     * @public
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsFutureSpread(symbol) {
      return is.string(symbol) && types.futures.spread.test(symbol);
    }
    /**
     * Returns true if the symbol represents an option on a futures contract; false
     * otherwise.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsFutureOption(symbol) {
      return is.string(symbol) && (types.futures.options.short.test(symbol) || types.futures.options.long.test(symbol) || types.futures.options.historical.test(symbol));
    }
    /**
     * Returns true if the symbol represents a foreign exchange currency pair;
     * false otherwise.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsForex(symbol) {
      return is.string(symbol) && types.forex.test(symbol);
    }
    /**
     * Returns true if the symbol represents an external index (e.g. Dow Jones
     * Industrials); false otherwise.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsIndex(symbol) {
      return is.string(symbol) && types.indicies.external.test(symbol);
    }
    /**
     * Returns true if the symbol represents an internally-calculated sector
     * index; false otherwise.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsSector(symbol) {
      return is.string(symbol) && types.indicies.sector.test(symbol);
    }
    /**
     * Returns true if the symbol represents an internally-calculated, cmdty-branded
     * index; false otherwise.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsCmdty(symbol) {
      return is.string(symbol) && types.indicies.cmdty.test(symbol);
    }
    /**
     * Returns true if the symbol is listed on the BATS exchange; false otherwise.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsBats(symbol) {
      return is.string(symbol) && predicates.bats.test(symbol);
    }
    /**
     * Returns true if the symbol has an expiration and the symbol appears
     * to be expired (e.g. a future for a past year).
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsExpired(symbol) {
      const definition = SymbolParser.parseInstrumentType(symbol);
      let returnVal = false;

      if (definition !== null && definition.year && definition.month) {
        const currentYear = getCurrentYear();

        if (definition.year < currentYear) {
          returnVal = true;
        } else if (definition.year === currentYear && futuresMonthNumbers.hasOwnProperty(definition.month)) {
          const currentMonth = getCurrentMonth();
          const futuresMonth = futuresMonthNumbers[definition.month];

          if (currentMonth > futuresMonth) {
            returnVal = true;
          }
        }
      }

      return returnVal;
    }
    /**
     * Returns true if prices for the symbol should be represented as a percentage; false
     * otherwise.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static displayUsingPercent(symbol) {
      return is.string(symbol) && predicates.percent.test(symbol);
    }

    toString() {
      return '[SymbolParser]';
    }

  }

  return SymbolParser;
})();

},{"@barchart/common-js/lang/is":31}],29:[function(require,module,exports){
const assert = require('./assert'),
      is = require('./is');

module.exports = (() => {
  'use strict';
  /**
   * Utilities for working with arrays.
   *
   * @public
   * @module lang/array
   */

  return {
    /**
     * Returns the unique items from an array, where the unique
     * key is determined via a strict equality check.
     *
     * @static
     * @param {Array} a
     * @returns {Array}
     */
    unique(a) {
      assert.argumentIsArray(a, 'a');
      return this.uniqueBy(a, item => item);
    },

    /**
     * Returns the unique items from an array, where the unique
     * key is determined by a delegate.
     *
     * @static
     * @param {Array} a
     * @param {Function} keySelector - A function that returns a unique key for an item.
     * @returns {Array}
     */
    uniqueBy(a, keySelector) {
      assert.argumentIsArray(a, 'a');
      return a.filter((item, index, array) => {
        const key = keySelector(item);
        return array.findIndex(candidate => key === keySelector(candidate)) === index;
      });
    },

    /**
     * Splits array into groups and returns an object (where the properties have
     * arrays). Unlike the indexBy function, there can be many items which share
     * the same key.
     *
     * @static
     * @param {Array} a
     * @param {Function} keySelector - A function that returns a unique key for an item.
     * @returns {Object}
     */
    groupBy(a, keySelector) {
      assert.argumentIsArray(a, 'a');
      assert.argumentIsRequired(keySelector, 'keySelector', Function);
      return a.reduce((groups, item) => {
        const key = keySelector(item);

        if (!groups.hasOwnProperty(key)) {
          groups[key] = [];
        }

        groups[key].push(item);
        return groups;
      }, {});
    },

    /**
     * Splits array into groups and returns an array of arrays where the items of each
     * nested array share a common key.
     *
     * @static
     * @param {Array} a
     * @param {Function} keySelector - A function that returns a unique key for an item.
     * @returns {Array}
     */
    batchBy(a, keySelector) {
      assert.argumentIsArray(a, 'a');
      assert.argumentIsRequired(keySelector, 'keySelector', Function);
      let currentKey = null;
      let currentBatch = null;
      return a.reduce((batches, item) => {
        const key = keySelector(item);

        if (currentBatch === null || currentKey !== key) {
          currentKey = key;
          currentBatch = [];
          batches.push(currentBatch);
        }

        currentBatch.push(item);
        return batches;
      }, []);
    },

    /**
     * Splits array into groups and returns an object (where the properties are items from the
     * original array). Unlike the groupBy, only one item can have a given key value.
     *
     * @static
     * @param {Array} a
     * @param {Function} keySelector - A function that returns a unique key for an item.
     * @returns {Object}
     */
    indexBy(a, keySelector) {
      assert.argumentIsArray(a, 'a');
      assert.argumentIsRequired(keySelector, 'keySelector', Function);
      return a.reduce((map, item) => {
        const key = keySelector(item);

        if (map.hasOwnProperty(key)) {
          throw new Error('Unable to index array. A duplicate key exists.');
        }

        map[key] = item;
        return map;
      }, {});
    },

    /**
     * Returns a new array containing all but the first item.
     *
     * @static
     * @param {Array} a
     * @returns {Array}
     */
    dropLeft(a) {
      assert.argumentIsArray(a, 'a');
      let returnRef = Array.from(a);

      if (returnRef.length !== 0) {
        returnRef.shift();
      }

      return returnRef;
    },

    /**
     * Returns a new array containing all but the last item.
     *
     * @static
     * @param {Array} a
     * @returns {Array}
     */
    dropRight(a) {
      assert.argumentIsArray(a, 'a');
      let returnRef = Array.from(a);

      if (returnRef.length !== 0) {
        returnRef.pop();
      }

      return returnRef;
    },

    /**
     * Returns the first item from an array, or an undefined value, if the
     * array is empty.
     *
     * @static
     * @param {Array} a
     * @returns {*|undefined}
     */
    first(a) {
      assert.argumentIsArray(a, 'a');
      let returnRef;

      if (a.length !== 0) {
        returnRef = a[0];
      } else {
        returnRef = undefined;
      }

      return returnRef;
    },

    /**
     * Returns the last item from an array, or an undefined value, if the
     * array is empty.
     *
     * @static
     * @param {Array} a
     * @returns {*|undefined}
     */
    last(a) {
      assert.argumentIsArray(a, 'a');
      let returnRef;

      if (a.length !== 0) {
        returnRef = a[a.length - 1];
      } else {
        returnRef = undefined;
      }

      return returnRef;
    },

    /**
     * Returns a copy of an array, replacing any item that is itself an array
     * with the item's items.
     *
     * @static
     * @param {Array} a
     * @param {Boolean=} recursive - If true, all nested arrays will be flattened.
     * @returns {Array}
     */
    flatten(a, recursive) {
      assert.argumentIsArray(a, 'a');
      assert.argumentIsOptional(recursive, 'recursive', Boolean);
      const empty = [];
      let flat = empty.concat.apply(empty, a);

      if (recursive && flat.some(x => is.array(x))) {
        flat = this.flatten(flat, true);
      }

      return flat;
    },

    /**
     * Breaks an array into smaller arrays, returning an array of arrays.
     *
     * @static
     * @param {Array} a
     * @param {Number} size - The maximum number of items per partition.
     * @param {Array<Array>}
     */
    partition(a, size) {
      assert.argumentIsArray(a, 'a');
      assert.argumentIsOptional(size, 'size', Number);
      const copy = a.slice(0);
      const partitions = [];

      while (copy.length !== 0) {
        partitions.push(copy.splice(0, size));
      }

      return partitions;
    },

    /**
     * Set difference operation (using strict equality).
     *
     * @static
     * @param {Array} a
     * @param {Array} b
     * @returns {Array}
     */
    difference(a, b) {
      return this.differenceBy(a, b, item => item);
    },

    /**
     * Set difference operation, where the uniqueness is determined by a delegate.
     *
     * @static
     * @param {Array} a
     * @param {Array} b
     * @param {Function} keySelector - A function that returns a unique key for an item.
     * @returns {Array}
     */
    differenceBy(a, b, keySelector) {
      assert.argumentIsArray(a, 'a');
      assert.argumentIsArray(b, 'b');
      assert.argumentIsRequired(keySelector, 'keySelector', Function);
      const returnRef = [];
      a.forEach(candidate => {
        const candidateKey = keySelector(candidate);
        const exclude = b.some(comparison => candidateKey === keySelector(comparison));

        if (!exclude) {
          returnRef.push(candidate);
        }
      });
      return returnRef;
    },

    /**
     * Set symmetric difference operation (using strict equality). In
     * other words, this is the union of the differences between the
     * sets.
     *
     * @static
     * @param {Array} a
     * @param {Array} b
     * @returns {Array}
     */
    differenceSymmetric(a, b) {
      return this.differenceSymmetricBy(a, b, item => item);
    },

    /**
     * Set symmetric difference operation, where the uniqueness is determined by a delegate.
     *
     * @static
     * @param {Array} a
     * @param {Array} b
     * @param {Function} keySelector - A function that returns a unique key for an item.
     * @returns {Array}
     */
    differenceSymmetricBy(a, b, keySelector) {
      return this.unionBy(this.differenceBy(a, b, keySelector), this.differenceBy(b, a, keySelector), keySelector);
    },

    /**
     * Set union operation (using strict equality).
     *
     * @static
     * @param {Array} a
     * @param {Array} b
     * @returns {Array}
     */
    union(a, b) {
      return this.unionBy(a, b, item => item);
    },

    /**
     * Set union operation, where the uniqueness is determined by a delegate.
     *
     * @static
     * @param {Array} a
     * @param {Array} b
     * @param {Function} keySelector - A function that returns a unique key for an item.
     * @returns {Array}
     */
    unionBy(a, b, keySelector) {
      assert.argumentIsArray(a, 'a');
      assert.argumentIsArray(b, 'b');
      assert.argumentIsRequired(keySelector, 'keySelector', Function);
      const returnRef = a.slice();
      b.forEach(candidate => {
        const candidateKey = keySelector(candidate);
        const exclude = returnRef.some(comparison => candidateKey === keySelector(comparison));

        if (!exclude) {
          returnRef.push(candidate);
        }
      });
      return returnRef;
    },

    /**
     * Set intersection operation (using strict equality).
     *
     * @static
     * @param {Array} a
     * @param {Array} b
     * @returns {Array}
     */
    intersection(a, b) {
      return this.intersectionBy(a, b, item => item);
    },

    /**
     * Set intersection operation, where the uniqueness is determined by a delegate.
     *
     * @static
     * @param {Array} a
     * @param {Array} b
     * @param {Function} keySelector - A function that returns a unique key for an item.
     * @returns {Array}
     */
    intersectionBy(a, b, keySelector) {
      assert.argumentIsArray(a, 'a');
      assert.argumentIsArray(b, 'b');
      const returnRef = [];
      a.forEach(candidate => {
        const candidateKey = keySelector(candidate);
        const include = b.some(comparison => candidateKey === keySelector(comparison));

        if (include) {
          returnRef.push(candidate);
        }
      });
      return returnRef;
    },

    /**
     * Removes the first item from an array which matches a predicate.
     *
     * @static
     * @public
     * @param {Array} a
     * @param {Function} predicate
     * @returns {Boolean}
     */
    remove(a, predicate) {
      assert.argumentIsArray(a, 'a');
      assert.argumentIsRequired(predicate, 'predicate', Function);
      const index = a.findIndex(predicate);
      const found = !(index < 0);

      if (found) {
        a.splice(index, 1);
      }

      return found;
    },

    /**
     * Inserts an item into an array using a binary search is used to determine the
     * proper point for insertion and returns the same array.
     *
     * @static
     * @public
     * @param {Array} a
     * @param {*} item
     * @param {Function} comparator
     * @returns {Array}
     */
    insert(a, item, comparator) {
      assert.argumentIsArray(a, 'a');
      assert.argumentIsRequired(comparator, 'comparator', Function);

      if (a.length === 0 || !(comparator(item, a[a.length - 1]) < 0)) {
        a.push(item);
      } else if (comparator(item, a[0]) < 0) {
        a.unshift(item);
      } else {
        a.splice(binarySearch(a, item, comparator, 0, a.length - 1), 0, item);
      }

      return a;
    }

  };

  function binarySearch(array, item, comparator, start, end) {
    const size = end - start;
    const midpointIndex = start + Math.floor(size / 2);
    const midpointItem = array[midpointIndex];
    const comparison = comparator(item, midpointItem) > 0;

    if (size < 2) {
      if (comparison > 0) {
        const finalIndex = array.length - 1;

        if (end === finalIndex && comparator(item, array[finalIndex]) > 0) {
          return end + 1;
        } else {
          return end;
        }
      } else {
        return start;
      }
    } else if (comparison > 0) {
      return binarySearch(array, item, comparator, midpointIndex, end);
    } else {
      return binarySearch(array, item, comparator, start, midpointIndex);
    }
  }
})();

},{"./assert":30,"./is":31}],30:[function(require,module,exports){
const is = require('./is');

module.exports = (() => {
  'use strict';

  function checkArgumentType(variable, variableName, type, typeDescription, index) {
    if (type === String) {
      if (!is.string(variable)) {
        throwInvalidTypeError(variableName, 'string', index);
      }
    } else if (type === Number) {
      if (!is.number(variable)) {
        throwInvalidTypeError(variableName, 'number', index);
      }
    } else if (type === Function) {
      if (!is.fn(variable)) {
        throwInvalidTypeError(variableName, 'function', index);
      }
    } else if (type === Boolean) {
      if (!is.boolean(variable)) {
        throwInvalidTypeError(variableName, 'boolean', index);
      }
    } else if (type === Date) {
      if (!is.date(variable)) {
        throwInvalidTypeError(variableName, 'date', index);
      }
    } else if (type === Array) {
      if (!is.array(variable)) {
        throwInvalidTypeError(variableName, 'array', index);
      }
    } else if (!(variable instanceof (type || Object))) {
      throwInvalidTypeError(variableName, typeDescription, index);
    }
  }

  function throwInvalidTypeError(variableName, typeDescription, index) {
    let message;

    if (typeof index === 'number') {
      message = `The argument [ ${variableName || 'unspecified'} ], at index [ ${index.toString()} ] must be a [ ${typeDescription || 'unknown'} ]`;
    } else {
      message = `The argument [ ${variableName || 'unspecified'} ] must be a [ ${typeDescription || 'Object'} ]`;
    }

    throw new Error(message);
  }

  function throwCustomValidationError(variableName, predicateDescription) {
    throw new Error(`The argument [ ${variableName || 'unspecified'} ] failed a validation check [ ${predicateDescription || 'No description available'} ]`);
  }
  /**
   * Utilities checking arguments.
   *
   * @public
   * @module lang/assert
   */


  return {
    /**
     * Throws an error if an argument doesn't conform to the desired specification (as
     * determined by a type check).
     *
     * @static
     * @param {*} variable - The value to check.
     * @param {String} variableName - The name of the value (used for formatting an error message).
     * @param {*} type - The expected type of the argument.
     * @param {String=} typeDescription - The description of the expected type (used for formatting an error message).
     */
    argumentIsRequired(variable, variableName, type, typeDescription) {
      checkArgumentType(variable, variableName, type, typeDescription);
    },

    /**
     * A relaxed version of the "argumentIsRequired" function that will not throw if
     * the value is undefined or null.
     *
     * @static
     * @param {*} variable - The value to check.
     * @param {String} variableName - The name of the value (used for formatting an error message).
     * @param {*} type - The expected type of the argument.
     * @param {String=} typeDescription - The description of the expected type (used for formatting an error message).
     */
    argumentIsOptional(variable, variableName, type, typeDescription, predicate, predicateDescription) {
      if (variable === null || variable === undefined) {
        return;
      }

      checkArgumentType(variable, variableName, type, typeDescription);

      if (is.fn(predicate) && !predicate(variable)) {
        throwCustomValidationError(variableName, predicateDescription);
      }
    },

    argumentIsArray(variable, variableName, itemConstraint, itemConstraintDescription) {
      this.argumentIsRequired(variable, variableName, Array);

      if (itemConstraint) {
        let itemValidator;

        if (typeof itemConstraint === 'function' && itemConstraint !== Function) {
          itemValidator = (value, index) => itemConstraint.prototype !== undefined && value instanceof itemConstraint || itemConstraint(value, `${variableName}[${index}]`);
        } else {
          itemValidator = (value, index) => checkArgumentType(value, variableName, itemConstraint, itemConstraintDescription, index);
        }

        variable.forEach((v, i) => {
          itemValidator(v, i);
        });
      }
    },

    /**
     * Throws an error if an argument doesn't conform to the desired specification
     * (as determined by a predicate).
     *
     * @static
     * @param {*} variable - The value to check.
     * @param {String} variableName - The name of the value (used for formatting an error message).
     * @param {Function=} predicate - A function used to validate the item (beyond type checking).
     * @param {String=} predicateDescription - A description of the assertion made by the predicate (e.g. "is an integer") that is used for formatting an error message.
     */
    argumentIsValid(variable, variableName, predicate, predicateDescription) {
      if (!predicate(variable)) {
        throwCustomValidationError(variableName, predicateDescription);
      }
    },

    areEqual(a, b, descriptionA, descriptionB) {
      if (a !== b) {
        throw new Error(`The objects must be equal [${descriptionA || a.toString()}] and [${descriptionB || b.toString()}]`);
      }
    },

    areNotEqual(a, b, descriptionA, descriptionB) {
      if (a === b) {
        throw new Error(`The objects cannot be equal [${descriptionA || a.toString()}] and [${descriptionB || b.toString()}]`);
      }
    }

  };
})();

},{"./is":31}],31:[function(require,module,exports){
module.exports = (() => {
  'use strict';
  /**
   * Utilities for interrogating variables (e.g. checking data types).
   *
   * @public
   * @module lang/is
   */

  return {
    /**
     * Returns true, if the argument is a number. NaN will return false.
     *
     * @static
     * @public
     * @param {*} candidate {*}
     * @returns {boolean}
     */
    number(candidate) {
      return typeof candidate === 'number' && !isNaN(candidate);
    },

    /**
     * Returns true, if the argument is NaN.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    nan(candidate) {
      return typeof candidate === 'number' && isNaN(candidate);
    },

    /**
     * Returns true, if the argument is a valid 32-bit integer.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    integer(candidate) {
      return typeof candidate === 'number' && !isNaN(candidate) && (candidate | 0) === candidate;
    },

    /**
     * Returns true, if the argument is a valid integer (which can exceed 32 bits); however,
     * the check can fail above the value of Number.MAX_SAFE_INTEGER.
     *
     * @static
     * @public
     * @param {*) candidate
     * @returns {boolean}
     */
    large(candidate) {
      return typeof candidate === 'number' && !isNaN(candidate) && isFinite(candidate) && Math.floor(candidate) === candidate;
    },

    /**
     * Returns true, if the argument is a number that is positive.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    positive(candidate) {
      return this.number(candidate) && candidate > 0;
    },

    /**
     * Returns true, if the argument is a number that is negative.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    negative(candidate) {
      return this.number(candidate) && candidate < 0;
    },

    /**
     * Returns true, if the argument is a string.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    string(candidate) {
      return typeof candidate === 'string';
    },

    /**
     * Returns true, if the argument is a JavaScript Date instance.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    date(candidate) {
      return candidate instanceof Date;
    },

    /**
     * Returns true, if the argument is a function.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    fn(candidate) {
      return typeof candidate === 'function';
    },

    /**
     * Returns true, if the argument is an array.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    array(candidate) {
      return Array.isArray(candidate);
    },

    /**
     * Returns true, if the argument is a Boolean value.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    boolean(candidate) {
      return typeof candidate === 'boolean';
    },

    /**
     * Returns true, if the argument is an object.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    object(candidate) {
      return typeof candidate === 'object' && candidate !== null;
    },

    /**
     * Returns true, if the argument is a null value.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    null(candidate) {
      return candidate === null;
    },

    /**
     * Returns true, if the argument is an undefined value.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    undefined(candidate) {
      return candidate === undefined;
    },

    /**
     * Given two classes, determines if the "child" class extends
     * the "parent" class (without instantiation).
     *
     * @param {Function} parent
     * @param {Function} child
     * @returns {Boolean}
     */
    extension(parent, child) {
      return this.fn(parent) && this.fn(child) && child.prototype instanceof parent;
    }

  };
})();

},{}],32:[function(require,module,exports){
const array = require('./array'),
      is = require('./is');

module.exports = (() => {
  'use strict';
  /**
   * Utilities for working with objects.
   *
   * @public
   * @module lang/object
   */

  const object = {
    /**
     * Performs "deep" equality check on two objects.
     *
     * Array items are compared, object properties are compared, and
     * "primitive" values are checked using strict equality rules.
     *
     * @static
     * @param {Object} a
     * @param {Object} b
     * @returns {Boolean}
     */
    equals(a, b) {
      let returnVal;

      if (a === b) {
        returnVal = true;
      } else if (is.array(a) && is.array(b)) {
        if (a.length === b.length) {
          returnVal = a.length === 0 || a.every((x, i) => object.equals(x, b[i]));
        } else {
          returnVal = false;
        }
      } else if (is.object(a) && is.object(b)) {
        if (is.fn(a.equals) && is.fn(b.equals)) {
          returnVal = a.equals(b);
        } else {
          const keysA = object.keys(a);
          const keysB = object.keys(b);
          returnVal = array.differenceSymmetric(keysA, keysB).length === 0 && keysA.every(key => {
            const valueA = a[key];
            const valueB = b[key];
            return object.equals(valueA, valueB);
          });
        }
      } else {
        returnVal = false;
      }

      return returnVal;
    },

    /**
     * Performs a "deep" copy.
     *
     * @static
     * @param {Object} source - The object to copy.
     * @param {Function=} canExtract - An optional function which indicates if the "extractor" can be used.
     * @param {Function=} extractor - An optional function which returns a cloned value for a property for assignment to the cloned object.
     * @returns {Object}
     */
    clone(source, canExtract, extractor) {
      let c;

      if (is.fn(canExtract) && canExtract(source)) {
        c = extractor(source);
      } else if (is.array(source)) {
        c = source.map(sourceItem => {
          return object.clone(sourceItem, canExtract, extractor);
        });
      } else if (is.object(source)) {
        c = object.keys(source).reduce((accumulator, key) => {
          accumulator[key] = object.clone(source[key], canExtract, extractor);
          return accumulator;
        }, {});
      } else {
        c = source;
      }

      return c;
    },

    /**
     * Creates a new object (or array) by performing a deep copy
     * of the properties from each object. If the same property
     * exists on both objects, the property value from the
     * second object ("b") is preferred.
     *
     * @static
     * @param {Object} a
     * @param {Object} b
     * @returns {Object}
     */
    merge(a, b) {
      let m;
      const mergeTarget = is.object(a) && !is.array(a);
      const mergeSource = is.object(b) && !is.array(b);

      if (mergeTarget && mergeSource) {
        const properties = array.unique(object.keys(a).concat(object.keys(b)));
        m = properties.reduce((accumulator, property) => {
          accumulator[property] = object.merge(a[property], b[property]);
          return accumulator;
        }, {});
      } else if (is.undefined(b)) {
        m = object.clone(a);
      } else {
        m = object.clone(b);
      }

      return m;
    },

    /**
     * Given an object, returns an array of "own" properties.
     *
     * @static
     * @param {Object} target - The object to interrogate.
     * @returns {Array<string>}
     */
    keys(target) {
      const keys = [];

      for (let k in target) {
        if (target.hasOwnProperty(k)) {
          keys.push(k);
        }
      }

      return keys;
    },

    /**
     * Given an object, returns a Boolean value, indicating if the
     * object has any "own" properties.
     *
     * @static
     * @param {Object} target - The object to interrogate.
     * @returns {Boolean}
     */
    empty(target) {
      let empty = true;

      for (let k in target) {
        if (target.hasOwnProperty(k)) {
          empty = false;
          break;
        }
      }

      return empty;
    }

  };
  return object;
})();

},{"./array":29,"./is":31}],33:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":35}],34:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var buildURL = require('./../helpers/buildURL');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = require('./../helpers/cookies');

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

},{"../core/createError":41,"./../core/settle":45,"./../helpers/buildURL":49,"./../helpers/cookies":51,"./../helpers/isURLSameOrigin":53,"./../helpers/parseHeaders":55,"./../utils":57}],35:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./cancel/Cancel":36,"./cancel/CancelToken":37,"./cancel/isCancel":38,"./core/Axios":39,"./core/mergeConfig":44,"./defaults":47,"./helpers/bind":48,"./helpers/spread":56,"./utils":57}],36:[function(require,module,exports){
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],37:[function(require,module,exports){
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":36}],38:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],39:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var buildURL = require('../helpers/buildURL');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);
  config.method = config.method ? config.method.toLowerCase() : 'get';

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"../helpers/buildURL":49,"./../utils":57,"./InterceptorManager":40,"./dispatchRequest":42,"./mergeConfig":44}],40:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":57}],41:[function(require,module,exports){
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":43}],42:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');
var isAbsoluteURL = require('./../helpers/isAbsoluteURL');
var combineURLs = require('./../helpers/combineURLs');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"../cancel/isCancel":38,"../defaults":47,"./../helpers/combineURLs":50,"./../helpers/isAbsoluteURL":52,"./../utils":57,"./transformData":46}],43:[function(require,module,exports){
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};

},{}],44:[function(require,module,exports){
'use strict';

var utils = require('../utils');

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  utils.forEach(['url', 'method', 'params', 'data'], function valueFromConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    }
  });

  utils.forEach(['headers', 'auth', 'proxy'], function mergeDeepProperties(prop) {
    if (utils.isObject(config2[prop])) {
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    } else if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (utils.isObject(config1[prop])) {
      config[prop] = utils.deepMerge(config1[prop]);
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  utils.forEach([
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'maxContentLength',
    'validateStatus', 'maxRedirects', 'httpAgent', 'httpsAgent', 'cancelToken',
    'socketPath'
  ], function defaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  return config;
};

},{"../utils":57}],45:[function(require,module,exports){
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":41}],46:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

},{"./../utils":57}],47:[function(require,module,exports){
(function (process){
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  // Only Node.JS has a process variable that is of [[Class]] process
  if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  } else if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

}).call(this,require('_process'))
},{"./adapters/http":34,"./adapters/xhr":34,"./helpers/normalizeHeaderName":54,"./utils":57,"_process":58}],48:[function(require,module,exports){
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],49:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":57}],50:[function(require,module,exports){
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],51:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

},{"./../utils":57}],52:[function(require,module,exports){
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],53:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

},{"./../utils":57}],54:[function(require,module,exports){
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":57}],55:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":57}],56:[function(require,module,exports){
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],57:[function(require,module,exports){
'use strict';

var bind = require('./helpers/bind');
var isBuffer = require('is-buffer');

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 *
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function deepMerge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === 'object') {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  deepMerge: deepMerge,
  extend: extend,
  trim: trim
};

},{"./helpers/bind":48,"is-buffer":59}],58:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],59:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

module.exports = function isBuffer (obj) {
  return obj != null && obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

},{}],60:[function(require,module,exports){
function DOMParser(options){
	this.options = options ||{locator:{}};
	
}
DOMParser.prototype.parseFromString = function(source,mimeType){
	var options = this.options;
	var sax =  new XMLReader();
	var domBuilder = options.domBuilder || new DOMHandler();//contentHandler and LexicalHandler
	var errorHandler = options.errorHandler;
	var locator = options.locator;
	var defaultNSMap = options.xmlns||{};
	var entityMap = {'lt':'<','gt':'>','amp':'&','quot':'"','apos':"'"}
	if(locator){
		domBuilder.setDocumentLocator(locator)
	}
	
	sax.errorHandler = buildErrorHandler(errorHandler,domBuilder,locator);
	sax.domBuilder = options.domBuilder || domBuilder;
	if(/\/x?html?$/.test(mimeType)){
		entityMap.nbsp = '\xa0';
		entityMap.copy = '\xa9';
		defaultNSMap['']= 'http://www.w3.org/1999/xhtml';
	}
	defaultNSMap.xml = defaultNSMap.xml || 'http://www.w3.org/XML/1998/namespace';
	if(source){
		sax.parse(source,defaultNSMap,entityMap);
	}else{
		sax.errorHandler.error("invalid doc source");
	}
	return domBuilder.doc;
}
function buildErrorHandler(errorImpl,domBuilder,locator){
	if(!errorImpl){
		if(domBuilder instanceof DOMHandler){
			return domBuilder;
		}
		errorImpl = domBuilder ;
	}
	var errorHandler = {}
	var isCallback = errorImpl instanceof Function;
	locator = locator||{}
	function build(key){
		var fn = errorImpl[key];
		if(!fn && isCallback){
			fn = errorImpl.length == 2?function(msg){errorImpl(key,msg)}:errorImpl;
		}
		errorHandler[key] = fn && function(msg){
			fn('[xmldom '+key+']\t'+msg+_locator(locator));
		}||function(){};
	}
	build('warning');
	build('error');
	build('fatalError');
	return errorHandler;
}

//console.log('#\n\n\n\n\n\n\n####')
/**
 * +ContentHandler+ErrorHandler
 * +LexicalHandler+EntityResolver2
 * -DeclHandler-DTDHandler 
 * 
 * DefaultHandler:EntityResolver, DTDHandler, ContentHandler, ErrorHandler
 * DefaultHandler2:DefaultHandler,LexicalHandler, DeclHandler, EntityResolver2
 * @link http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html
 */
function DOMHandler() {
    this.cdata = false;
}
function position(locator,node){
	node.lineNumber = locator.lineNumber;
	node.columnNumber = locator.columnNumber;
}
/**
 * @see org.xml.sax.ContentHandler#startDocument
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
 */ 
DOMHandler.prototype = {
	startDocument : function() {
    	this.doc = new DOMImplementation().createDocument(null, null, null);
    	if (this.locator) {
        	this.doc.documentURI = this.locator.systemId;
    	}
	},
	startElement:function(namespaceURI, localName, qName, attrs) {
		var doc = this.doc;
	    var el = doc.createElementNS(namespaceURI, qName||localName);
	    var len = attrs.length;
	    appendElement(this, el);
	    this.currentElement = el;
	    
		this.locator && position(this.locator,el)
	    for (var i = 0 ; i < len; i++) {
	        var namespaceURI = attrs.getURI(i);
	        var value = attrs.getValue(i);
	        var qName = attrs.getQName(i);
			var attr = doc.createAttributeNS(namespaceURI, qName);
			this.locator &&position(attrs.getLocator(i),attr);
			attr.value = attr.nodeValue = value;
			el.setAttributeNode(attr)
	    }
	},
	endElement:function(namespaceURI, localName, qName) {
		var current = this.currentElement
		var tagName = current.tagName;
		this.currentElement = current.parentNode;
	},
	startPrefixMapping:function(prefix, uri) {
	},
	endPrefixMapping:function(prefix) {
	},
	processingInstruction:function(target, data) {
	    var ins = this.doc.createProcessingInstruction(target, data);
	    this.locator && position(this.locator,ins)
	    appendElement(this, ins);
	},
	ignorableWhitespace:function(ch, start, length) {
	},
	characters:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
		//console.log(chars)
		if(chars){
			if (this.cdata) {
				var charNode = this.doc.createCDATASection(chars);
			} else {
				var charNode = this.doc.createTextNode(chars);
			}
			if(this.currentElement){
				this.currentElement.appendChild(charNode);
			}else if(/^\s*$/.test(chars)){
				this.doc.appendChild(charNode);
				//process xml
			}
			this.locator && position(this.locator,charNode)
		}
	},
	skippedEntity:function(name) {
	},
	endDocument:function() {
		this.doc.normalize();
	},
	setDocumentLocator:function (locator) {
	    if(this.locator = locator){// && !('lineNumber' in locator)){
	    	locator.lineNumber = 0;
	    }
	},
	//LexicalHandler
	comment:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
	    var comm = this.doc.createComment(chars);
	    this.locator && position(this.locator,comm)
	    appendElement(this, comm);
	},
	
	startCDATA:function() {
	    //used in characters() methods
	    this.cdata = true;
	},
	endCDATA:function() {
	    this.cdata = false;
	},
	
	startDTD:function(name, publicId, systemId) {
		var impl = this.doc.implementation;
	    if (impl && impl.createDocumentType) {
	        var dt = impl.createDocumentType(name, publicId, systemId);
	        this.locator && position(this.locator,dt)
	        appendElement(this, dt);
	    }
	},
	/**
	 * @see org.xml.sax.ErrorHandler
	 * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
	 */
	warning:function(error) {
		console.warn('[xmldom warning]\t'+error,_locator(this.locator));
	},
	error:function(error) {
		console.error('[xmldom error]\t'+error,_locator(this.locator));
	},
	fatalError:function(error) {
		console.error('[xmldom fatalError]\t'+error,_locator(this.locator));
	    throw error;
	}
}
function _locator(l){
	if(l){
		return '\n@'+(l.systemId ||'')+'#[line:'+l.lineNumber+',col:'+l.columnNumber+']'
	}
}
function _toString(chars,start,length){
	if(typeof chars == 'string'){
		return chars.substr(start,length)
	}else{//java sax connect width xmldom on rhino(what about: "? && !(chars instanceof String)")
		if(chars.length >= start+length || start){
			return new java.lang.String(chars,start,length)+'';
		}
		return chars;
	}
}

/*
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html
 * used method of org.xml.sax.ext.LexicalHandler:
 *  #comment(chars, start, length)
 *  #startCDATA()
 *  #endCDATA()
 *  #startDTD(name, publicId, systemId)
 *
 *
 * IGNORED method of org.xml.sax.ext.LexicalHandler:
 *  #endDTD()
 *  #startEntity(name)
 *  #endEntity(name)
 *
 *
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html
 * IGNORED method of org.xml.sax.ext.DeclHandler
 * 	#attributeDecl(eName, aName, type, mode, value)
 *  #elementDecl(name, model)
 *  #externalEntityDecl(name, publicId, systemId)
 *  #internalEntityDecl(name, value)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
 * IGNORED method of org.xml.sax.EntityResolver2
 *  #resolveEntity(String name,String publicId,String baseURI,String systemId)
 *  #resolveEntity(publicId, systemId)
 *  #getExternalSubset(name, baseURI)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
 * IGNORED method of org.xml.sax.DTDHandler
 *  #notationDecl(name, publicId, systemId) {};
 *  #unparsedEntityDecl(name, publicId, systemId, notationName) {};
 */
"endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g,function(key){
	DOMHandler.prototype[key] = function(){return null}
})

/* Private static helpers treated below as private instance methods, so don't need to add these to the public API; we might use a Relator to also get rid of non-standard public properties */
function appendElement (hander,node) {
    if (!hander.currentElement) {
        hander.doc.appendChild(node);
    } else {
        hander.currentElement.appendChild(node);
    }
}//appendChild and setAttributeNS are preformance key

//if(typeof require == 'function'){
	var XMLReader = require('./sax').XMLReader;
	var DOMImplementation = exports.DOMImplementation = require('./dom').DOMImplementation;
	exports.XMLSerializer = require('./dom').XMLSerializer ;
	exports.DOMParser = DOMParser;
//}

},{"./dom":61,"./sax":62}],61:[function(require,module,exports){
/*
 * DOM Level 2
 * Object DOMException
 * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
 */

function copy(src,dest){
	for(var p in src){
		dest[p] = src[p];
	}
}
/**
^\w+\.prototype\.([_\w]+)\s*=\s*((?:.*\{\s*?[\r\n][\s\S]*?^})|\S.*?(?=[;\r\n]));?
^\w+\.prototype\.([_\w]+)\s*=\s*(\S.*?(?=[;\r\n]));?
 */
function _extends(Class,Super){
	var pt = Class.prototype;
	if(Object.create){
		var ppt = Object.create(Super.prototype)
		pt.__proto__ = ppt;
	}
	if(!(pt instanceof Super)){
		function t(){};
		t.prototype = Super.prototype;
		t = new t();
		copy(pt,t);
		Class.prototype = pt = t;
	}
	if(pt.constructor != Class){
		if(typeof Class != 'function'){
			console.error("unknow Class:"+Class)
		}
		pt.constructor = Class
	}
}
var htmlns = 'http://www.w3.org/1999/xhtml' ;
// Node Types
var NodeType = {}
var ELEMENT_NODE                = NodeType.ELEMENT_NODE                = 1;
var ATTRIBUTE_NODE              = NodeType.ATTRIBUTE_NODE              = 2;
var TEXT_NODE                   = NodeType.TEXT_NODE                   = 3;
var CDATA_SECTION_NODE          = NodeType.CDATA_SECTION_NODE          = 4;
var ENTITY_REFERENCE_NODE       = NodeType.ENTITY_REFERENCE_NODE       = 5;
var ENTITY_NODE                 = NodeType.ENTITY_NODE                 = 6;
var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
var COMMENT_NODE                = NodeType.COMMENT_NODE                = 8;
var DOCUMENT_NODE               = NodeType.DOCUMENT_NODE               = 9;
var DOCUMENT_TYPE_NODE          = NodeType.DOCUMENT_TYPE_NODE          = 10;
var DOCUMENT_FRAGMENT_NODE      = NodeType.DOCUMENT_FRAGMENT_NODE      = 11;
var NOTATION_NODE               = NodeType.NOTATION_NODE               = 12;

// ExceptionCode
var ExceptionCode = {}
var ExceptionMessage = {};
var INDEX_SIZE_ERR              = ExceptionCode.INDEX_SIZE_ERR              = ((ExceptionMessage[1]="Index size error"),1);
var DOMSTRING_SIZE_ERR          = ExceptionCode.DOMSTRING_SIZE_ERR          = ((ExceptionMessage[2]="DOMString size error"),2);
var HIERARCHY_REQUEST_ERR       = ExceptionCode.HIERARCHY_REQUEST_ERR       = ((ExceptionMessage[3]="Hierarchy request error"),3);
var WRONG_DOCUMENT_ERR          = ExceptionCode.WRONG_DOCUMENT_ERR          = ((ExceptionMessage[4]="Wrong document"),4);
var INVALID_CHARACTER_ERR       = ExceptionCode.INVALID_CHARACTER_ERR       = ((ExceptionMessage[5]="Invalid character"),5);
var NO_DATA_ALLOWED_ERR         = ExceptionCode.NO_DATA_ALLOWED_ERR         = ((ExceptionMessage[6]="No data allowed"),6);
var NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = ((ExceptionMessage[7]="No modification allowed"),7);
var NOT_FOUND_ERR               = ExceptionCode.NOT_FOUND_ERR               = ((ExceptionMessage[8]="Not found"),8);
var NOT_SUPPORTED_ERR           = ExceptionCode.NOT_SUPPORTED_ERR           = ((ExceptionMessage[9]="Not supported"),9);
var INUSE_ATTRIBUTE_ERR         = ExceptionCode.INUSE_ATTRIBUTE_ERR         = ((ExceptionMessage[10]="Attribute in use"),10);
//level2
var INVALID_STATE_ERR        	= ExceptionCode.INVALID_STATE_ERR        	= ((ExceptionMessage[11]="Invalid state"),11);
var SYNTAX_ERR               	= ExceptionCode.SYNTAX_ERR               	= ((ExceptionMessage[12]="Syntax error"),12);
var INVALID_MODIFICATION_ERR 	= ExceptionCode.INVALID_MODIFICATION_ERR 	= ((ExceptionMessage[13]="Invalid modification"),13);
var NAMESPACE_ERR            	= ExceptionCode.NAMESPACE_ERR           	= ((ExceptionMessage[14]="Invalid namespace"),14);
var INVALID_ACCESS_ERR       	= ExceptionCode.INVALID_ACCESS_ERR      	= ((ExceptionMessage[15]="Invalid access"),15);


function DOMException(code, message) {
	if(message instanceof Error){
		var error = message;
	}else{
		error = this;
		Error.call(this, ExceptionMessage[code]);
		this.message = ExceptionMessage[code];
		if(Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
	}
	error.code = code;
	if(message) this.message = this.message + ": " + message;
	return error;
};
DOMException.prototype = Error.prototype;
copy(ExceptionCode,DOMException)
/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177
 * The NodeList interface provides the abstraction of an ordered collection of nodes, without defining or constraining how this collection is implemented. NodeList objects in the DOM are live.
 * The items in the NodeList are accessible via an integral index, starting from 0.
 */
function NodeList() {
};
NodeList.prototype = {
	/**
	 * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
	 * @standard level1
	 */
	length:0, 
	/**
	 * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
	 * @standard level1
	 * @param index  unsigned long 
	 *   Index into the collection.
	 * @return Node
	 * 	The node at the indexth position in the NodeList, or null if that is not a valid index. 
	 */
	item: function(index) {
		return this[index] || null;
	},
	toString:function(isHTML,nodeFilter){
		for(var buf = [], i = 0;i<this.length;i++){
			serializeToString(this[i],buf,isHTML,nodeFilter);
		}
		return buf.join('');
	}
};
function LiveNodeList(node,refresh){
	this._node = node;
	this._refresh = refresh
	_updateLiveList(this);
}
function _updateLiveList(list){
	var inc = list._node._inc || list._node.ownerDocument._inc;
	if(list._inc != inc){
		var ls = list._refresh(list._node);
		//console.log(ls.length)
		__set__(list,'length',ls.length);
		copy(ls,list);
		list._inc = inc;
	}
}
LiveNodeList.prototype.item = function(i){
	_updateLiveList(this);
	return this[i];
}

_extends(LiveNodeList,NodeList);
/**
 * 
 * Objects implementing the NamedNodeMap interface are used to represent collections of nodes that can be accessed by name. Note that NamedNodeMap does not inherit from NodeList; NamedNodeMaps are not maintained in any particular order. Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index, but this is simply to allow convenient enumeration of the contents of a NamedNodeMap, and does not imply that the DOM specifies an order to these Nodes.
 * NamedNodeMap objects in the DOM are live.
 * used for attributes or DocumentType entities 
 */
function NamedNodeMap() {
};

function _findNodeIndex(list,node){
	var i = list.length;
	while(i--){
		if(list[i] === node){return i}
	}
}

function _addNamedNode(el,list,newAttr,oldAttr){
	if(oldAttr){
		list[_findNodeIndex(list,oldAttr)] = newAttr;
	}else{
		list[list.length++] = newAttr;
	}
	if(el){
		newAttr.ownerElement = el;
		var doc = el.ownerDocument;
		if(doc){
			oldAttr && _onRemoveAttribute(doc,el,oldAttr);
			_onAddAttribute(doc,el,newAttr);
		}
	}
}
function _removeNamedNode(el,list,attr){
	//console.log('remove attr:'+attr)
	var i = _findNodeIndex(list,attr);
	if(i>=0){
		var lastIndex = list.length-1
		while(i<lastIndex){
			list[i] = list[++i]
		}
		list.length = lastIndex;
		if(el){
			var doc = el.ownerDocument;
			if(doc){
				_onRemoveAttribute(doc,el,attr);
				attr.ownerElement = null;
			}
		}
	}else{
		throw DOMException(NOT_FOUND_ERR,new Error(el.tagName+'@'+attr))
	}
}
NamedNodeMap.prototype = {
	length:0,
	item:NodeList.prototype.item,
	getNamedItem: function(key) {
//		if(key.indexOf(':')>0 || key == 'xmlns'){
//			return null;
//		}
		//console.log()
		var i = this.length;
		while(i--){
			var attr = this[i];
			//console.log(attr.nodeName,key)
			if(attr.nodeName == key){
				return attr;
			}
		}
	},
	setNamedItem: function(attr) {
		var el = attr.ownerElement;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		var oldAttr = this.getNamedItem(attr.nodeName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},
	/* returns Node */
	setNamedItemNS: function(attr) {// raises: WRONG_DOCUMENT_ERR,NO_MODIFICATION_ALLOWED_ERR,INUSE_ATTRIBUTE_ERR
		var el = attr.ownerElement, oldAttr;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		oldAttr = this.getNamedItemNS(attr.namespaceURI,attr.localName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},

	/* returns Node */
	removeNamedItem: function(key) {
		var attr = this.getNamedItem(key);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
		
		
	},// raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR
	
	//for level2
	removeNamedItemNS:function(namespaceURI,localName){
		var attr = this.getNamedItemNS(namespaceURI,localName);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
	},
	getNamedItemNS: function(namespaceURI, localName) {
		var i = this.length;
		while(i--){
			var node = this[i];
			if(node.localName == localName && node.namespaceURI == namespaceURI){
				return node;
			}
		}
		return null;
	}
};
/**
 * @see http://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490
 */
function DOMImplementation(/* Object */ features) {
	this._features = {};
	if (features) {
		for (var feature in features) {
			 this._features = features[feature];
		}
	}
};

DOMImplementation.prototype = {
	hasFeature: function(/* string */ feature, /* string */ version) {
		var versions = this._features[feature.toLowerCase()];
		if (versions && (!version || version in versions)) {
			return true;
		} else {
			return false;
		}
	},
	// Introduced in DOM Level 2:
	createDocument:function(namespaceURI,  qualifiedName, doctype){// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR,WRONG_DOCUMENT_ERR
		var doc = new Document();
		doc.implementation = this;
		doc.childNodes = new NodeList();
		doc.doctype = doctype;
		if(doctype){
			doc.appendChild(doctype);
		}
		if(qualifiedName){
			var root = doc.createElementNS(namespaceURI,qualifiedName);
			doc.appendChild(root);
		}
		return doc;
	},
	// Introduced in DOM Level 2:
	createDocumentType:function(qualifiedName, publicId, systemId){// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR
		var node = new DocumentType();
		node.name = qualifiedName;
		node.nodeName = qualifiedName;
		node.publicId = publicId;
		node.systemId = systemId;
		// Introduced in DOM Level 2:
		//readonly attribute DOMString        internalSubset;
		
		//TODO:..
		//  readonly attribute NamedNodeMap     entities;
		//  readonly attribute NamedNodeMap     notations;
		return node;
	}
};


/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247
 */

function Node() {
};

Node.prototype = {
	firstChild : null,
	lastChild : null,
	previousSibling : null,
	nextSibling : null,
	attributes : null,
	parentNode : null,
	childNodes : null,
	ownerDocument : null,
	nodeValue : null,
	namespaceURI : null,
	prefix : null,
	localName : null,
	// Modified in DOM Level 2:
	insertBefore:function(newChild, refChild){//raises 
		return _insertBefore(this,newChild,refChild);
	},
	replaceChild:function(newChild, oldChild){//raises 
		this.insertBefore(newChild,oldChild);
		if(oldChild){
			this.removeChild(oldChild);
		}
	},
	removeChild:function(oldChild){
		return _removeChild(this,oldChild);
	},
	appendChild:function(newChild){
		return this.insertBefore(newChild,null);
	},
	hasChildNodes:function(){
		return this.firstChild != null;
	},
	cloneNode:function(deep){
		return cloneNode(this.ownerDocument||this,this,deep);
	},
	// Modified in DOM Level 2:
	normalize:function(){
		var child = this.firstChild;
		while(child){
			var next = child.nextSibling;
			if(next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE){
				this.removeChild(next);
				child.appendData(next.data);
			}else{
				child.normalize();
				child = next;
			}
		}
	},
  	// Introduced in DOM Level 2:
	isSupported:function(feature, version){
		return this.ownerDocument.implementation.hasFeature(feature,version);
	},
    // Introduced in DOM Level 2:
    hasAttributes:function(){
    	return this.attributes.length>0;
    },
    lookupPrefix:function(namespaceURI){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			for(var n in map){
    				if(map[n] == namespaceURI){
    					return n;
    				}
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    lookupNamespaceURI:function(prefix){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			if(prefix in map){
    				return map[prefix] ;
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    isDefaultNamespace:function(namespaceURI){
    	var prefix = this.lookupPrefix(namespaceURI);
    	return prefix == null;
    }
};


function _xmlEncoder(c){
	return c == '<' && '&lt;' ||
         c == '>' && '&gt;' ||
         c == '&' && '&amp;' ||
         c == '"' && '&quot;' ||
         '&#'+c.charCodeAt()+';'
}


copy(NodeType,Node);
copy(NodeType,Node.prototype);

/**
 * @param callback return true for continue,false for break
 * @return boolean true: break visit;
 */
function _visitNode(node,callback){
	if(callback(node)){
		return true;
	}
	if(node = node.firstChild){
		do{
			if(_visitNode(node,callback)){return true}
        }while(node=node.nextSibling)
    }
}



function Document(){
}
function _onAddAttribute(doc,el,newAttr){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns == 'http://www.w3.org/2000/xmlns/'){
		//update namespace
		el._nsMap[newAttr.prefix?newAttr.localName:''] = newAttr.value
	}
}
function _onRemoveAttribute(doc,el,newAttr,remove){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns == 'http://www.w3.org/2000/xmlns/'){
		//update namespace
		delete el._nsMap[newAttr.prefix?newAttr.localName:'']
	}
}
function _onUpdateChild(doc,el,newChild){
	if(doc && doc._inc){
		doc._inc++;
		//update childNodes
		var cs = el.childNodes;
		if(newChild){
			cs[cs.length++] = newChild;
		}else{
			//console.log(1)
			var child = el.firstChild;
			var i = 0;
			while(child){
				cs[i++] = child;
				child =child.nextSibling;
			}
			cs.length = i;
		}
	}
}

/**
 * attributes;
 * children;
 * 
 * writeable properties:
 * nodeValue,Attr:value,CharacterData:data
 * prefix
 */
function _removeChild(parentNode,child){
	var previous = child.previousSibling;
	var next = child.nextSibling;
	if(previous){
		previous.nextSibling = next;
	}else{
		parentNode.firstChild = next
	}
	if(next){
		next.previousSibling = previous;
	}else{
		parentNode.lastChild = previous;
	}
	_onUpdateChild(parentNode.ownerDocument,parentNode);
	return child;
}
/**
 * preformance key(refChild == null)
 */
function _insertBefore(parentNode,newChild,nextChild){
	var cp = newChild.parentNode;
	if(cp){
		cp.removeChild(newChild);//remove and update
	}
	if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
		var newFirst = newChild.firstChild;
		if (newFirst == null) {
			return newChild;
		}
		var newLast = newChild.lastChild;
	}else{
		newFirst = newLast = newChild;
	}
	var pre = nextChild ? nextChild.previousSibling : parentNode.lastChild;

	newFirst.previousSibling = pre;
	newLast.nextSibling = nextChild;
	
	
	if(pre){
		pre.nextSibling = newFirst;
	}else{
		parentNode.firstChild = newFirst;
	}
	if(nextChild == null){
		parentNode.lastChild = newLast;
	}else{
		nextChild.previousSibling = newLast;
	}
	do{
		newFirst.parentNode = parentNode;
	}while(newFirst !== newLast && (newFirst= newFirst.nextSibling))
	_onUpdateChild(parentNode.ownerDocument||parentNode,parentNode);
	//console.log(parentNode.lastChild.nextSibling == null)
	if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
		newChild.firstChild = newChild.lastChild = null;
	}
	return newChild;
}
function _appendSingleChild(parentNode,newChild){
	var cp = newChild.parentNode;
	if(cp){
		var pre = parentNode.lastChild;
		cp.removeChild(newChild);//remove and update
		var pre = parentNode.lastChild;
	}
	var pre = parentNode.lastChild;
	newChild.parentNode = parentNode;
	newChild.previousSibling = pre;
	newChild.nextSibling = null;
	if(pre){
		pre.nextSibling = newChild;
	}else{
		parentNode.firstChild = newChild;
	}
	parentNode.lastChild = newChild;
	_onUpdateChild(parentNode.ownerDocument,parentNode,newChild);
	return newChild;
	//console.log("__aa",parentNode.lastChild.nextSibling == null)
}
Document.prototype = {
	//implementation : null,
	nodeName :  '#document',
	nodeType :  DOCUMENT_NODE,
	doctype :  null,
	documentElement :  null,
	_inc : 1,
	
	insertBefore :  function(newChild, refChild){//raises 
		if(newChild.nodeType == DOCUMENT_FRAGMENT_NODE){
			var child = newChild.firstChild;
			while(child){
				var next = child.nextSibling;
				this.insertBefore(child,refChild);
				child = next;
			}
			return newChild;
		}
		if(this.documentElement == null && newChild.nodeType == ELEMENT_NODE){
			this.documentElement = newChild;
		}
		
		return _insertBefore(this,newChild,refChild),(newChild.ownerDocument = this),newChild;
	},
	removeChild :  function(oldChild){
		if(this.documentElement == oldChild){
			this.documentElement = null;
		}
		return _removeChild(this,oldChild);
	},
	// Introduced in DOM Level 2:
	importNode : function(importedNode,deep){
		return importNode(this,importedNode,deep);
	},
	// Introduced in DOM Level 2:
	getElementById :	function(id){
		var rtv = null;
		_visitNode(this.documentElement,function(node){
			if(node.nodeType == ELEMENT_NODE){
				if(node.getAttribute('id') == id){
					rtv = node;
					return true;
				}
			}
		})
		return rtv;
	},
	
	//document factory method:
	createElement :	function(tagName){
		var node = new Element();
		node.ownerDocument = this;
		node.nodeName = tagName;
		node.tagName = tagName;
		node.childNodes = new NodeList();
		var attrs	= node.attributes = new NamedNodeMap();
		attrs._ownerElement = node;
		return node;
	},
	createDocumentFragment :	function(){
		var node = new DocumentFragment();
		node.ownerDocument = this;
		node.childNodes = new NodeList();
		return node;
	},
	createTextNode :	function(data){
		var node = new Text();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createComment :	function(data){
		var node = new Comment();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createCDATASection :	function(data){
		var node = new CDATASection();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createProcessingInstruction :	function(target,data){
		var node = new ProcessingInstruction();
		node.ownerDocument = this;
		node.tagName = node.target = target;
		node.nodeValue= node.data = data;
		return node;
	},
	createAttribute :	function(name){
		var node = new Attr();
		node.ownerDocument	= this;
		node.name = name;
		node.nodeName	= name;
		node.localName = name;
		node.specified = true;
		return node;
	},
	createEntityReference :	function(name){
		var node = new EntityReference();
		node.ownerDocument	= this;
		node.nodeName	= name;
		return node;
	},
	// Introduced in DOM Level 2:
	createElementNS :	function(namespaceURI,qualifiedName){
		var node = new Element();
		var pl = qualifiedName.split(':');
		var attrs	= node.attributes = new NamedNodeMap();
		node.childNodes = new NodeList();
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.tagName = qualifiedName;
		node.namespaceURI = namespaceURI;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		attrs._ownerElement = node;
		return node;
	},
	// Introduced in DOM Level 2:
	createAttributeNS :	function(namespaceURI,qualifiedName){
		var node = new Attr();
		var pl = qualifiedName.split(':');
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.name = qualifiedName;
		node.namespaceURI = namespaceURI;
		node.specified = true;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		return node;
	}
};
_extends(Document,Node);


function Element() {
	this._nsMap = {};
};
Element.prototype = {
	nodeType : ELEMENT_NODE,
	hasAttribute : function(name){
		return this.getAttributeNode(name)!=null;
	},
	getAttribute : function(name){
		var attr = this.getAttributeNode(name);
		return attr && attr.value || '';
	},
	getAttributeNode : function(name){
		return this.attributes.getNamedItem(name);
	},
	setAttribute : function(name, value){
		var attr = this.ownerDocument.createAttribute(name);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	removeAttribute : function(name){
		var attr = this.getAttributeNode(name)
		attr && this.removeAttributeNode(attr);
	},
	
	//four real opeartion method
	appendChild:function(newChild){
		if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
			return this.insertBefore(newChild,null);
		}else{
			return _appendSingleChild(this,newChild);
		}
	},
	setAttributeNode : function(newAttr){
		return this.attributes.setNamedItem(newAttr);
	},
	setAttributeNodeNS : function(newAttr){
		return this.attributes.setNamedItemNS(newAttr);
	},
	removeAttributeNode : function(oldAttr){
		//console.log(this == oldAttr.ownerElement)
		return this.attributes.removeNamedItem(oldAttr.nodeName);
	},
	//get real attribute name,and remove it by removeAttributeNode
	removeAttributeNS : function(namespaceURI, localName){
		var old = this.getAttributeNodeNS(namespaceURI, localName);
		old && this.removeAttributeNode(old);
	},
	
	hasAttributeNS : function(namespaceURI, localName){
		return this.getAttributeNodeNS(namespaceURI, localName)!=null;
	},
	getAttributeNS : function(namespaceURI, localName){
		var attr = this.getAttributeNodeNS(namespaceURI, localName);
		return attr && attr.value || '';
	},
	setAttributeNS : function(namespaceURI, qualifiedName, value){
		var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	getAttributeNodeNS : function(namespaceURI, localName){
		return this.attributes.getNamedItemNS(namespaceURI, localName);
	},
	
	getElementsByTagName : function(tagName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType == ELEMENT_NODE && (tagName === '*' || node.tagName == tagName)){
					ls.push(node);
				}
			});
			return ls;
		});
	},
	getElementsByTagNameNS : function(namespaceURI, localName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === '*' || node.namespaceURI === namespaceURI) && (localName === '*' || node.localName == localName)){
					ls.push(node);
				}
			});
			return ls;
			
		});
	}
};
Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;


_extends(Element,Node);
function Attr() {
};
Attr.prototype.nodeType = ATTRIBUTE_NODE;
_extends(Attr,Node);


function CharacterData() {
};
CharacterData.prototype = {
	data : '',
	substringData : function(offset, count) {
		return this.data.substring(offset, offset+count);
	},
	appendData: function(text) {
		text = this.data+text;
		this.nodeValue = this.data = text;
		this.length = text.length;
	},
	insertData: function(offset,text) {
		this.replaceData(offset,0,text);
	
	},
	appendChild:function(newChild){
		throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR])
	},
	deleteData: function(offset, count) {
		this.replaceData(offset,count,"");
	},
	replaceData: function(offset, count, text) {
		var start = this.data.substring(0,offset);
		var end = this.data.substring(offset+count);
		text = start + text + end;
		this.nodeValue = this.data = text;
		this.length = text.length;
	}
}
_extends(CharacterData,Node);
function Text() {
};
Text.prototype = {
	nodeName : "#text",
	nodeType : TEXT_NODE,
	splitText : function(offset) {
		var text = this.data;
		var newText = text.substring(offset);
		text = text.substring(0, offset);
		this.data = this.nodeValue = text;
		this.length = text.length;
		var newNode = this.ownerDocument.createTextNode(newText);
		if(this.parentNode){
			this.parentNode.insertBefore(newNode, this.nextSibling);
		}
		return newNode;
	}
}
_extends(Text,CharacterData);
function Comment() {
};
Comment.prototype = {
	nodeName : "#comment",
	nodeType : COMMENT_NODE
}
_extends(Comment,CharacterData);

function CDATASection() {
};
CDATASection.prototype = {
	nodeName : "#cdata-section",
	nodeType : CDATA_SECTION_NODE
}
_extends(CDATASection,CharacterData);


function DocumentType() {
};
DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
_extends(DocumentType,Node);

function Notation() {
};
Notation.prototype.nodeType = NOTATION_NODE;
_extends(Notation,Node);

function Entity() {
};
Entity.prototype.nodeType = ENTITY_NODE;
_extends(Entity,Node);

function EntityReference() {
};
EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
_extends(EntityReference,Node);

function DocumentFragment() {
};
DocumentFragment.prototype.nodeName =	"#document-fragment";
DocumentFragment.prototype.nodeType =	DOCUMENT_FRAGMENT_NODE;
_extends(DocumentFragment,Node);


function ProcessingInstruction() {
}
ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
_extends(ProcessingInstruction,Node);
function XMLSerializer(){}
XMLSerializer.prototype.serializeToString = function(node,isHtml,nodeFilter){
	return nodeSerializeToString.call(node,isHtml,nodeFilter);
}
Node.prototype.toString = nodeSerializeToString;
function nodeSerializeToString(isHtml,nodeFilter){
	var buf = [];
	var refNode = this.nodeType == 9?this.documentElement:this;
	var prefix = refNode.prefix;
	var uri = refNode.namespaceURI;
	
	if(uri && prefix == null){
		//console.log(prefix)
		var prefix = refNode.lookupPrefix(uri);
		if(prefix == null){
			//isHTML = true;
			var visibleNamespaces=[
			{namespace:uri,prefix:null}
			//{namespace:uri,prefix:''}
			]
		}
	}
	serializeToString(this,buf,isHtml,nodeFilter,visibleNamespaces);
	//console.log('###',this.nodeType,uri,prefix,buf.join(''))
	return buf.join('');
}
function needNamespaceDefine(node,isHTML, visibleNamespaces) {
	var prefix = node.prefix||'';
	var uri = node.namespaceURI;
	if (!prefix && !uri){
		return false;
	}
	if (prefix === "xml" && uri === "http://www.w3.org/XML/1998/namespace" 
		|| uri == 'http://www.w3.org/2000/xmlns/'){
		return false;
	}
	
	var i = visibleNamespaces.length 
	//console.log('@@@@',node.tagName,prefix,uri,visibleNamespaces)
	while (i--) {
		var ns = visibleNamespaces[i];
		// get namespace prefix
		//console.log(node.nodeType,node.tagName,ns.prefix,prefix)
		if (ns.prefix == prefix){
			return ns.namespace != uri;
		}
	}
	//console.log(isHTML,uri,prefix=='')
	//if(isHTML && prefix ==null && uri == 'http://www.w3.org/1999/xhtml'){
	//	return false;
	//}
	//node.flag = '11111'
	//console.error(3,true,node.flag,node.prefix,node.namespaceURI)
	return true;
}
function serializeToString(node,buf,isHTML,nodeFilter,visibleNamespaces){
	if(nodeFilter){
		node = nodeFilter(node);
		if(node){
			if(typeof node == 'string'){
				buf.push(node);
				return;
			}
		}else{
			return;
		}
		//buf.sort.apply(attrs, attributeSorter);
	}
	switch(node.nodeType){
	case ELEMENT_NODE:
		if (!visibleNamespaces) visibleNamespaces = [];
		var startVisibleNamespaces = visibleNamespaces.length;
		var attrs = node.attributes;
		var len = attrs.length;
		var child = node.firstChild;
		var nodeName = node.tagName;
		
		isHTML =  (htmlns === node.namespaceURI) ||isHTML 
		buf.push('<',nodeName);
		
		
		
		for(var i=0;i<len;i++){
			// add namespaces for attributes
			var attr = attrs.item(i);
			if (attr.prefix == 'xmlns') {
				visibleNamespaces.push({ prefix: attr.localName, namespace: attr.value });
			}else if(attr.nodeName == 'xmlns'){
				visibleNamespaces.push({ prefix: '', namespace: attr.value });
			}
		}
		for(var i=0;i<len;i++){
			var attr = attrs.item(i);
			if (needNamespaceDefine(attr,isHTML, visibleNamespaces)) {
				var prefix = attr.prefix||'';
				var uri = attr.namespaceURI;
				var ns = prefix ? ' xmlns:' + prefix : " xmlns";
				buf.push(ns, '="' , uri , '"');
				visibleNamespaces.push({ prefix: prefix, namespace:uri });
			}
			serializeToString(attr,buf,isHTML,nodeFilter,visibleNamespaces);
		}
		// add namespace for current node		
		if (needNamespaceDefine(node,isHTML, visibleNamespaces)) {
			var prefix = node.prefix||'';
			var uri = node.namespaceURI;
			var ns = prefix ? ' xmlns:' + prefix : " xmlns";
			buf.push(ns, '="' , uri , '"');
			visibleNamespaces.push({ prefix: prefix, namespace:uri });
		}
		
		if(child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)){
			buf.push('>');
			//if is cdata child node
			if(isHTML && /^script$/i.test(nodeName)){
				while(child){
					if(child.data){
						buf.push(child.data);
					}else{
						serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
					}
					child = child.nextSibling;
				}
			}else
			{
				while(child){
					serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
					child = child.nextSibling;
				}
			}
			buf.push('</',nodeName,'>');
		}else{
			buf.push('/>');
		}
		// remove added visible namespaces
		//visibleNamespaces.length = startVisibleNamespaces;
		return;
	case DOCUMENT_NODE:
	case DOCUMENT_FRAGMENT_NODE:
		var child = node.firstChild;
		while(child){
			serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
			child = child.nextSibling;
		}
		return;
	case ATTRIBUTE_NODE:
		return buf.push(' ',node.name,'="',node.value.replace(/[<&"]/g,_xmlEncoder),'"');
	case TEXT_NODE:
		return buf.push(node.data.replace(/[<&]/g,_xmlEncoder));
	case CDATA_SECTION_NODE:
		return buf.push( '<![CDATA[',node.data,']]>');
	case COMMENT_NODE:
		return buf.push( "<!--",node.data,"-->");
	case DOCUMENT_TYPE_NODE:
		var pubid = node.publicId;
		var sysid = node.systemId;
		buf.push('<!DOCTYPE ',node.name);
		if(pubid){
			buf.push(' PUBLIC "',pubid);
			if (sysid && sysid!='.') {
				buf.push( '" "',sysid);
			}
			buf.push('">');
		}else if(sysid && sysid!='.'){
			buf.push(' SYSTEM "',sysid,'">');
		}else{
			var sub = node.internalSubset;
			if(sub){
				buf.push(" [",sub,"]");
			}
			buf.push(">");
		}
		return;
	case PROCESSING_INSTRUCTION_NODE:
		return buf.push( "<?",node.target," ",node.data,"?>");
	case ENTITY_REFERENCE_NODE:
		return buf.push( '&',node.nodeName,';');
	//case ENTITY_NODE:
	//case NOTATION_NODE:
	default:
		buf.push('??',node.nodeName);
	}
}
function importNode(doc,node,deep){
	var node2;
	switch (node.nodeType) {
	case ELEMENT_NODE:
		node2 = node.cloneNode(false);
		node2.ownerDocument = doc;
		//var attrs = node2.attributes;
		//var len = attrs.length;
		//for(var i=0;i<len;i++){
			//node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
		//}
	case DOCUMENT_FRAGMENT_NODE:
		break;
	case ATTRIBUTE_NODE:
		deep = true;
		break;
	//case ENTITY_REFERENCE_NODE:
	//case PROCESSING_INSTRUCTION_NODE:
	////case TEXT_NODE:
	//case CDATA_SECTION_NODE:
	//case COMMENT_NODE:
	//	deep = false;
	//	break;
	//case DOCUMENT_NODE:
	//case DOCUMENT_TYPE_NODE:
	//cannot be imported.
	//case ENTITY_NODE:
	//case NOTATION_NODE：
	//can not hit in level3
	//default:throw e;
	}
	if(!node2){
		node2 = node.cloneNode(false);//false
	}
	node2.ownerDocument = doc;
	node2.parentNode = null;
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(importNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}
//
//var _relationMap = {firstChild:1,lastChild:1,previousSibling:1,nextSibling:1,
//					attributes:1,childNodes:1,parentNode:1,documentElement:1,doctype,};
function cloneNode(doc,node,deep){
	var node2 = new node.constructor();
	for(var n in node){
		var v = node[n];
		if(typeof v != 'object' ){
			if(v != node2[n]){
				node2[n] = v;
			}
		}
	}
	if(node.childNodes){
		node2.childNodes = new NodeList();
	}
	node2.ownerDocument = doc;
	switch (node2.nodeType) {
	case ELEMENT_NODE:
		var attrs	= node.attributes;
		var attrs2	= node2.attributes = new NamedNodeMap();
		var len = attrs.length
		attrs2._ownerElement = node2;
		for(var i=0;i<len;i++){
			node2.setAttributeNode(cloneNode(doc,attrs.item(i),true));
		}
		break;;
	case ATTRIBUTE_NODE:
		deep = true;
	}
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(cloneNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}

function __set__(object,key,value){
	object[key] = value
}
//do dynamic
try{
	if(Object.defineProperty){
		Object.defineProperty(LiveNodeList.prototype,'length',{
			get:function(){
				_updateLiveList(this);
				return this.$$length;
			}
		});
		Object.defineProperty(Node.prototype,'textContent',{
			get:function(){
				return getTextContent(this);
			},
			set:function(data){
				switch(this.nodeType){
				case ELEMENT_NODE:
				case DOCUMENT_FRAGMENT_NODE:
					while(this.firstChild){
						this.removeChild(this.firstChild);
					}
					if(data || String(data)){
						this.appendChild(this.ownerDocument.createTextNode(data));
					}
					break;
				default:
					//TODO:
					this.data = data;
					this.value = data;
					this.nodeValue = data;
				}
			}
		})
		
		function getTextContent(node){
			switch(node.nodeType){
			case ELEMENT_NODE:
			case DOCUMENT_FRAGMENT_NODE:
				var buf = [];
				node = node.firstChild;
				while(node){
					if(node.nodeType!==7 && node.nodeType !==8){
						buf.push(getTextContent(node));
					}
					node = node.nextSibling;
				}
				return buf.join('');
			default:
				return node.nodeValue;
			}
		}
		__set__ = function(object,key,value){
			//console.log(value)
			object['$$'+key] = value
		}
	}
}catch(e){//ie8
}

//if(typeof require == 'function'){
	exports.DOMImplementation = DOMImplementation;
	exports.XMLSerializer = XMLSerializer;
//}

},{}],62:[function(require,module,exports){
//[4]   	NameStartChar	   ::=   	":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
//[4a]   	NameChar	   ::=   	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
//[5]   	Name	   ::=   	NameStartChar (NameChar)*
var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]///\u10000-\uEFFFF
var nameChar = new RegExp("[\\-\\.0-9"+nameStartChar.source.slice(1,-1)+"\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
var tagNamePattern = new RegExp('^'+nameStartChar.source+nameChar.source+'*(?:\:'+nameStartChar.source+nameChar.source+'*)?$');
//var tagNamePattern = /^[a-zA-Z_][\w\-\.]*(?:\:[a-zA-Z_][\w\-\.]*)?$/
//var handlers = 'resolveEntity,getExternalSubset,characters,endDocument,endElement,endPrefixMapping,ignorableWhitespace,processingInstruction,setDocumentLocator,skippedEntity,startDocument,startElement,startPrefixMapping,notationDecl,unparsedEntityDecl,error,fatalError,warning,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,comment,endCDATA,endDTD,endEntity,startCDATA,startDTD,startEntity'.split(',')

//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
var S_TAG = 0;//tag name offerring
var S_ATTR = 1;//attr name offerring 
var S_ATTR_SPACE=2;//attr name end and space offer
var S_EQ = 3;//=space?
var S_ATTR_NOQUOT_VALUE = 4;//attr value(no quot value only)
var S_ATTR_END = 5;//attr value end and no space(quot end)
var S_TAG_SPACE = 6;//(attr value end || tag end ) && (space offer)
var S_TAG_CLOSE = 7;//closed el<el />

function XMLReader(){
	
}

XMLReader.prototype = {
	parse:function(source,defaultNSMap,entityMap){
		var domBuilder = this.domBuilder;
		domBuilder.startDocument();
		_copy(defaultNSMap ,defaultNSMap = {})
		parse(source,defaultNSMap,entityMap,
				domBuilder,this.errorHandler);
		domBuilder.endDocument();
	}
}
function parse(source,defaultNSMapCopy,entityMap,domBuilder,errorHandler){
	function fixedFromCharCode(code) {
		// String.prototype.fromCharCode does not supports
		// > 2 bytes unicode chars directly
		if (code > 0xffff) {
			code -= 0x10000;
			var surrogate1 = 0xd800 + (code >> 10)
				, surrogate2 = 0xdc00 + (code & 0x3ff);

			return String.fromCharCode(surrogate1, surrogate2);
		} else {
			return String.fromCharCode(code);
		}
	}
	function entityReplacer(a){
		var k = a.slice(1,-1);
		if(k in entityMap){
			return entityMap[k]; 
		}else if(k.charAt(0) === '#'){
			return fixedFromCharCode(parseInt(k.substr(1).replace('x','0x')))
		}else{
			errorHandler.error('entity not found:'+a);
			return a;
		}
	}
	function appendText(end){//has some bugs
		if(end>start){
			var xt = source.substring(start,end).replace(/&#?\w+;/g,entityReplacer);
			locator&&position(start);
			domBuilder.characters(xt,0,end-start);
			start = end
		}
	}
	function position(p,m){
		while(p>=lineEnd && (m = linePattern.exec(source))){
			lineStart = m.index;
			lineEnd = lineStart + m[0].length;
			locator.lineNumber++;
			//console.log('line++:',locator,startPos,endPos)
		}
		locator.columnNumber = p-lineStart+1;
	}
	var lineStart = 0;
	var lineEnd = 0;
	var linePattern = /.*(?:\r\n?|\n)|.*$/g
	var locator = domBuilder.locator;
	
	var parseStack = [{currentNSMap:defaultNSMapCopy}]
	var closeMap = {};
	var start = 0;
	while(true){
		try{
			var tagStart = source.indexOf('<',start);
			if(tagStart<0){
				if(!source.substr(start).match(/^\s*$/)){
					var doc = domBuilder.doc;
	    			var text = doc.createTextNode(source.substr(start));
	    			doc.appendChild(text);
	    			domBuilder.currentElement = text;
				}
				return;
			}
			if(tagStart>start){
				appendText(tagStart);
			}
			switch(source.charAt(tagStart+1)){
			case '/':
				var end = source.indexOf('>',tagStart+3);
				var tagName = source.substring(tagStart+2,end);
				var config = parseStack.pop();
				if(end<0){
					
	        		tagName = source.substring(tagStart+2).replace(/[\s<].*/,'');
	        		//console.error('#@@@@@@'+tagName)
	        		errorHandler.error("end tag name: "+tagName+' is not complete:'+config.tagName);
	        		end = tagStart+1+tagName.length;
	        	}else if(tagName.match(/\s</)){
	        		tagName = tagName.replace(/[\s<].*/,'');
	        		errorHandler.error("end tag name: "+tagName+' maybe not complete');
	        		end = tagStart+1+tagName.length;
				}
				//console.error(parseStack.length,parseStack)
				//console.error(config);
				var localNSMap = config.localNSMap;
				var endMatch = config.tagName == tagName;
				var endIgnoreCaseMach = endMatch || config.tagName&&config.tagName.toLowerCase() == tagName.toLowerCase()
		        if(endIgnoreCaseMach){
		        	domBuilder.endElement(config.uri,config.localName,tagName);
					if(localNSMap){
						for(var prefix in localNSMap){
							domBuilder.endPrefixMapping(prefix) ;
						}
					}
					if(!endMatch){
		            	errorHandler.fatalError("end tag name: "+tagName+' is not match the current start tagName:'+config.tagName );
					}
		        }else{
		        	parseStack.push(config)
		        }
				
				end++;
				break;
				// end elment
			case '?':// <?...?>
				locator&&position(tagStart);
				end = parseInstruction(source,tagStart,domBuilder);
				break;
			case '!':// <!doctype,<![CDATA,<!--
				locator&&position(tagStart);
				end = parseDCC(source,tagStart,domBuilder,errorHandler);
				break;
			default:
				locator&&position(tagStart);
				var el = new ElementAttributes();
				var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
				//elStartEnd
				var end = parseElementStartPart(source,tagStart,el,currentNSMap,entityReplacer,errorHandler);
				var len = el.length;
				
				
				if(!el.closed && fixSelfClosed(source,end,el.tagName,closeMap)){
					el.closed = true;
					if(!entityMap.nbsp){
						errorHandler.warning('unclosed xml attribute');
					}
				}
				if(locator && len){
					var locator2 = copyLocator(locator,{});
					//try{//attribute position fixed
					for(var i = 0;i<len;i++){
						var a = el[i];
						position(a.offset);
						a.locator = copyLocator(locator,{});
					}
					//}catch(e){console.error('@@@@@'+e)}
					domBuilder.locator = locator2
					if(appendElement(el,domBuilder,currentNSMap)){
						parseStack.push(el)
					}
					domBuilder.locator = locator;
				}else{
					if(appendElement(el,domBuilder,currentNSMap)){
						parseStack.push(el)
					}
				}
				
				
				
				if(el.uri === 'http://www.w3.org/1999/xhtml' && !el.closed){
					end = parseHtmlSpecialContent(source,end,el.tagName,entityReplacer,domBuilder)
				}else{
					end++;
				}
			}
		}catch(e){
			errorHandler.error('element parse error: '+e)
			//errorHandler.error('element parse error: '+e);
			end = -1;
			//throw e;
		}
		if(end>start){
			start = end;
		}else{
			//TODO: 这里有可能sax回退，有位置错误风险
			appendText(Math.max(tagStart,start)+1);
		}
	}
}
function copyLocator(f,t){
	t.lineNumber = f.lineNumber;
	t.columnNumber = f.columnNumber;
	return t;
}

/**
 * @see #appendElement(source,elStartEnd,el,selfClosed,entityReplacer,domBuilder,parseStack);
 * @return end of the elementStartPart(end of elementEndPart for selfClosed el)
 */
function parseElementStartPart(source,start,el,currentNSMap,entityReplacer,errorHandler){
	var attrName;
	var value;
	var p = ++start;
	var s = S_TAG;//status
	while(true){
		var c = source.charAt(p);
		switch(c){
		case '=':
			if(s === S_ATTR){//attrName
				attrName = source.slice(start,p);
				s = S_EQ;
			}else if(s === S_ATTR_SPACE){
				s = S_EQ;
			}else{
				//fatalError: equal must after attrName or space after attrName
				throw new Error('attribute equal must after attrName');
			}
			break;
		case '\'':
		case '"':
			if(s === S_EQ || s === S_ATTR //|| s == S_ATTR_SPACE
				){//equal
				if(s === S_ATTR){
					errorHandler.warning('attribute value must after "="')
					attrName = source.slice(start,p)
				}
				start = p+1;
				p = source.indexOf(c,start)
				if(p>0){
					value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					el.add(attrName,value,start-1);
					s = S_ATTR_END;
				}else{
					//fatalError: no end quot match
					throw new Error('attribute value no end \''+c+'\' match');
				}
			}else if(s == S_ATTR_NOQUOT_VALUE){
				value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
				//console.log(attrName,value,start,p)
				el.add(attrName,value,start);
				//console.dir(el)
				errorHandler.warning('attribute "'+attrName+'" missed start quot('+c+')!!');
				start = p+1;
				s = S_ATTR_END
			}else{
				//fatalError: no equal before
				throw new Error('attribute value must after "="');
			}
			break;
		case '/':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				s =S_TAG_CLOSE;
				el.closed = true;
			case S_ATTR_NOQUOT_VALUE:
			case S_ATTR:
			case S_ATTR_SPACE:
				break;
			//case S_EQ:
			default:
				throw new Error("attribute invalid close char('/')")
			}
			break;
		case ''://end document
			//throw new Error('unexpected end of input')
			errorHandler.error('unexpected end of input');
			if(s == S_TAG){
				el.setTagName(source.slice(start,p));
			}
			return p;
		case '>':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				break;//normal
			case S_ATTR_NOQUOT_VALUE://Compatible state
			case S_ATTR:
				value = source.slice(start,p);
				if(value.slice(-1) === '/'){
					el.closed  = true;
					value = value.slice(0,-1)
				}
			case S_ATTR_SPACE:
				if(s === S_ATTR_SPACE){
					value = attrName;
				}
				if(s == S_ATTR_NOQUOT_VALUE){
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					el.add(attrName,value.replace(/&#?\w+;/g,entityReplacer),start)
				}else{
					if(currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !value.match(/^(?:disabled|checked|selected)$/i)){
						errorHandler.warning('attribute "'+value+'" missed value!! "'+value+'" instead!!')
					}
					el.add(value,value,start)
				}
				break;
			case S_EQ:
				throw new Error('attribute value missed!!');
			}
//			console.log(tagName,tagNamePattern,tagNamePattern.test(tagName))
			return p;
		/*xml space '\x20' | #x9 | #xD | #xA; */
		case '\u0080':
			c = ' ';
		default:
			if(c<= ' '){//space
				switch(s){
				case S_TAG:
					el.setTagName(source.slice(start,p));//tagName
					s = S_TAG_SPACE;
					break;
				case S_ATTR:
					attrName = source.slice(start,p)
					s = S_ATTR_SPACE;
					break;
				case S_ATTR_NOQUOT_VALUE:
					var value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					el.add(attrName,value,start)
				case S_ATTR_END:
					s = S_TAG_SPACE;
					break;
				//case S_TAG_SPACE:
				//case S_EQ:
				//case S_ATTR_SPACE:
				//	void();break;
				//case S_TAG_CLOSE:
					//ignore warning
				}
			}else{//not space
//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
				switch(s){
				//case S_TAG:void();break;
				//case S_ATTR:void();break;
				//case S_ATTR_NOQUOT_VALUE:void();break;
				case S_ATTR_SPACE:
					var tagName =  el.tagName;
					if(currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !attrName.match(/^(?:disabled|checked|selected)$/i)){
						errorHandler.warning('attribute "'+attrName+'" missed value!! "'+attrName+'" instead2!!')
					}
					el.add(attrName,attrName,start);
					start = p;
					s = S_ATTR;
					break;
				case S_ATTR_END:
					errorHandler.warning('attribute space is required"'+attrName+'"!!')
				case S_TAG_SPACE:
					s = S_ATTR;
					start = p;
					break;
				case S_EQ:
					s = S_ATTR_NOQUOT_VALUE;
					start = p;
					break;
				case S_TAG_CLOSE:
					throw new Error("elements closed character '/' and '>' must be connected to");
				}
			}
		}//end outer switch
		//console.log('p++',p)
		p++;
	}
}
/**
 * @return true if has new namespace define
 */
function appendElement(el,domBuilder,currentNSMap){
	var tagName = el.tagName;
	var localNSMap = null;
	//var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
	var i = el.length;
	while(i--){
		var a = el[i];
		var qName = a.qName;
		var value = a.value;
		var nsp = qName.indexOf(':');
		if(nsp>0){
			var prefix = a.prefix = qName.slice(0,nsp);
			var localName = qName.slice(nsp+1);
			var nsPrefix = prefix === 'xmlns' && localName
		}else{
			localName = qName;
			prefix = null
			nsPrefix = qName === 'xmlns' && ''
		}
		//can not set prefix,because prefix !== ''
		a.localName = localName ;
		//prefix == null for no ns prefix attribute 
		if(nsPrefix !== false){//hack!!
			if(localNSMap == null){
				localNSMap = {}
				//console.log(currentNSMap,0)
				_copy(currentNSMap,currentNSMap={})
				//console.log(currentNSMap,1)
			}
			currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
			a.uri = 'http://www.w3.org/2000/xmlns/'
			domBuilder.startPrefixMapping(nsPrefix, value) 
		}
	}
	var i = el.length;
	while(i--){
		a = el[i];
		var prefix = a.prefix;
		if(prefix){//no prefix attribute has no namespace
			if(prefix === 'xml'){
				a.uri = 'http://www.w3.org/XML/1998/namespace';
			}if(prefix !== 'xmlns'){
				a.uri = currentNSMap[prefix || '']
				
				//{console.log('###'+a.qName,domBuilder.locator.systemId+'',currentNSMap,a.uri)}
			}
		}
	}
	var nsp = tagName.indexOf(':');
	if(nsp>0){
		prefix = el.prefix = tagName.slice(0,nsp);
		localName = el.localName = tagName.slice(nsp+1);
	}else{
		prefix = null;//important!!
		localName = el.localName = tagName;
	}
	//no prefix element has default namespace
	var ns = el.uri = currentNSMap[prefix || ''];
	domBuilder.startElement(ns,localName,tagName,el);
	//endPrefixMapping and startPrefixMapping have not any help for dom builder
	//localNSMap = null
	if(el.closed){
		domBuilder.endElement(ns,localName,tagName);
		if(localNSMap){
			for(prefix in localNSMap){
				domBuilder.endPrefixMapping(prefix) 
			}
		}
	}else{
		el.currentNSMap = currentNSMap;
		el.localNSMap = localNSMap;
		//parseStack.push(el);
		return true;
	}
}
function parseHtmlSpecialContent(source,elStartEnd,tagName,entityReplacer,domBuilder){
	if(/^(?:script|textarea)$/i.test(tagName)){
		var elEndStart =  source.indexOf('</'+tagName+'>',elStartEnd);
		var text = source.substring(elStartEnd+1,elEndStart);
		if(/[&<]/.test(text)){
			if(/^script$/i.test(tagName)){
				//if(!/\]\]>/.test(text)){
					//lexHandler.startCDATA();
					domBuilder.characters(text,0,text.length);
					//lexHandler.endCDATA();
					return elEndStart;
				//}
			}//}else{//text area
				text = text.replace(/&#?\w+;/g,entityReplacer);
				domBuilder.characters(text,0,text.length);
				return elEndStart;
			//}
			
		}
	}
	return elStartEnd+1;
}
function fixSelfClosed(source,elStartEnd,tagName,closeMap){
	//if(tagName in closeMap){
	var pos = closeMap[tagName];
	if(pos == null){
		//console.log(tagName)
		pos =  source.lastIndexOf('</'+tagName+'>')
		if(pos<elStartEnd){//忘记闭合
			pos = source.lastIndexOf('</'+tagName)
		}
		closeMap[tagName] =pos
	}
	return pos<elStartEnd;
	//} 
}
function _copy(source,target){
	for(var n in source){target[n] = source[n]}
}
function parseDCC(source,start,domBuilder,errorHandler){//sure start with '<!'
	var next= source.charAt(start+2)
	switch(next){
	case '-':
		if(source.charAt(start + 3) === '-'){
			var end = source.indexOf('-->',start+4);
			//append comment source.substring(4,end)//<!--
			if(end>start){
				domBuilder.comment(source,start+4,end-start-4);
				return end+3;
			}else{
				errorHandler.error("Unclosed comment");
				return -1;
			}
		}else{
			//error
			return -1;
		}
	default:
		if(source.substr(start+3,6) == 'CDATA['){
			var end = source.indexOf(']]>',start+9);
			domBuilder.startCDATA();
			domBuilder.characters(source,start+9,end-start-9);
			domBuilder.endCDATA() 
			return end+3;
		}
		//<!DOCTYPE
		//startDTD(java.lang.String name, java.lang.String publicId, java.lang.String systemId) 
		var matchs = split(source,start);
		var len = matchs.length;
		if(len>1 && /!doctype/i.test(matchs[0][0])){
			var name = matchs[1][0];
			var pubid = len>3 && /^public$/i.test(matchs[2][0]) && matchs[3][0]
			var sysid = len>4 && matchs[4][0];
			var lastMatch = matchs[len-1]
			domBuilder.startDTD(name,pubid && pubid.replace(/^(['"])(.*?)\1$/,'$2'),
					sysid && sysid.replace(/^(['"])(.*?)\1$/,'$2'));
			domBuilder.endDTD();
			
			return lastMatch.index+lastMatch[0].length
		}
	}
	return -1;
}



function parseInstruction(source,start,domBuilder){
	var end = source.indexOf('?>',start);
	if(end){
		var match = source.substring(start,end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
		if(match){
			var len = match[0].length;
			domBuilder.processingInstruction(match[1], match[2]) ;
			return end+2;
		}else{//error
			return -1;
		}
	}
	return -1;
}

/**
 * @param source
 */
function ElementAttributes(source){
	
}
ElementAttributes.prototype = {
	setTagName:function(tagName){
		if(!tagNamePattern.test(tagName)){
			throw new Error('invalid tagName:'+tagName)
		}
		this.tagName = tagName
	},
	add:function(qName,value,offset){
		if(!tagNamePattern.test(qName)){
			throw new Error('invalid attribute:'+qName)
		}
		this[this.length++] = {qName:qName,value:value,offset:offset}
	},
	length:0,
	getLocalName:function(i){return this[i].localName},
	getLocator:function(i){return this[i].locator},
	getQName:function(i){return this[i].qName},
	getURI:function(i){return this[i].uri},
	getValue:function(i){return this[i].value}
//	,getIndex:function(uri, localName)){
//		if(localName){
//			
//		}else{
//			var qName = uri
//		}
//	},
//	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
//	getType:function(uri,localName){}
//	getType:function(i){},
}




function _set_proto_(thiz,parent){
	thiz.__proto__ = parent;
	return thiz;
}
if(!(_set_proto_({},_set_proto_.prototype) instanceof _set_proto_)){
	_set_proto_ = function(thiz,parent){
		function p(){};
		p.prototype = parent;
		p = new p();
		for(parent in thiz){
			p[parent] = thiz[parent];
		}
		return p;
	}
}

function split(source,start){
	var match;
	var buf = [];
	var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
	reg.lastIndex = start;
	reg.exec(source);//skip <
	while(match = reg.exec(source)){
		buf.push(match);
		if(match[1])return buf;
	}
}

exports.XMLReader = XMLReader;


},{}]},{},[1]);
