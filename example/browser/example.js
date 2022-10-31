(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const version = require('./../../../lib/meta').version;
const Connection = require('./../../../lib/connection/Connection');
const timezones = require('./../../../lib/utilities/data/timezones');
const formatDecimal = require('./../../../lib/utilities/format/decimal'),
  formatPrice = require('./../../../lib/utilities/format/price'),
  formatQuote = require('./../../../lib/utilities/format/quote');
const AssetClass = require('./../../../lib/utilities/data/AssetClass');
const Profile = require('./../../../lib/marketState/Profile');
const formatterForCmdtyView = require('./../../../lib/utilities/format/specialized/cmdtyView');
module.exports = (() => {
  'use strict';

  Profile.setPriceFormatterCustom(formatterForCmdtyView);
  var PageModel = function () {
    var that = this;
    var connection = null;
    var diagnostics = null;
    that.hostname = ko.observable('wsqs-cf.aws.barchart.com');
    var timezoneLocal = timezones.guessTimezone();
    var timezonesList = [];
    timezonesList.push('Variable/Exchange_Local');
    timezonesList.push('');
    if (timezoneLocal) {
      timezonesList.push(timezoneLocal);
      timezonesList.push('');
    }
    function addTimezone(t) {
      if (t !== timezoneLocal) {
        timezonesList.push(t);
      }
    }
    addTimezone('America/Chicago');
    addTimezone('America/New_York');
    addTimezone('America/Los_Angeles');
    addTimezone('Europe/London');
    addTimezone('Europe/Paris');
    addTimezone('Europe/Minsk');
    addTimezone('Asia/Tokyo');
    timezonesList.push('');
    that.timezone = ko.observable('Variable/Exchange_Local');
    that.timezones = ko.observableArray(timezonesList.concat(timezones.getTimezones()));
    that.username = ko.observable('');
    that.password = ko.observable('');
    that.replayFile = ko.observable('$M1LX.ddf');
    that.replaySymbols = ko.observable('$M1LX');
    that.replayIndex = ko.observable(0);
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
    that.diagnosticsIndex = ko.observable(0);
    that.diagnosticsEnabled = ko.computed(function () {
      var hostname = that.hostname();
      return hostname === 'localhost';
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
          if (that.diagnosticsEnabled() && diagnostics === null) {
            that.diagnosticsIndex(0);
            diagnostics = connection.getDiagnosticsController();
            var replayFile = that.replayFile();
            var replaySymbols = that.replaySymbols().toString().split(',');
            var subscriptions = [];
            function bindReplaySymbol(s) {
              var model = new RowModel(s, that.timezone);
              var handleMarketUpdate = function (message) {
                model.quote(connection.getMarketState().getQuote(s));
              };
              model.setMarketUpdateHandler(handleMarketUpdate);
              that.rows.push(model);
              var subscription = {};
              subscription.symbol = s;
              subscription.callback = handleMarketUpdate;
              subscriptions.push(subscription);
            }
            for (var i = 0; i < replaySymbols.length; i++) {
              bindReplaySymbol(replaySymbols[i]);
            }
            diagnostics.initialize(replayFile, subscriptions);
          }
          that.showGrid();
        } else if (event === 'login fail') {
          that.disconnect();
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
      var hostname = that.hostname();
      var username = that.username();
      var password = that.password();
      if (!hostname) {
        return;
      }
      var diagnosticsEnabled = that.diagnosticsEnabled();
      var replayFile = that.replayFile();
      var replaySymbols = that.replaySymbols();
      if (diagnosticsEnabled) {
        if (!replayFile || !replaySymbols) {
          return;
        }
        username = 'anonymous';
        password = 'anonymous';
        that.username(username);
        that.password(password);
      } else {
        if (!username || !password) {
          return;
        }
      }
      that.connecting(true);
      if (connection) {
        connection.off('events', handleEvents);
      }
      connection = new Connection();
      connection.setExtendedProfileMode(true);
      connection.setExtendedQuoteMode(true);
      connection.on('events', handleEvents);
      connection.connect(hostname, username, password);
    };
    that.disconnect = function () {
      if (connection === null) {
        return;
      }
      connection.disconnect();
      connection = null;
      diagnostics = null;
      that.rows.removeAll();
      that.connecting(false);
      that.connected(false);
      that.paused(false);
      that.replayIndex(0);
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
      } else if (symbol === '#PLATTS') {
        symbols = PLATTS;
      } else if (symbol === '#BOTH') {
        symbols = BOTH;
      } else if (symbol === '#AG') {
        symbols = AG;
      } else {
        symbols = [symbol];
      }
      function execute(s) {
        var model = new RowModel(s, that.timezone);
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
      return connection.getMarketState().getProfile(symbol).then(function (profile) {
        if (that.activeTemplate() === 'profile-template') {
          that.showProfile(profile);
        }
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
      if (!that.diagnosticsEnabled()) {
        that.symbolFocus(true);
      }
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
    that.diagnosticsScroll = function () {
      if (that.diagnosticsEnabled() && diagnostics !== null) {
        var desiredIndex = that.diagnosticsIndex();
        try {
          desiredIndex = parseInt(desiredIndex);
        } catch (e) {
          desiredIndex = null;
        }
        if (desiredIndex !== null) {
          diagnostics.scroll(desiredIndex);
        }
      }
    };
    that.diagnosticsNext = function () {
      if (that.diagnosticsEnabled() && diagnostics !== null) {
        diagnostics.next();
        that.replayIndex(that.replayIndex() + 1);
      }
    };
    that.diagnosticsScroll = function () {
      if (that.diagnosticsEnabled() && diagnostics !== null) {
        const scrollIndex = that.replayIndex() + 100;
        diagnostics.scroll(scrollIndex);
        that.replayIndex(scrollIndex);
      }
    };
    that.handleDiagnosticsScrollKeypress = function (d, e) {
      if (e.keyCode === 13) {
        that.addSymbol();
      }
      return true;
    };
    that.disconnect();
  };
  var RowModel = function (symbol, timezone) {
    var that = this;
    that.symbol = symbol;
    that.quote = ko.observable(null);
    that.priceLevels = ko.observableArray();
    that.priceLevelLast = ko.observable(null);
    that.cumulativeVolumeReady = ko.observable(false);
    that.displayTime = ko.computed(function () {
      var q = that.quote();
      var t = timezone();
      if (t === 'Variable/Exchange_Local') {
        t = null;
      }
      if (q !== null) {
        return formatQuote(q, false, false, t || null);
      } else {
        return '';
      }
    });
    that.priceChange = ko.computed(function () {
      var quote = that.quote();
      if (quote && quote.lastPrice && quote.previousPrice) {
        return Math.round((quote.lastPrice - quote.previousPrice) * 100) / 100;
      } else {
        return '';
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
    that.formatPrice = function (price) {
      return that.quote().profile.formatPrice(price);

      //return formatPrice(price, that.quote().profile.unitCode, '-', true);
    };

    that.formatInteger = function (value) {
      return formatDecimal(value, 0, ',');
    };
    that.formatPercent = function (value) {
      if (value) {
        return (value * 100).toFixed(2) + '%';
      } else {
        return '--';
      }
    };
  };
  var PriceLevelModel = function (price, volume) {
    var that = this;
    that.price = ko.observable(price);
    that.volume = ko.observable(volume);
    that.updated = ko.observable(false);
  };
  const SP_500 = ['ABT', 'ABBV', 'ACN', 'ATVI', 'AYI', 'ADBE', 'AMD', 'AAP', 'AES', 'AET', 'AMG', 'AFL', 'A', 'APD', 'AKAM', 'ALK', 'ALB', 'ARE', 'ALXN', 'ALGN', 'ALLE', 'AGN', 'ADS', 'LNT', 'ALL', 'GOOGL', 'GOOG', 'MO', 'AMZN', 'AEE', 'AAL', 'AEP', 'AXP', 'AIG', 'AMT', 'AWK', 'AMP', 'ABC', 'AME', 'AMGN', 'APH', 'APC', 'ADI', 'ANDV', 'ANSS', 'ANTM', 'AON', 'AOS', 'APA', 'AIV', 'AAPL', 'AMAT', 'ADM', 'ARNC', 'AJG', 'AIZ', 'T', 'ADSK', 'ADP', 'AZO', 'AVB', 'AVY', 'BHGE', 'BLL', 'BAC', 'BK', 'BCR', 'BAX', 'BBT', 'BDX', 'BRK.B', 'BBY', 'BIIB', 'BLK', 'HRB', 'BA', 'BWA', 'BXP', 'BSX', 'BHF', 'BMY', 'AVGO', 'BF.B', 'CHRW', 'CA', 'COG', 'CDNS', 'CPB', 'COF', 'CAH', 'CBOE', 'KMX', 'CCL', 'CAT', 'CBG', 'CBS', 'CELG', 'CNC', 'CNP', 'CTL', 'CERN', 'CF', 'SCHW', 'CHTR', 'CHK', 'CVX', 'CMG', 'CB', 'CHD', 'CI', 'XEC', 'CINF', 'CTAS', 'CSCO', 'C', 'CFG', 'CTXS', 'CLX', 'CME', 'CMS', 'COH', 'KO', 'CTSH', 'CL', 'CMCSA', 'CMA', 'CAG', 'CXO', 'COP', 'ED', 'STZ', 'COO', 'GLW', 'COST', 'COTY', 'CCI', 'CSRA', 'CSX', 'CMI', 'CVS', 'DHI', 'DHR', 'DRI', 'DVA', 'DE', 'DLPH', 'DAL', 'XRAY', 'DVN', 'DLR', 'DFS', 'DISCA', 'DISCK', 'DISH', 'DG', 'DLTR', 'D', 'DOV', 'DWDP', 'DPS', 'DTE', 'DRE', 'DUK', 'DXC', 'ETFC', 'EMN', 'ETN', 'EBAY', 'ECL', 'EIX', 'EW', 'EA', 'EMR', 'ETR', 'EVHC', 'EOG', 'EQT', 'EFX', 'EQIX', 'EQR', 'ESS', 'EL', 'ES', 'RE', 'EXC', 'EXPE', 'EXPD', 'ESRX', 'EXR', 'XOM', 'FFIV', 'FB', 'FAST', 'FRT', 'FDX', 'FIS', 'FITB', 'FE', 'FISV', 'FLIR', 'FLS', 'FLR', 'FMC', 'FL', 'F', 'FTV', 'FBHS', 'BEN', 'FCX', 'GPS', 'GRMN', 'IT', 'GD', 'GE', 'GGP', 'GIS', 'GM', 'GPC', 'GILD', 'GPN', 'GS', 'GT', 'GWW', 'HAL', 'HBI', 'HOG', 'HRS', 'HIG', 'HAS', 'HCA', 'HCP', 'HP', 'HSIC', 'HSY', 'HES', 'HPE', 'HLT', 'HOLX', 'HD', 'HON', 'HRL', 'HST', 'HPQ', 'HUM', 'HBAN', 'IDXX', 'INFO', 'ITW', 'ILMN', 'IR', 'INTC', 'ICE', 'IBM', 'INCY', 'IP', 'IPG', 'IFF', 'INTU', 'ISRG', 'IVZ', 'IRM', 'JEC', 'JBHT', 'SJM', 'JNJ', 'JCI', 'JPM', 'JNPR', 'KSU', 'K', 'KEY', 'KMB', 'KIM', 'KMI', 'KLAC', 'KSS', 'KHC', 'KR', 'LB', 'LLL', 'LH', 'LRCX', 'LEG', 'LEN', 'LUK', 'LLY', 'LNC', 'LKQ', 'LMT', 'L', 'LOW', 'LYB', 'MTB', 'MAC', 'M', 'MRO', 'MPC', 'MAR', 'MMC', 'MLM', 'MAS', 'MA', 'MAT', 'MKC', 'MCD', 'MCK', 'MDT', 'MRK', 'MET', 'MTD', 'MGM', 'KORS', 'MCHP', 'MU', 'MSFT', 'MAA', 'MHK', 'TAP', 'MDLZ', 'MON', 'MNST', 'MCO', 'MS', 'MOS', 'MSI', 'MYL', 'NDAQ', 'NOV', 'NAVI', 'NTAP', 'NFLX', 'NWL', 'NFX', 'NEM', 'NWSA', 'NWS', 'NEE', 'NLSN', 'NKE', 'NI', 'NBL', 'JWN', 'NSC', 'NTRS', 'NOC', 'NCLH', 'NRG', 'NUE', 'NVDA', 'ORLY', 'OXY', 'OMC', 'OKE', 'ORCL', 'PCAR', 'PKG', 'PH', 'PDCO', 'PAYX', 'PYPL', 'PNR', 'PBCT', 'PEP', 'PKI', 'PRGO', 'PFE', 'PCG', 'PM', 'PSX', 'PNW', 'PXD', 'PNC', 'RL', 'PPG', 'PPL', 'PX', 'PCLN', 'PFG', 'PG', 'PGR', 'PLD', 'PRU', 'PEG', 'PSA', 'PHM', 'PVH', 'QRVO', 'PWR', 'QCOM', 'DGX', 'Q', 'RRC', 'RJF', 'RTN', 'O', 'RHT', 'REG', 'REGN', 'RF', 'RSG', 'RMD', 'RHI', 'ROK', 'COL', 'ROP', 'ROST', 'RCL', 'CRM', 'SBAC', 'SCG', 'SLB', 'SNI', 'STX', 'SEE', 'SRE', 'SHW', 'SIG', 'SPG', 'SWKS', 'SLG', 'SNA', 'SO', 'LUV', 'SPGI', 'SWK', 'SBUX', 'STT', 'SRCL', 'SYK', 'STI', 'SYMC', 'SYF', 'SNPS', 'SYY', 'TROW', 'TGT', 'TEL', 'FTI', 'TXN', 'TXT', 'TMO', 'TIF', 'TWX', 'TJX', 'TMK', 'TSS', 'TSCO', 'TDG', 'TRV', 'TRIP', 'FOXA', 'FOX', 'TSN', 'UDR', 'ULTA', 'USB', 'UA', 'UAA', 'UNP', 'UAL', 'UNH', 'UPS', 'URI', 'UTX', 'UHS', 'UNM', 'VFC', 'VLO', 'VAR', 'VTR', 'VRSN', 'VRSK', 'VZ', 'VRTX', 'VIAB', 'V', 'VNO', 'VMC', 'WMT', 'WBA', 'DIS', 'WM', 'WAT', 'WEC', 'WFC', 'HCN', 'WDC', 'WU', 'WRK', 'WY', 'WHR', 'WMB', 'WLTW', 'WYN', 'WYNN', 'XEL', 'XRX', 'XLNX', 'XL', 'XYL', 'YUM', 'ZBH', 'ZION', 'ZTS'];
  const C3 = ['AL79MRM1.C3', 'BSP9WGQ1.C3', 'BUT9USM1.C3', 'RA10BGM1.C3'];
  const C3_OLD = ['C3:AL79MRM1', 'C3:BSP9WGQ1', 'C3:RA10BGM1'];
  const CMDTY = ['SCB001.CP', 'MER001.CP', 'ZCBAUS.CM', 'HOPAW001009.CM', 'AE030UBX.CS', 'UDZZ303N.CS'];
  const PLATTS = ['PLATTS:AAWAB00', 'AAWAB00.PT', 'PLATTS:AAXVA00', 'AAXVA00.PT', 'PLATTS:CBAAF00', 'CBAAF00.PT'];
  const AG = ['ZCPAIA.CM', 'ZCPAIL.CM', 'ZCPAIN.CM', 'ZCPAKS.CM', 'ZCPAMI.CM'];
  const BOTH = ['ESZ19', 'ESZ9'];
  $(document).ready(function () {
    var pageModel = new PageModel();
    ko.applyBindings(pageModel, $('body')[0]);
  });
})();

},{"./../../../lib/connection/Connection":2,"./../../../lib/marketState/Profile":18,"./../../../lib/meta":20,"./../../../lib/utilities/data/AssetClass":25,"./../../../lib/utilities/data/timezones":27,"./../../../lib/utilities/format/decimal":29,"./../../../lib/utilities/format/price":32,"./../../../lib/utilities/format/quote":33,"./../../../lib/utilities/format/specialized/cmdtyView":34}],2:[function(require,module,exports){
const array = require('@barchart/common-js/lang/array'),
  object = require('@barchart/common-js/lang/object');
const ConnectionBase = require('./ConnectionBase'),
  parseMessage = require('./../utilities/parse/ddf/message');
const retrieveExchanges = require('./snapshots/exchanges/retrieveExchanges'),
  retrieveProfileExtensions = require('./snapshots/profiles/retrieveExtensions'),
  retrieveQuoteSnapshots = require('./snapshots/quotes/retrieveSnapshots'),
  retrieveQuoteExtensions = require('./snapshots/quotes/retrieveExtensions'),
  SymbolParser = require('./../utilities/parsers/SymbolParser');
const WebSocketAdapterFactory = require('./adapter/WebSocketAdapterFactory'),
  WebSocketAdapterFactoryForBrowsers = require('./adapter/WebSocketAdapterFactoryForBrowsers');
const DiagnosticsControllerBase = require('./diagnostics/DiagnosticsControllerBase');
const LoggerFactory = require('./../logging/LoggerFactory');
const version = require('./../meta').version;
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
  const subscriptionTypes = {
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
  function ConnectionInternal(marketState, instance) {
    const __logger = LoggerFactory.getLogger('@barchart/marketdata-api-js');
    const __instance = instance;
    const __marketState = marketState;
    let __connectionFactory = null;
    let __connection = null;
    let __connectionState = state.disconnected;
    let __paused = false;
    let __reconnectAllowed = false;
    let __pollingFrequency = null;
    let __extendedProfile = false;
    let __extendedQuote = false;
    let __processOptions = {};
    let __watchdogToken = null;
    let __watchdogAwake = false;
    let __exchangeMetadataPromise = null;
    let __inboundMessages = [];
    let __marketMessages = [];
    let __pendingTasks = [];
    let __outboundMessages = [];
    let __knownConsumerSymbols = {};
    let __pendingProfileSymbols = {};
    let __completedProfileExtensions = [];
    const __listeners = {
      marketDepth: {},
      marketUpdate: {},
      cumulativeVolume: {},
      events: [],
      timestamp: []
    };
    const __loginInfo = {
      hostname: null,
      username: null,
      password: null
    };
    let __decoder = null;
    let __diagnosticsController = null;

    //
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
        __logger.log(`Connection [ ${__instance} ]: Switching to streaming mode.`);
        __pollingFrequency = null;
      } else if (typeof pollingFrequency === 'number' && !isNaN(pollingFrequency) && !(pollingFrequency < 1000)) {
        __logger.log(`Connection [ ${__instance} ]: Switching to polling mode.`);
        __pollingFrequency = pollingFrequency;
      }
    }
    function setExtendedProfileMode(mode) {
      if (__extendedProfile !== mode) {
        __extendedProfile = mode;
      }
    }
    function setExtendedQuoteMode(mode) {
      if (__extendedQuote !== mode) {
        __extendedQuote = mode;
      }
    }

    //
    // Functions for connecting to and disconnecting from JERQ, monitoring
    // established connections, and handling involuntary disconnects.
    //

    /**
     * Attempts to establish a connection to JERQ, setting the flag to allow
     * reconnection if an involuntary disconnect occurs.
     *
     * @private
     * @param {String} hostname
     * @param {String} username
     * @param {String} password
     * @param {WebSocketAdapterFactory} webSocketAdapterFactory
     */
    function initializeConnection(hostname, username, password, webSocketAdapterFactory) {
      __connectionFactory = webSocketAdapterFactory;
      __reconnectAllowed = true;
      connect(hostname, username, password);
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
      __loginInfo.hostname = null;
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
     * @param {String} hostname
     * @param {String} username
     * @param {String} password
     */
    function connect(hostname, username, password) {
      if (!hostname) {
        throw new Error('Unable to connect, the "hostname" argument is required.');
      }
      if (!username) {
        throw new Error('Unable to connect, the "username" argument is required.');
      }
      if (!password) {
        throw new Error('Unable to connect, the "password" argument is required.');
      }
      if (__connection !== null) {
        __logger.warn(`Connection [ ${__instance} ]: Unable to connect, a connection already exists.`);
        return;
      }
      ensureExchangeMetadata();
      __logger.log(`Connection [ ${__instance} ]: Initializing. Version [ ${version} ]. Using [ ${username}@${hostname} ].`);
      let protocol;
      let port;
      if (hostname === 'localhost') {
        protocol = 'ws';
        port = 8080;
      } else {
        protocol = 'wss';
        port = 443;
      }
      __loginInfo.username = username;
      __loginInfo.password = password;
      __loginInfo.hostname = hostname;
      __connectionState = state.disconnected;
      __connection = __connectionFactory.build(`${protocol}://${__loginInfo.hostname}:${port}/jerq`);
      __connection.binaryType = 'arraybuffer';
      __decoder = __connection.getDecoder();
      __connection.onopen = () => {
        __logger.log(`Connection [ ${__instance} ]: Open event received.`);
      };
      __connection.onclose = () => {
        __logger.log(`Connection [ ${__instance} ]: Close event received.`);
        __connectionState = state.disconnected;
        stopWatchdog();
        __connection.onopen = null;
        __connection.onclose = null;
        __connection.onmessage = null;
        __connection = null;

        // There is a race condition. We enqueue network messages and processes
        // them asynchronously in batches. The asynchronous message processing is
        // done by a function called pumpInboundProcessing. So, it's possible we received
        // a login failure message and enqueued it. But, the websocket was closed
        // before the first invocation of pumpInboundProcessing could process the login
        // failure.

        const loginFailed = __inboundMessages.length > 0 && __inboundMessages[0].indexOf('-') === 0;
        let messages = __inboundMessages;
        __inboundMessages = [];
        __marketMessages = [];
        __pendingTasks = [];
        __outboundMessages = [];
        if (loginFailed) {
          __logger.warn(`Connection [ ${__instance} ]: Connection closed before login was processed.`);
          const lines = messages[0].split('\n');
          __logger.debug(`Connection [ ${__instance} ]: Discarding pending message(s) because connection was closed.`);
          lines.forEach(line => {
            if (line.length > 0) {
              __logger.debug(`Connection [ ${__instance} ] << ${line}`);
            }
          });
          broadcastEvent('events', {
            event: 'login fail'
          });
        } else {
          __logger.warn(`Connection [ ${__instance} ]: Connection dropped.`);
          broadcastEvent('events', {
            event: 'disconnect'
          });
        }
        if (__reconnectAllowed) {
          __logger.log(`Connection [ ${__instance} ]: Scheduling reconnect attempt.`);
          const reconnectAction = () => connect(__loginInfo.hostname, __loginInfo.username, __loginInfo.password);
          const reconnectDelay = _RECONNECT_INTERVAL + Math.floor(Math.random() * _WATCHDOG_INTERVAL);
          setTimeout(reconnectAction, reconnectDelay);
        }
      };
      __connection.onmessage = event => {
        __watchdogAwake = false;
        let message;
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
      __logger.warn(`Connection [ ${__instance} ]: Disconnecting.`);
      __connectionState = state.disconnected;
      stopWatchdog();
      if (__connection !== null) {
        try {
          if (__connection.readyState === __connection.OPEN) {
            __connection.send('LOGOUT\r\n');
          }
          __logger.warn(`Connection [ ${__instance} ]: Closing connection.`);
          __connection.close();
        } catch (e) {
          __logger.warn(`Connection [ ${__instance} ]: Unable to close connection.`);
        }
      }
      __inboundMessages = [];
      __marketMessages = [];
      __pendingTasks = [];
      __outboundMessages = [];
    }
    function pause() {
      if (__paused) {
        __logger.warn(`Connection [ ${__instance} ]: Unable to pause, feed is already paused.`);
        return;
      }
      __logger.log(`Connection [ ${__instance} ]: Pausing feed.`);
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
        __logger.warn(`Connection [ ${__instance} ]: Unable to resume, feed is not paused.`);
        return;
      }
      __logger.log(`Connection [ ${__instance} ]: Resuming feed.`);
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
      __logger.log(`Connection [ ${__instance} ]: Watchdog started.`);
      const watchdogAction = () => {
        if (__watchdogAwake) {
          __logger.log(`Connection [ ${__instance} ]: Watchdog triggered, connection silent for too long. Triggering disconnect.`);
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
        __logger.log(`Connection [ ${__instance} ]: Watchdog stopped.`);
        clearInterval(__watchdogToken);
      }
      __watchdogAwake = false;
    }

    //
    // Functions used to maintain exchange metadata
    //

    /**
     * Runs out-of-band query for exchange metadata and forwards it to the
     * {@link MarketState} instance.
     *
     * @private
     */
    function ensureExchangeMetadata() {
      if (__exchangeMetadataPromise !== null) {
        return;
      }
      try {
        __logger.log(`Connection [ ${__instance} ]: Downloading exchange metadata.`);
        __exchangeMetadataPromise = retrieveExchanges().then(items => {
          items.forEach(item => {
            __marketState.processExchangeMetadata(item.id, item.description, item.timezoneDdf, item.timezoneExchange);
          });
          __logger.log(`Connection [ ${__instance} ]: Downloaded exchange metadata.`);
          return true;
        }).catch(e => {
          __logger.warn(`Connection [ ${__instance} ]: An error occurred while processing exchange metadata.`);
          __exchangeMetadataPromise = null;
        });
      } catch (e) {
        __logger.warn(`Connection [ ${__instance} ]: An error occurred while downloading exchange metadata.`);
        __exchangeMetadataPromise = null;
      }
    }

    //
    // Functions for handling user-initiated requests to start subscriptions, stop subscriptions,
    // and request profiles.
    //

    /**
     * Subscribes to an event (e.g. quotes, heartbeats, connection status, etc), given
     * the event type, a callback, and a symbol (if necessary).
     *
     * @private
     * @param {Enums.SubscriptionType} subscriptionType
     * @param {Function} handler
     * @param {String=} symbol
     */
    function on(subscriptionType, handler, symbol) {
      if (typeof subscriptionType !== 'string') {
        throw new Error('The "subscriptionType" argument must be a string.');
      }
      if (typeof handler !== 'function') {
        throw new Error('The "handler" argument must be a function.');
      }
      if (!subscriptionTypes.hasOwnProperty(subscriptionType)) {
        __logger.log(`Consumer [ ${__instance} ]: Unable to process "on" command, subscription type is not recognized.`);
        return;
      }
      const subscriptionData = subscriptionTypes[subscriptionType];
      if (subscriptionData.requiresSymbol) {
        if (typeof symbol !== 'string') {
          throw new Error(`The "symbol" argument must be a string for [ ${subscriptionType} ] subscriptions.`);
        }
        symbol = symbol.toUpperCase().trim();
        if (!symbol || !(symbol.indexOf(' ') < 0)) {
          __logger.log(`Consumer [ ${__instance} ]: Unable to process "on" command, the "symbol" argument is invalid.`);
          __logger.trace();
          return;
        }
      }
      const subscribe = (streamingTaskName, snapshotTaskName, listenerMap, sharedListenerMaps) => {
        const consumerSymbol = symbol;
        const producerSymbol = SymbolParser.getProducerSymbol(consumerSymbol);
        if (SymbolParser.getIsReference(consumerSymbol)) {
          __logger.warn(`Connection [ ${__instance} ]: Ignoring subscription for reference symbol [ ${consumerSymbol} ].`);
          return false;
        }
        if (SymbolParser.getIsExpired(consumerSymbol)) {
          __logger.warn(`Connection [ ${__instance} ]: Ignoring subscription for expired symbol [ ${consumerSymbol} ].`);
          return false;
        }
        addKnownConsumerSymbol(consumerSymbol, producerSymbol);
        const producerListenerExists = getProducerListenerExists(producerSymbol, sharedListenerMaps.concat(listenerMap));
        listenerMap[consumerSymbol] = addListener(listenerMap[consumerSymbol], handler);
        if (!__paused) {
          if (producerListenerExists) {
            addTask(snapshotTaskName, producerSymbol);
          } else {
            addTask(streamingTaskName, producerSymbol);
          }
        }
        return true;
      };
      switch (subscriptionType) {
        case 'events':
          __listeners.events = addListener(__listeners.events, handler);
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
          __listeners.timestamp = addListener(__listeners.timestamp, handler);
          break;
      }
    }

    /**
     * Drops a subscription to an event for a specific handler (callback). If other
     * subscriptions to the same event (as determined by strict equality of the
     * handler) exist, the subscription will continue to operate for other handlers.
     *
     * @private
     * @param {Enums.SubscriptionType} subscriptionType
     * @param {Function} handler
     * @param {String=} symbol
     */
    function off(subscriptionType, handler, symbol) {
      if (typeof subscriptionType !== 'string') {
        throw new Error('The "subscriptionType" argument must be a string.');
      }
      if (typeof handler !== 'function') {
        throw new Error('The "handler" argument must be a function.');
      }
      if (!subscriptionTypes.hasOwnProperty(subscriptionType)) {
        __logger.log(`Consumer [ ${__instance} ]: Unable to process "off" command, subscription type is not supported [ ${subscriptionType} ].`);
        __logger.trace();
        return;
      }
      const subscriptionData = subscriptionTypes[subscriptionType];
      if (subscriptionData.requiresSymbol) {
        if (typeof symbol !== 'string') {
          throw new Error(`The "symbol" argument must be a string for [ ${subscriptionType} ] subscriptions.`);
        }
        symbol = symbol.toUpperCase().trim();
        if (!symbol || !(symbol.indexOf(' ') < 0)) {
          __logger.log(`Consumer [ ${__instance} ]: Unable to process "off" command, the "symbol" argument is empty.`);
          __logger.trace();
          return;
        }
      }
      const unsubscribe = (stopTaskName, listenerMap, sharedListenerMaps) => {
        const consumerSymbol = symbol;
        const producerSymbol = SymbolParser.getProducerSymbol(consumerSymbol);
        const listenerMaps = sharedListenerMaps.concat(listenerMap);
        let previousProducerListenerExists = getProducerListenerExists(producerSymbol, listenerMaps);
        let currentProducerListenerExists;
        listenerMap[consumerSymbol] = removeListener(listenerMap[consumerSymbol], handler);
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
      switch (subscriptionType) {
        case 'events':
          __listeners.events = removeListener(__listeners.events, handler);
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
          __listeners.timestamp = removeListener(__listeners.timestamp, handler);
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
        __logger.log(`Consumer [ ${__instance} ]: Unable to process profile request, the "symbol" argument is empty.`);
        __logger.trace();
        return;
      }
      const producerSymbol = SymbolParser.getProducerSymbol(consumerSymbol);
      const pendingConsumerSymbols = __pendingProfileSymbols[producerSymbol] || [];
      if (!pendingConsumerSymbols.some(candidate => candidate === producerSymbol)) {
        pendingConsumerSymbols.push(producerSymbol);
      }
      if (!pendingConsumerSymbols.some(candidate => candidate === consumerSymbol)) {
        pendingConsumerSymbols.push(consumerSymbol);
      }
      __pendingProfileSymbols[producerSymbol] = pendingConsumerSymbols;
      addTask('P_SNAPSHOT', producerSymbol);
    }

    //
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
    }

    //
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
        if (lines.length > 0) {
          __logger.debug(`Connection [ ${__instance} ]: Processing inbound message(s) in [ connecting ] mode.`);
          lines.forEach(line => {
            if (line.length > 0) {
              __logger.debug(`Connection [ ${__instance} ] << ${line}`);
            }
          });
        }
        if (lines.some(line => line === '+++')) {
          __connectionState = state.authenticating;
          __logger.log(`Connection [ ${__instance} ]: Sending credentials.`);
          __connection.send(`LOGIN ${__loginInfo.username}:${__loginInfo.password} VERSION=${_API_VERSION}\r\n`);
        }
      } else if (__connectionState === state.authenticating) {
        const lines = message.split('\n');
        if (lines.length > 0) {
          __logger.debug(`Connection [ ${__instance} ]: Processing inbound message(s) in [ authenticating ] mode.`);
          lines.forEach(line => {
            if (line.length > 0) {
              __logger.debug(`Connection [ ${__instance} ] << ${line}`);
            }
          });
        }
        const firstCharacter = message.charAt(0);
        if (firstCharacter === '+') {
          __connectionState = state.authenticated;
          __logger.log(`Connection [ ${__instance} ]: Login accepted.`);
          broadcastEvent('events', {
            event: 'login success'
          });
          if (__paused) {
            __logger.log(`Connection [ ${__instance} ]: Establishing heartbeat only -- feed is paused.`);
            enqueueHeartbeat();
          } else {
            __logger.log(`Connection [ ${__instance} ]: Establishing subscriptions for heartbeat and existing symbols.`);
            enqueueHeartbeat();
            enqueueGoTasks();
          }
        } else if (firstCharacter === '-') {
          __logger.log(`Connection [ ${__instance} ]: Login failed.`);
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
        __logger.warn(`Pump Inbound [ ${__instance} ]: An error occurred during inbound message queue processing. Disconnecting.`, e);
        disconnect();
      }
      setTimeout(pumpInboundProcessing, 125);
    }

    //
    // Functions to process the queue of market-related messages, updating market
    // state and notifying interested subscribers.
    //

    /**
     * The first stage of inbound message processing. A raw DDF message is converted to
     * its object representation and passed to the "processMarketMessage" function.
     *
     * @private
     * @param {String} message
     */
    function parseMarketMessage(message) {
      let parsed;
      try {
        parsed = parseMessage(message, __processOptions);
      } catch (e) {
        parsed = null;
        __logger.error(`An error occurred while parsing a market message [ ${message} ]. Continuing.`, e);
      }
      if (parsed !== null) {
        if (parsed.type) {
          processMarketMessage(parsed);
        } else {
          __logger.log(message);
        }
      }
    }

    /**
     * The second stage of inbound message processing. Each message is checked to determine
     * if aliases for the message's symbol exist (i.e. "consumer" symbols). If alternate
     * "consumer" symbols exists, the message is cloned. Finally, the original message (for
     * the "producer" symbol) along with any cloned messages (for the "consumer" symbols) are
     * passed to the "updateMarketState" function.
     *
     * @private
     * @param {Object} message
     */
    function processMarketMessage(message) {
      try {
        const producerSymbol = message.symbol;
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
              messageToProcess = message;
            } else {
              messageToProcess = Object.assign({}, message);
              messageToProcess.symbol = consumerSymbol;
            }
            updateMarketState(messageToProcess);
          });
        } else {
          updateMarketState(message);
        }
      } catch (e) {
        __logger.error(`An error occurred while processing a market message [ ${message} ]. Continuing.`, e);
      }
    }

    /**
     * The third and final stage of message processing. The message is used to update
     * market state. Afterwards, any interested consumers are notified.
     *
     * @private
     * @param {Object} message
     */
    function updateMarketState(message) {
      try {
        __marketState.processMessage(message);
        if (message.type === 'BOOK') {
          broadcastEvent('marketDepth', message);
        } else if (message.type === 'TIMESTAMP') {
          broadcastEvent('timestamp', __marketState.getTimestamp());
        } else if (message.type !== 'REFRESH_CUMULATIVE_VOLUME') {
          broadcastEvent('marketUpdate', message);
        }
      } catch (e) {
        __logger.error(`An error occurred while updating market state [ ${message} ]. Continuing.`, e);
      }
    }

    /**
     * Invokes consumer-supplied callbacks in response to new events (e.g. market
     * state updates, heartbeats, connection status changes, etc).
     *
     * @private
     * @param {String} subscriptionType
     * @param {Object} message
     */
    function broadcastEvent(subscriptionType, message) {
      let listeners;
      if (subscriptionType === 'events') {
        listeners = __listeners.events;
      } else if (subscriptionType === 'marketDepth') {
        listeners = __listeners.marketDepth[message.symbol];
      } else if (subscriptionType === 'marketUpdate') {
        listeners = __listeners.marketUpdate[message.symbol];
      } else if (subscriptionType === 'timestamp') {
        listeners = __listeners.timestamp;
      } else {
        __logger.warn(`Broadcast [ ${__instance} ]: Unable to notify subscribers of [ ${subscriptionType} ].`);
        listeners = null;
      }
      if (listeners) {
        listeners.forEach(listener => {
          try {
            listener(message);
          } catch (e) {
            __logger.warn(`Broadcast [ ${__instance} ]:: A consumer-supplied listener for [ ${subscriptionType} ] threw an error. Continuing.`, e);
          }
        });
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
            if (msgType === 1) {
              if (s.length < idx + suffixLength + 1) {
                if (__marketMessages.length > 0) __marketMessages[0] = s + __marketMessages[0];else {
                  __marketMessages.unshift(s);
                  done = true;
                }
                skip = true;
              } else if (s.substr(idx + 1, 1) === ascii.dc4) {
                epos += suffixLength + 1;
              }
            }
            if (!skip) {
              let s2 = s.substring(0, epos);
              if (msgType === 2) {
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
    }

    //
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
      const processTask = task => {
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
            __logger.warn(`Pump Tasks [ ${__instance} ]: An unsupported task was found in the tasks queue.`);
            return;
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
            const pushOutboundTask = batch => {
              __outboundMessages.push(`${command} ${batch.map(s => `${s}=${suffix}`).join(',')}`);
            };
            while (symbolsStreaming.length > 0) {
              pushOutboundTask(symbolsStreaming.splice(0, batchSize));
            }
            if (task.id === 'MU_GO' || task.id === 'MU_REFRESH') {
              while (symbolsSnapshot.length > 0) {
                const batch = symbolsSnapshot.splice(0, batchSize);
                processSnapshots(batch);
              }
            }
            if (__extendedProfile && (task.id === 'MU_GO' || task.id === 'P_SNAPSHOT')) {
              const symbolsExtended = symbolsUnique.filter(getIsExtendedProfileSymbol);
              while (symbolsExtended.length > 0) {
                const batch = symbolsExtended.splice(0, batchSize);
                processExtendedProfiles(batch);
              }
            }
            if (__extendedQuote && task.id === 'MU_GO') {
              const symbolsExtended = symbolsUnique.filter(getIsExtendedQuoteSymbol);
              while (symbolsExtended.length > 0) {
                const batch = symbolsExtended.splice(0, batchSize);
                processExtendedQuotes(batch);
              }
            }
          }
        }
      };
      while (__pendingTasks.length > 0) {
        processTask(__pendingTasks.shift());
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
          __logger.warn(`Pump Tasks [ ${__instance} ]: An error occurred during task queue processing. Disconnecting.`, e);
          disconnect();
        }
        pumpTaskProcessing(pumpDelegate === processTasksInPollingMode);
      };
      setTimeout(pumpWrapper, pumpDelay);
    }

    //
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
            __logger.log(`Pump Outbound [ ${__instance} ]: ${message}`);
            __connection.send(message);
          } catch (e) {
            __logger.warn(`Pump Outbound [ ${__instance} ]: An error occurred during outbound message queue processing. Disconnecting.`, e);
            disconnect();
            break;
          }
        }
      }
      setTimeout(pumpOutboundProcessing, 200);
    }

    //
    // Functions used to maintain market state for symbols which are not supported
    // by JERQ.
    //

    /**
     * Makes requests for snapshot updates for a batch of symbols to an out-of-band
     * service (i.e. OnDemand). This function is typically used for symbols that are
     * not supported by JERQ.
     *
     * @private
     * @param {String[]} symbols
     */
    function processSnapshots(symbols) {
      if (__connectionState !== state.authenticated || symbols.length === 0) {
        return;
      }
      retrieveQuoteSnapshots(symbols, __loginInfo.username, __loginInfo.password).then(quotes => {
        if (__connectionState !== state.authenticated) {
          return;
        }
        quotes.forEach(message => processMarketMessage(message));
      }).catch(e => {
        __logger.log(`Snapshots [ ${__instance} ]: Out-of-band snapshot request failed for [ ${symbols.join()} ].`, e);
      });
    }

    /**
     * Periodically requests snapshots for existing symbols subscriptions which do not
     * stream through JERQ.
     *
     * @private
     */
    function pumpSnapshotRefresh() {
      if (__connectionState !== state.authenticated) {
        return;
      }
      try {
        const snapshotBatches = getSymbolBatches(getProducerSymbols([__listeners.marketUpdate]), getIsSnapshotSymbol);
        snapshotBatches.forEach(batch => {
          processSnapshots(batch);
        });
      } catch (e) {
        __logger.warn(`Snapshots [ ${__instance} ]: An error occurred during refresh processing. Ignoring.`, e);
      }
      setTimeout(pumpSnapshotRefresh, 3600000);
    }

    //
    // Functions to acquire "extended" data not provided through DDF (via JERQ).
    //

    /**
     * Makes requests for "extended" profile data for a batch of symbols to an out-of-band
     * web service (e.g. extras).
     *
     * @private
     * @param {String[]} symbols
     */
    function processExtendedProfiles(symbols) {
      if (__connectionState !== state.authenticated) {
        return;
      }
      retrieveProfileExtensions(array.difference(symbols, __completedProfileExtensions)).then(extensions => {
        if (__connectionState !== state.authenticated) {
          return;
        }
        extensions.forEach(extension => {
          const producerSymbol = extension.symbol;
          const consumerSymbols = __knownConsumerSymbols[producerSymbol] || [];
          const compositeSymbols = array.unique([producerSymbol].concat(consumerSymbols));
          compositeSymbols.forEach(symbol => {
            const message = Object.assign({}, extension);
            message.symbol = symbol;
            message.type = 'PROFILE_EXTENSION';
            updateMarketState(message);
            __completedProfileExtensions.push(symbol);
          });
        });
      }).catch(e => {
        __logger.log(`Profiles [ ${__instance} ]: Out-of-band profile extension request failed for [ ${symbols.join()} ].`, e);
      });
    }

    /**
     * Makes requests for "extended" quote data for a batch of symbols to an out-of-band
     * web service (e.g. extras).
     *
     * @private
     * @param {String[]} symbols
     */
    function processExtendedQuotes(symbols) {
      if (__connectionState !== state.authenticated) {
        return;
      }
      retrieveQuoteExtensions(symbols, __loginInfo.username, __loginInfo.password).then(extensions => {
        if (__connectionState !== state.authenticated) {
          return;
        }
        extensions.forEach(extension => {
          const producerSymbol = extension.symbol;
          const consumerSymbols = __knownConsumerSymbols[producerSymbol] || [];
          const compositeSymbols = array.unique([producerSymbol].concat(consumerSymbols));
          compositeSymbols.forEach(symbol => {
            const message = Object.assign({}, extension);
            message.symbol = symbol;
            message.type = 'QUOTE_EXTENSION';
            updateMarketState(message);
          });
        });
      }).catch(e => {
        __logger.log(`Profiles [ ${__instance} ]: Out-of-band quote extension request failed for [ ${symbols.join()} ].`, e);
      });
    }

    //
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
     * @returns {String[]}
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
    }

    /**
     * Accepts an array of "listener" functions, copies the array, and adds a
     * new "listener" function to the array (if it does not already exist), and
     * returns the copied array.
     *
     * @private
     * @param {Function[]} listeners
     * @param {Function} listener
     * @returns {Object}
     */
    function addListener(listeners, listener) {
      listeners = listeners || [];
      const add = !listeners.some(candidate => {
        return candidate === listener;
      });
      let updatedListeners;
      if (add) {
        updatedListeners = listeners.slice(0);
        updatedListeners.push(listener);
      } else {
        updatedListeners = listeners;
      }
      return updatedListeners;
    }

    /**
     * Accepts an array of "listener" functions, copies the array, and removes an
     * existing "listener" function frim the array (if it exists), and returns the
     * copied array.
     *
     * @private
     * @param {Function[]} listeners
     * @param {Function} listener
     */
    function removeListener(listeners, listener) {
      const listenersToFilter = listeners || [];
      return listenersToFilter.filter(candidate => {
        return candidate !== listener;
      });
    }

    //
    // Diagnostics functions
    //

    function getDiagnosticsController() {
      if (__connection === null || __loginInfo.hostname !== 'localhost') {
        throw new Error('Diagnostics mode is only available when connected to localhost.');
      }
      if (__diagnosticsController === null) {
        const subscribeAction = (symbol, callback) => {
          __logger.log(`Connection [ ${__instance} ]: Added diagnostic subscription to market updates for [ ${symbol} ]`);

          //__listeners.marketUpdate[symbol] = addListener(__listeners.marketUpdate[symbol], callback);
          //__knownConsumerSymbols[symbol] = [ symbol ];

          on('marketUpdate', callback, symbol);
        };
        const transmitAction = message => {
          __logger.log(`Connection [ ${__instance} ]: Enqueued outbound diagnostic message [ ${message} ]`);
          __outboundMessages.push(message);
        };
        __diagnosticsController = new DiagnosticsController(transmitAction, subscribeAction);
      }
      return __diagnosticsController;
    }

    //
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
      return false;
    }

    /**
     * Indicates if some profile information cannot be extracted from JERQ via
     * DDF messages (which requires an out-of-band effort to get the complete
     * profile).
     *
     * @private
     * @param {String} symbol
     * @returns {Boolean}
     */
    function getIsExtendedProfileSymbol(symbol) {
      return SymbolParser.getIsFuture(symbol) || SymbolParser.getIsC3(symbol) || SymbolParser.getIsCmdty(symbol) || SymbolParser.getIsFutureOption(symbol);
    }

    /**
     * Indicates if some quote information cannot be extracted from JERQ via
     * DDF messages (which requires an out-of-band effort to get the complete
     * profile).
     *
     * @private
     * @param {String} symbol
     * @returns {Boolean}
     */
    function getIsExtendedQuoteSymbol(symbol) {
      return SymbolParser.getIsFuture(symbol) || SymbolParser.getIsCmdtyStats(symbol);
    }

    /**
     * Breaks an array of symbols into multiple array, each containing no more
     * than 250 symbols. Also, symbols are filtered according to a predicate.
     *
     * @private
     * @param {String[]} symbols
     * @param {Function} predicate
     * @returns {Array<String[]>}
     */
    function getSymbolBatches(symbols, predicate) {
      const candidates = symbols.filter(predicate);
      const partitions = [];
      while (candidates.length !== 0) {
        partitions.push(candidates.splice(0, 250));
      }
      return partitions;
    }

    //
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
      on: on,
      off: off,
      getProducerSymbolCount: getProducerSymbolCount,
      setPollingFrequency: setPollingFrequency,
      setExtendedProfileMode: setExtendedProfileMode,
      setExtendedQuoteMode: setExtendedQuoteMode,
      handleProfileRequest: handleProfileRequest,
      getDiagnosticsController: getDiagnosticsController
    };
  }
  class DiagnosticsController extends DiagnosticsControllerBase {
    constructor(transmitAction, subscribeAction) {
      super();
      this._transmitAction = transmitAction;
      this._subscribeAction = subscribeAction;
    }
    _initialize(subscriptions) {
      subscriptions.forEach(subscription => {
        this._subscribeAction(subscription.symbol, subscription.callback);
      });
    }
    _transmit(message) {
      this._transmitAction(message);
    }
    toString() {
      return '[DiagnosticsController]';
    }
  }

  /**
   * The **central component of the SDK**. It is responsible for connecting to Barchart's
   * servers, managing market data subscriptions, and maintaining market state. The
   * SDK consumer should use one instance at a time.
   *
   * @public
   * @exported
   * @extends {ConnectionBase}
   */
  class Connection extends ConnectionBase {
    constructor() {
      super();
      this._internal = ConnectionInternal(this.getMarketState(), this._getInstance());
    }
    _connect(webSocketAdapterFactory) {
      this._internal.connect(this.getHostname(), this.getUsername(), this.getPassword(), webSocketAdapterFactory === null ? new WebSocketAdapterFactoryForBrowsers() : webSocketAdapterFactory);
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
    _onExtendedProfileModeChanged(mode) {
      return this._internal.setExtendedProfileMode(mode);
    }
    _onExtendedQuoteModeChanged(mode) {
      return this._internal.setExtendedQuoteMode(mode);
    }
    _handleProfileRequest(symbol) {
      this._internal.handleProfileRequest(symbol);
    }
    _getDiagnosticsController() {
      return this._internal.getDiagnosticsController.call(this._internal);
    }
    toString() {
      return `[Connection (instance=${this._getInstance()})]`;
    }
  }
  return Connection;
})();

},{"./../logging/LoggerFactory":13,"./../meta":20,"./../utilities/parse/ddf/message":36,"./../utilities/parsers/SymbolParser":39,"./ConnectionBase":3,"./adapter/WebSocketAdapterFactory":5,"./adapter/WebSocketAdapterFactoryForBrowsers":6,"./diagnostics/DiagnosticsControllerBase":7,"./snapshots/exchanges/retrieveExchanges":8,"./snapshots/profiles/retrieveExtensions":9,"./snapshots/quotes/retrieveExtensions":10,"./snapshots/quotes/retrieveSnapshots":11,"@barchart/common-js/lang/array":45,"@barchart/common-js/lang/object":48}],3:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');
const MarketState = require('./../marketState/MarketState');
module.exports = (() => {
  'use strict';

  let instanceCounter = 0;

  /**
   * Contract for communicating with remove market data servers and
   * querying current market state.
   *
   * @protected
   * @abstract
   * @ignore
   */
  class ConnectionBase {
    constructor() {
      this._hostname = null;
      this._username = null;
      this._password = null;
      this._marketState = new MarketState(symbol => this._handleProfileRequest(symbol));
      this._pollingFrequency = null;
      this._extendedProfileMode = false;
      this._extendedQuoteMode = false;
      this._instance = ++instanceCounter;
    }

    /**
     * Establishes WebSocket connection to Barchart's servers and authenticates. Success
     * or failure is reported asynchronously by the **Events** subscription (see
     * {@link Enums.SubscriptionType}). Connection attempts will continue until
     * the disconnect function is called.
     *
     * @public
     * @param {string} hostname - Barchart hostname (contact solutions@barchart.com)
     * @param {string} username - Your username (contact solutions@barchart.com)
     * @param {string} password - Your password (contact solutions@barchart.com)
     * @param {WebSocketAdapterFactory=} webSocketAdapterFactory - Strategy for creating a WebSocket (required for Node.js)
     */
    connect(hostname, username, password, webSocketAdapterFactory) {
      this._hostname = hostname;
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
     * Forces a disconnect from the server. All subscriptions are discarded. Reconnection
     * attempts will cease.
     *
     * @public
     */
    disconnect() {
      this._hostname = null;
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
     * Initiates a subscription, registering a callback for event notifications.
     *
     * @public
     * @param {Enums.SubscriptionType} subscriptionType - The type of subscription
     * @param {Callbacks.MarketDepthCallback|Callbacks.MarketUpdateCallback|Callbacks.CumulativeVolumeCallback|Callbacks.TimestampCallback|Callbacks.EventsCallback} callback - A function which will be invoked each time the event occurs
     * @param {String=} symbol - A symbol (only applicable for market data subscriptions)
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
     * Drops a subscription (see {@link ConnectionBase#on}).
     *
     * @public
     * @param {Enums.SubscriptionType} subscriptionType - The type of subscription
     * @param {Callbacks.MarketDepthCallback|Callbacks.MarketUpdateCallback|Callbacks.CumulativeVolumeCallback|Callbacks.TimestampCallback|Callbacks.EventsCallback} callback - The **same** function which was passed to {@link ConnectionBase#on}
     * @param {String=} symbol - The symbol (only applicable for market data subscriptions)
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

    /**
     * Pauses the data flow over the network. All subscriptions are maintained;
     * however, callbacks will cease to be invoked.
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
     * Restarts the flow of data over the network. Subscription callbacks will once
     * again be invoked.
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
    getActiveSymbolCount() {
      return this._getActiveSymbolCount();
    }
    _getActiveSymbolCount() {
      return null;
    }

    /**
     * By default, the server pushes data to the SDK. However, to save network
     * bandwidth, the SDK can operate in a polling mode -- only updating
     * periodically. Calling this function with a positive number will
     * cause the SDK to begin polling. Calling this function with a null
     * value will cause to SDK to resume normal operation.
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
     * By default, the server pushes data to the SDK. However, to save network
     * bandwidth, the SDK can operate in a polling mode -- only updating
     * periodically. If the SDK is configured for polling, the frequency, in
     * milliseconds will be returned. If the SDK is configured for normal operation,
     * a null value will be returned.
     *
     * @public
     * @returns {number|null}
     */
    getPollingFrequency() {
      return this._pollingFrequency;
    }

    /**
     * When set to true, additional properties become available on {@link Profile}
     * instances (e.g. the "first notice dates" for futures contracts). This is accomplished
     * by making additional out-of-band queries to web Barchart services.
     *
     * @public
     * @param {Boolean} mode
     */
    setExtendedProfileMode(mode) {
      if (is.boolean(mode) && this._extendedProfileMode !== mode) {
        this._extendedProfileMode = mode;
        this._onExtendedProfileModeChanged(this._extendedProfileMode);
      }
    }

    /**
     * @protected
     * @ignore
     */
    _onExtendedProfileModeChanged(mode) {
      return;
    }

    /**
     * Indicates if additional {@link Profile} data (e.g. the "first notice dates" for
     * futures contracts) should be loaded (via out-of-band queries).
     *
     * @public
     * @returns {Boolean}
     */
    getExtendedProfileMode() {
      return this._extendedProfileMode;
    }

    /**
     * When set to true, additional properties become available on {@link Quote} instances
     * (e.g. "record high price" for futures contracts). This is accomplished by making
     * additional out-of-band queries to Barchart web services.
     *
     * @public
     * @param {Boolean} mode
     */
    setExtendedQuoteMode(mode) {
      if (is.boolean(mode) && this._extendedQuoteMode !== mode) {
        this._extendedQuoteMode = mode;
        this._onExtendedQuoteModeChanged(this._extendedQuoteMode);
      }
    }

    /**
     * @protected
     * @ignore
     */
    _onExtendedQuoteModeChanged(mode) {
      return;
    }

    /**
     * Indicates if additional {@link Quote} data (e.g. "record high price" for futures
     * contracts) should be loaded (via out-of-band queries).
     *
     * @public
     * @returns {Boolean}
     */
    getExtendedQuoteMode() {
      return this._extendedQuoteMode;
    }

    /**
     * @protected
     * @ignore
     * @param {String} symbol
     */
    _handleProfileRequest(symbol) {
      return;
    }

    /**
     * This is an undocumented feature which places the connection into "diagnostic
     * mode" which allows the consumer to send raw messages directly to the remote
     * server.
     *
     * @public
     * @ignore
     * @returns {DiagnosticsControllerBase}
     */
    getDiagnosticsController() {
      return this._getDiagnosticsController();
    }

    /**
     * @protected
     * @ignore
     */
    _getDiagnosticsController() {
      return null;
    }

    /**
     * Returns the {@link MarketState} singleton -- which can be used to access
     * {@link Quote}, {@link Profile}, and {@link CumulativeVolume} instances
     * for any symbol subscribed symbol.
     *
     * @public
     * @returns {MarketState}
     */
    getMarketState() {
      return this._marketState;
    }

    /**
     * The Barchart hostname.
     *
     * @public
     * @returns {null|string}
     */
    getHostname() {
      return this._hostname;
    }

    /**
     * The Barchart hostname.
     *
     * @public
     * @returns {null|string}
     */
    getServer() {
      return this._hostname;
    }

    /**
     * The password used to authenticate to Barchart.
     *
     * @public
     * @returns {null|string}
     */
    getPassword() {
      return this._password;
    }

    /**
     * The username used to authenticate to Barchart.
     *
     * @public
     * @returns {null|string}
     */
    getUsername() {
      return this._username;
    }

    /**
     * Gets a unique identifier for the current instance.
     *
     * @protected
     * @ignore
     * @returns {Number}
     */
    _getInstance() {
      return this._instance;
    }
    toString() {
      return `[ConnectionBase (instance=${this._instance})]`;
    }
  }
  return ConnectionBase;
})();

},{"./../marketState/MarketState":17,"@barchart/common-js/lang/is":47}],4:[function(require,module,exports){
module.exports = (() => {
  'use strict';

  /**
   * The abstract definition for an object which can establish and
   * communicate over a WebSocket. It is unlikely that SDK consumers
   * will need to implement this class.
   *
   * @public
   * @exported
   * @abstract
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
   * An abstract definition for an factory that builds {@link WebSocketAdapter}
   * instances. It is unlikely that SDK consumers will need to implement this class.
   *
   * @public
   * @exported
   * @abstract
   */
  class WebSocketAdapterFactory {
    constructor() {}

    /**
     * Returns a new {@link WebSocketAdapter} instance.
     *
     * @public
     * @abstract
     * @param {String} host
     * @returns {WebSocketAdapter}
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
   * An implementation of {@link WebSocketAdapterFactory} for use with web browsers. By default,
   * this strategy is used by the {@link Connection} class.
   *
   * @public
   * @extends {WebSocketAdapterFactory}
   * @exported
   */
  class WebSocketAdapterFactoryForBrowsers extends WebSocketAdapterFactory {
    constructor() {
      super();
      this._logger = LoggerFactory.getLogger('@barchart/marketdata-api-js');
    }

    /**
     * Returns a new {@link WebSocketAdapter} instance suitable for use
     * with a web browser.
     *
     * @public
     * @param {String} host
     * @returns {WebSocketAdapter}
     */
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

},{"./../../logging/LoggerFactory":13,"./WebSocketAdapter":4,"./WebSocketAdapterFactory":5}],7:[function(require,module,exports){
const assert = require('@barchart/common-js/lang/assert');
const is = require('@barchart/common-js/lang/is');
module.exports = (() => {
  'use strict';

  /**
   * Contract for sending diagnostic commands to the remote server.
   *
   * @protected
   * @abstract
   * @ignore
   */
  class DiagnosticsControllerBase {
    constructor() {
      this._initialized = false;
    }

    /**
     * @public
     * @param {String} file
     * @param {*} subscriptions
     */
    initialize(file, subscriptions) {
      if (this._initialized) {
        throw new Error('The diagnostics controller has already been initialized.');
      }
      assert.argumentIsRequired(file, 'file', String);
      if (subscriptions) {
        assert.argumentIsArray(subscriptions, 'subscriptions', s => is.string(s.symbol) && is.fn(s.callback), 'DiagnosticsSubscription');
      }
      this._initialized = true;
      this._initialize(subscriptions || []);
      this._transmit(`LOAD ${file}`);
    }
    _initialize(subscriptions) {
      return;
    }
    next() {
      checkReady.call(this);
      this._transmit('NEXT');
    }
    scroll(index) {
      assert.argumentIsRequired(index, 'index', Number);
      checkReady.call(this);
      this._transmit(`SCROLL ${index.toString()}`);
    }
    _transmit(message) {
      return;
    }
    toString() {
      return `[DiagnosticsControllerBase]`;
    }
  }
  function checkReady() {
    if (!this._initialized) {
      throw new Error('The diagnostics controller has not been initialized.');
    }
  }
  return DiagnosticsControllerBase;
})();

},{"@barchart/common-js/lang/assert":46,"@barchart/common-js/lang/is":47}],8:[function(require,module,exports){
const axios = require('axios');
module.exports = (() => {
  'use strict';

  /**
   * Executes an HTTP request for exchange metadata.
   *
   * @function
   * @exported
   * @returns {Promise<ExchangeMetadata[]>}
   */
  function retrieveExchanges() {
    return Promise.resolve().then(() => {
      const options = {
        url: `https://instruments-prod.aws.barchart.com/exchanges`,
        method: 'GET'
      };
      return Promise.resolve(axios(options)).then(response => {
        const results = response.data || [];
        return results.map(result => {
          const metadata = {};
          metadata.id = result.id;
          metadata.description = result.description;
          metadata.timezoneExchange = result.timezoneLocal || null;
          metadata.timezoneDdf = result.timezoneDdf || null;
          return metadata;
        });
      });
    });
  }

  /**
   * Exchange metadata
   *
   * @typedef ExchangeMetadata
   * @type {Object}
   * @ignore
   * @property {String} id
   * @property {String} description
   * @property {String} timezoneExchange
   * @property {String} timezoneDdf
   */

  return retrieveExchanges;
})();

},{"axios":57}],9:[function(require,module,exports){
const axios = require('axios');
const array = require('@barchart/common-js/lang/array'),
  assert = require('@barchart/common-js/lang/assert'),
  Day = require('@barchart/common-js/lang/Day'),
  is = require('@barchart/common-js/lang/is');
const SymbolParser = require('./../../../utilities/parsers/SymbolParser');
const LoggerFactory = require('./../../../logging/LoggerFactory');
module.exports = (() => {
  'use strict';

  let logger = null;

  /**
   * Executes an HTTP request for "extended" profile data for an array
   * of symbols.
   *
   * @function
   * @ignore
   * @param {String[]} symbols
   * @returns {Promise<ProfileExtension[]>}
   */
  function retrieveExtensions(symbols) {
    return Promise.resolve().then(() => {
      if (logger === null) {
        logger = LoggerFactory.getLogger('@barchart/marketdata-api-js');
      }
      assert.argumentIsArray(symbols, 'symbols', String);
      return Promise.all([retrieveExtensionsForC3(symbols.filter(SymbolParser.getIsC3)), retrieveExtensionsForCmdtyStats(symbols.filter(SymbolParser.getIsCmdtyStats)), retrieveExtensionsForFutures(symbols.filter(SymbolParser.getIsFuture)), retrieveExtensionsForFuturesOptions(symbols.filter(SymbolParser.getIsFutureOption)), retrieveExtensionsForGrainBids(symbols.filter(SymbolParser.getIsGrainBid))]).then(results => {
        return array.flatten(results);
      });
    });
  }
  function retrieveExtensionsForFutures(symbols) {
    return Promise.resolve().then(() => {
      if (symbols.length === 0) {
        return Promise.resolve([]);
      }
      const options = {
        url: `https://extras.ddfplus.com/json/instruments/?lookup=${encodeURIComponent(symbols.join())}`,
        method: 'GET'
      };
      return Promise.resolve(axios(options)).then(response => {
        if (response.status !== 200) {
          return [];
        }
        const results = (response.data.instruments || []).filter(result => {
          return result.status === 200;
        });
        return results.map(result => {
          const extension = {};
          extension.symbol = result.lookup;
          if (is.string(result.symbol_expire)) {
            const matches = result.symbol_expire.match(regex.dates.expire);
            if (matches !== null) {
              extension.expiration = Day.parse(matches[1]).format();
            }
          }
          if (is.string(result.symbol_fnd)) {
            extension.firstNotice = Day.parse(result.symbol_fnd).format();
          }
          return extension;
        });
      });
    });
  }
  function retrieveExtensionsForCmdtyStats(symbols) {
    return Promise.resolve().then(() => {
      if (symbols.length === 0) {
        return Promise.resolve([]);
      }
      const options = {
        url: `https://instrument-extensions.aws.barchart.com/v1/cmdtyStats/meta?&symbols=${encodeURIComponent(symbols.join())}`,
        method: 'GET'
      };
      return Promise.resolve(axios(options)).then(response => {
        if (response.status !== 200) {
          return [];
        }
        const results = (response.data || []).filter(result => {
          return result.meta !== null;
        });
        return results.map(result => {
          const extension = {};
          extension.symbol = result.symbol;
          extension.cmdtyStats = result.meta;
          return extension;
        });
      });
    });
  }
  function retrieveExtensionsForC3(symbols) {
    return Promise.resolve().then(() => {
      if (symbols.length === 0) {
        return Promise.resolve([]);
      }
      const options = {
        url: `https://instrument-extensions.aws.barchart.com/v1/c3/meta?symbols=${encodeURIComponent(symbols.join())}`,
        method: 'GET'
      };
      return Promise.resolve(axios(options)).then(response => {
        const results = response.data || [];
        return results.reduce((accumulator, result) => {
          try {
            const extension = {};
            extension.symbol = result.symbol.toUpperCase();
            if (SymbolParser.getIsC3(extension.symbol) && is.object(result.meta)) {
              const c3 = {};
              c3.area = null;
              c3.basis = null;
              c3.currency = null;
              c3.delivery = null;
              c3.description = null;
              c3.lot = null;
              c3.market = null;
              c3.product = null;
              c3.terms = null;
              const meta = result.meta;
              if (meta.area) {
                c3.area = meta.area;
              }
              if (meta.basis) {
                c3.basis = meta.basis;
              }
              if (meta.lot) {
                c3.currency = getC3Currency(meta.lot);
              }
              if (meta.delivery) {
                c3.delivery = meta.delivery;
              }
              if (meta.description) {
                c3.description = meta.description;
              }
              if (meta.lot) {
                c3.lot = meta.lot;
              }
              if (meta.market) {
                c3.market = meta.market;
              }
              if (meta.product) {
                c3.product = meta.product;
              }
              if (meta.terms) {
                c3.terms = meta.terms;
              }
              extension.c3 = c3;
            }
            accumulator.push(extension);
          } catch (e) {
            logger.warn(`Extensions: Failed to process extension [ ${symbols.join()} ]`);
          }
          return accumulator;
        }, []);
      });
    });
  }
  function retrieveExtensionsForFuturesOptions(symbols) {
    return Promise.resolve().then(() => {
      if (symbols.length === 0) {
        return Promise.resolve([]);
      }
      const options = {
        url: `https://extras.ddfplus.com/json/instruments/?lookup=${encodeURIComponent(symbols.join())}`,
        method: 'GET'
      };
      return Promise.resolve(axios(options)).then(response => {
        if (response.status !== 200) {
          return [];
        }
        const results = (response.data.instruments || []).filter(result => {
          return result.status === 200;
        });
        return results.map(result => {
          const extension = {};
          extension.symbol = result.lookup;
          if (is.string(result.symbol_expire)) {
            const matches = result.symbol_expire.match(regex.dates.expire);
            if (matches !== null) {
              extension.expiration = Day.parse(matches[1]).format();
            }
          }
          extension.option = {};
          if (result.underlier) {
            const u = SymbolParser.parseInstrumentType(result.underlier);
            const o = SymbolParser.parseInstrumentType(result.lookup);
            if (o !== null) {
              if (extension.expiration) {
                const expiration = {};
                expiration.date = extension.expiration;
                expiration.month = result.symbol_ddf_expire_month;
                expiration.year = SymbolParser.getFuturesYear(result.symbol_ddf_expire_year, result.symbol_ddf_expire_month);
                extension.option.expiration = expiration;
              }
              extension.option.putCall = o.option_type;
              extension.option.strike = o.strike;
            }
            const underlying = {};
            underlying.symbol = result.underlier;
            if (u !== null) {
              underlying.root = u.root;
              underlying.month = u.month;
              underlying.year = u.year;
            }
            extension.option.underlying = underlying;
          }
          return extension;
        });
      });
    });
  }
  function retrieveExtensionsForGrainBids(symbols) {
    return Promise.resolve().then(() => {
      if (symbols.length === 0) {
        return Promise.resolve([]);
      }
      const options = {
        url: `https://instrument-extensions.aws.barchart.com/v1/grains/meta?&symbols=${encodeURIComponent(symbols.join())}`,
        method: 'GET'
      };
      return Promise.resolve(axios(options)).then(response => {
        if (response.status !== 200) {
          return [];
        }
        const results = (response.data || []).filter(result => {
          return result.meta !== null;
        });
        return results.map(result => {
          const extension = {};
          extension.symbol = result.symbol;
          extension.grainBid = result.meta;
          return extension;
        });
      });
    });
  }
  const regex = {};
  regex.dates = {};
  regex.dates.expire = /^([0-9]{4}-[0-9]{2}-[0-9]{2})T/;
  regex.c3 = {};
  regex.c3.currencies = {};
  regex.c3.currencies.eur = /^(EUR)\/(.*)$/i;
  regex.c3.currencies.rub = /^(RUB)\/(.*)$/i;
  regex.c3.currencies.uah = /^(UAH)\/(.*)$/i;
  regex.c3.currencies.usd = /^(USD|Usc|\$|)\/(.*)$/i;
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

  /**
   * Extended profile information.
   *
   * @typedef ProfileExtension
   * @type {Object}
   * @ignore
   * @property {String} symbol
   * @property {String=} expiration
   * @property {Object=} c3
   * @property {Object=} cmdtyStats
   * @property {String=} firstNotice
   * @property {Object=} grainBid
   * @property {Object=} option
   */

  return retrieveExtensions;
})();

},{"./../../../logging/LoggerFactory":13,"./../../../utilities/parsers/SymbolParser":39,"@barchart/common-js/lang/Day":42,"@barchart/common-js/lang/array":45,"@barchart/common-js/lang/assert":46,"@barchart/common-js/lang/is":47,"axios":57}],10:[function(require,module,exports){
const axios = require('axios');
const array = require('@barchart/common-js/lang/array'),
  Day = require('@barchart/common-js/lang/Day'),
  is = require('@barchart/common-js/lang/is');
const SymbolParser = require('./../../../utilities/parsers/SymbolParser');
module.exports = (() => {
  'use strict';

  /**
   * Executes an HTTP request for a quote snapshot extension(s). A quote
   * extension contains supplemental quote-related data that is not available
   * though normal sources (i.e. some data points are not available through
   * a stream from JERQ).
   *
   * An array of quote refresh messages (suitable for processing by
   * the {@link MarketState#processMessage} function) are returned.
   *
   * @function
   * @ignore
   * @param {String|Array<String>} symbols
   * @param {String} username
   * @param {String} password
   * @returns {Promise<QuoteExtension[]>}
   */
  function retrieveExtensions(symbols, username, password) {
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
      const extensions = [];
      const getOrCreateExtension = symbol => {
        let extension = extensions.find(e => e.symbol === symbol);
        if (!extension) {
          extension = {
            symbol
          };
          extensions.push(extension);
        }
        return extension;
      };
      const promises = [];
      const futuresSymbols = array.unique(symbolsToUse.filter(s => SymbolParser.getIsFuture(s) && SymbolParser.getIsConcrete(s)).sort());
      if (futuresSymbols.length !== 0) {
        promises.push(retrieveFuturesHiLo(futuresSymbols).then(results => {
          results.forEach(result => {
            if (result.hilo) {
              const extension = getOrCreateExtension(result.symbol);
              const hilo = {};
              hilo.highPrice = result.hilo.highPrice;
              hilo.highDate = result.hilo.highDate ? Day.parse(result.hilo.highDate) : null;
              hilo.lowPrice = result.hilo.lowPrice;
              hilo.lowDate = result.hilo.lowDate ? Day.parse(result.hilo.lowDate) : null;
              extension.hilo = hilo;
            }
          });
        }));
      }
      const cmdtyStatsSymbols = array.unique(symbolsToUse.filter(s => SymbolParser.getIsCmdtyStats(s)).sort());
      if (cmdtyStatsSymbols.length !== 0) {
        promises.push(retrieveCmdtyStatsDates(cmdtyStatsSymbols).then(results => {
          results.forEach(result => {
            if (result.quote) {
              const extension = getOrCreateExtension(result.symbol);
              const cmdtyStats = {};
              if (result.quote.current) {
                cmdtyStats.currentDate = result.quote.current.date;
              }
              if (result.quote.previous) {
                cmdtyStats.previousDate = result.quote.previous.date;
              }
              extension.cmdtyStats = cmdtyStats;
            }
          });
        }));
      }
      if (promises.length === 0) {
        return Promise.resolve([]);
      }
      return Promise.all(promises).then(() => {
        return extensions;
      });
    });
  }

  /**
   * Retrieves all-time highs and lows for specific futures contracts.
   *
   * @private
   * @param {String[]} symbols
   * @returns {Promise<Object[]>}
   */
  function retrieveFuturesHiLo(symbols) {
    return Promise.resolve().then(() => {
      const options = {
        url: `https://instrument-extensions.aws.barchart.com/v1/futures/hilo?&symbols=${encodeURIComponent(symbols.join())}`,
        method: 'GET'
      };
      return Promise.resolve(axios(options)).then(response => {
        return response.data || [];
      });
    });
  }

  /**
   * Retrieves current and previous quote dates for cmdtyStats instruments.
   *
   * @private
   * @param {String[]} symbols
   * @returns {Promise<Object[]>}
   */
  function retrieveCmdtyStatsDates(symbols) {
    return Promise.resolve().then(() => {
      const options = {
        url: `https://instrument-extensions.aws.barchart.com/v1/cmdtyStats/quote?&symbols=${encodeURIComponent(symbols.join())}`,
        method: 'GET'
      };
      return Promise.resolve(axios(options)).then(response => {
        return response.data || [];
      });
    });
  }

  /**
   * Extended quote information.
   *
   * @typedef QuoteExtension
   * @type {Object}
   * @ignore
   * @property {String} symbol
   * @property {QuoteExtensionHiLo=} hilo
   * @property {QuoteExtensionCmdtyStatus=} cmdtyStats
   */

  /**
   * Extended quote information (for all-time highs and lows).
   *
   * @typedef QuoteExtensionHiLo
   * @type {Object}
   * @ignore
   * @property {Number=} highPrice
   * @property {Day=} highDate
   * @property {Number=} lowPrice
   * @property {Day=} lowDate
   */

  /**
   * Extended quote information (for cmdtyStats instruments).
   *
   * @typedef QuoteExtensionCmdtyStats
   * @type {Object}
   * @ignore
   * @property {Day=} currentDate
   * @property {Day=} previousDate
   */

  return retrieveExtensions;
})();

},{"./../../../utilities/parsers/SymbolParser":39,"@barchart/common-js/lang/Day":42,"@barchart/common-js/lang/array":45,"@barchart/common-js/lang/is":47,"axios":57}],11:[function(require,module,exports){
const axios = require('axios');
const array = require('@barchart/common-js/lang/array'),
  is = require('@barchart/common-js/lang/is');
const convertDateToDayCode = require('./../../../utilities/convert/dateToDayCode'),
  convertDayCodeToNumber = require('./../../../utilities/convert/dayCodeToNumber'),
  convertBaseCodeToUnitCode = require('./../../../utilities/convert/baseCodeToUnitCode');
const SymbolParser = require('./../../../utilities/parsers/SymbolParser');
const LoggerFactory = require('./../../../logging/LoggerFactory');
module.exports = (() => {
  'use strict';

  let logger = null;

  /**
   * Executes an HTTP request for a quote snapshot(s) and returns a
   * promise of quote refresh message(s) (suitable for processing by
   * the {@link MarketState#processMessage} function).
   *
   * @function
   * @ignore
   * @param {String|Array<String>} symbols
   * @param {String} username
   * @param {String} password
   * @returns {Promise<Array>}
   */
  function retrieveSnapshots(symbols, username, password) {
    return Promise.resolve().then(() => {
      if (logger === null) {
        logger = LoggerFactory.getLogger('@barchart/marketdata-api-js');
      }
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
        const concrete = SymbolParser.getProducerSymbol(symbol);
        if (concrete !== symbol) {
          aliases[concrete] = symbol;
        }
        getQuoteSymbols.push(concrete);
      });
      const promises = [];
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
        const messages = results.reduce((accumulator, result) => {
          try {
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
            if (SymbolParser.getIsC3(message.symbol)) {
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
            accumulator.push(message);
          } catch (e) {
            logger.warn(`Snapshot: Failed to process snapshot [ ${symbols.join()} ]`);
          }
          return accumulator;
        }, []);
        return messages;
      });
    });
  }
  const regex = {};
  regex.day = /^([0-9]{4}).?([0-9]{2}).?([0-9]{2})$/;
  regex.c3 = {};
  regex.c3.currencies = {};
  regex.c3.currencies.eur = /^(EUR)\/(.*)$/i;
  regex.c3.currencies.rub = /^(RUB)\/(.*)$/i;
  regex.c3.currencies.uah = /^(UAH)\/(.*)$/i;
  regex.c3.currencies.usd = /^(USD|Usc|\$|)\/(.*)$/i;
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
  return retrieveSnapshots;
})();

},{"./../../../logging/LoggerFactory":13,"./../../../utilities/convert/baseCodeToUnitCode":21,"./../../../utilities/convert/dateToDayCode":22,"./../../../utilities/convert/dayCodeToNumber":23,"./../../../utilities/parsers/SymbolParser":39,"@barchart/common-js/lang/array":45,"@barchart/common-js/lang/is":47,"axios":57}],12:[function(require,module,exports){
module.exports = (() => {
  'use strict';

  /**
   * An interface for writing log messages. An implementation of this
   * class is returned by {@link LoggerProvider.getLogger}.
   *
   * @public
   * @exported
   * @abstract
   */
  class Logger {
    constructor() {}

    /**
     * Writes a log message.
     *
     * @public
     * @abstract
     * @param {...Schema.Loggable}
     */
    log() {
      return;
    }

    /**
     * Writes a log message at "trace" level.
     *
     * @public
     * @abstract
     * @param {...Schema.Loggable}
     */
    trace() {
      return;
    }

    /**
     * Writes a log message at "debug" level.
     *
     * @public
     * @abstract
     * @param {...Schema.Loggable}
     */
    debug() {
      return;
    }

    /**
     * Writes a log message at "info" level.
     *
     * @public
     * @abstract
     * @param {...Schema.Loggable}
     */
    info() {
      return;
    }

    /**
     * Writes a log message at "warn" level.
     *
     * @public
     * @abstract
     * @param {...Schema.Loggable}
     */
    warn() {
      return;
    }

    /**
     * Writes a log message at "error" level.
     *
     * @public
     * @abstract
     * @param {...Schema.Loggable}
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

},{}],13:[function(require,module,exports){
const Logger = require('./Logger'),
  LoggerProvider = require('./LoggerProvider');
module.exports = (() => {
  'use strict';

  let __provider = null;

  /**
   * Container for static functions which control logging within the SDK.
   *
   * @public
   * @exported
   */
  class LoggerFactory {
    constructor() {}

    /**
     * Configures the SDK to write log messages to the console.
     *
     * @public
     * @static
     */
    static configureForConsole() {
      LoggerFactory.configure(new ConsoleLoggerProvider());
    }

    /**
     * Configures the SDK to mute all log messages.
     *
     * @public
     * @static
     */
    static configureForSilence() {
      LoggerFactory.configure(new EmptyLoggerProvider());
    }

    /**
     * Configures the library to delegate any log messages to a custom
     * implementation of the {@link LoggerProvider} class.
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
     * @returns {Logger}
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
      try {
        console.log.apply(console, arguments);
      } catch (e) {}
    }
    trace() {
      try {
        console.trace.apply(console, arguments);
      } catch (e) {}
    }
    debug() {
      try {
        console.debug.apply(console, arguments);
      } catch (e) {}
    }
    info() {
      try {
        console.info.apply(console, arguments);
      } catch (e) {}
    }
    warn() {
      try {
        console.warn.apply(console, arguments);
      } catch (e) {}
    }
    error() {
      try {
        console.error.apply(console, arguments);
      } catch (e) {}
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
    debug() {
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

},{"./Logger":12,"./LoggerProvider":14}],14:[function(require,module,exports){
module.exports = (() => {
  'use strict';

  /**
   * A contract for generating {@link Logger} instances. For custom logging
   * the SDK consumer should implement this class and pass it to the
   * {@link LoggerFactory.configure} function.
   *
   * @public
   * @exported
   * @abstract
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

},{}],15:[function(require,module,exports){
const object = require('@barchart/common-js/lang//object');
const LoggerFactory = require('./../logging/LoggerFactory');
module.exports = (() => {
  'use strict';

  let __logger = null;
  const events = {
    update: 'update',
    reset: 'reset'
  };

  /**
   * An aggregation of the total volume traded at each price level for a
   * single instrument, mutates as **CumulativeVolume** subscription updates
   * are processed (see {@link Enums.SubscriptionType}).
   *
   * @public
   * @exported
   */
  class CumulativeVolume {
    constructor(symbol, tickIncrement) {
      /**
       * @property {string} symbol - Symbol of the cumulative volume.
       * @public
       * @readonly
       */
      this.symbol = symbol;
      this._tickIncrement = tickIncrement;
      this._handlers = [];
      this._priceLevels = {};
      this._highPrice = null;
      this._lowPrice = null;
      if (__logger === null) {
        __logger = LoggerFactory.getLogger('@barchart/marketdata-api-js');
      }
    }

    /**
     * Registers an event handler for a given event. The following events are
     * supported:
     *
     * update -- when a new price level is added, or an existing price level mutates.
     * reset -- when all price levels are cleared.
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
     * @returns {Schema.VolumeLevel[]}
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
     * @returns {CumulativeVolume}
     */
    static clone(symbol, source) {
      const clone = new CumulativeVolume(symbol, source.getTickIncrement());
      source.toArray().forEach(priceLevel => {
        clone.incrementVolume(priceLevel.price, priceLevel.volume);
      });
      return clone;
    }
    toString() {
      return `[CumulativeVolume (symbol=${this.symbol})]`;
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
      __logger.error('An error was thrown by a cumulative volume observer.', e);
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

},{"./../logging/LoggerFactory":13,"@barchart/common-js/lang//object":48}],16:[function(require,module,exports){
const Timezones = require('@barchart/common-js/lang/Timezones');
module.exports = (() => {
  'use strict';

  /**
   * Describes an exchange.
   *
   * @public
   * @exported
   */
  class Exchange {
    constructor(id, name, timezoneDdf, timezoneExchange) {
      /**
       * @property {string} id - Barchart code for the exchange
       * @public
       * @readonly
       */
      this.id = id;

      /**
       * @property {string} name - Name of the exchange
       * @public
       * @readonly
       */
      this.name = name;

      /**
       * @property {string|null} timezoneDdf - Implied timezone of DDF messages for this exchange (conforms to a TZ database name)
       * @public
       * @readonly
       */
      this.timezoneDdf = null;

      /**
       * @property {number|null} offsetDdf - The offset, in milliseconds, between a DDF time and UTC.
       * @public
       * @readonly
       */
      this.offsetDdf = null;

      /**
       * @property {string} timezoneLocal - Timezone exchange is physically located in (conforms to a TZ database name).
       * @public
       * @readonly
       */
      this.timezoneExchange = null;

      /**
       * @property {number} offsetExchange -- The offset, in milliseconds, between exchange time and UTC.
       * @public
       * @readonly
       */
      this.offsetExchange = null;
      const tzDdf = Timezones.parse(timezoneDdf);
      const tzExchange = Timezones.parse(timezoneExchange);
      if (tzDdf !== null) {
        this.timezoneDdf = tzDdf.code;
        this.offsetDdf = tzDdf.getUtcOffset(null, true);
      }
      if (tzExchange !== null) {
        this.timezoneExchange = tzExchange.code;
        this.offsetExchange = tzExchange.getUtcOffset(null, true);
      }
    }
    toString() {
      return `[Exchange (id=${this.id})]`;
    }
  }
  return Exchange;
})();

},{"@barchart/common-js/lang/Timezones":44}],17:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is'),
  object = require('@barchart/common-js/lang/object'),
  timezone = require('@barchart/common-js/lang/timezone'),
  Timezones = require('@barchart/common-js/lang/Timezones');
const CumulativeVolume = require('./CumulativeVolume'),
  Exchange = require('./Exchange'),
  Profile = require('./Profile'),
  Quote = require('./Quote');
const convertDayCodeToNumber = require('./../utilities/convert/dayCodeToNumber'),
  SymbolParser = require('../utilities/parsers/SymbolParser');
const LoggerFactory = require('./../logging/LoggerFactory');
const version = require('./../meta').version;
module.exports = (() => {
  'use strict';

  let instanceCounter = 0;
  function MarketStateInternal(handleProfileRequest, instance) {
    const _logger = LoggerFactory.getLogger('@barchart/marketdata-api-js');
    const _instance = instance;
    let _timezone = timezone.guessTimezone() || null;
    let _offset;
    if (_timezone !== null) {
      _offset = Timezones.parse(_timezone).getUtcOffset(null, true);
    } else {
      _offset = null;
    }
    _logger.log(`MarketState [ ${_instance} ]: Initializing. Version [ ${version} ]. Using timezone [ ${_timezone} ].`);
    const _exchanges = {};
    const _book = {};
    const _quote = {};
    const _cvol = {};
    const _profileCallbacks = {};
    const _profileExtensions = {};
    const _quoteExtensions = {};
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
    const _processQuoteExtension = (quote, extension) => {
      const hilo = extension.hilo;
      if (hilo) {
        if (is.number(hilo.highPrice)) {
          quote.recordHighPrice = Math.max(hilo.highPrice, is.number(quote.highPrice) ? quote.highPrice : Number.MIN_SAFE_INTEGER);
        }
        if (is.number(hilo.lowPrice)) {
          quote.recordLowPrice = Math.min(hilo.lowPrice, is.number(quote.lowPrice) ? quote.lowPrice : Number.MAX_SAFE_INTEGER);
        }
      }
      const cmdtyStats = extension.cmdtyStats;
      if (cmdtyStats) {
        if (cmdtyStats.currentDate) {
          quote.currentDate = cmdtyStats.currentDate;
        }
        if (cmdtyStats.previousDate) {
          quote.previousDate = cmdtyStats.previousDate;
        }
      }
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
          const extension = _quoteExtensions[symbol];
          if (extension) {
            _processQuoteExtension(quote, extension);
            delete _quoteExtensions[symbol];
          }
        }
        _quote[symbol] = quote;
      }
      return quote;
    };
    const _getUtcTimestamp = (symbol, timestamp) => {
      let utc;
      if (_offset !== null) {
        const profile = Profile.Profiles[symbol];
        if (profile && profile.exchangeRef && is.number(profile.exchangeRef.offsetDdf)) {
          const offsetLocal = _offset;
          const offsetDdf = profile.exchangeRef.offsetDdf;
          utc = new Date(timestamp.getTime() + offsetLocal - offsetDdf);
        }
      } else {
        utc = null;
      }
      return utc;
    };
    const _processProfileExtension = (profile, extension) => {
      if (extension.expiration) {
        profile.expiration = extension.expiration;
      }
      if (extension.firstNotice) {
        profile.firstNotice = extension.firstNotice;
      }
      if (extension.c3) {
        profile.c3 = extension.c3;
      }
      if (extension.cmdtyStats) {
        profile.cmdtyStats = extension.cmdtyStats;
      }
      if (extension.grainBid) {
        profile.grainBid = extension.grainBid;
      }
      if (extension.option) {
        profile.option = extension.option;
      }
    };
    const _createProfile = (symbol, name, exchange, unitCode, pointValue, tickIncrement, additional) => {
      const profile = new Profile(symbol, name, exchange, unitCode, pointValue, tickIncrement, _exchanges[exchange] || null, additional);
      const extension = _profileExtensions[symbol];
      if (extension) {
        _processProfileExtension(profile, extension);
        delete _profileExtensions[symbol];
      }
      if (_profileCallbacks.hasOwnProperty(symbol)) {
        _profileCallbacks[symbol].forEach(profileCallback => {
          profileCallback(profile);
        });
        delete _profileCallbacks[symbol];
      }
      return profile;
    };
    const _getOrCreateProfile = symbol => {
      let profile = Profile.Profiles[symbol];
      if (!profile) {
        const producerSymbol = SymbolParser.getProducerSymbol(symbol);
        const producerProfile = Profile.Profiles[producerSymbol];
        if (producerProfile) {
          profile = _createProfile(symbol, producerProfile.name, producerProfile.exchange, producerProfile.unitCode, producerProfile.pointValue, producerProfile.tickIncrement);
          const extension = {};
          if (producerProfile.expiration) {
            extension.expiration = producerProfile.expiration;
          }
          if (producerProfile.firstNotice) {
            extension.firstNotice = producerProfile.firstNotice;
          }
          _processProfileExtension(profile, extension);
        }
      }
      return profile;
    };
    const _deriveRecordHighPrice = quote => {
      if (is.number(quote.highPrice) && is.number(quote.recordHighPrice) && quote.highPrice > quote.recordHighPrice) {
        quote.recordHighPrice = quote.highPrice;
      }
    };
    const _deriveRecordLowPrice = quote => {
      if (is.number(quote.lowPrice) && is.number(quote.recordLowPrice) && quote.lowPrice < quote.recordLowPrice) {
        quote.recordLowPrice = quote.lowPrice;
      }
    };
    const _derivePriceChange = quote => {
      let currentPrice = quote.lastPrice || null;
      let comparePrice = quote.previousPrice || null;
      if (quote.flag === 'p' && quote.days.length > 0) {
        const previousDay = quote.days[0];
        currentPrice = currentPrice || previousDay.lastPrice;
        comparePrice = previousDay.previousPrice || comparePrice;
      }
      let priceChange = null;
      let priceChangePercent = null;
      if (is.number(currentPrice) && is.number(comparePrice)) {
        priceChange = currentPrice - comparePrice;
        if (comparePrice !== 0) {
          priceChangePercent = priceChange / Math.abs(comparePrice);
        }
      }
      quote.priceChange = priceChange;
      quote.priceChangePercent = priceChangePercent;
    };
    const _derivePreviousPriceChange = quote => {
      if (quote.days.length < 1) {
        return;
      }
      const previousPrice = quote.days[0].lastPrice;
      const previousPreviousPrice = quote.days[0].previousPrice;
      let previousPriceChange = null;
      let previousPriceChangePercent = null;
      if (is.number(previousPrice) && is.number(previousPreviousPrice)) {
        previousPriceChange = previousPrice - previousPreviousPrice;
        if (previousPreviousPrice !== 0) {
          previousPriceChangePercent = previousPriceChange / Math.abs(previousPreviousPrice);
        }
      }
      quote.previousPriceChange = previousPriceChange;
      quote.previousPriceChangePercent = previousPriceChangePercent;
    };
    const _processMessage = (message, options) => {
      const symbol = message.symbol;
      if (message.type === 'TIMESTAMP') {
        _timestamp = message.timestamp;
        return;
      }
      if (message.type === 'BOOK') {
        const b = _getOrCreateBook(symbol);
        b.asks = message.asks;
        b.bids = message.bids;
        return;
      }
      if (message.type === 'REFRESH_CUMULATIVE_VOLUME') {
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
      if (message.type === 'PROFILE_EXTENSION') {
        if (p) {
          _processProfileExtension(p, message);
        } else {
          _profileExtensions[symbol] = message;
        }
        return;
      }
      if (message.type === 'QUOTE_EXTENSION') {
        const q = _quote[symbol];
        if (p && q) {
          _processQuoteExtension(q, message);
        } else {
          _quoteExtensions[symbol] = message;
        }
        return;
      }
      if (!p && message.type !== 'REFRESH_QUOTE') {
        _logger.warn(`MarketState [ ${_instance} ]: No profile found for [ ${symbol} ]`);
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
          q.message = message;

          // Roll the quote

          q.days.unshift({
            day: q.day,
            previousPrice: q.previousPrice,
            lastPrice: q.lastPrice
          });
          while (q.days.length > 3) {
            q.days.pop();
          }
          q.day = message.day;
          q.dayNum = dayNum;
          q.flag = 'p';
          q.bidPrice = 0.0;
          q.bidSize = undefined;
          q.askPrice = undefined;
          q.askSize = undefined;
          if (q.settlementPrice) {
            q.previousPrice = q.settlementPrice;
            q.previousSettlementPrice = q.settlementPrice;
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
          q.settlementPrice = undefined;
          _derivePriceChange(q);
          _derivePreviousPriceChange(q);
        } else if (q.dayNum > dayNum) {
          return;
        }
      } else {
        return;
      }
      const cv = _cvol[symbol];
      switch (message.type) {
        case 'HIGH':
          q.message = message;
          q.highPrice = message.value;
          _deriveRecordHighPrice(q);
          break;
        case 'LOW':
          q.message = message;
          q.lowPrice = message.value;
          _deriveRecordLowPrice(q);
          break;
        case 'OPEN':
          q.message = message;
          q.flag = undefined;
          q.openPrice = message.value;
          q.highPrice = message.value;
          q.lowPrice = message.value;
          q.lastPrice = message.value;
          _derivePriceChange(q);
          _deriveRecordHighPrice(q);
          _deriveRecordLowPrice(q);
          if (cv && cv.container) {
            cv.container.reset();
          }
          break;
        case 'OHLC':
          q.message = message;
          q.flag = undefined;
          if (is.number(message.openPrice)) {
            q.openPrice = message.openPrice;
          }
          if (is.number(message.highPrice)) {
            q.highPrice = message.highPrice;
          }
          if (is.number(message.lowPrice)) {
            q.lowPrice = message.lowPrice;
          }
          if (is.number(message.lastPrice)) {
            q.lastPrice = message.lastPrice;
          }
          if (is.number(message.volume)) {
            q.volume = message.volume;
          }
          _derivePriceChange(q);
          _deriveRecordHighPrice(q);
          _deriveRecordLowPrice(q);
          break;
        case 'OPEN_INTEREST':
          q.message = message;
          q.openInterest = message.value;
          break;
        case 'REFRESH_DDF':
          switch (message.subrecord) {
            case '1':
            case '2':
            case '3':
              q.message = message;
              q.refresh = message;
              if (message.openPrice === null) {
                q.openPrice = undefined;
              } else if (message.openPrice) {
                q.openPrice = message.openPrice;
              }
              if (message.highPrice === null) {
                q.highPrice = undefined;
              } else if (message.highPrice) {
                q.highPrice = message.highPrice;
                _deriveRecordHighPrice(q);
              }
              if (message.lowPrice === null) {
                q.lowPrice = undefined;
              } else if (message.lowPrice) {
                q.lowPrice = message.lowPrice;
                _deriveRecordLowPrice(q);
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
                if (q.flag === 's') {
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
              if (message.subrecord === '1') {
                if (message.time) {
                  q.lastUpdate = message.time;
                  q.lastUpdateUtc = _getUtcTimestamp(symbol, message.time);
                }
              }
              _derivePriceChange(q);
              break;
          }
          break;
        case 'REFRESH_QUOTE':
          if (!p) {
            p = _createProfile(symbol, message.name, message.exchange, message.unitcode, message.pointValue, message.tickIncrement, message.additional || null);
          }
          if (!q.profile) {
            q.profile = p;
          }
          q.message = message;
          q.refresh = message;
          q.flag = message.flag;
          q.mode = message.mode;
          if (message.lastUpdate) {
            q.lastUpdate = message.lastUpdate;
            q.lastUpdateUtc = _getUtcTimestamp(symbol, message.lastUpdate);
          }
          q.bidPrice = message.bidPrice;
          q.bidSize = message.bidSize;
          q.askPrice = message.askPrice;
          q.askSize = message.askSize;
          q.lastPrice = message.lastPrice;
          q.tradeSize = message.tradeSize;
          q.numberOfTrades = message.numberOfTrades;
          q.previousPrice = message.previousPrice;
          q.settlementPrice = message.settlementPrice;
          if (message.previousSettlementPrice) {
            q.previousSettlementPrice = message.previousSettlementPrice;
          }
          q.openPrice = message.openPrice;
          q.highPrice = message.highPrice;
          q.lowPrice = message.lowPrice;
          if (is.string(message.previousDay) && is.number(message.previousPreviousPrice) && is.number(message.previousLastPrice)) {
            q.days.unshift({
              day: message.previousDay,
              previousPrice: message.previousPreviousPrice,
              lastPrice: message.previousLastPrice
            });
          }
          _derivePriceChange(q);
          _derivePreviousPriceChange(q);
          _deriveRecordHighPrice(q);
          _deriveRecordLowPrice(q);
          q.volume = message.volume;
          q.openInterest = message.openInterest;
          if (message.tradeTime) {
            q.time = message.tradeTime;
            q.timeUtc = _getUtcTimestamp(symbol, message.tradeTime);
          } else if (message.timeStamp) {
            q.time = message.timeStamp;
            q.timeUtc = _getUtcTimestamp(symbol, message.timeStamp);
          }
          if (message.blockTrade) q.blockTrade = message.blockTrade;
          break;
        case 'SETTLEMENT':
          q.message = message;
          q.lastPrice = message.value;
          q.settlement = message.value;
          if (message.element === 'D') {
            q.flag = 's';
          }
          _derivePriceChange(q);
          break;
        case 'TOB':
          q.message = message;
          q.bidPrice = message.bidPrice;
          q.bidSize = message.bidSize;
          q.askPrice = message.askPrice;
          q.askSize = message.askSize;
          if (message.time) {
            q.time = message.time;
            q.timeUtc = _getUtcTimestamp(symbol, message.time);
          }
          break;
        case 'TRADE':
          q.message = message;
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
            q.timeUtc = _getUtcTimestamp(symbol, message.time);
          }
          _derivePriceChange(q);
          if (cv && cv.container && message.tradePrice && message.tradeSize) {
            cv.container.incrementVolume(message.tradePrice, message.tradeSize);
          }
          break;
        case 'TRADE_OUT_OF_SEQUENCE':
          q.message = message;
          if (message.tradeSize) {
            q.volume += message.tradeSize;
          }
          if (message.session === 'Z') q.blockTrade = message.tradePrice;
          if (cv && cv.container && message.tradePrice && message.tradeSize) {
            cv.container.incrementVolume(message.tradePrice, message.tradeSize);
          }
          break;
        case 'VOLUME':
          q.message = message;
          q.volume = message.value;
          break;
        case 'VOLUME_YESTERDAY':
          break;
        case 'VWAP':
          q.message = message;
          q.vwap1 = message.value;
          break;
        default:
          _logger.error(`MarketState [ ${_instance} ]: Unhandled Market Message`);
          _logger.error(message);
          break;
      }
    };
    const _processExchangeMetadata = (id, description, timezoneDdf, timezoneExchange) => {
      if (_exchanges.hasOwnProperty(id)) {
        return;
      }
      const exchange = new Exchange(id, description, timezoneDdf, timezoneExchange);
      if (exchange.timezoneDdf === null || exchange.timezoneExchange === null) {
        _logger.warn(`MarketState [ ${_instance} ]: Timezones data for [ ${id} ] is incomplete; DDF timezone is [ ${exchange.timezoneDdf ? exchange.timezoneDdf : '--'} ], exchange timezone is [ ${exchange.timezoneExchange ? exchange.timezoneExchange : '--'} ]`);
      }
      const profiles = Profile.Profiles;
      const symbols = object.keys(profiles);
      symbols.forEach(symbol => {
        const profile = profiles[symbol];
        if (profile.exchange === id) {
          profile.exchangeRef = exchange;
        }
      });
      _exchanges[id] = exchange;
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
        if (is.fn(callback)) {
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
          if (handleProfileRequest && is.fn(handleProfileRequest)) {
            handleProfileRequest(symbol);
          }
        });
      }
      return promise.then(p => {
        if (is.fn(callback)) {
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
      processMessage: _processMessage,
      processExchangeMetadata: _processExchangeMetadata
    };
  }

  /**
   * Repository for current market state. This repository will only contain
   * data for an symbol after a subscription has been established using
   * the {@link Connection#on} function.
   *
   * Access the singleton instance using the {@link Connection#getMarketState}
   * function.
   *
   * @public
   * @exported
   */
  class MarketState {
    constructor(handleProfileRequest) {
      this._internal = MarketStateInternal(handleProfileRequest, ++instanceCounter);
    }

    /**
     * Returns a promise for the {@link Profile} instance matching the symbol provided.
     *
     * @public
     * @param {string} symbol
     * @param {function=} callback - Invoked when the {@link Profile} instance becomes available
     * @returns {Promise<Profile|null>}
     */
    getProfile(symbol, callback) {
      return this._internal.getProfile(symbol, callback);
    }

    /**
     * Synchronously returns the {@link Quote} instance for a symbol. If no **MarketUpdate**
     * subscription has been established for the symbol, an undefined value will be returned
     * (see {@link Enums.SubscriptionType}).
     *
     * @public
     * @param {string} symbol
     * @returns {Quote|undefined}
     */
    getQuote(symbol) {
      return this._internal.getQuote(symbol);
    }

    /**
     * Synchronously returns a {@link Book} object for a symbol. If no **MarketDepth**
     * subscription has been established for the symbol, an undefined value will be returned
     * (see {@link Enums.SubscriptionType}).
     *
     * @public
     * @param {string} symbol
     * @returns {Schema.Book|undefined}
     */
    getBook(symbol) {
      return this._internal.getBook(symbol);
    }

    /**
     * Returns a promise for the {@link CumulativeVolume} instance matching the symbol
     * provided. The promise will not be fulfilled until a **CumulativeVolume** subscription
     * has been established (see {@link Enums.SubscriptionType}).
     *
     * @public
     * @param {string} symbol
     * @param {function=} callback - Invoked when the {@link CumulativeVolume} instance becomes available
     * @returns {Promise<CumulativeVolume>} The {@link CumulativeVolume} instance, as a promise
     */
    getCumulativeVolume(symbol, callback) {
      return this._internal.getCumulativeVolume(symbol, callback);
    }

    /**
     * Returns the time of the most recent server heartbeat.
     *
     * @public
     * @returns {Date}
     */
    getTimestamp() {
      return this._internal.getTimestamp();
    }

    /**
     * @ignore
     */
    processMessage(message, options) {
      return this._internal.processMessage(message, options);
    }

    /**
     * @ignore
     */
    processExchangeMetadata(id, description, timezoneDdf, timezoneExchange) {
      return this._internal.processExchangeMetadata(id, description, timezoneDdf, timezoneExchange);
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

},{"../utilities/parsers/SymbolParser":39,"./../logging/LoggerFactory":13,"./../meta":20,"./../utilities/convert/dayCodeToNumber":23,"./CumulativeVolume":15,"./Exchange":16,"./Profile":18,"./Quote":19,"@barchart/common-js/lang/Timezones":44,"@barchart/common-js/lang/is":47,"@barchart/common-js/lang/object":48,"@barchart/common-js/lang/timezone":50}],18:[function(require,module,exports){
const SymbolParser = require('./../utilities/parsers/SymbolParser'),
  buildPriceFormatter = require('../utilities/format/factories/price');
const AssetClass = require('./../utilities/data/AssetClass');
const cmdtyViewPriceFormatter = require('./../utilities/format/specialized/cmdtyView');
module.exports = (() => {
  'use strict';

  let profiles = {};
  let formatter = cmdtyViewPriceFormatter;

  /**
   * Describes an instrument (associated with a unique symbol).
   *
   * @public
   * @exported
   */
  class Profile {
    constructor(symbol, name, exchangeId, unitCode, pointValue, tickIncrement, exchange, additional) {
      /**
       * @property {string} symbol - Symbol of the instrument.
       * @public
       * @readonly
       */
      this.symbol = symbol;

      /**
       * @property {string} name - Name of the instrument.
       * @public
       * @readonly
       */
      this.name = name;

      /**
       * @property {string} exchange - Code for the listing exchange.
       * @public
       * @readonly
       */
      this.exchange = exchangeId;

      /**
       * @property {Exchange|null} exchangeRef - The {@link Exchange}.
       * @public
       * @readonly
       */
      this.exchangeRef = exchange || null;

      /**
       * @property {string} unitCode - Code indicating how a prices should be formatted.
       * @public
       * @readonly
       */
      this.unitCode = unitCode;

      /**
       * @property {string} pointValue - The change in value for a one point change in price.
       * @public
       * @readonly
       */
      this.pointValue = pointValue;

      /**
       * @property {number} tickIncrement - The minimum price movement.
       * @public
       * @readonly
       */
      this.tickIncrement = tickIncrement;
      const info = SymbolParser.parseInstrumentType(this.symbol);
      const future = info !== null && info.asset === AssetClass.FUTURE;
      const option = info !== null && info.asset === AssetClass.FUTURE_OPTION;
      if (future || option) {
        /**
         * @property {string|undefined} root - Root symbol (futures and futures options only).
         * @public
         * @readonly
         */
        this.root = info.root;
        if (future) {
          /**
           * @property {string|undefined} month - Month code (futures only).
           * @public
           * @readonly
           */
          this.month = info.month;

          /**
           * @property {number|undefined} year - Expiration year (futures only).
           * @public
           * @readonly
           */
          this.year = info.year;

          /**
           * @property {string|undefined} expiration - Expiration date, formatted as YYYY-MM-DD (futures only).
           * @public
           * @readonly
           */
          this.expiration = null;

          /**
           * @property {string|undefined} firstNotice - First notice date, formatted as YYYY-MM-DD (futures only).
           * @public
           * @readonly
           */
          this.firstNotice = null;
        }
      }

      /**
       * @property {AssetClass|null} asset - The instrument type. This will only be present when inference based on the instrument symbol is possible.
       * @public
       * @readonly
       */
      this.asset = null;
      if (info && info.asset) {
        this.asset = info.asset;
      }
      if (typeof additional === 'object' && additional !== null) {
        for (let p in additional) {
          this[p] = additional[p];
        }
      }
      profiles[symbol] = this;
    }

    /**
     * Given a price, returns the human-readable representation.
     *
     * @public
     * @param {number} price
     * @returns {string}
     */
    formatPrice(price) {
      return formatter(price, this.unitCode, this);
    }

    /**
     * Configures the logic used to format all prices using the {@link Profile#formatPrice} instance function.
     * Alternately, the {@link Profile.setPriceFormatterCustom} function can be used for complete control over
     * price formatting.
     *
     * @public
     * @static
     * @param {string} fractionSeparator - usually a dash or a period
     * @param {boolean} specialFractions - usually true
     * @param {string=} thousandsSeparator - usually a comma
     */
    static setPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator) {
      formatter = buildPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator);
    }

    /**
     * An alternative to {@link Profile.setPriceFormatter} which allows the consumer to specify
     * a function to format prices. Use of this function overrides the rules set using the
     * {link Profile.setPriceFormatter} function.
     *
     * @public
     * @static
     * @param {Callbacks.CustomPriceFormatterCallback} fn - The function to use for price formatting (which replaces the default logic).
     */
    static setPriceFormatterCustom(fn) {
      formatter = fn;
    }

    /**
     * Alias for the {@link Profile.setPriceFormatter} function.
     *
     * @public
     * @static
     * @ignore
     * @deprecated
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
      return `[Profile (symbol=${this.symbol})]`;
    }
  }
  return Profile;
})();

},{"../utilities/format/factories/price":30,"./../utilities/data/AssetClass":25,"./../utilities/format/specialized/cmdtyView":34,"./../utilities/parsers/SymbolParser":39}],19:[function(require,module,exports){
module.exports = (() => {
  'use strict';

  /**
   * Current market conditions for an instrument, mutates as **MarketUpdate**
   * subscription updates are processed (see {@link Enums.SubscriptionType}).
   *
   * @public
   * @exported
   */
  class Quote {
    constructor(symbol) {
      /**
       * @property {string} symbol - Symbol of the quoted instrument.
       * @public
       * @readonly
       */
      this.symbol = symbol || null;

      /**
       * @property {Profile|null} profile - Metadata regarding the quoted instrument.
       * @public
       * @readonly
       */
      this.profile = null;

      /**
       * @property {string} refresh - Most recent DDF refresh message which caused this instance to mutate.
       * @public
       * @readonly
       */
      this.refresh = null;

      /**
       * @property {string} message - Most recent DDF message which caused this instance to mutate.
       * @public
       * @readonly
       */
      this.message = null;

      /**
       * @property {string|undefined} flag - Market status, will have one of three values: "p", "s", or undefined.
       * @public
       * @readonly
       */
      this.flag = null;

      /**
       * @property {string} mode - One of two values, "I" or "R" -- indicating delayed or realtime data, respectively.
       * @public
       * @readonly
       */
      this.mode = null;

      /**
       * @property {string} day - One character code indicating the day of the month of the current trading session.
       * @public
       * @readonly
       */
      this.day = null;

      /**
       * @property {number} dayNum - Day of the month of the current trading session.
       * @public
       * @readonly
       */
      this.dayNum = 0;

      /**
       * @property {string|null} session
       * @public
       * @readonly
       */
      this.session = null;

      /**
       * @property {Date|null} lastUpdate - The most recent refresh date. Caution should be used. This date was created from hours, minutes, and seconds without regard for the client computer's timezone. As such, it is only safe to read time-related values (e.g. ```Date.getHours```, ```Date.getMinutes```, etc). Do not attempt to compare. Do not attempt to convert.
       * @public
       * @readonly
       */
      this.lastUpdate = null;

      /**
       * @property {Date|null} lastUpdateUtc - A timezone-aware version of {@link Quote#lastUpdate}. This property will only have a value when both (a) the exchange timezone is known; and (b) the client computer's timezone is known.
       * @public
       * @readonly
       */
      this.lastUpdateUtc = null;

      /**
       * @property {number} bidPrice - The top-of-book price on the buy side.
       * @public
       * @readonly
       */
      this.bidPrice = null;

      /**
       * @property {number} bidSize - The top-of-book quantity on the buy side.
       * @public
       * @readonly
       */
      this.bidSize = null;

      /**
       * @property {number} askPrice - The top-of-book price on the sell side.
       * @public
       * @readonly
       */
      this.askPrice = null;

      /**
       * @property {number} askSize - The top-of-book quantity on the sell side.
       * @public
       * @readonly
       */
      this.askSize = null;

      /**
       * @property {number} lastPrice - Most recent price (not necessarily a trade).
       * @public
       * @readonly
       */
      this.lastPrice = null;

      /**
       * @property {number} tradePrice - Most recent trade price.
       * @public
       * @readonly
       */
      this.tradePrice = null;

      /**
       * @property {number} tradeSize - Most recent trade quantity.
       * @public
       * @readonly
       */
      this.tradeSize = null;
      this.numberOfTrades = null;
      this.vwap1 = null; // Exchange Provided
      this.vwap2 = null; // Calculated

      /**
       * @property {number} blockTrade - Most recent block trade price.
       * @public
       * @readonly
       */
      this.blockTrade = null;

      /**
       * @property {number} settlementPrice - Settlement price for current trading session.
       * @public
       * @readonly
       */
      this.settlementPrice = null;

      /**
       * @property {number} previousSettlementPrice - Settlement price from previous trading session.
       * @public
       * @readonly
       */
      this.previousSettlementPrice = null;

      /**
       * @property {number|null} openPrice - The opening price for the current trading session.
       * @public
       * @readonly
       */
      this.openPrice = null;

      /**
       * @property {number|null} highPrice - The highest trade price from the current trading session.
       * @public
       * @readonly
       */
      this.highPrice = null;

      /**
       * @property {number|null} lowPrice - The lowest trade price from the current trading session.
       * @public
       * @readonly
       */
      this.lowPrice = null;

      /**
       * @property {number|null} recordHighPrice - The all-time highest trade price from current or previous trading sessions.
       * @public
       * @readonly
       */
      this.recordHighPrice = null;

      /**
       * @property {number|null} recordLowPrice - The all-time lowest trade price from current or previous trading sessions.
       * @public
       * @readonly
       */
      this.recordLowPrice = null;

      /**
       * @property {number|null} volume - The quantity traded during the current trading session.
       * @public
       * @readonly
       */
      this.volume = null;

      /**
       * @property {number|null} openInterest - The outstanding number of active contracts. For some asset classes, this property is not relevant.
       * @public
       * @readonly
       */
      this.openInterest = null;

      /**
       * @property {number} previousPrice - The last price from the previous trading session.
       * @public
       * @readonly
       */
      this.previousPrice = null;

      /**
       * @property {Date|null} time - The most recent trade, quote, or refresh time. Caution should be used. This date was created from hours, minutes, and seconds without regard for the client computer's timezone. As such, it is only safe to read time-related values (e.g. ```Date.getHours```, ```Date.getMinutes```, etc). Do not attempt to compare. Do not attempt to convert.
       * @public
       * @readonly
       */
      this.time = null;

      /**
       * @property {Date|null} timeUtc - A timezone-aware version of {@link Quote#time}. This property will only have a value when both (a) the exchange timezone is known; and (b) the client computer's timezone is known.
       * @public
       * @readonly
       */
      this.timeUtc = null;

      /**
       * @property {Number|null}
       * @public
       * @readonly
       */
      this.priceChange = null;

      /**
       * @property {Number|null}
       * @public
       * @readonly
       */
      this.priceChangePercent = null;

      /**
       * @property {Number|null}
       * @public
       * @readonly
       */
      this.previousPriceChange = null;

      /**
       * @property {Number|null}
       * @public
       * @readonly
       */
      this.previousPriceChangePercent = null;
      this.days = [];
      this.ticks = [];
    }
    static clone(symbol, source) {
      const clone = Object.assign({}, source);
      clone.symbol = symbol;
      return clone;
    }
    toString() {
      return `[Quote (symbol=${this.symbol})]`;
    }
  }
  return Quote;
})();

},{}],20:[function(require,module,exports){
module.exports = (() => {
  'use strict';

  return {
    version: '5.27.1'
  };
})();

},{}],21:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');
const UnitCode = require('./../data/UnitCode');
module.exports = (() => {
  'use strict';

  /**
   * Converts a Barchart "base" code into a Barchart "unit" code. If the "base"
   * code provided is invalid, the character '0' will be returned -- which is
   * not a valid unit code.
   *
   * @function
   * @memberOf Functions
   * @ignore
   * @param {Number} baseCode
   * @returns {String}
   */
  function convertBaseCodeToUnitCode(baseCode) {
    if (!is.number(baseCode)) {
      return '0';
    }
    const unitCodeItem = UnitCode.fromBaseCode(baseCode);
    return unitCodeItem === null ? '0' : unitCodeItem.unitCode;
  }
  return convertBaseCodeToUnitCode;
})();

},{"./../data/UnitCode":26,"@barchart/common-js/lang/is":47}],22:[function(require,module,exports){
const convertNumberToDayCode = require('./numberToDayCode');
module.exports = (() => {
  'use strict';

  /**
   * Extracts the day of the month from a {@link Date} instance
   * and returns the day code for the day of the month.
   *
   * @function
   * @memberOf Functions
   * @ignore
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

},{"./numberToDayCode":24}],23:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');
module.exports = (() => {
  'use strict';

  /**
   * Converts a day code (e.g. "A" ) to a day number (e.g. 11).
   *
   * @function
   * @memberOf Functions
   * @ignore
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

},{"@barchart/common-js/lang/is":47}],24:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');
module.exports = (() => {
  'use strict';

  const ASCII_ONE = '1'.charCodeAt(0);
  const ASCII_A = 'A'.charCodeAt(0);

  /**
   * Converts a day number to a single character day code (e.g. 1 is
   * converted to "1", and 10 is converted to "0", and 11 is converted
   * to "A").
   *
   * @function
   * @memberOf Functions
   * @ignore
   * @param {Number} d
   * @returns {String}
   */
  function convertNumberToDayCode(d) {
    if (!is.integer(d)) {
      return null;
    }
    if (d >= 1 && d <= 9) {
      return String.fromCharCode(ASCII_ONE + d - 1);
    } else if (d === 10) {
      return '0';
    } else {
      return String.fromCharCode(ASCII_A + d - 11);
    }
  }
  return convertNumberToDayCode;
})();

},{"@barchart/common-js/lang/is":47}],25:[function(require,module,exports){
const Enum = require('@barchart/common-js/lang/Enum');
module.exports = (() => {
  'use strict';

  /**
   * An enumeration for instrument types (e.g. stock, future, etc).
   *
   * @public
   * @exported
   * @extends {Enum}
   * @param {String} code
   * @param {String} description
   * @param {Number} id
   */
  class AssetClass extends Enum {
    constructor(code, description, id) {
      super(code, description);
      this._id = id;
    }

    /**
     * A unique numeric identifier assigned by Barchart.
     *
     * @public
     * @returns {Number}
     */
    get id() {
      return this._id;
    }
    toJSON() {
      return this._id;
    }

    /**
     * Converts the string-based identifier into an enumeration item.
     *
     * @public
     * @static
     * @param {String} code
     * @returns {AssetClass|null}
     */
    static parse(code) {
      return Enum.fromCode(AssetClass, code);
    }

    /**
     * Converts the numeric identifier into an enumeration item.
     *
     * @public
     * @static
     * @param {Number} id
     * @returns {AssetClass|null}
     */
    static fromId(id) {
      return Enum.getItems(AssetClass).find(x => x.id === id) || null;
    }

    /**
     * A stock.
     *
     * @public
     * @static
     * @returns {AssetClass}
     */
    static get STOCK() {
      return STOCK;
    }

    /**
     * A stock option.
     *
     * @public
     * @static
     * @returns {AssetClass}
     */
    static get STOCK_OPTION() {
      return STOCK_OPTION;
    }

    /**
     * A future.
     *
     * @public
     * @static
     * @returns {AssetClass}
     */
    static get FUTURE() {
      return FUTURE;
    }

    /**
     * A future option.
     *
     * @public
     * @static
     * @returns {AssetClass}
     */
    static get FUTURE_OPTION() {
      return FUTURE_OPTION;
    }

    /**
     * A foreign exchange instrument.
     *
     * @public
     * @static
     * @returns {AssetClass}
     */
    static get FOREX() {
      return FOREX;
    }

    /**
     * A cmdtyStats instrument.
     *
     * @public
     * @static
     * @returns {AssetClass}
     */
    static get CMDTY_STATS() {
      return CMDTY_STATS;
    }
    toString() {
      return `[AssetClass (id=${this.id}, code=${this.code})]`;
    }
  }
  const STOCK = new AssetClass('STK', 'U.S. Equity', 1);
  const STOCK_OPTION = new AssetClass('STKOPT', 'Equity Option', 34);
  const FUTURE = new AssetClass('FUT', 'Future', 2);
  const FUTURE_OPTION = new AssetClass('FUTOPT', 'Future Option', 12);
  const FOREX = new AssetClass('FOREX', 'FOREX', 10);
  const CMDTY_STATS = new AssetClass('CMDTY', 'cmdtyStats', 24);
  return AssetClass;
})();

},{"@barchart/common-js/lang/Enum":43}],26:[function(require,module,exports){
const Enum = require('@barchart/common-js/lang/Enum');
module.exports = (() => {
  'use strict';

  // 2021/07/14, For a more detailed on the "special" fractional formatting (i.e. CME
  // tick notation), please refer to the detailed unit test suite written for CME
  // notation (see the cmeSpec.js file).

  /**
   * An enumeration that describes different conventions for formatting prices,
   * as decimals or fractions (using tick notation). Each instrument is assigned
   * a unit code. See the {@link Profile.unitCode} property.
   *
   * Barchart uses fourteen distinct unit codes.
   *
   * @public
   * @exported
   * @extends {Enum}
   * @param {String} code
   * @param {Number} baseCode
   * @param {Number} decimalDigits - When formatting a price as a decimal value, the number of decimal places to display.
   * @param {Boolean} supportsFractions - As an alternative to decimal-formatted prices, some instruments support fractional representations.
   * @param {Number=} fractionFactor - The count of discrete prices which a unit can be divided into (e.g. a US dollar can be divided into 100 cents). By default, this is also the implied denominator in fractional notation (e.g. 3.6875 equals 3 and 22/32 — which is represented in fractional notation as "3-22", where the denominator of 32 is implied).
   * @param {Number} fractionDigits - The number of digits of the fraction's numerator to display (e.g. using two digits, the fraction 22/32 is shown as "0-22"; using three digits, the fraction 22.375/32 is shown as "0-223").
   * @param {Number=} fractionFactorSpecial - Special fraction factors refer to the CME tick notation scheme (read more [here](https://www.cmegroup.com/confluence/display/EPICSANDBOX/Fractional+Pricing+-+Tick+and+Decimal+Conversions)). For example, the CME notation for 0.51171875 (in 1/8ths of 1/32nds) is "0-163", where the numerator of "163" means 16 thirty-seconds and 3 eighths of a thirty-second, where the actual fraction is 16.3[75] / 32, which equals 0.51171875.
   * @param {Number=} fractionDigitsSpecial - The number of digits of the fraction's numerator to display, when formatting in CME tick notation. For example, the notation "0-163" (in 1/8ths of 1/32nds) equates to the fraction of 16.375/32. This notation is limited to three digits (163) and omits the trailing two digits (75).
   */
  class UnitCode extends Enum {
    constructor(code, baseCode, decimalDigits, supportsFractions, fractionFactor, fractionDigits, fractionFactorSpecial, fractionDigitsSpecial) {
      super(code, code);
      this._baseCode = baseCode;
      this._decimalDigits = decimalDigits;
      this._supportsFractions = supportsFractions;
      if (supportsFractions) {
        this._fractionFactor = fractionFactor;
        this._fractionDigits = fractionDigits;
        this._fractionFactorSpecial = fractionFactorSpecial || fractionFactor;
        this._fractionDigitsSpecial = fractionDigitsSpecial || fractionDigits;
      } else {
        this._fractionFactor = undefined;
        this._fractionDigits = undefined;
        this._fractionFactorSpecial = undefined;
        this._fractionDigitsSpecial = undefined;
      }
    }

    /**
     * The numeric counterpart of a "unit" code.
     *
     * @public
     * @returns {Number}
     */
    get baseCode() {
      return this._baseCode;
    }

    /**
     * The single character "unit" code.
     *
     * @public
     * @returns {String}
     */
    get unitCode() {
      return this._code;
    }

    /**
     * When formatting in decimal mode, the number of digits to show after the
     * decimal point.
     *
     * @public
     * @returns {Number}
     */
    get decimalDigits() {
      return this._decimalDigits;
    }

    /**
     * Indicates if formatting can use the alternative to decimal notation -- that
     * is, fractional notation.
     *
     * @public
     * @returns {Boolean}
     */
    get supportsFractions() {
      return this._supportsFractions;
    }

    /**
     * The count of discrete prices which a unit can be divided into (e.g. a US dollar can be divided
     * into 100 cents). By default, this is also the implied denominator in fractional notation (e.g. 3.6875
     * equals 3 and 22/32 — which is represented in fractional notation as "3-22", where the denominator of 32
     * is implied).
     *
     * @public
     * @returns {Number|undefined}
     */
    get fractionFactor() {
      return this._fractionFactor;
    }

    /**
     * The number of digits of the fraction's numerator to display (e.g. using two digits, the fraction 22/32 is
     * shown as "0-22"; using three digits, the fraction 22.375/32 is shown as "0-223").
     *
     * @public
     * @returns {Number|undefined}
     */
    get fractionDigits() {
      return this._fractionDigits;
    }

    /**
     * Special fraction factors refer to the CME tick notation scheme (read more [here](https://www.cmegroup.com/confluence/display/EPICSANDBOX/Fractional+Pricing+-+Tick+and+Decimal+Conversions)).
     *
     * @public
     * @returns {Number|undefined}
     */
    get fractionFactorSpecial() {
      return this._fractionFactorSpecial;
    }

    /**
     * Same as {@link UnitCode#fractionDigits} for "special" fractions.
     *
     * @public
     * @returns {Number|undefined}
     */
    get fractionDigitsSpecial() {
      return this._fractionDigitsSpecial;
    }

    /**
     * The number of digits of the fraction's numerator to display, when formatting
     * in CME tick notation. For example, the notation "0-163" (in 1/8ths of 1/32nds) equates
     * to the fraction of 16.375/32. This notation is limited to three digits (163)
     * and omits the trailing two digits (75).
     *
     * @public
     * @param {Boolean=} special
     * @returns {Number|undefined}
     */
    getFractionFactor(special) {
      return special === true ? this._fractionFactorSpecial : this._fractionFactor;
    }

    /**
     * Returns the {@link UnitCode#fractionDigits} or {@link UnitCode#fractionDigitsSpecial} value.
     *
     * @public
     * @param {Boolean=} special
     * @returns {Number|undefined}
     */
    getFractionDigits(special) {
      return special === true ? this._fractionDigitsSpecial : this._fractionDigits;
    }
    toString() {
      return `[UnitCode (code=${this.code})]`;
    }

    /**
     * Converts a unit code character into a {@link UnitCode} enumeration item.
     *
     * @public
     * @static
     * @param {String} code
     * @returns {UnitCode|null}
     */
    static parse(code) {
      return Enum.fromCode(UnitCode, code);
    }

    /**
     * Converts a numeric "base" code into a {@link UnitCode} item.
     *
     * @public
     * @static
     * @param {Number} code
     * @returns {UnitCode|null}
     */
    static fromBaseCode(code) {
      return Enum.getItems(UnitCode).find(x => x.baseCode === code) || null;
    }
  }
  const TWO = new UnitCode('2', -1, 3, true, 8, 1);
  const THREE = new UnitCode('3', -2, 4, true, 16, 2);
  const FOUR = new UnitCode('4', -3, 5, true, 32, 2);
  const FIVE = new UnitCode('5', -4, 6, true, 64, 2, 320, 3);
  const SIX = new UnitCode('6', -5, 7, true, 128, 3, 320, 3);
  const SEVEN = new UnitCode('7', -6, 8, true, 256, 3, 320, 3);
  const EIGHT = new UnitCode('8', 0, 0, false);
  const NINE = new UnitCode('9', 1, 1, false);
  const A = new UnitCode('A', 2, 2, false);
  const B = new UnitCode('B', 3, 3, false);
  const C = new UnitCode('C', 4, 4, false);
  const D = new UnitCode('D', 5, 5, false);
  const E = new UnitCode('E', 6, 6, false);
  const F = new UnitCode('F', 7, 7, false);
  return UnitCode;
})();

},{"@barchart/common-js/lang/Enum":43}],27:[function(require,module,exports){
const timezone = require('@barchart/common-js/lang/timezone');
module.exports = (() => {
  'use strict';

  return {
    /**
     * Gets a list of names in the tz database (see https://en.wikipedia.org/wiki/Tz_database
     * and https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
     *
     * @public
     * @static
     * @exported
     * @returns {Array<String>}
     */
    getTimezones() {
      return timezone.getTimezones();
    },
    /**
     * Attempts to guess the local timezone.
     *
     * @public
     * @static
     * @exported
     * @returns {String|null}
     */
    guessTimezone() {
      return timezone.guessTimezone();
    }
  };
})();

},{"@barchart/common-js/lang/timezone":50}],28:[function(require,module,exports){
module.exports = (() => {
  'use strict';

  function leftPad(value) {
    return ('00' + value).substr(-2);
  }

  /**
   * Formats a {@link Date} instance as a string (using a MM/DD/YY pattern).
   *
   * @exported
   * @function
   * @memberOf Functions
   * @param {Date=} date
   * @param {Boolean=} utc
   * @returns {String}
   */
  function formatDate(date, utc) {
    if (!date) {
      return '';
    }
    if (utc) {
      return `${leftPad(date.getUTCMonth() + 1)}/${leftPad(date.getUTCDate())}/${leftPad(date.getUTCFullYear())}`;
    } else {
      return `${leftPad(date.getMonth() + 1)}/${leftPad(date.getDate())}/${leftPad(date.getFullYear())}`;
    }
  }
  return formatDate;
})();

},{}],29:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');
module.exports = (() => {
  'use strict';

  /**
   * Formats a number as decimal value (with a given number of digits after the decimal place,
   * thousands separator(s), and options for displaying negative values).
   *
   * @exported
   * @function
   * @memberOf Functions
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
    if (!is.string(thousandsSeparator) || thousandsSeparator.length > 1) {
      thousandsSeparator = '';
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

},{"@barchart/common-js/lang/is":47}],30:[function(require,module,exports){
const formatPrice = require('./../price');
module.exports = (() => {
  'use strict';

  /**
   * Returns a {@link PriceFormatterFactory~formatPrice} which uses
   * the configuration supplied to this function as parameters.
   *
   * @exported
   * @function
   * @param {String=} fractionSeparator
   * @param {Boolean=} specialFractions
   * @param {String=} thousandsSeparator
   * @param {Boolean=} useParenthesis
   * @returns {PriceFormatterFactory~formatPrice}
   */
  function buildPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator, useParenthesis) {
    return (value, unitCode, profile) => formatPrice(value, unitCode, fractionSeparator, specialFractions, thousandsSeparator, useParenthesis);
  }

  /**
   * Accepts a numeric value and a unit code, and returns a formatted price as a string.
   *
   * @public
   * @callback PriceFormatterFactory~formatPrice
   * @param {Number} value
   * @param {String} unitCode
   * @param {Profile} profile
   * @returns {String}
   */

  return buildPriceFormatter;
})();

},{"./../price":32}],31:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');
module.exports = (() => {
  'use strict';

  function getIntegerPart(value, fractionSeparator) {
    const floor = Math.floor(value);
    if (floor === 0 && fractionSeparator === '') {
      return '';
    } else {
      return floor;
    }
  }
  function getDecimalPart(absoluteValue) {
    return absoluteValue - Math.floor(absoluteValue);
  }
  function frontPad(value, digits) {
    return ['000', Math.floor(value)].join('').substr(-1 * digits);
  }

  /**
   * Formats a value using fractional tick notation.
   *
   * @exported
   * @function
   * @memberOf Functions
   * @param {Number} value - The decimal value to format as a fraction.
   * @param {Number} fractionFactor - The count of discrete prices which a unit can be divided into (e.g. a US dollar can be divided into 100 cents). By default, this is also the implied denominator in fractional notation (e.g. 3.6875 equals 3 and 22/32 — which is represented in fractional notation as "3-22" where the denominator of 32 is implied).
   * @param {Number} fractionDigits - The number of digits of the fraction's numerator to display (e.g. using two digits, the fraction 22/32 is shown as "0-22"; using three digits, the fraction 22.375/32 is shown as "0-223").
   * @param {String=} fractionSeparator - An optional character to insert between the whole and fractional part of the value.
   * @param {Boolean=} useParenthesis - If true, negative values will be wrapped in parenthesis.
   * @returns {String}
   */
  function formatFraction(value, fractionFactor, fractionDigits, fractionSeparator, useParenthesis) {
    if (!is.number(value)) {
      return '';
    }
    if (!is.number(fractionFactor)) {
      return '';
    }
    if (!is.number(fractionDigits)) {
      return '';
    }
    if (!is.string(fractionSeparator) || fractionSeparator.length > 1) {
      fractionSeparator = '.';
    }
    const absoluteValue = Math.abs(value);
    const integerPart = getIntegerPart(absoluteValue, fractionSeparator);
    const decimalPart = getDecimalPart(absoluteValue);
    const denominator = fractionFactor;
    const numerator = decimalPart * denominator;
    const roundedNumerator = Math.floor(parseFloat(numerator.toFixed(1)));
    const formattedNumerator = frontPad(roundedNumerator, fractionDigits);
    let prefix;
    let suffix;
    if (value < 0) {
      useParenthesis = is.boolean(useParenthesis) && useParenthesis;
      if (useParenthesis) {
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
    return [prefix, integerPart, fractionSeparator, formattedNumerator, suffix].join('');
  }
  return formatFraction;
})();

},{"@barchart/common-js/lang/is":47}],32:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');
const formatDecimal = require('./decimal'),
  formatFraction = require('./fraction');
const UnitCode = require('./../data/UnitCode');
module.exports = (() => {
  'use strict';

  /**
   * Converts a numeric price into a human-readable string. One of two modes
   * may be used, depending on the unit code and fraction separator. For example,
   * using unit code "2" the value 9.5432 is formatted as "9.543" in decimal
   * mode and "9-4" in fractional mode.
   *
   * @exported
   * @function
   * @memberOf Functions
   * @param {Number} value
   * @param {String} unitCode
   * @param {String=} fractionSeparator - Can be zero or one character in length. If invalid or omitted, a decimal notation is used. If non-decimal, then fractional notation is used (assuming supported by unit code).
   * @param {Boolean=} specialFractions - If fractional notation is used, indicates if the "special" factor (i.e. denominator) is used to calculate numerator.
   * @param {String=} thousandsSeparator - Can be zero or one character in length. If invalid or omitted, a zero-length string is used.
   * @param {Boolean=} useParenthesis - If true, negative values will be represented with parenthesis (instead of a leading minus sign).
   * @returns {String}
   */
  function formatPrice(value, unitCode, fractionSeparator, specialFractions, thousandsSeparator, useParenthesis) {
    if (!is.number(value)) {
      return '';
    }
    const unitCodeItem = UnitCode.parse(unitCode);
    if (unitCodeItem === null) {
      return '';
    }
    if (!is.string(fractionSeparator) || fractionSeparator.length > 1) {
      fractionSeparator = '.';
    }
    specialFractions = is.boolean(specialFractions) && specialFractions;
    useParenthesis = is.boolean(useParenthesis) && useParenthesis;
    if (!unitCodeItem.supportsFractions || fractionSeparator === '.') {
      return formatDecimal(value, unitCodeItem.decimalDigits, thousandsSeparator, useParenthesis);
    } else {
      const fractionFactor = unitCodeItem.getFractionFactor(specialFractions);
      const fractionDigits = unitCodeItem.getFractionDigits(specialFractions);
      return formatFraction(value, fractionFactor, fractionDigits, fractionSeparator, useParenthesis);
    }
  }
  return formatPrice;
})();

},{"./../data/UnitCode":26,"./decimal":29,"./fraction":31,"@barchart/common-js/lang/is":47}],33:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');
const formatDate = require('./date'),
  formatTime = require('./time');
const Timezone = require('@barchart/common-js/lang/Timezones');
module.exports = (() => {
  'use strict';

  let offsets = {};

  /**
   * Returns a string-formatted date (or time), based on a {@link Quote} instance's
   * state. If the market is open, and a trade has occurred, then the formatted time
   * is returned. Otherwise, the formatted date is returned.
   *
   * @exported
   * @function
   * @memberOf Functions
   * @param {Quote} quote
   * @param {Boolean=} useTwelveHourClock
   * @param {Boolean=} short
   * @param {String=} timezone - A name from the tz database (see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) or "EXCHANGE"
   * @returns {String}
   */
  function formatQuoteDateTime(quote, useTwelveHourClock, short, timezone) {
    if (!quote || !quote.time) {
      return '';
    }
    let t;
    let utc;
    if (quote.timeUtc && (is.string(timezone) || quote.profile && quote.profile.exchangeRef && quote.profile.exchangeRef && quote.profile.exchangeRef.timezoneExchange)) {
      utc = true;
      let tz;
      if (is.string(timezone)) {
        tz = timezone;
      } else {
        tz = quote.profile.exchangeRef.timezoneExchange;
      }
      let epoch = quote.timeUtc.getTime();
      if (!offsets.hasOwnProperty(tz)) {
        const offset = {};
        offset.latest = epoch;
        offset.timezone = Timezone.parse(tz);
        if (offset.timezone !== null) {
          offset.milliseconds = offset.timezone.getUtcOffset(null, true);
        } else {
          offset.milliseconds = null;
        }
        offsets[tz] = offset;
      }
      const o = offsets[tz];
      if (o.milliseconds !== null) {
        t = new Date(epoch + o.milliseconds);
      } else {
        t = null;
      }
    } else {
      utc = false;
      t = quote.time;
    }
    if (t === null) {
      return '';
    } else if (!quote.lastPrice || quote.flag || quote.sessionT) {
      return formatDate(t, utc);
    } else {
      return formatTime(t, quote.timezone, useTwelveHourClock, short, utc);
    }
  }
  return formatQuoteDateTime;
})();

},{"./date":28,"./time":35,"@barchart/common-js/lang/Timezones":44,"@barchart/common-js/lang/is":47}],34:[function(require,module,exports){
const AssetClass = require('./../../data/AssetClass');
const formatFraction = require('./../fraction'),
  formatPrice = require('./../price');
module.exports = (() => {
  'use strict';

  const regex = {};
  regex.ZB = /^BB\d$/;
  regex.ZT = /^BT\d$/;
  regex.ZF = /^BF\d$/;
  regex.ZN = /^BN\d$/;

  /**
   * An implementation of {@link Callbacks.CustomPriceFormatterCallback} which can be
   * used with ${@link Profile.setPriceFormatterCustom}. This implementation applies
   * logic specific to the [cmdtyView](https://www.barchart.com/cmdty/trading/cmdtyview)
   * product.
   *
   * @function
   * @ignore
   * @param {Number} value
   * @param {String} unitCode
   * @param {Profile} profile
   * @returns {String}
   */
  function formatForCmdtyView(value, unitCode, profile) {
    if (profile.asset === AssetClass.FUTURE_OPTION) {
      const root = profile.root;

      // 2021/07/15, BRI. Options for ZB and ZN use unitCode="5" which defines
      // 64 price increments. The default price formatter will output fractions
      // using halves of thirty-seconds (e.g. 0-315). However, the CME specifies
      // formatting with sixty-fourths (e.g. 0-63). These notations are numerically
      // equivalent (i.e. 0-315 equals 0-63); however, customers will expect to see
      // the latter. This logic includes the option "root" symbols for normal, weekly,
      // and wednesday options (for ZB and ZN futures).

      if (root === 'ZB' || root === 'ZN' || regex.ZB.test(root) || regex.ZN.test(root)) {
        return formatFraction(value, 64, 2, '-', false);
      }

      // 2021/07/15, BRI. Options for ZT and ZF use unitCode="6" which defines
      // 128 price increments. The default price formatter will output fractions
      // using quarters of thirty-seconds (e.g. 0-317). However, the CME specifies
      // formatting with halves of sixty-fourths (e.g. 0-635). These notations are
      // numerically equivalent (i.e. 0-317 equals 0-635); however, customers will
      // expect to see the latter. This logic includes the option "root" symbols for
      // normal, weekly,and wednesday options (for ZT and ZF futures).

      if (root === 'ZT' || root === 'ZF' || regex.ZT.test(root) || regex.ZF.test(root)) {
        return formatFraction(value, 640, 3, '-', false);
      }
    }
    return formatPrice(value, unitCode, '-', true, ',');
  }
  return formatForCmdtyView;
})();

},{"./../../data/AssetClass":25,"./../fraction":31,"./../price":32}],35:[function(require,module,exports){
module.exports = (() => {
  'use strict';

  function leftPad(value) {
    return ('00' + value).substr(-2);
  }
  function formatTwelveHourTime(t, utc) {
    let hours;
    let minutes;
    let seconds;
    if (utc) {
      hours = t.getUTCHours();
      minutes = t.getUTCMinutes();
      seconds = t.getUTCSeconds();
    } else {
      hours = t.getHours();
      minutes = t.getMinutes();
      seconds = t.getSeconds();
    }
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
    return `${leftPad(hours)}:${leftPad(minutes)}:${leftPad(seconds)} ${period}`;
  }
  function formatTwelveHourTimeShort(t, utc) {
    let hours;
    let minutes;
    if (utc) {
      hours = t.getUTCHours();
      minutes = t.getUTCMinutes();
    } else {
      hours = t.getHours();
      minutes = t.getMinutes();
    }
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
    return `${leftPad(hours)}:${leftPad(minutes)}${period}`;
  }
  function formatTwentyFourHourTime(t, utc) {
    let hours;
    let minutes;
    let seconds;
    if (utc) {
      hours = t.getUTCHours();
      minutes = t.getUTCMinutes();
      seconds = t.getUTCSeconds();
    } else {
      hours = t.getHours();
      minutes = t.getMinutes();
      seconds = t.getSeconds();
    }
    return `${leftPad(hours)}:${leftPad(minutes)}:${leftPad(seconds)}`;
  }
  function formatTwentyFourHourTimeShort(t, utc) {
    let hours;
    let minutes;
    if (utc) {
      hours = t.getUTCHours();
      minutes = t.getUTCMinutes();
    } else {
      hours = t.getHours();
      minutes = t.getMinutes();
    }
    return `${leftPad(hours)}:${leftPad(minutes)}`;
  }

  /**
   * Formats a {@link Date} instance's time component as a string.
   *
   * @exported
   * @function
   * @memberOf Functions
   * @param {Date} date
   * @param {String=} timezone
   * @param {Boolean=} useTwelveHourClock
   * @param {Boolean=} short
   * @param {Boolean=} utc
   * @returns {String}
   */
  function formatTime(date, timezone, useTwelveHourClock, short, utc) {
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
    let formatted = ft(date, utc);
    if (timezone) {
      formatted = `${formatted} ${timezone}`;
    }
    return formatted;
  }
  return formatTime;
})();

},{}],36:[function(require,module,exports){
const xmlDom = require('@xmldom/xmldom');
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
   * @exported
   * @function
   * @param {String} msg
   * @param {Object=} options
   * @returns {Object}
   */
  function parseMessage(msg, options) {
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
                    if (node.childNodes[j].nodeName === 'SESSION') {
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

                  // 2021/06/30, This seems wrong. We may be selecting most values
                  // from the "combined" session ... but, the "previousPrice" value
                  // from the "previous" session ... This can give us the same "previousPrice"
                  // and "lastPrice" values (e.g. ZCN1 right after 4:45 PM, when the
                  // snapshots change).

                  if (premarket) {
                    message.previousPrice = sessions.previous.previousPrice;
                  } else if (sessions.combined.previousPrice) {
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
                  if (session.tradeTime) message.tradeTime = session.tradeTime;

                  // 2016/10/29, BRI. We have a problem where we don't "roll" quotes
                  // for futures. For example, LEZ16 doesn't "roll" the settlementPrice
                  // to the previous price -- so, we did this on the open message (2,0A).
                  // Eero has another idea. Perhaps we are setting the "day" improperly
                  // here. Perhaps we should base the day off of the actual session
                  // (i.e. "session" variable) -- instead of taking it from the "combined"
                  // session.

                  if (sessions.combined.day) message.day = session.day;
                  if (premarket && typeof message.flag === 'undefined') message.flag = 'p';
                  const p = sessions.previous;
                  message.previousDay = p.day;
                  message.previousLastPrice = p.lastPrice;
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
                          if (message.modifier === '1') message.type = 'OPEN_INTEREST';
                          break;
                        case 'D':
                        case 'd':
                          if (message.modifier === '0') message.type = 'SETTLEMENT';
                          break;
                        case 'V':
                          if (message.modifier === '0') message.type = 'VWAP';
                          break;
                        case '0':
                          {
                            if (message.modifier === '0') {
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
                            if (message.modifier === '1') message.type = 'VOLUME_YESTERDAY';else if (message.modifier === '6') message.type = 'VOLUME';
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
                  case '6':
                    {
                      if (msg.substr(1, 1) === '2') {
                        const ary = msg.substring(pos + 8).split(',');
                        message.openPrice = parseValue(ary[0], message.unitcode);
                        message.highPrice = parseValue(ary[1], message.unitcode);
                        message.lowPrice = parseValue(ary[2], message.unitcode);
                        message.lastPrice = parseValue(ary[3], message.unitcode);
                        message.volume = ary[13].length > 0 ? parseInt(ary[13]) : undefined;
                        message.day = ary[14].substr(0, 1);
                        message.session = ary[14].substr(1, 1);
                        message.type = 'OHLC';
                      }
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
                      message.bidDepth = msg.substr(pos + 5, 1) === 'A' ? 10 : parseInt(msg.substr(pos + 5, 1));
                      message.askDepth = msg.substr(pos + 6, 1) === 'A' ? 10 : parseInt(msg.substr(pos + 6, 1));
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

},{"./timestamp":37,"./value":38,"@xmldom/xmldom":55}],37:[function(require,module,exports){
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
   * @exported
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
    const ms = (0xFF & bytes.charCodeAt(7)) + ((0xFF & bytes.charCodeAt(8)) << 8);

    // 2016/02/17. JERQ is providing us with date and time values that
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

},{}],38:[function(require,module,exports){
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
   * @exported
   * @function
   * @param {String} str
   * @param {String} unitCode
   * @param {String=} thousandsSeparator
   * @returns {Number|undefined|null}
   */
  function parseValue(str, unitCode, thousandsSeparator) {
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
    const sign = str.substr(0, 1) === '-' ? -1 : 1;
    if (sign === -1) {
      str = str.substr(1);
    }
    switch (unitCode) {
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

},{}],39:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is'),
  string = require('@barchart/common-js/lang/string');
const AssetClass = require('./../data/AssetClass');
module.exports = (() => {
  'use strict';

  /**
   * Static utilities for parsing symbols.
   *
   * @public
   * @ignore
   */
  class SymbolParser {
    constructor() {}

    /**
     * Returns true when a symbol is not an alias.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */
    static getIsConcrete(symbol) {
      return is.string(symbol) && !this.getIsReference(symbol);
    }

    /**
     * Returns true when a symbol is an alias.
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
     * Returns true when a symbol represents futures contract.
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
     * Returns true when a symbol represents futures spread.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */
    static getIsFutureSpread(symbol) {
      return is.string(symbol) && types.futures.spread.test(symbol);
    }

    /**
     * Returns true when a symbol represents an option on a futures contract.
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
     * Returns true when a symbol represents a foreign exchange currency pair. However,
     * this function can return false positives (cyptocurrency symbols can use the same
     * pattern).
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
     * Returns true when a symbol represents a cryptocurrency. However, this function can
     * return false positives (forex symbols can use the same pattern).
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */
    static getIsCrypto(symbol) {
      return is.string(symbol) && types.crypto.test(symbol);
    }

    /**
     * Returns true if the symbol represents an external index (i.e. an index
     * which is not generated by Barchart, e.g. the S&P 500).
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
     * Returns true if the symbol represents a Barchart sector (i.e. a type
     * of index calculated by Barchart).
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
     * Returns true if the symbol represents a Canadian mutual fund.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */
    static getIsCanadianFund(symbol) {
      return is.string(symbol) && types.funds.canadian.test(symbol);
    }

    /**
     * Returns true if the symbol represents an instrument which falls under the
     * cmdty brand.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */
    static getIsCmdty(symbol) {
      return is.string(symbol) && (types.cmdty.stats.test(symbol) || types.cmdty.internal.test(symbol) || types.cmdty.external.test(symbol));
    }

    /**
     * Returns true if the symbol represents a cmdtyStats instrument.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */
    static getIsCmdtyStats(symbol) {
      return is.string(symbol) && types.cmdty.stats.test(symbol);
    }

    /**
     * Returns true if the symbol is listed on the BATS exchange.
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
     * Returns true if the symbol represents an option on an equity or index; false
     * otherwise.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */
    static getIsEquityOption(symbol) {
      return is.string(symbol) && types.equities.options.test(symbol);
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
     * Returns true if the symbol represents a Commodity3 instrument.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */
    static getIsC3(symbol) {
      return is.string(symbol) && (types.c3.concrete.test(symbol) || types.c3.alias.test(symbol));
    }

    /**
     * Returns true if the symbol represents a Platts instrument.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */
    static getIsPlatts(symbol) {
      return is.string(symbol) && (types.platts.concrete.test(symbol) || types.platts.alias.test(symbol));
    }

    /**
     * Returns true if the symbol represents a pit-traded instrument. The
     * name must also be included.
     *
     * @public
     * @static
     * @param {String} symbol
     * @param {String} name
     * @returns {Boolean}
     */
    static getIsPit(symbol, name) {
      return is.string(symbol) && is.string(name) && predicates.pit.test(name);
    }

    /**
     * Returns true if the symbol represents a grain bid instrument.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */
    static getIsGrainBid(symbol) {
      return is.string(symbol) && types.bids.test(symbol);
    }

    /**
     * Returns a simple instrument definition containing information which
     * can be inferred from the symbol. A null value is returned if nothing
     * can be inferred based solely on the symbol.
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
     * In some cases, multiple symbols can be used to refer to the same instrument
     * (e.g. ZCZ1 and ZCZ21 may refer to the same futures contract). That said,
     * internal quote servers may only recognize one of the symbols. So, given
     * a symbol, this function will return the symbol which the internal quote
     * servers will recognize. In other words, the symbol used by the quote "producer"
     * is returned. In most cases, the same symbol is returned.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {String|null}
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
     * Converts a futures option symbol in "database" format to "pipeline" format
     * (e.g. ZLF320Q -> ZLF9|320C).
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
     * Converts an abbreviated futures symbol (with a single digit year) into
     * a futures symbol with a two digit year. If the symbol is not a futures
     * contract, a null value is returned.
     *
     * @static
     * @public
     * @param {String} symbol
     * @returns {String|null}
     */
    static getFuturesExplicitFormat(symbol) {
      let explicit = null;
      if (SymbolParser.getIsFuture(symbol) && SymbolParser.getIsConcrete(symbol)) {
        const parsed = SymbolParser.parseInstrumentType(symbol);
        explicit = `${parsed.root}${parsed.month}${string.padLeft(Math.floor(parsed.year % 100).toString(), 2, '0')}`;
      }
      return explicit;
    }

    /**
     * Determine (or guess) the expiration year (for a futures contract), given
     * the string representation of the expiration year and the expiration month
     * code.
     *
     * @static
     * @public
     * @param {String} yearString
     * @param {String} monthCode
     */
    static getFuturesYear(yearString, monthCode) {
      return getFuturesYear(yearString, monthCode);
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
  predicates.pit = /\(P(it)?\)/;
  const types = {};
  types.bids = /^([A-Z]{2})([B|P])([A-Z\d]{3,4})-(\d+)-(\d+)(\.CM)$/i;
  types.c3 = {};
  types.c3.alias = /^(C3:)(.*)$/i;
  types.c3.concrete = /(\.C3)$/i;
  types.cmdty = {};
  types.cmdty.stats = /(\.CS)$/i;
  types.cmdty.internal = /(\.CM)$/i;
  types.cmdty.external = /(\.CP)$/i;
  types.crypto = /^\^([A-Z]{3})([A-Z]{3,4})$/i;
  types.equities = {};
  types.equities.options = /^([A-Z\$][A-Z\-]{0,}(\.[A-Z]{1})?)([0-9]?)(\.[A-Z]{2})?\|([[0-9]{4})([[0-9]{2})([[0-9]{2})\|([0-9]+\.[0-9]+)[P|W]?(C|P)/i;
  types.forex = /^\^([A-Z]{3})([A-Z]{3})$/i;
  types.funds = {};
  types.funds.canadian = /(.*)(\.CF)$/i;
  types.futures = {};
  types.futures.alias = /^([A-Z][A-Z0-9\$\-!\.]{0,2})(\*{1})([0-9]{1,2})$/i;
  types.futures.concrete = /^([A-Z][A-Z0-9\$\-!\.]{0,2})([A-Z]{1})([0-9]{4}|[0-9]{1,2})$/i;
  types.futures.spread = /^_S_/i;
  types.futures.options = {};
  types.futures.options.historical = /^([A-Z][A-Z0-9\$\-!\.]{0,2})([A-Z])([0-9]{2})([0-9]{1,5})(C|P)$/i;
  types.futures.options.long = /^([A-Z][A-Z0-9\$\-!\.]{0,2})([A-Z])([0-9]{1,4})\|(\-?[0-9]{1,5})(C|P)$/i;
  types.futures.options.short = /^([A-Z][A-Z0-9\$\-!\.]?)([A-Z])([0-9]{1,4})([A-Z])$/i;
  types.indicies = {};
  types.indicies.external = /^\$(.*)$/i;
  types.indicies.sector = /^\-(.*)$/i;
  types.platts = {};
  types.platts.alias = /^(PLATTS:)(.*)$/i;
  types.platts.concrete = /^(.*)(\.PT)$/i;
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
      definition.asset = AssetClass.FUTURE;
      definition.dynamic = false;
      definition.root = match[1];
      definition.month = match[2];
      definition.year = getFuturesYear(match[3], match[2]);
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
      definition.asset = AssetClass.FUTURE;
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
      definition.asset = AssetClass.FOREX;
    }
    return definition;
  });
  parsers.push(symbol => {
    let definition = null;
    const match = symbol.match(types.equities.options);
    if (match !== null) {
      const suffix = typeof match[4] !== 'undefined' ? match[4] : '';
      definition = {};
      definition.symbol = symbol;
      definition.type = 'equity_option';
      definition.asset = AssetClass.STOCK_OPTION;
      definition.option_type = match[9] === 'C' ? 'call' : 'put';
      definition.strike = parseFloat(match[8]);
      definition.root = `${match[1]}${suffix}`;
      definition.month = parseInt(match[6]);
      definition.day = parseInt(match[7]);
      definition.year = parseInt(match[5]);
      definition.adjusted = match[3] !== '';
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
      definition.asset = AssetClass.FUTURE_OPTION;
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
      definition.asset = AssetClass.FUTURE_OPTION;
      definition.option_type = match[5] === 'C' ? 'call' : 'put';
      definition.strike = parseInt(match[4]);
      definition.root = match[1];
      definition.month = getFuturesMonth(match[2]);
      definition.year = getFuturesYear(match[3]);
    }
    return definition;
  });
  parsers.push(symbol => {
    let definition = null;
    const match = symbol.match(types.cmdty.stats);
    if (match !== null) {
      definition = {};
      definition.symbol = symbol;
      definition.type = 'cmdtyStats';
      definition.asset = AssetClass.CMDTY_STATS;
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

        // 2021/01/02, BRI. Per Tom, symbols (for the same instrument) change each year.
        // For calls that expire this year, the letter is "C" ... For calls that expire next
        // year, the letter is "D" ... For calls that expire two years from now, the letter
        // is "E" ... etc ...

        converted = `${definition.root}${definition.month}${definition.strike}${String.fromCharCode(putCallCharacterCode + definition.year - getCurrentYear())}`;
      } else {
        converted = `${definition.root}${definition.month}${getYearDigits(definition.year, 1)}|${definition.strike}${putCallCharacter}`;
      }
    }
    return converted;
  });
  converters.push(symbol => {
    let converted = null;
    if (types.c3.alias.test(symbol)) {
      converted = symbol.replace(types.c3.alias, '$2.C3');
    }
    return converted;
  });
  converters.push(symbol => {
    let converted = null;
    if (types.platts.alias.test(symbol)) {
      converted = symbol.replace(types.platts.alias, '$2.PT');
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
  function getFuturesYear(yearString, monthCode) {
    const currentYear = getCurrentYear();
    let year = parseInt(yearString);
    if (year === 0 && monthCode === 'Y') {
      year = Math.floor(currentYear / 100) * 100 + 100;
    } else if (year < 10 && yearString.length === 1) {
      const bump = year < currentYear % 10 ? 1 : 0;
      year = Math.floor(currentYear / 10) * 10 + year + bump * 10;
    } else if (year < 100) {
      year = Math.floor(currentYear / 100) * 100 + year;
      if (currentYear + 25 < year) {
        year = year - 100;
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
  return SymbolParser;
})();

},{"./../data/AssetClass":25,"@barchart/common-js/lang/is":47,"@barchart/common-js/lang/string":49}],40:[function(require,module,exports){
const assert = require('./../../lang/assert'),
  comparators = require('./comparators');
module.exports = (() => {
  'use strict';

  /**
   * A builder for compound comparator functions (e.g. sort by last name,
   * then by first name, then by social security number) that uses a fluent
   * interface.
   *
   * @public
   * @param {Function} comparator - The initial comparator.
   * @param {Boolean=} invert - Indicates if the comparator should sort in descending order.
   */
  class ComparatorBuilder {
    constructor(comparator, invert, previous) {
      assert.argumentIsRequired(comparator, 'comparator', Function);
      assert.argumentIsOptional(invert, 'invert', Boolean);
      this._comparator = comparator;
      this._invert = invert || false;
      this._previous = previous || null;
    }

    /**
     * Adds a new comparator to the list of comparators to use.
     *
     * @public
     * @param {Function} comparator - The next comparator function.
     * @param {Boolean=} invert - Indicates if the comparator should sort in descending order.
     * @returns {ComparatorBuilder}
     */
    thenBy(comparator, invert) {
      assert.argumentIsRequired(comparator, 'comparator', Function);
      assert.argumentIsOptional(invert, 'invert', Boolean);
      return new ComparatorBuilder(comparator, invert, this);
    }

    /**
     * Flips the order of the comparator (e.g. ascending to descending).
     *
     * @public
     * @returns {ComparatorBuilder}
     */
    invert() {
      let previous;
      if (this._previous) {
        previous = this._previous.invert();
      } else {
        previous = null;
      }
      return new ComparatorBuilder(this._comparator, !this._invert, previous);
    }

    /**
     * Returns the comparator function.
     *
     * @public
     * @returns {Function}
     */
    toComparator() {
      let previousComparator;
      if (this._previous) {
        previousComparator = this._previous.toComparator();
      } else {
        previousComparator = comparators.empty;
      }
      return (a, b) => {
        let result = previousComparator(a, b);
        if (result === 0) {
          let sortA;
          let sortB;
          if (this._invert) {
            sortA = b;
            sortB = a;
          } else {
            sortA = a;
            sortB = b;
          }
          result = this._comparator(sortA, sortB);
        }
        return result;
      };
    }
    toString() {
      return '[ComparatorBuilder]';
    }

    /**
     * Creates a {@link ComparatorBuilder}, given an initial comparator function.
     *
     * @public
     * @param {Function} comparator - The initial comparator.
     * @param {Boolean=} invert - Indicates if the comparator should sort in descending order.
     * @returns {ComparatorBuilder}
     */
    static startWith(comparator, invert) {
      return new ComparatorBuilder(comparator, invert);
    }
  }
  return ComparatorBuilder;
})();

},{"./../../lang/assert":46,"./comparators":41}],41:[function(require,module,exports){
const assert = require('./../../lang/assert');
module.exports = (() => {
  'use strict';

  /**
   * Functions that can be used as comparators.
   *
   * @public
   * @module collections/sorting/comparators
   */
  return {
    /**
     * Compares two dates (in ascending order).
     *
     * @public
     * @static
     * @param {Date} a
     * @param {Date} b
     * @returns {Number}
     */
    compareDates: (a, b) => {
      assert.argumentIsRequired(a, 'a', Date);
      assert.argumentIsRequired(b, 'b', Date);
      return a - b;
    },
    /**
     * Compares two numbers (in ascending order).
     *
     * @public
     * @static
     * @param {Number} a
     * @param {Number} b
     * @returns {Number}
     */
    compareNumbers: (a, b) => {
      assert.argumentIsRequired(a, 'a', Number);
      assert.argumentIsRequired(b, 'b', Number);
      return a - b;
    },
    /**
     * Compares two strings (in ascending order), using {@link String#localeCompare}.
     *
     * @public
     * @static
     * @param {String} a
     * @param {String} b
     * @returns {Number}
     */
    compareStrings: (a, b) => {
      assert.argumentIsRequired(a, 'a', String);
      assert.argumentIsRequired(b, 'b', String);
      return a.localeCompare(b);
    },
    /**
     * Compares two boolean values (in ascending order -- false first, true second).
     *
     * @public
     * @static
     * @param {Boolean} a
     * @param {Boolean} b
     * @returns {Number}
     */
    compareBooleans: (a, b) => {
      assert.argumentIsRequired(a, 'a', Boolean);
      assert.argumentIsRequired(b, 'b', Boolean);
      if (a === b) {
        return 0;
      } else if (a) {
        return 1;
      } else {
        return -1;
      }
    },
    /**
     * Compares two values for nulls (in ascending order -- null first, non-null second).
     *
     * @public
     * @static
     * @param {*|null} a
     * @param {*|null} b
     * @returns {Number}
     */
    compareNull: (a, b) => {
      if (a === null && b !== null) {
        return -1;
      } else if (a !== null && b === null) {
        return 1;
      } else {
        return 0;
      }
    },
    /**
     * Compares two objects, always returning zero.
     *
     * @public
     * @static
     * @param {*} a
     * @param {*} b
     * @returns {Number}
     */
    empty: (a, b) => {
      return 0;
    }
  };
})();

},{"./../../lang/assert":46}],42:[function(require,module,exports){
const assert = require('./assert'),
  ComparatorBuilder = require('./../collections/sorting/ComparatorBuilder'),
  comparators = require('./../collections/sorting/comparators'),
  is = require('./is');
module.exports = (() => {
  'use strict';

  /**
   * A data structure that represents a day (year, month, and day)
   * without consideration for time or timezone.
   *
   * @public
   * @param {Number} year
   * @param {Number} month
   * @param {Number} day
   */
  class Day {
    constructor(year, month, day) {
      if (!Day.validate(year, month, day)) {
        throw new Error(`Unable to instantiate Day, input is invalid [${year}], [${month}], [${day}]`);
      }
      this._year = year;
      this._month = month;
      this._day = day;
    }

    /**
     * Calculates a new {@link Day} in the future (or past).
     *
     * @public
     * @param {Number} days - The number of days to add (negative numbers can be used for subtraction).
     * @param {Boolean=} inverse - If true, the sign of the "days" value will be flipped.
     * @returns {Day}
     */
    addDays(days, inverse) {
      assert.argumentIsRequired(days, 'days', Number);
      assert.argumentIsOptional(inverse, inverse, Boolean);
      assert.argumentIsValid(days, 'days', is.large, 'is an integer');
      let totalDaysToShift;
      if (is.boolean(inverse) && inverse) {
        totalDaysToShift = days * -1;
      } else {
        totalDaysToShift = days;
      }
      const positive = is.positive(totalDaysToShift);
      let shiftedDay = this._day;
      let shiftedMonth = this._month;
      let shiftedYear = this._year;
      while (totalDaysToShift !== 0) {
        let monthDaysAvailable;
        let monthDaysToShift;
        if (positive) {
          monthDaysAvailable = Day.getDaysInMonth(shiftedYear, shiftedMonth) - shiftedDay;
          monthDaysToShift = Math.min(totalDaysToShift, monthDaysAvailable);
        } else {
          monthDaysAvailable = 1 - shiftedDay;
          monthDaysToShift = Math.max(totalDaysToShift, monthDaysAvailable);
        }
        totalDaysToShift = totalDaysToShift - monthDaysToShift;
        if (totalDaysToShift === 0) {
          shiftedDay = shiftedDay + monthDaysToShift;
        } else if (positive) {
          shiftedMonth++;
          if (shiftedMonth > 12) {
            shiftedYear++;
            shiftedMonth = 1;
          }
          shiftedDay = 0;
        } else {
          shiftedMonth--;
          if (shiftedMonth < 1) {
            shiftedYear--;
            shiftedMonth = 12;
          }
          shiftedDay = Day.getDaysInMonth(shiftedYear, shiftedMonth) + 1;
        }
      }
      return new Day(shiftedYear, shiftedMonth, shiftedDay);
    }

    /**
     * Calculates a new {@link Day} in the past (or future).
     *
     * @public
     * @param {Number} days - The number of days to subtract (negative numbers can be used for addition).
     * @returns {Day}
     */
    subtractDays(days) {
      return this.addDays(days, true);
    }

    /**
     * Calculates a new {@link Day} in the future (or past). If the new date is at the end of
     * the month and the new month has fewer days than the current month, days will be subtracted
     * as necessary (e.g. adding one month to March 31 will return April 30).
     *
     * @public
     * @param {Number} months - The number of months to add (negative numbers can be used for subtraction).
     * @param {Boolean=} inverse - If true, the sign of the "days" value will be flipped.
     * @returns {Day}
     */
    addMonths(months, inverse) {
      assert.argumentIsRequired(months, 'months', Number);
      assert.argumentIsOptional(inverse, inverse, Boolean);
      assert.argumentIsValid(months, 'months', is.large, 'is an integer');
      let totalMonthsToShift;
      if (is.boolean(inverse) && inverse) {
        totalMonthsToShift = months * -1;
      } else {
        totalMonthsToShift = months;
      }
      const monthsToShift = totalMonthsToShift % 12;
      const yearsToShift = (totalMonthsToShift - monthsToShift) / 12;
      let shiftedYear = this.year + yearsToShift;
      let shiftedMonth = this.month + monthsToShift;
      let shiftedDay = this.day;
      if (shiftedMonth > 12) {
        shiftedYear = shiftedYear + 1;
        shiftedMonth = shiftedMonth - 12;
      }
      if (shiftedMonth < 1) {
        shiftedYear = shiftedYear - 1;
        shiftedMonth = shiftedMonth + 12;
      }
      while (!Day.validate(shiftedYear, shiftedMonth, shiftedDay)) {
        shiftedDay = shiftedDay - 1;
      }
      return new Day(shiftedYear, shiftedMonth, shiftedDay);
    }

    /**
     * Calculates a new {@link Day} in the past (or future).
     *
     * @public
     * @param {Number} months - The number of months to subtract (negative numbers can be used for addition).
     * @returns {Day}
     */
    subtractMonths(months) {
      return this.addMonths(months, true);
    }

    /**
     * Calculates a new {@link Day} in the future (or past). If the new date is at the end of
     * the month and the new month has fewer days than the current month, days will be subtracted
     * as necessary (e.g. adding one year to February 29 will return February 28).
     *
     * @public
     * @param {Number} years - The number of years to add (negative numbers can be used for subtraction).
     * @param {Boolean=} inverse - If true, the sign of the "days" value will be flipped.
     * @returns {Day}
     */
    addYears(years, inverse) {
      assert.argumentIsRequired(years, 'years', Number);
      assert.argumentIsOptional(inverse, inverse, Boolean);
      assert.argumentIsValid(years, 'years', is.large, 'is an integer');
      let yearsToShift;
      if (is.boolean(inverse) && inverse) {
        yearsToShift = years * -1;
      } else {
        yearsToShift = years;
      }
      let shiftedYear = this.year + yearsToShift;
      let shiftedMonth = this.month;
      let shiftedDay = this.day;
      while (!Day.validate(shiftedYear, shiftedMonth, shiftedDay)) {
        shiftedDay = shiftedDay - 1;
      }
      return new Day(shiftedYear, shiftedMonth, shiftedDay);
    }

    /**
     * Calculates a new {@link Day} in the past (or future).
     *
     * @public
     * @param {Number} years - The number of years to subtract (negative numbers can be used for addition).
     * @returns {Day}
     */
    subtractYears(years) {
      return this.addYears(years, true);
    }

    /**
     * Returns a new {@link Day} instance for the start of the month referenced by the current instance.
     *
     * @public
     * @returns {Day}
     */
    getStartOfMonth() {
      return new Day(this.year, this.month, 1);
    }

    /**
     * Returns a new instance for the {@link Day} end of the month referenced by the current instance.
     *
     * @public
     * @returns {Day}
     */
    getEndOfMonth() {
      return new Day(this.year, this.month, Day.getDaysInMonth(this.year, this.month));
    }

    /**
     * Indicates if the current {@link Day} instance occurs before another day.
     *
     * @public
     * @param {Day} other
     * @returns {boolean}
     */
    getIsBefore(other) {
      return Day.compareDays(this, other) < 0;
    }

    /**
     * Indicates if the current {@link Day} instance occurs after another day.
     *
     * @public
     * @param {Day} other
     * @returns {boolean}
     */
    getIsAfter(other) {
      return Day.compareDays(this, other) > 0;
    }

    /**
     * Indicates the current day falls between two other days, inclusive
     * of the range boundaries.
     *
     * @public
     * @param {Day=} first
     * @param {Day=} last
     * @param {boolean=} exclusive
     * @returns {boolean}
     */
    getIsContained(first, last) {
      assert.argumentIsOptional(first, 'first', Day, 'Day');
      assert.argumentIsOptional(last, 'last', Day, 'Day');
      let notAfter;
      let notBefore;
      if (first && last && first.getIsAfter(last)) {
        notBefore = false;
        notAfter = false;
      } else {
        notAfter = !(last instanceof Day) || !this.getIsAfter(last);
        notBefore = !(first instanceof Day) || !this.getIsBefore(first);
      }
      return notAfter && notBefore;
    }

    /**
     * Indicates if another {@link Day} refers to the same moment.
     *
     * @public
     * @param {Day} other
     * @returns {boolean}
     */
    getIsEqual(other) {
      return Day.compareDays(this, other) === 0;
    }

    /**
     * The year.
     *
     * @public
     * @returns {Number}
     */
    get year() {
      return this._year;
    }

    /**
     * The month of the year (January is one, December is twelve).
     *
     * @public
     * @returns {Number}
     */
    get month() {
      return this._month;
    }

    /**
     * The day of the month.
     *
     * @public
     * @returns {Number}
     */
    get day() {
      return this._day;
    }

    /**
     * Outputs the date as the formatted string: {year}-{month}-{day}.
     *
     * @public
     * @returns {String}
     */
    format() {
      return `${leftPad(this._year, 4, '0')}-${leftPad(this._month, 2, '0')}-${leftPad(this._day, 2, '0')}`;
    }

    /**
     * Returns the JSON representation.
     *
     * @public
     * @returns {String}
     */
    toJSON() {
      return this.format();
    }

    /**
     * Clones a {@link Day} instance.
     *
     * @public
     * @static
     * @param {Day} value
     * @returns {Day}
     */
    static clone(value) {
      assert.argumentIsRequired(value, 'value', Day, 'Day');
      return new Day(value.year, value.month, value.day);
    }

    /**
     * Converts a string (which matches the output of {@link Day#format}) into
     * a {@link Day} instance.
     *
     * @public
     * @static
     * @param {String} value
     * @returns {Day}
     */
    static parse(value) {
      assert.argumentIsRequired(value, 'value', String);
      const match = value.match(dayRegex);
      if (match === null) {
        throw new Error(`Unable to parse value as Day [ ${value} ]`);
      }
      return new Day(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
    }

    /**
     * Creates a {@link Day} from the year, month, and day properties (in local time)
     * of the {@link Date} argument.
     *
     * @public
     * @static
     * @param {Date} date
     * @returns {Day}
     */
    static fromDate(date) {
      assert.argumentIsRequired(date, 'date', Date);
      return new Day(date.getFullYear(), date.getMonth() + 1, date.getDate());
    }

    /**
     * Creates a {@link Day} from the year, month, and day properties (in UTC)
     * of the {@link Date} argument.
     *
     * @public
     * @static
     * @param {Date} date
     * @returns {Day}
     */
    static fromDateUtc(date) {
      assert.argumentIsRequired(date, 'date', Date);
      return new Day(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
    }

    /**
     * Returns a {@link Day} instance using today's local date.
     *
     * @static
     * @public
     * @returns {Day}
     */
    static getToday() {
      return Day.fromDate(new Date());
    }

    /**
     * Returns true if the year, month, and day combination is valid; otherwise false.
     *
     * @public
     * @static
     * @param {Number} year
     * @param {Number} month
     * @param {Number} day
     * @returns {Boolean}
     */
    static validate(year, month, day) {
      return is.integer(year) && is.integer(month) && is.integer(day) && !(month < 1) && !(month > 12) && !(day < 1) && !(day > Day.getDaysInMonth(year, month));
    }

    /**
     * Returns the number of days in a given month.
     *
     * @public
     * @static
     * @param {number} year - The year number (e.g. 2017)
     * @param {number} month - The month number (e.g. 2 is February)
     */
    static getDaysInMonth(year, month) {
      switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          {
            return 31;
          }
        case 4:
        case 6:
        case 9:
        case 11:
          {
            return 30;
          }
        case 2:
          {
            if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
              return 29;
            } else {
              return 28;
            }
          }
      }
    }

    /**
     * A comparator function for {@link Day} instances.
     *
     * @public
     * @static
     * @param {Day} a
     * @param {Day} b
     * @returns {Number}
     */
    static compareDays(a, b) {
      assert.argumentIsRequired(a, 'a', Day, 'Day');
      assert.argumentIsRequired(b, 'b', Day, 'Day');
      return comparator(a, b);
    }
    toString() {
      return '[Day]';
    }
  }
  const dayRegex = /^([0-9]{4}).?([0-9]{2}).?([0-9]{2})$/;
  function leftPad(value, digits, character) {
    let string = value.toString();
    let padding = digits - string.length;
    return `${character.repeat(padding)}${string}`;
  }
  const comparator = ComparatorBuilder.startWith((a, b) => comparators.compareNumbers(a.year, b.year)).thenBy((a, b) => comparators.compareNumbers(a.month, b.month)).thenBy((a, b) => comparators.compareNumbers(a.day, b.day)).toComparator();
  return Day;
})();

},{"./../collections/sorting/ComparatorBuilder":40,"./../collections/sorting/comparators":41,"./assert":46,"./is":47}],43:[function(require,module,exports){
const assert = require('./assert');
module.exports = (() => {
  'use strict';

  const types = new Map();

  /**
   * An enumeration. Must be inherited. Do not instantiate directly.
   * Also, this class uses the ES6 Map, therefore a polyfill must
   * be supplied.
   *
   * @public
   * @interface
   * @param {String} code - The unique code of the enumeration item.
   * @param {String} description - A description of the enumeration item.
   */
  class Enum {
    constructor(code, description) {
      assert.argumentIsRequired(code, 'code', String);
      assert.argumentIsRequired(description, 'description', String);
      this._code = code;
      this._description = description;
      const c = this.constructor;
      if (!types.has(c)) {
        types.set(c, []);
      }
      const existing = Enum.fromCode(c, code);
      if (existing === null) {
        types.get(c).push(this);
      }
    }

    /**
     * The unique code.
     *
     * @public
     * @returns {String}
     */
    get code() {
      return this._code;
    }

    /**
     * The description.
     *
     * @public
     * @returns {String}
     */
    get description() {
      return this._description;
    }

    /**
     * Returns true if the provided {@link Enum} argument is equal
     * to the instance.
     *
     * @public
     * @param {Enum} other
     * @returns {boolean}
     */
    equals(other) {
      return other === this || other instanceof Enum && other.constructor === this.constructor && other.code === this.code;
    }

    /**
     * Returns the JSON representation.
     *
     * @public
     * @returns {String}
     */
    toJSON() {
      return this.code;
    }

    /**
     * Looks up a enumeration item; given the enumeration type and the enumeration
     * item's value. If no matching item can be found, a null value is returned.
     *
     * @public
     * @static
     * @param {Function} type - The enumeration type.
     * @param {String} code - The enumeration item's code.
     * @returns {*|null}
     */
    static fromCode(type, code) {
      return Enum.getItems(type).find(x => x.code === code) || null;
    }

    /**
     * Returns all of the enumeration's items (given an enumeration type).
     *
     * @public
     * @static
     * @param {Function} type - The enumeration to list.
     * @returns {Array}
     */
    static getItems(type) {
      return types.get(type) || [];
    }
    toString() {
      return '[Enum]';
    }
  }
  return Enum;
})();

},{"./assert":46}],44:[function(require,module,exports){
const moment = require('moment-timezone/builds/moment-timezone-with-data-2012-2022');
const Enum = require('./Enum'),
  is = require('./is'),
  timezone = require('./timezone');
module.exports = (() => {
  'use strict';

  /**
   * An enumeration item that lists timezones, according to the common names
   * used in the tz database (see https://en.wikipedia.org/wiki/Tz_database).
   * The full list of names is sourced from moment.js; however, this wikipedia
   * article lists them: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
   *
   * @public
   * @param {String} code - The timezone name
   * @extends {Enum}
   */
  class Timezones extends Enum {
    constructor(code) {
      super(code, code);
    }

    /**
     * Attempts to determine if daylight savings time is in effect.
     *
     * @public
     * @param {Number=} timestamp - The moment at which the daylight savings time is checked, otherwise now.
     * @returns {Number}
     */
    getIsDaylightSavingsTime(timestamp) {
      let m;
      if (is.number(timestamp)) {
        m = moment(timestamp);
      } else {
        m = moment();
      }
      return m.tz(this.code).isDST();
    }

    /**
     * Calculates and returns the timezone's offset from UTC.
     *
     * @public
     * @param {Number=} timestamp - The moment at which the offset is calculated, otherwise now.
     * @param {Boolean=} milliseconds - If true, the offset is returned in milliseconds; otherwise minutes.
     * @returns {Number}
     */
    getUtcOffset(timestamp, milliseconds) {
      let timestampToUse;
      if (is.number(timestamp)) {
        timestampToUse = timestamp;
      } else {
        timestampToUse = new Date().getTime();
      }
      let multiplier;
      if (is.boolean(milliseconds) && milliseconds) {
        multiplier = 60 * 1000;
      } else {
        multiplier = 1;
      }
      const offset = moment.tz.zone(this.code).utcOffset(timestampToUse) * multiplier;
      if (offset !== 0) {
        return offset * -1;
      } else {
        return 0;
      }
    }

    /**
     *
     * Given a code, returns the enumeration item.
     *
     * @public
     * @param {String} code
     * @returns {Timezones|null}
     */
    static parse(code) {
      return Enum.fromCode(Timezones, code);
    }

    /**
     * UTC
     *
     * @public
     * @static
     * @returns {Timezones}
     */
    static get UTC() {
      return utc;
    }

    /**
     * America/Chicago
     *
     * @public
     * @static
     * @returns {Timezones}
     */
    static get AMERICA_CHICAGO() {
      return america_chicago;
    }

    /**
     * America/New_York
     *
     * @public
     * @static
     * @returns {Timezones}
     */
    static get AMERICA_NEW_YORK() {
      return america_new_york;
    }
    toString() {
      return `[Timezone (name=${this.code})]`;
    }
  }
  timezone.getTimezones().forEach(name => new Timezones(name));
  const utc = Enum.fromCode(Timezones, 'UTC');
  const america_chicago = Enum.fromCode(Timezones, 'America/Chicago');
  const america_new_york = Enum.fromCode(Timezones, 'America/New_York');
  return Timezones;
})();

},{"./Enum":43,"./is":47,"./timezone":50,"moment-timezone/builds/moment-timezone-with-data-2012-2022":86}],45:[function(require,module,exports){
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
     * Set difference operation, returning any item in "a" that is not
     * contained in "b" (using strict equality).
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
     * Set difference operation, returning any item in "a" that is not
     * contained in "b" (where the uniqueness is determined by a delegate).
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
        a.splice(binarySearchForInsert(a, item, comparator, 0, a.length - 1), 0, item);
      }
      return a;
    },
    /**
     * Performs a binary search to locate an item within an array.
     *
     * @param {*[]} a
     * @param {*} key
     * @param {Function} comparator
     * @param {Number=} start
     * @param {Number=} end
     * @returns {*|null}
     */
    binarySearch(a, key, comparator, start, end) {
      assert.argumentIsArray(a, 'a');
      assert.argumentIsRequired(comparator, 'comparator', Function);
      assert.argumentIsOptional(start, 'start', Number);
      assert.argumentIsOptional(end, 'end', Number);
      if (a.length === 0) {
        return null;
      }
      return binarySearchForMatch(a, key, comparator, start || 0, end || a.length - 1);
    }
  };
  function binarySearchForMatch(a, key, comparator, start, end) {
    const size = end - start;
    const midpointIndex = start + Math.floor(size / 2);
    const midpointItem = a[midpointIndex];
    const comparison = comparator(key, midpointItem);
    if (comparison === 0) {
      return midpointItem;
    } else if (size < 2) {
      const finalIndex = a.length - 1;
      const finalItem = a[finalIndex];
      if (end === finalIndex && comparator(key, finalItem) === 0) {
        return finalItem;
      } else {
        return null;
      }
    } else if (comparison > 0) {
      return binarySearchForMatch(a, key, comparator, midpointIndex, end);
    } else {
      return binarySearchForMatch(a, key, comparator, start, midpointIndex);
    }
  }
  function binarySearchForInsert(a, item, comparator, start, end) {
    const size = end - start;
    const midpointIndex = start + Math.floor(size / 2);
    const midpointItem = a[midpointIndex];
    const comparison = comparator(item, midpointItem) > 0;
    if (size < 2) {
      if (comparison > 0) {
        const finalIndex = a.length - 1;
        if (end === finalIndex && comparator(item, a[finalIndex]) > 0) {
          return end + 1;
        } else {
          return end;
        }
      } else {
        return start;
      }
    } else if (comparison > 0) {
      return binarySearchForInsert(a, item, comparator, midpointIndex, end);
    } else {
      return binarySearchForInsert(a, item, comparator, start, midpointIndex);
    }
  }
})();

},{"./assert":46,"./is":47}],46:[function(require,module,exports){
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
     * @param {String=} variableName - The name of the value (used for formatting an error message).
     * @param {*=} type - The expected type of the argument.
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
     * @param {String=} variableName - The name of the value (used for formatting an error message).
     * @param {*=} type - The expected type of the argument.
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
     * @param {String=} variableName - The name of the value (used for formatting an error message).
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

},{"./is":47}],47:[function(require,module,exports){
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
     * Returns true if the argument is a number. NaN will return false.
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
     * Returns true if the argument is NaN.
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
     * Returns true if the argument is a valid 32-bit integer.
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
     * Returns true if the argument is a valid integer (which can exceed 32 bits); however,
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
     * Returns true if the argument is a number that is positive.
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
     * Returns true if the argument is a number that is negative.
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
     * Returns true if the argument is iterable.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    iterable(candidate) {
      return !this.null(candidate) && !this.undefined(candidate) && this.fn(candidate[Symbol.iterator]);
    },
    /**
     * Returns true if the argument is a string.
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
     * Returns true if the argument is a JavaScript Date instance.
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
     * Returns true if the argument is a function.
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
     * Returns true if the argument is an array.
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
     * Returns true if the argument is a Boolean value.
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
     * Returns true if the argument is an object.
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
     * Returns true if the argument is a null value.
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
     * Returns true if the argument is an undefined value.
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
     * Returns true if the argument is a zero-length string.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    zeroLengthString(candidate) {
      return this.string(candidate) && candidate.length === 0;
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

},{}],48:[function(require,module,exports){
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
      } else if (is.date(source)) {
        c = new Date(source.getTime());
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

},{"./array":45,"./is":47}],49:[function(require,module,exports){
const assert = require('./assert'),
  is = require('./is');
module.exports = (() => {
  'use strict';

  const regex = {};
  regex.camel = {};
  regex.camel.violations = /\b[A-Z]/g;

  /**
   * Utility functions for strings.
   *
   * @public
   * @module lang/string
   */
  return {
    /**
     * Adjusts a string, replacing the first character of each word with an uppercase
     * character and all subsequent characters in the word with lowercase characters.
     *
     * @public
     * @static
     * @param {String} s
     * @returns {String}
     */
    startCase(s) {
      return s.split(' ').reduce((phrase, word) => {
        if (word.length !== 0) {
          phrase.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
        }
        return phrase;
      }, []).join(' ');
    },
    /**
     * Adjust a string to use camel case, where the first letter of each word is replaced
     * with a lower case character.
     *
     * @public
     * @static
     * @param {String} s
     * @returns {String}
     */
    camelCase(s) {
      assert.argumentIsRequired(s, 's', String);
      return s.replace(regex.camel.violations, m => m.toLocaleLowerCase());
    },
    /**
     * If a string exceeds a desired length, it is truncated and a poor man's
     * ellipsis (i.e. three periods) is appended. Otherwise, the original
     * string is returned.
     *
     * @public
     * @static
     * @param {String} s
     * @param {Number} length
     * @returns {String}
     */
    truncate(s, length) {
      if (is.string(s) && s.length > length) {
        return s.substring(0, length) + ' ...';
      } else {
        return s;
      }
    },
    /**
     * Adds leading characters to a string, until the string length is a desired size.
     *
     * @public
     * @static
     * @param {String} s - The string to pad.
     * @param {Number} length - The desired overall length of the string.
     * @param {String} character - The character to use for padding.
     * @returns {String}
     */
    padLeft(s, length, character) {
      assert.argumentIsRequired(s, 's', String);
      assert.argumentIsRequired(length, 'length', Number);
      assert.argumentIsRequired(character, 'character', String);
      if (character.length !== 1) {
        throw new Error('The "character" argument must be one character in length.');
      }
      return character.repeat(length - s.length) + s;
    },
    /**
     * Performs a simple token replacement on a string; where the tokens
     * are braced numbers (e.g. {0}, {1}, {2}).
     *
     * @public
     * @static
     * @param {String} s - The string to format (e.g. 'my first name is {0} and my last name is {1}')
     * @param {Array<String>} data - The replacement data
     * @returns {String}
     */
    format(s, ...data) {
      assert.argumentIsRequired(s, 's', String);
      return s.replace(/{(\d+)}/g, (match, i) => {
        let replacement;
        if (i < data.length) {
          const item = data[i];
          if (!is.undefined(item) && !is.null(item)) {
            replacement = item.toString();
          } else {
            replacement = match;
          }
        } else {
          replacement = match;
        }
        return replacement;
      });
    }
  };
})();

},{"./assert":46,"./is":47}],50:[function(require,module,exports){
const moment = require('moment-timezone/builds/moment-timezone-with-data-2012-2022'),
  assert = require('./assert');
module.exports = (() => {
  'use strict';

  /**
   * Utilities for working with timezones.
   *
   * @public
   * @module lang/timezone
   */
  return {
    /**
     * Gets a list of names in the tz database (see https://en.wikipedia.org/wiki/Tz_database
     * and https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
     *
     * @public
     * @static
     * @returns {Array<String>}
     */
    getTimezones() {
      return moment.tz.names();
    },
    /**
     * Indicates if a timezone name exists.
     *
     * @public
     * @static
     * @param {String} name - The timezone name to find.
     * @returns {Boolean}
     */
    hasTimezone(name) {
      assert.argumentIsRequired(name, 'name', String);
      return this.getTimezones().some(candidate => {
        return candidate === name;
      });
    },
    /**
     * Attempts to guess the timezone of the current computer.
     *
     * @public
     * @static
     * @returns {String|null}
     */
    guessTimezone() {
      return moment.tz.guess() || null;
    }
  };
})();

},{"./assert":46,"moment-timezone/builds/moment-timezone-with-data-2012-2022":86}],51:[function(require,module,exports){
'use strict'

/**
 * "Shallow freezes" an object to render it immutable.
 * Uses `Object.freeze` if available,
 * otherwise the immutability is only in the type.
 *
 * Is used to create "enum like" objects.
 *
 * @template T
 * @param {T} object the object to freeze
 * @param {Pick<ObjectConstructor, 'freeze'> = Object} oc `Object` by default,
 * 				allows to inject custom object constructor for tests
 * @returns {Readonly<T>}
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
 */
function freeze(object, oc) {
	if (oc === undefined) {
		oc = Object
	}
	return oc && typeof oc.freeze === 'function' ? oc.freeze(object) : object
}

/**
 * Since we can not rely on `Object.assign` we provide a simplified version
 * that is sufficient for our needs.
 *
 * @param {Object} target
 * @param {Object | null | undefined} source
 *
 * @returns {Object} target
 * @throws TypeError if target is not an object
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 * @see https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.assign
 */
function assign(target, source) {
	if (target === null || typeof target !== 'object') {
		throw new TypeError('target is not an object')
	}
	for (var key in source) {
		if (Object.prototype.hasOwnProperty.call(source, key)) {
			target[key] = source[key]
		}
	}
	return target
}

/**
 * All mime types that are allowed as input to `DOMParser.parseFromString`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString#Argument02 MDN
 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#domparsersupportedtype WHATWG HTML Spec
 * @see DOMParser.prototype.parseFromString
 */
var MIME_TYPE = freeze({
	/**
	 * `text/html`, the only mime type that triggers treating an XML document as HTML.
	 *
	 * @see DOMParser.SupportedType.isHTML
	 * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
	 * @see https://en.wikipedia.org/wiki/HTML Wikipedia
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
	 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring WHATWG HTML Spec
	 */
	HTML: 'text/html',

	/**
	 * Helper method to check a mime type if it indicates an HTML document
	 *
	 * @param {string} [value]
	 * @returns {boolean}
	 *
	 * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
	 * @see https://en.wikipedia.org/wiki/HTML Wikipedia
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
	 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring 	 */
	isHTML: function (value) {
		return value === MIME_TYPE.HTML
	},

	/**
	 * `application/xml`, the standard mime type for XML documents.
	 *
	 * @see https://www.iana.org/assignments/media-types/application/xml IANA MimeType registration
	 * @see https://tools.ietf.org/html/rfc7303#section-9.1 RFC 7303
	 * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
	 */
	XML_APPLICATION: 'application/xml',

	/**
	 * `text/html`, an alias for `application/xml`.
	 *
	 * @see https://tools.ietf.org/html/rfc7303#section-9.2 RFC 7303
	 * @see https://www.iana.org/assignments/media-types/text/xml IANA MimeType registration
	 * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
	 */
	XML_TEXT: 'text/xml',

	/**
	 * `application/xhtml+xml`, indicates an XML document that has the default HTML namespace,
	 * but is parsed as an XML document.
	 *
	 * @see https://www.iana.org/assignments/media-types/application/xhtml+xml IANA MimeType registration
	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument WHATWG DOM Spec
	 * @see https://en.wikipedia.org/wiki/XHTML Wikipedia
	 */
	XML_XHTML_APPLICATION: 'application/xhtml+xml',

	/**
	 * `image/svg+xml`,
	 *
	 * @see https://www.iana.org/assignments/media-types/image/svg+xml IANA MimeType registration
	 * @see https://www.w3.org/TR/SVG11/ W3C SVG 1.1
	 * @see https://en.wikipedia.org/wiki/Scalable_Vector_Graphics Wikipedia
	 */
	XML_SVG_IMAGE: 'image/svg+xml',
})

/**
 * Namespaces that are used in this code base.
 *
 * @see http://www.w3.org/TR/REC-xml-names
 */
var NAMESPACE = freeze({
	/**
	 * The XHTML namespace.
	 *
	 * @see http://www.w3.org/1999/xhtml
	 */
	HTML: 'http://www.w3.org/1999/xhtml',

	/**
	 * Checks if `uri` equals `NAMESPACE.HTML`.
	 *
	 * @param {string} [uri]
	 *
	 * @see NAMESPACE.HTML
	 */
	isHTML: function (uri) {
		return uri === NAMESPACE.HTML
	},

	/**
	 * The SVG namespace.
	 *
	 * @see http://www.w3.org/2000/svg
	 */
	SVG: 'http://www.w3.org/2000/svg',

	/**
	 * The `xml:` namespace.
	 *
	 * @see http://www.w3.org/XML/1998/namespace
	 */
	XML: 'http://www.w3.org/XML/1998/namespace',

	/**
	 * The `xmlns:` namespace
	 *
	 * @see https://www.w3.org/2000/xmlns/
	 */
	XMLNS: 'http://www.w3.org/2000/xmlns/',
})

exports.assign = assign;
exports.freeze = freeze;
exports.MIME_TYPE = MIME_TYPE;
exports.NAMESPACE = NAMESPACE;

},{}],52:[function(require,module,exports){
var conventions = require("./conventions");
var dom = require('./dom')
var entities = require('./entities');
var sax = require('./sax');

var DOMImplementation = dom.DOMImplementation;

var NAMESPACE = conventions.NAMESPACE;

var ParseError = sax.ParseError;
var XMLReader = sax.XMLReader;

/**
 * Normalizes line ending according to https://www.w3.org/TR/xml11/#sec-line-ends:
 *
 * > XML parsed entities are often stored in computer files which,
 * > for editing convenience, are organized into lines.
 * > These lines are typically separated by some combination
 * > of the characters CARRIAGE RETURN (#xD) and LINE FEED (#xA).
 * >
 * > To simplify the tasks of applications, the XML processor must behave
 * > as if it normalized all line breaks in external parsed entities (including the document entity)
 * > on input, before parsing, by translating all of the following to a single #xA character:
 * >
 * > 1. the two-character sequence #xD #xA
 * > 2. the two-character sequence #xD #x85
 * > 3. the single character #x85
 * > 4. the single character #x2028
 * > 5. any #xD character that is not immediately followed by #xA or #x85.
 *
 * @param {string} input
 * @returns {string}
 */
function normalizeLineEndings(input) {
	return input
		.replace(/\r[\n\u0085]/g, '\n')
		.replace(/[\r\u0085\u2028]/g, '\n')
}

/**
 * @typedef Locator
 * @property {number} [columnNumber]
 * @property {number} [lineNumber]
 */

/**
 * @typedef DOMParserOptions
 * @property {DOMHandler} [domBuilder]
 * @property {Function} [errorHandler]
 * @property {(string) => string} [normalizeLineEndings] used to replace line endings before parsing
 * 						defaults to `normalizeLineEndings`
 * @property {Locator} [locator]
 * @property {Record<string, string>} [xmlns]
 *
 * @see normalizeLineEndings
 */

/**
 * The DOMParser interface provides the ability to parse XML or HTML source code
 * from a string into a DOM `Document`.
 *
 * _xmldom is different from the spec in that it allows an `options` parameter,
 * to override the default behavior._
 *
 * @param {DOMParserOptions} [options]
 * @constructor
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-parsing-and-serialization
 */
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
	var isHTML = /\/x?html?$/.test(mimeType);//mimeType.toLowerCase().indexOf('html') > -1;
  	var entityMap = isHTML ? entities.HTML_ENTITIES : entities.XML_ENTITIES;
	if(locator){
		domBuilder.setDocumentLocator(locator)
	}

	sax.errorHandler = buildErrorHandler(errorHandler,domBuilder,locator);
	sax.domBuilder = options.domBuilder || domBuilder;
	if(isHTML){
		defaultNSMap[''] = NAMESPACE.HTML;
	}
	defaultNSMap.xml = defaultNSMap.xml || NAMESPACE.XML;
	var normalize = options.normalizeLineEndings || normalizeLineEndings;
	if (source && typeof source === 'string') {
		sax.parse(
			normalize(source),
			defaultNSMap,
			entityMap
		)
	} else {
		sax.errorHandler.error('invalid doc source')
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
					this.doc.doctype = dt;
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
		throw new ParseError(error, this.locator);
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

exports.__DOMHandler = DOMHandler;
exports.normalizeLineEndings = normalizeLineEndings;
exports.DOMParser = DOMParser;

},{"./conventions":51,"./dom":53,"./entities":54,"./sax":56}],53:[function(require,module,exports){
var conventions = require("./conventions");

var NAMESPACE = conventions.NAMESPACE;

/**
 * A prerequisite for `[].filter`, to drop elements that are empty
 * @param {string} input
 * @returns {boolean}
 */
function notEmptyString (input) {
	return input !== ''
}
/**
 * @see https://infra.spec.whatwg.org/#split-on-ascii-whitespace
 * @see https://infra.spec.whatwg.org/#ascii-whitespace
 *
 * @param {string} input
 * @returns {string[]} (can be empty)
 */
function splitOnASCIIWhitespace(input) {
	// U+0009 TAB, U+000A LF, U+000C FF, U+000D CR, U+0020 SPACE
	return input ? input.split(/[\t\n\f\r ]+/).filter(notEmptyString) : []
}

/**
 * Adds element as a key to current if it is not already present.
 *
 * @param {Record<string, boolean | undefined>} current
 * @param {string} element
 * @returns {Record<string, boolean | undefined>}
 */
function orderedSetReducer (current, element) {
	if (!current.hasOwnProperty(element)) {
		current[element] = true;
	}
	return current;
}

/**
 * @see https://infra.spec.whatwg.org/#ordered-set
 * @param {string} input
 * @returns {string[]}
 */
function toOrderedSet(input) {
	if (!input) return [];
	var list = splitOnASCIIWhitespace(input);
	return Object.keys(list.reduce(orderedSetReducer, {}))
}

/**
 * Uses `list.indexOf` to implement something like `Array.prototype.includes`,
 * which we can not rely on being available.
 *
 * @param {any[]} list
 * @returns {function(any): boolean}
 */
function arrayIncludes (list) {
	return function(element) {
		return list && list.indexOf(element) !== -1;
	}
}

function copy(src,dest){
	for(var p in src){
		if (Object.prototype.hasOwnProperty.call(src, p)) {
			dest[p] = src[p];
		}
	}
}

/**
^\w+\.prototype\.([_\w]+)\s*=\s*((?:.*\{\s*?[\r\n][\s\S]*?^})|\S.*?(?=[;\r\n]));?
^\w+\.prototype\.([_\w]+)\s*=\s*(\S.*?(?=[;\r\n]));?
 */
function _extends(Class,Super){
	var pt = Class.prototype;
	if(!(pt instanceof Super)){
		function t(){};
		t.prototype = Super.prototype;
		t = new t();
		copy(pt,t);
		Class.prototype = pt = t;
	}
	if(pt.constructor != Class){
		if(typeof Class != 'function'){
			console.error("unknown Class:"+Class)
		}
		pt.constructor = Class
	}
}

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

/**
 * DOM Level 2
 * Object DOMException
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
 * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
 */
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
	},
	/**
	 * @private
	 * @param {function (Node):boolean} predicate
	 * @returns {Node | undefined}
	 */
	find: function (predicate) {
		return Array.prototype.find.call(this, predicate);
	},
	/**
	 * @private
	 * @param {function (Node):boolean} predicate
	 * @returns {Node[]}
	 */
	filter: function (predicate) {
		return Array.prototype.filter.call(this, predicate);
	},
	/**
	 * @private
	 * @param {Node} item
	 * @returns {number}
	 */
	indexOf: function (item) {
		return Array.prototype.indexOf.call(this, item);
	},
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
 * Objects implementing the NamedNodeMap interface are used
 * to represent collections of nodes that can be accessed by name.
 * Note that NamedNodeMap does not inherit from NodeList;
 * NamedNodeMaps are not maintained in any particular order.
 * Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index,
 * but this is simply to allow convenient enumeration of the contents of a NamedNodeMap,
 * and does not imply that the DOM specifies an order to these Nodes.
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
		throw new DOMException(NOT_FOUND_ERR,new Error(el.tagName+'@'+attr))
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
 * The DOMImplementation interface represents an object providing methods
 * which are not dependent on any particular document.
 * Such an object is returned by the `Document.implementation` property.
 *
 * __The individual methods describe the differences compared to the specs.__
 *
 * @constructor
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation MDN
 * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490 DOM Level 1 Core (Initial)
 * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-102161490 DOM Level 2 Core
 * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-102161490 DOM Level 3 Core
 * @see https://dom.spec.whatwg.org/#domimplementation DOM Living Standard
 */
function DOMImplementation() {
}

DOMImplementation.prototype = {
	/**
	 * The DOMImplementation.hasFeature() method returns a Boolean flag indicating if a given feature is supported.
	 * The different implementations fairly diverged in what kind of features were reported.
	 * The latest version of the spec settled to force this method to always return true, where the functionality was accurate and in use.
	 *
	 * @deprecated It is deprecated and modern browsers return true in all cases.
	 *
	 * @param {string} feature
	 * @param {string} [version]
	 * @returns {boolean} always true
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/hasFeature MDN
	 * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-5CED94D7 DOM Level 1 Core
	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-hasfeature DOM Living Standard
	 */
	hasFeature: function(feature, version) {
			return true;
	},
	/**
	 * Creates an XML Document object of the specified type with its document element.
	 *
	 * __It behaves slightly different from the description in the living standard__:
	 * - There is no interface/class `XMLDocument`, it returns a `Document` instance.
	 * - `contentType`, `encoding`, `mode`, `origin`, `url` fields are currently not declared.
	 * - this implementation is not validating names or qualified names
	 *   (when parsing XML strings, the SAX parser takes care of that)
	 *
	 * @param {string|null} namespaceURI
	 * @param {string} qualifiedName
	 * @param {DocumentType=null} doctype
	 * @returns {Document}
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocument MDN
	 * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocument DOM Level 2 Core (initial)
	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument  DOM Level 2 Core
	 *
	 * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
	 * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
	 * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
	 */
	createDocument: function(namespaceURI,  qualifiedName, doctype){
		var doc = new Document();
		doc.implementation = this;
		doc.childNodes = new NodeList();
		doc.doctype = doctype || null;
		if (doctype){
			doc.appendChild(doctype);
		}
		if (qualifiedName){
			var root = doc.createElementNS(namespaceURI, qualifiedName);
			doc.appendChild(root);
		}
		return doc;
	},
	/**
	 * Returns a doctype, with the given `qualifiedName`, `publicId`, and `systemId`.
	 *
	 * __This behavior is slightly different from the in the specs__:
	 * - this implementation is not validating names or qualified names
	 *   (when parsing XML strings, the SAX parser takes care of that)
	 *
	 * @param {string} qualifiedName
	 * @param {string} [publicId]
	 * @param {string} [systemId]
	 * @returns {DocumentType} which can either be used with `DOMImplementation.createDocument` upon document creation
	 * 				  or can be put into the document via methods like `Node.insertBefore()` or `Node.replaceChild()`
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocumentType MDN
	 * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocType DOM Level 2 Core
	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocumenttype DOM Living Standard
	 *
	 * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
	 * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
	 * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
	 */
	createDocumentType: function(qualifiedName, publicId, systemId){
		var node = new DocumentType();
		node.name = qualifiedName;
		node.nodeName = qualifiedName;
		node.publicId = publicId || '';
		node.systemId = systemId || '';

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
	/**
	 * Look up the prefix associated to the given namespace URI, starting from this node.
	 * **The default namespace declarations are ignored by this method.**
	 * See Namespace Prefix Lookup for details on the algorithm used by this method.
	 *
	 * _Note: The implementation seems to be incomplete when compared to the algorithm described in the specs._
	 *
	 * @param {string | null} namespaceURI
	 * @returns {string | null}
	 * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespacePrefix
	 * @see https://www.w3.org/TR/DOM-Level-3-Core/namespaces-algorithms.html#lookupNamespacePrefixAlgo
	 * @see https://dom.spec.whatwg.org/#dom-node-lookupprefix
	 * @see https://github.com/xmldom/xmldom/issues/322
	 */
    lookupPrefix:function(namespaceURI){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			for(var n in map){
						if (Object.prototype.hasOwnProperty.call(map, n) && map[n] === namespaceURI) {
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
    			if(Object.prototype.hasOwnProperty.call(map, prefix)){
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
	if(ns === NAMESPACE.XMLNS){
		//update namespace
		el._nsMap[newAttr.prefix?newAttr.localName:''] = newAttr.value
	}
}

function _onRemoveAttribute(doc,el,newAttr,remove){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns === NAMESPACE.XMLNS){
		//update namespace
		delete el._nsMap[newAttr.prefix?newAttr.localName:'']
	}
}

/**
 * Updates `el.childNodes`, updating the indexed items and it's `length`.
 * Passing `newChild` means it will be appended.
 * Otherwise it's assumed that an item has been removed,
 * and `el.firstNode` and it's `.nextSibling` are used
 * to walk the current list of child nodes.
 *
 * @param {Document} doc
 * @param {Node} el
 * @param {Node} [newChild]
 * @private
 */
function _onUpdateChild (doc, el, newChild) {
	if(doc && doc._inc){
		doc._inc++;
		//update childNodes
		var cs = el.childNodes;
		if (newChild) {
			cs[cs.length++] = newChild;
		} else {
			var child = el.firstChild;
			var i = 0;
			while (child) {
				cs[i++] = child;
				child = child.nextSibling;
			}
			cs.length = i;
			delete cs[cs.length];
		}
	}
}

/**
 * Removes the connections between `parentNode` and `child`
 * and any existing `child.previousSibling` or `child.nextSibling`.
 *
 * @see https://github.com/xmldom/xmldom/issues/135
 * @see https://github.com/xmldom/xmldom/issues/145
 *
 * @param {Node} parentNode
 * @param {Node} child
 * @returns {Node} the child that was removed.
 * @private
 */
function _removeChild (parentNode, child) {
	var previous = child.previousSibling;
	var next = child.nextSibling;
	if (previous) {
		previous.nextSibling = next;
	} else {
		parentNode.firstChild = next;
	}
	if (next) {
		next.previousSibling = previous;
	} else {
		parentNode.lastChild = previous;
	}
	child.parentNode = null;
	child.previousSibling = null;
	child.nextSibling = null;
	_onUpdateChild(parentNode.ownerDocument, parentNode);
	return child;
}

/**
 * Returns `true` if `node` can be a parent for insertion.
 * @param {Node} node
 * @returns {boolean}
 */
function hasValidParentNodeType(node) {
	return (
		node &&
		(node.nodeType === Node.DOCUMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node.ELEMENT_NODE)
	);
}

/**
 * Returns `true` if `node` can be inserted according to it's `nodeType`.
 * @param {Node} node
 * @returns {boolean}
 */
function hasInsertableNodeType(node) {
	return (
		node &&
		(isElementNode(node) ||
			isTextNode(node) ||
			isDocTypeNode(node) ||
			node.nodeType === Node.DOCUMENT_FRAGMENT_NODE ||
			node.nodeType === Node.COMMENT_NODE ||
			node.nodeType === Node.PROCESSING_INSTRUCTION_NODE)
	);
}

/**
 * Returns true if `node` is a DOCTYPE node
 * @param {Node} node
 * @returns {boolean}
 */
function isDocTypeNode(node) {
	return node && node.nodeType === Node.DOCUMENT_TYPE_NODE;
}

/**
 * Returns true if the node is an element
 * @param {Node} node
 * @returns {boolean}
 */
function isElementNode(node) {
	return node && node.nodeType === Node.ELEMENT_NODE;
}
/**
 * Returns true if `node` is a text node
 * @param {Node} node
 * @returns {boolean}
 */
function isTextNode(node) {
	return node && node.nodeType === Node.TEXT_NODE;
}

/**
 * Check if en element node can be inserted before `child`, or at the end if child is falsy,
 * according to the presence and position of a doctype node on the same level.
 *
 * @param {Document} doc The document node
 * @param {Node} child the node that would become the nextSibling if the element would be inserted
 * @returns {boolean} `true` if an element can be inserted before child
 * @private
 * https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
 */
function isElementInsertionPossible(doc, child) {
	var parentChildNodes = doc.childNodes || [];
	if (parentChildNodes.find(isElementNode) || isDocTypeNode(child)) {
		return false;
	}
	var docTypeNode = parentChildNodes.find(isDocTypeNode);
	return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
}
/**
 * @private
 * @param {Node} parent the parent node to insert `node` into
 * @param {Node} node the node to insert
 * @param {Node=} child the node that should become the `nextSibling` of `node`
 * @returns {Node}
 * @throws DOMException for several node combinations that would create a DOM that is not well-formed.
 * @throws DOMException if `child` is provided but is not a child of `parent`.
 * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
 */
function _insertBefore(parent, node, child) {
	if (!hasValidParentNodeType(parent)) {
		throw new DOMException(HIERARCHY_REQUEST_ERR, 'Unexpected parent node type ' + parent.nodeType);
	}
	if (child && child.parentNode !== parent) {
		throw new DOMException(NOT_FOUND_ERR, 'child not in parent');
	}
	if (
		!hasInsertableNodeType(node) ||
		// the sax parser currently adds top level text nodes, this will be fixed in 0.9.0
		// || (node.nodeType === Node.TEXT_NODE && parent.nodeType === Node.DOCUMENT_NODE)
		(isDocTypeNode(node) && parent.nodeType !== Node.DOCUMENT_NODE)
	) {
		throw new DOMException(
			HIERARCHY_REQUEST_ERR,
			'Unexpected node type ' + node.nodeType + ' for parent node type ' + parent.nodeType
		);
	}
	var parentChildNodes = parent.childNodes || [];
	var nodeChildNodes = node.childNodes || [];
	if (parent.nodeType === Node.DOCUMENT_NODE) {
		if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
			let nodeChildElements = nodeChildNodes.filter(isElementNode);
			if (nodeChildElements.length > 1 || nodeChildNodes.find(isTextNode)) {
				throw new DOMException(HIERARCHY_REQUEST_ERR, 'More than one element or text in fragment');
			}
			if (nodeChildElements.length === 1 && !isElementInsertionPossible(parent, child)) {
				throw new DOMException(HIERARCHY_REQUEST_ERR, 'Element in fragment can not be inserted before doctype');
			}
		}
		if (isElementNode(node)) {
			if (parentChildNodes.find(isElementNode) || !isElementInsertionPossible(parent, child)) {
				throw new DOMException(HIERARCHY_REQUEST_ERR, 'Only one element can be added and only after doctype');
			}
		}
		if (isDocTypeNode(node)) {
			if (parentChildNodes.find(isDocTypeNode)) {
				throw new DOMException(HIERARCHY_REQUEST_ERR, 'Only one doctype is allowed');
			}
			let parentElementChild = parentChildNodes.find(isElementNode);
			if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
				throw new DOMException(HIERARCHY_REQUEST_ERR, 'Doctype can only be inserted before an element');
			}
			if (!child && parentElementChild) {
				throw new DOMException(HIERARCHY_REQUEST_ERR, 'Doctype can not be appended since element is present');
			}
		}
	}

	var cp = node.parentNode;
	if(cp){
		cp.removeChild(node);//remove and update
	}
	if(node.nodeType === DOCUMENT_FRAGMENT_NODE){
		var newFirst = node.firstChild;
		if (newFirst == null) {
			return node;
		}
		var newLast = node.lastChild;
	}else{
		newFirst = newLast = node;
	}
	var pre = child ? child.previousSibling : parent.lastChild;

	newFirst.previousSibling = pre;
	newLast.nextSibling = child;


	if(pre){
		pre.nextSibling = newFirst;
	}else{
		parent.firstChild = newFirst;
	}
	if(child == null){
		parent.lastChild = newLast;
	}else{
		child.previousSibling = newLast;
	}
	do{
		newFirst.parentNode = parent;
	}while(newFirst !== newLast && (newFirst= newFirst.nextSibling))
	_onUpdateChild(parent.ownerDocument||parent, parent);
	//console.log(parent.lastChild.nextSibling == null)
	if (node.nodeType == DOCUMENT_FRAGMENT_NODE) {
		node.firstChild = node.lastChild = null;
	}
	return node;
}

/**
 * Appends `newChild` to `parentNode`.
 * If `newChild` is already connected to a `parentNode` it is first removed from it.
 *
 * @see https://github.com/xmldom/xmldom/issues/135
 * @see https://github.com/xmldom/xmldom/issues/145
 * @param {Node} parentNode
 * @param {Node} newChild
 * @returns {Node}
 * @private
 */
function _appendSingleChild (parentNode, newChild) {
	if (newChild.parentNode) {
		newChild.parentNode.removeChild(newChild);
	}
	newChild.parentNode = parentNode;
	newChild.previousSibling = parentNode.lastChild;
	newChild.nextSibling = null;
	if (newChild.previousSibling) {
		newChild.previousSibling.nextSibling = newChild;
	} else {
		parentNode.firstChild = newChild;
	}
	parentNode.lastChild = newChild;
	_onUpdateChild(parentNode.ownerDocument, parentNode, newChild);
	return newChild;
}

Document.prototype = {
	//implementation : null,
	nodeName :  '#document',
	nodeType :  DOCUMENT_NODE,
	/**
	 * The DocumentType node of the document.
	 *
	 * @readonly
	 * @type DocumentType
	 */
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
		_insertBefore(this, newChild, refChild);
		newChild.ownerDocument = this;
		if (this.documentElement === null && newChild.nodeType === ELEMENT_NODE) {
			this.documentElement = newChild;
		}

		return newChild;
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

	/**
	 * The `getElementsByClassName` method of `Document` interface returns an array-like object
	 * of all child elements which have **all** of the given class name(s).
	 *
	 * Returns an empty list if `classeNames` is an empty string or only contains HTML white space characters.
	 *
	 *
	 * Warning: This is a live LiveNodeList.
	 * Changes in the DOM will reflect in the array as the changes occur.
	 * If an element selected by this array no longer qualifies for the selector,
	 * it will automatically be removed. Be aware of this for iteration purposes.
	 *
	 * @param {string} classNames is a string representing the class name(s) to match; multiple class names are separated by (ASCII-)whitespace
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
	 * @see https://dom.spec.whatwg.org/#concept-getelementsbyclassname
	 */
	getElementsByClassName: function(classNames) {
		var classNamesSet = toOrderedSet(classNames)
		return new LiveNodeList(this, function(base) {
			var ls = [];
			if (classNamesSet.length > 0) {
				_visitNode(base.documentElement, function(node) {
					if(node !== base && node.nodeType === ELEMENT_NODE) {
						var nodeClassNames = node.getAttribute('class')
						// can be null if the attribute does not exist
						if (nodeClassNames) {
							// before splitting and iterating just compare them for the most common case
							var matches = classNames === nodeClassNames;
							if (!matches) {
								var nodeClassNamesSet = toOrderedSet(nodeClassNames)
								matches = classNamesSet.every(arrayIncludes(nodeClassNamesSet))
							}
							if(matches) {
								ls.push(node);
							}
						}
					}
				});
			}
			return ls;
		});
	},

	//document factory method:
	createElement :	function(tagName){
		var node = new Element();
		node.ownerDocument = this;
		node.nodeName = tagName;
		node.tagName = tagName;
		node.localName = tagName;
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
	var refNode = this.nodeType == 9 && this.documentElement || this;
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

function needNamespaceDefine(node, isHTML, visibleNamespaces) {
	var prefix = node.prefix || '';
	var uri = node.namespaceURI;
	// According to [Namespaces in XML 1.0](https://www.w3.org/TR/REC-xml-names/#ns-using) ,
	// and more specifically https://www.w3.org/TR/REC-xml-names/#nsc-NoPrefixUndecl :
	// > In a namespace declaration for a prefix [...], the attribute value MUST NOT be empty.
	// in a similar manner [Namespaces in XML 1.1](https://www.w3.org/TR/xml-names11/#ns-using)
	// and more specifically https://www.w3.org/TR/xml-names11/#nsc-NSDeclared :
	// > [...] Furthermore, the attribute value [...] must not be an empty string.
	// so serializing empty namespace value like xmlns:ds="" would produce an invalid XML document.
	if (!uri) {
		return false;
	}
	if (prefix === "xml" && uri === NAMESPACE.XML || uri === NAMESPACE.XMLNS) {
		return false;
	}

	var i = visibleNamespaces.length
	while (i--) {
		var ns = visibleNamespaces[i];
		// get namespace prefix
		if (ns.prefix === prefix) {
			return ns.namespace !== uri;
		}
	}
	return true;
}
/**
 * Well-formed constraint: No < in Attribute Values
 * > The replacement text of any entity referred to directly or indirectly
 * > in an attribute value must not contain a <.
 * @see https://www.w3.org/TR/xml11/#CleanAttrVals
 * @see https://www.w3.org/TR/xml11/#NT-AttValue
 *
 * Literal whitespace other than space that appear in attribute values
 * are serialized as their entity references, so they will be preserved.
 * (In contrast to whitespace literals in the input which are normalized to spaces)
 * @see https://www.w3.org/TR/xml11/#AVNormalize
 * @see https://w3c.github.io/DOM-Parsing/#serializing-an-element-s-attributes
 */
function addSerializedAttribute(buf, qualifiedName, value) {
	buf.push(' ', qualifiedName, '="', value.replace(/[<>&"\t\n\r]/g, _xmlEncoder), '"')
}

function serializeToString(node,buf,isHTML,nodeFilter,visibleNamespaces){
	if (!visibleNamespaces) {
		visibleNamespaces = [];
	}

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
		var attrs = node.attributes;
		var len = attrs.length;
		var child = node.firstChild;
		var nodeName = node.tagName;

		isHTML = NAMESPACE.isHTML(node.namespaceURI) || isHTML

		var prefixedNodeName = nodeName
		if (!isHTML && !node.prefix && node.namespaceURI) {
			var defaultNS
			// lookup current default ns from `xmlns` attribute
			for (var ai = 0; ai < attrs.length; ai++) {
				if (attrs.item(ai).name === 'xmlns') {
					defaultNS = attrs.item(ai).value
					break
				}
			}
			if (!defaultNS) {
				// lookup current default ns in visibleNamespaces
				for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
					var namespace = visibleNamespaces[nsi]
					if (namespace.prefix === '' && namespace.namespace === node.namespaceURI) {
						defaultNS = namespace.namespace
						break
					}
				}
			}
			if (defaultNS !== node.namespaceURI) {
				for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
					var namespace = visibleNamespaces[nsi]
					if (namespace.namespace === node.namespaceURI) {
						if (namespace.prefix) {
							prefixedNodeName = namespace.prefix + ':' + nodeName
						}
						break
					}
				}
			}
		}

		buf.push('<', prefixedNodeName);

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
				addSerializedAttribute(buf, prefix ? 'xmlns:' + prefix : "xmlns", uri);
				visibleNamespaces.push({ prefix: prefix, namespace:uri });
			}
			serializeToString(attr,buf,isHTML,nodeFilter,visibleNamespaces);
		}

		// add namespace for current node
		if (nodeName === prefixedNodeName && needNamespaceDefine(node, isHTML, visibleNamespaces)) {
			var prefix = node.prefix||'';
			var uri = node.namespaceURI;
			addSerializedAttribute(buf, prefix ? 'xmlns:' + prefix : "xmlns", uri);
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
						serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
					}
					child = child.nextSibling;
				}
			}else
			{
				while(child){
					serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
					child = child.nextSibling;
				}
			}
			buf.push('</',prefixedNodeName,'>');
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
			serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
			child = child.nextSibling;
		}
		return;
	case ATTRIBUTE_NODE:
		return addSerializedAttribute(buf, node.name, node.value);
	case TEXT_NODE:
		/**
		 * The ampersand character (&) and the left angle bracket (<) must not appear in their literal form,
		 * except when used as markup delimiters, or within a comment, a processing instruction, or a CDATA section.
		 * If they are needed elsewhere, they must be escaped using either numeric character references or the strings
		 * `&amp;` and `&lt;` respectively.
		 * The right angle bracket (>) may be represented using the string " &gt; ", and must, for compatibility,
		 * be escaped using either `&gt;` or a character reference when it appears in the string `]]>` in content,
		 * when that string is not marking the end of a CDATA section.
		 *
		 * In the content of elements, character data is any string of characters
		 * which does not contain the start-delimiter of any markup
		 * and does not include the CDATA-section-close delimiter, `]]>`.
		 *
		 * @see https://www.w3.org/TR/xml/#NT-CharData
		 * @see https://w3c.github.io/DOM-Parsing/#xml-serializing-a-text-node
		 */
		return buf.push(node.data
			.replace(/[<&>]/g,_xmlEncoder)
		);
	case CDATA_SECTION_NODE:
		return buf.push( '<![CDATA[',node.data,']]>');
	case COMMENT_NODE:
		return buf.push( "<!--",node.data,"-->");
	case DOCUMENT_TYPE_NODE:
		var pubid = node.publicId;
		var sysid = node.systemId;
		buf.push('<!DOCTYPE ',node.name);
		if(pubid){
			buf.push(' PUBLIC ', pubid);
			if (sysid && sysid!='.') {
				buf.push(' ', sysid);
			}
			buf.push('>');
		}else if(sysid && sysid!='.'){
			buf.push(' SYSTEM ', sysid, '>');
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
	for (var n in node) {
		if (Object.prototype.hasOwnProperty.call(node, n)) {
			var v = node[n];
			if (typeof v != "object") {
				if (v != node2[n]) {
					node2[n] = v;
				}
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
	exports.DocumentType = DocumentType;
	exports.DOMException = DOMException;
	exports.DOMImplementation = DOMImplementation;
	exports.Element = Element;
	exports.Node = Node;
	exports.NodeList = NodeList;
	exports.XMLSerializer = XMLSerializer;
//}

},{"./conventions":51}],54:[function(require,module,exports){
var freeze = require('./conventions').freeze;

/**
 * The entities that are predefined in every XML document.
 *
 * @see https://www.w3.org/TR/2006/REC-xml11-20060816/#sec-predefined-ent W3C XML 1.1
 * @see https://www.w3.org/TR/2008/REC-xml-20081126/#sec-predefined-ent W3C XML 1.0
 * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Predefined_entities_in_XML Wikipedia
 */
exports.XML_ENTITIES = freeze({amp:'&', apos:"'", gt:'>', lt:'<', quot:'"'})

/**
 * A map of currently 241 entities that are detected in an HTML document.
 * They contain all entries from `XML_ENTITIES`.
 *
 * @see XML_ENTITIES
 * @see DOMParser.parseFromString
 * @see DOMImplementation.prototype.createHTMLDocument
 * @see https://html.spec.whatwg.org/#named-character-references WHATWG HTML(5) Spec
 * @see https://www.w3.org/TR/xml-entity-names/ W3C XML Entity Names
 * @see https://www.w3.org/TR/html4/sgml/entities.html W3C HTML4/SGML
 * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Character_entity_references_in_HTML Wikipedia (HTML)
 * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Entities_representing_special_characters_in_XHTML Wikpedia (XHTML)
 */
exports.HTML_ENTITIES = freeze({
       lt: '<',
       gt: '>',
       amp: '&',
       quot: '"',
       apos: "'",
       Agrave: "À",
       Aacute: "Á",
       Acirc: "Â",
       Atilde: "Ã",
       Auml: "Ä",
       Aring: "Å",
       AElig: "Æ",
       Ccedil: "Ç",
       Egrave: "È",
       Eacute: "É",
       Ecirc: "Ê",
       Euml: "Ë",
       Igrave: "Ì",
       Iacute: "Í",
       Icirc: "Î",
       Iuml: "Ï",
       ETH: "Ð",
       Ntilde: "Ñ",
       Ograve: "Ò",
       Oacute: "Ó",
       Ocirc: "Ô",
       Otilde: "Õ",
       Ouml: "Ö",
       Oslash: "Ø",
       Ugrave: "Ù",
       Uacute: "Ú",
       Ucirc: "Û",
       Uuml: "Ü",
       Yacute: "Ý",
       THORN: "Þ",
       szlig: "ß",
       agrave: "à",
       aacute: "á",
       acirc: "â",
       atilde: "ã",
       auml: "ä",
       aring: "å",
       aelig: "æ",
       ccedil: "ç",
       egrave: "è",
       eacute: "é",
       ecirc: "ê",
       euml: "ë",
       igrave: "ì",
       iacute: "í",
       icirc: "î",
       iuml: "ï",
       eth: "ð",
       ntilde: "ñ",
       ograve: "ò",
       oacute: "ó",
       ocirc: "ô",
       otilde: "õ",
       ouml: "ö",
       oslash: "ø",
       ugrave: "ù",
       uacute: "ú",
       ucirc: "û",
       uuml: "ü",
       yacute: "ý",
       thorn: "þ",
       yuml: "ÿ",
       nbsp: "\u00a0",
       iexcl: "¡",
       cent: "¢",
       pound: "£",
       curren: "¤",
       yen: "¥",
       brvbar: "¦",
       sect: "§",
       uml: "¨",
       copy: "©",
       ordf: "ª",
       laquo: "«",
       not: "¬",
       shy: "­­",
       reg: "®",
       macr: "¯",
       deg: "°",
       plusmn: "±",
       sup2: "²",
       sup3: "³",
       acute: "´",
       micro: "µ",
       para: "¶",
       middot: "·",
       cedil: "¸",
       sup1: "¹",
       ordm: "º",
       raquo: "»",
       frac14: "¼",
       frac12: "½",
       frac34: "¾",
       iquest: "¿",
       times: "×",
       divide: "÷",
       forall: "∀",
       part: "∂",
       exist: "∃",
       empty: "∅",
       nabla: "∇",
       isin: "∈",
       notin: "∉",
       ni: "∋",
       prod: "∏",
       sum: "∑",
       minus: "−",
       lowast: "∗",
       radic: "√",
       prop: "∝",
       infin: "∞",
       ang: "∠",
       and: "∧",
       or: "∨",
       cap: "∩",
       cup: "∪",
       'int': "∫",
       there4: "∴",
       sim: "∼",
       cong: "≅",
       asymp: "≈",
       ne: "≠",
       equiv: "≡",
       le: "≤",
       ge: "≥",
       sub: "⊂",
       sup: "⊃",
       nsub: "⊄",
       sube: "⊆",
       supe: "⊇",
       oplus: "⊕",
       otimes: "⊗",
       perp: "⊥",
       sdot: "⋅",
       Alpha: "Α",
       Beta: "Β",
       Gamma: "Γ",
       Delta: "Δ",
       Epsilon: "Ε",
       Zeta: "Ζ",
       Eta: "Η",
       Theta: "Θ",
       Iota: "Ι",
       Kappa: "Κ",
       Lambda: "Λ",
       Mu: "Μ",
       Nu: "Ν",
       Xi: "Ξ",
       Omicron: "Ο",
       Pi: "Π",
       Rho: "Ρ",
       Sigma: "Σ",
       Tau: "Τ",
       Upsilon: "Υ",
       Phi: "Φ",
       Chi: "Χ",
       Psi: "Ψ",
       Omega: "Ω",
       alpha: "α",
       beta: "β",
       gamma: "γ",
       delta: "δ",
       epsilon: "ε",
       zeta: "ζ",
       eta: "η",
       theta: "θ",
       iota: "ι",
       kappa: "κ",
       lambda: "λ",
       mu: "μ",
       nu: "ν",
       xi: "ξ",
       omicron: "ο",
       pi: "π",
       rho: "ρ",
       sigmaf: "ς",
       sigma: "σ",
       tau: "τ",
       upsilon: "υ",
       phi: "φ",
       chi: "χ",
       psi: "ψ",
       omega: "ω",
       thetasym: "ϑ",
       upsih: "ϒ",
       piv: "ϖ",
       OElig: "Œ",
       oelig: "œ",
       Scaron: "Š",
       scaron: "š",
       Yuml: "Ÿ",
       fnof: "ƒ",
       circ: "ˆ",
       tilde: "˜",
       ensp: " ",
       emsp: " ",
       thinsp: " ",
       zwnj: "‌",
       zwj: "‍",
       lrm: "‎",
       rlm: "‏",
       ndash: "–",
       mdash: "—",
       lsquo: "‘",
       rsquo: "’",
       sbquo: "‚",
       ldquo: "“",
       rdquo: "”",
       bdquo: "„",
       dagger: "†",
       Dagger: "‡",
       bull: "•",
       hellip: "…",
       permil: "‰",
       prime: "′",
       Prime: "″",
       lsaquo: "‹",
       rsaquo: "›",
       oline: "‾",
       euro: "€",
       trade: "™",
       larr: "←",
       uarr: "↑",
       rarr: "→",
       darr: "↓",
       harr: "↔",
       crarr: "↵",
       lceil: "⌈",
       rceil: "⌉",
       lfloor: "⌊",
       rfloor: "⌋",
       loz: "◊",
       spades: "♠",
       clubs: "♣",
       hearts: "♥",
       diams: "♦"
});

/**
 * @deprecated use `HTML_ENTITIES` instead
 * @see HTML_ENTITIES
 */
exports.entityMap = exports.HTML_ENTITIES

},{"./conventions":51}],55:[function(require,module,exports){
var dom = require('./dom')
exports.DOMImplementation = dom.DOMImplementation
exports.XMLSerializer = dom.XMLSerializer
exports.DOMParser = require('./dom-parser').DOMParser

},{"./dom":53,"./dom-parser":52}],56:[function(require,module,exports){
var NAMESPACE = require("./conventions").NAMESPACE;

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

/**
 * Creates an error that will not be caught by XMLReader aka the SAX parser.
 *
 * @param {string} message
 * @param {any?} locator Optional, can provide details about the location in the source
 * @constructor
 */
function ParseError(message, locator) {
	this.message = message
	this.locator = locator
	if(Error.captureStackTrace) Error.captureStackTrace(this, ParseError);
}
ParseError.prototype = new Error();
ParseError.prototype.name = ParseError.name

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
		if (Object.hasOwnProperty.call(entityMap, k)) {
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
				var tagName = source.substring(tagStart + 2, end).replace(/[ \t\n\r]+$/g, '');
				var config = parseStack.pop();
				if(end<0){

	        		tagName = source.substring(tagStart+2).replace(/[\s<].*/,'');
	        		errorHandler.error("end tag name: "+tagName+' is not complete:'+config.tagName);
	        		end = tagStart+1+tagName.length;
	        	}else if(tagName.match(/\s</)){
	        		tagName = tagName.replace(/[\s<].*/,'');
	        		errorHandler.error("end tag name: "+tagName+' maybe not complete');
	        		end = tagStart+1+tagName.length;
				}
				var localNSMap = config.localNSMap;
				var endMatch = config.tagName == tagName;
				var endIgnoreCaseMach = endMatch || config.tagName&&config.tagName.toLowerCase() == tagName.toLowerCase()
		        if(endIgnoreCaseMach){
		        	domBuilder.endElement(config.uri,config.localName,tagName);
					if(localNSMap){
						for (var prefix in localNSMap) {
							if (Object.prototype.hasOwnProperty.call(localNSMap, prefix)) {
								domBuilder.endPrefixMapping(prefix);
							}
						}
					}
					if(!endMatch){
		            	errorHandler.fatalError("end tag name: "+tagName+' is not match the current start tagName:'+config.tagName ); // No known test case
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

				if (NAMESPACE.isHTML(el.uri) && !el.closed) {
					end = parseHtmlSpecialContent(source,end,el.tagName,entityReplacer,domBuilder)
				} else {
					end++;
				}
			}
		}catch(e){
			if (e instanceof ParseError) {
				throw e;
			}
			errorHandler.error('element parse error: '+e)
			end = -1;
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

	/**
	 * @param {string} qname
	 * @param {string} value
	 * @param {number} startIndex
	 */
	function addAttribute(qname, value, startIndex) {
		if (el.attributeNames.hasOwnProperty(qname)) {
			errorHandler.fatalError('Attribute ' + qname + ' redefined')
		}
		el.addValue(
			qname,
			// @see https://www.w3.org/TR/xml/#AVNormalize
			// since the xmldom sax parser does not "interpret" DTD the following is not implemented:
			// - recursive replacement of (DTD) entity references
			// - trimming and collapsing multiple spaces into a single one for attributes that are not of type CDATA
			value.replace(/[\t\n\r]/g, ' ').replace(/&#?\w+;/g, entityReplacer),
			startIndex
		)
	}
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
				throw new Error('attribute equal must after attrName'); // No known test case
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
					value = source.slice(start, p);
					addAttribute(attrName, value, start-1);
					s = S_ATTR_END;
				}else{
					//fatalError: no end quot match
					throw new Error('attribute value no end \''+c+'\' match');
				}
			}else if(s == S_ATTR_NOQUOT_VALUE){
				value = source.slice(start, p);
				addAttribute(attrName, value, start);
				errorHandler.warning('attribute "'+attrName+'" missed start quot('+c+')!!');
				start = p+1;
				s = S_ATTR_END
			}else{
				//fatalError: no equal before
				throw new Error('attribute value must after "="'); // No known test case
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
				throw new Error("attribute invalid close char('/')") // No known test case
			}
			break;
		case ''://end document
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
					errorHandler.warning('attribute "'+value+'" missed quot(")!');
					addAttribute(attrName, value, start)
				}else{
					if(!NAMESPACE.isHTML(currentNSMap['']) || !value.match(/^(?:disabled|checked|selected)$/i)){
						errorHandler.warning('attribute "'+value+'" missed value!! "'+value+'" instead!!')
					}
					addAttribute(value, value, start)
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
					var value = source.slice(start, p);
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					addAttribute(attrName, value, start)
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
					if (!NAMESPACE.isHTML(currentNSMap['']) || !attrName.match(/^(?:disabled|checked|selected)$/i)) {
						errorHandler.warning('attribute "'+attrName+'" missed value!! "'+attrName+'" instead2!!')
					}
					addAttribute(attrName, attrName, start);
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
			a.uri = NAMESPACE.XMLNS
			domBuilder.startPrefixMapping(nsPrefix, value)
		}
	}
	var i = el.length;
	while(i--){
		a = el[i];
		var prefix = a.prefix;
		if(prefix){//no prefix attribute has no namespace
			if(prefix === 'xml'){
				a.uri = NAMESPACE.XML;
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
			for (prefix in localNSMap) {
				if (Object.prototype.hasOwnProperty.call(localNSMap, prefix)) {
					domBuilder.endPrefixMapping(prefix);
				}
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

function _copy (source, target) {
	for (var n in source) {
		if (Object.prototype.hasOwnProperty.call(source, n)) {
			target[n] = source[n];
		}
	}
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
			var pubid = false;
			var sysid = false;
			if(len>3){
				if(/^public$/i.test(matchs[2][0])){
					pubid = matchs[3][0];
					sysid = len>4 && matchs[4][0];
				}else if(/^system$/i.test(matchs[2][0])){
					sysid = matchs[3][0];
				}
			}
			var lastMatch = matchs[len-1]
			domBuilder.startDTD(name, pubid, sysid);
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

function ElementAttributes(){
	this.attributeNames = {}
}
ElementAttributes.prototype = {
	setTagName:function(tagName){
		if(!tagNamePattern.test(tagName)){
			throw new Error('invalid tagName:'+tagName)
		}
		this.tagName = tagName
	},
	addValue:function(qName, value, offset) {
		if(!tagNamePattern.test(qName)){
			throw new Error('invalid attribute:'+qName)
		}
		this.attributeNames[qName] = this.length;
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
exports.ParseError = ParseError;

},{"./conventions":51}],57:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":59}],58:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var cookies = require('./../helpers/cookies');
var buildURL = require('./../helpers/buildURL');
var buildFullPath = require('../core/buildFullPath');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
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
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
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
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

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
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
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
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
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

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

},{"../core/buildFullPath":65,"../core/createError":66,"./../core/settle":70,"./../helpers/buildURL":74,"./../helpers/cookies":76,"./../helpers/isURLSameOrigin":79,"./../helpers/parseHeaders":81,"./../utils":84}],59:[function(require,module,exports){
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

// Expose isAxiosError
axios.isAxiosError = require('./helpers/isAxiosError');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./cancel/Cancel":60,"./cancel/CancelToken":61,"./cancel/isCancel":62,"./core/Axios":63,"./core/mergeConfig":69,"./defaults":72,"./helpers/bind":73,"./helpers/isAxiosError":78,"./helpers/spread":82,"./utils":84}],60:[function(require,module,exports){
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

},{}],61:[function(require,module,exports){
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

},{"./Cancel":60}],62:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],63:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var buildURL = require('../helpers/buildURL');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');
var validator = require('../helpers/validator');

var validators = validator.validators;
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

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
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
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"../helpers/buildURL":74,"../helpers/validator":83,"./../utils":84,"./InterceptorManager":64,"./dispatchRequest":67,"./mergeConfig":69}],64:[function(require,module,exports){
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
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
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

},{"./../utils":84}],65:[function(require,module,exports){
'use strict';

var isAbsoluteURL = require('../helpers/isAbsoluteURL');
var combineURLs = require('../helpers/combineURLs');

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

},{"../helpers/combineURLs":75,"../helpers/isAbsoluteURL":77}],66:[function(require,module,exports){
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

},{"./enhanceError":68}],67:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');

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

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
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
    response.data = transformData.call(
      config,
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
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"../cancel/isCancel":62,"../defaults":72,"./../utils":84,"./transformData":71}],68:[function(require,module,exports){
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

  error.toJSON = function toJSON() {
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

},{}],69:[function(require,module,exports){
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

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};

},{"../utils":84}],70:[function(require,module,exports){
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
  if (!response.status || !validateStatus || validateStatus(response.status)) {
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

},{"./createError":66}],71:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var defaults = require('./../defaults');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};

},{"./../defaults":72,"./../utils":84}],72:[function(require,module,exports){
(function (process){(function (){
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');
var enhanceError = require('./core/enhanceError');

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
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

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
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
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
  maxBodyLength: -1,

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

}).call(this)}).call(this,require('_process'))
},{"./adapters/http":58,"./adapters/xhr":58,"./core/enhanceError":68,"./helpers/normalizeHeaderName":80,"./utils":84,"_process":88}],73:[function(require,module,exports){
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

},{}],74:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
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

},{"./../utils":84}],75:[function(require,module,exports){
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

},{}],76:[function(require,module,exports){
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

},{"./../utils":84}],77:[function(require,module,exports){
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

},{}],78:[function(require,module,exports){
'use strict';

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};

},{}],79:[function(require,module,exports){
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

},{"./../utils":84}],80:[function(require,module,exports){
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

},{"../utils":84}],81:[function(require,module,exports){
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

},{"./../utils":84}],82:[function(require,module,exports){
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

},{}],83:[function(require,module,exports){
'use strict';

var pkg = require('./../../package.json');

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};
var currentVerArr = pkg.version.split('.');

/**
 * Compare package versions
 * @param {string} version
 * @param {string?} thanVersion
 * @returns {boolean}
 */
function isOlderVersion(version, thanVersion) {
  var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
  var destVer = version.split('.');
  for (var i = 0; i < 3; i++) {
    if (pkgVersionArr[i] > destVer[i]) {
      return true;
    } else if (pkgVersionArr[i] < destVer[i]) {
      return false;
    }
  }
  return false;
}

/**
 * Transitional option validator
 * @param {function|boolean?} validator
 * @param {string?} version
 * @param {string} message
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  var isDeprecated = version && isOlderVersion(version);

  function formatMessage(opt, desc) {
    return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed in ' + version));
    }

    if (isDeprecated && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  isOlderVersion: isOlderVersion,
  assertOptions: assertOptions,
  validators: validators
};

},{"./../../package.json":85}],84:[function(require,module,exports){
'use strict';

var bind = require('./helpers/bind');

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
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
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
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
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
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
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
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
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

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
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
  isPlainObject: isPlainObject,
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
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};

},{"./helpers/bind":73}],85:[function(require,module,exports){
module.exports={
  "name": "axios",
  "version": "0.21.4",
  "description": "Promise based HTTP client for the browser and node.js",
  "main": "index.js",
  "scripts": {
    "test": "grunt test",
    "start": "node ./sandbox/server.js",
    "build": "NODE_ENV=production grunt build",
    "preversion": "npm test",
    "version": "npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json",
    "postversion": "git push && git push --tags",
    "examples": "node ./examples/server.js",
    "coveralls": "cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
    "fix": "eslint --fix lib/**/*.js"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/axios/axios.git"
  },
  "keywords": [
    "xhr",
    "http",
    "ajax",
    "promise",
    "node"
  ],
  "author": "Matt Zabriskie",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/axios/axios/issues"
  },
  "homepage": "https://axios-http.com",
  "devDependencies": {
    "coveralls": "^3.0.0",
    "es6-promise": "^4.2.4",
    "grunt": "^1.3.0",
    "grunt-banner": "^0.6.0",
    "grunt-cli": "^1.2.0",
    "grunt-contrib-clean": "^1.1.0",
    "grunt-contrib-watch": "^1.0.0",
    "grunt-eslint": "^23.0.0",
    "grunt-karma": "^4.0.0",
    "grunt-mocha-test": "^0.13.3",
    "grunt-ts": "^6.0.0-beta.19",
    "grunt-webpack": "^4.0.2",
    "istanbul-instrumenter-loader": "^1.0.0",
    "jasmine-core": "^2.4.1",
    "karma": "^6.3.2",
    "karma-chrome-launcher": "^3.1.0",
    "karma-firefox-launcher": "^2.1.0",
    "karma-jasmine": "^1.1.1",
    "karma-jasmine-ajax": "^0.1.13",
    "karma-safari-launcher": "^1.0.0",
    "karma-sauce-launcher": "^4.3.6",
    "karma-sinon": "^1.0.5",
    "karma-sourcemap-loader": "^0.3.8",
    "karma-webpack": "^4.0.2",
    "load-grunt-tasks": "^3.5.2",
    "minimist": "^1.2.0",
    "mocha": "^8.2.1",
    "sinon": "^4.5.0",
    "terser-webpack-plugin": "^4.2.3",
    "typescript": "^4.0.5",
    "url-search-params": "^0.10.0",
    "webpack": "^4.44.2",
    "webpack-dev-server": "^3.11.0"
  },
  "browser": {
    "./lib/adapters/http.js": "./lib/adapters/xhr.js"
  },
  "jsdelivr": "dist/axios.min.js",
  "unpkg": "dist/axios.min.js",
  "typings": "./index.d.ts",
  "dependencies": {
    "follow-redirects": "^1.14.0"
  },
  "bundlesize": [
    {
      "path": "./dist/axios.min.js",
      "threshold": "5kB"
    }
  ]
}

},{}],86:[function(require,module,exports){
//! moment-timezone.js
//! version : 0.5.38
//! Copyright (c) JS Foundation and other contributors
//! license : MIT
//! github.com/moment/moment-timezone

(function (root, factory) {
	"use strict";

	/*global define*/
	if (typeof module === 'object' && module.exports) {
		module.exports = factory(require('moment')); // Node
	} else if (typeof define === 'function' && define.amd) {
		define(['moment'], factory);                 // AMD
	} else {
		factory(root.moment);                        // Browser
	}
}(this, function (moment) {
	"use strict";

	// Resolves es6 module loading issue
	if (moment.version === undefined && moment.default) {
		moment = moment.default;
	}

	// Do not load moment-timezone a second time.
	// if (moment.tz !== undefined) {
	// 	logError('Moment Timezone ' + moment.tz.version + ' was already loaded ' + (moment.tz.dataVersion ? 'with data from ' : 'without any data') + moment.tz.dataVersion);
	// 	return moment;
	// }

	var VERSION = "0.5.38",
		zones = {},
		links = {},
		countries = {},
		names = {},
		guesses = {},
		cachedGuess;

	if (!moment || typeof moment.version !== 'string') {
		logError('Moment Timezone requires Moment.js. See https://momentjs.com/timezone/docs/#/use-it/browser/');
	}

	var momentVersion = moment.version.split('.'),
		major = +momentVersion[0],
		minor = +momentVersion[1];

	// Moment.js version check
	if (major < 2 || (major === 2 && minor < 6)) {
		logError('Moment Timezone requires Moment.js >= 2.6.0. You are using Moment.js ' + moment.version + '. See momentjs.com');
	}

	/************************************
		Unpacking
	************************************/

	function charCodeToInt(charCode) {
		if (charCode > 96) {
			return charCode - 87;
		} else if (charCode > 64) {
			return charCode - 29;
		}
		return charCode - 48;
	}

	function unpackBase60(string) {
		var i = 0,
			parts = string.split('.'),
			whole = parts[0],
			fractional = parts[1] || '',
			multiplier = 1,
			num,
			out = 0,
			sign = 1;

		// handle negative numbers
		if (string.charCodeAt(0) === 45) {
			i = 1;
			sign = -1;
		}

		// handle digits before the decimal
		for (i; i < whole.length; i++) {
			num = charCodeToInt(whole.charCodeAt(i));
			out = 60 * out + num;
		}

		// handle digits after the decimal
		for (i = 0; i < fractional.length; i++) {
			multiplier = multiplier / 60;
			num = charCodeToInt(fractional.charCodeAt(i));
			out += num * multiplier;
		}

		return out * sign;
	}

	function arrayToInt (array) {
		for (var i = 0; i < array.length; i++) {
			array[i] = unpackBase60(array[i]);
		}
	}

	function intToUntil (array, length) {
		for (var i = 0; i < length; i++) {
			array[i] = Math.round((array[i - 1] || 0) + (array[i] * 60000)); // minutes to milliseconds
		}

		array[length - 1] = Infinity;
	}

	function mapIndices (source, indices) {
		var out = [], i;

		for (i = 0; i < indices.length; i++) {
			out[i] = source[indices[i]];
		}

		return out;
	}

	function unpack (string) {
		var data = string.split('|'),
			offsets = data[2].split(' '),
			indices = data[3].split(''),
			untils  = data[4].split(' ');

		arrayToInt(offsets);
		arrayToInt(indices);
		arrayToInt(untils);

		intToUntil(untils, indices.length);

		return {
			name       : data[0],
			abbrs      : mapIndices(data[1].split(' '), indices),
			offsets    : mapIndices(offsets, indices),
			untils     : untils,
			population : data[5] | 0
		};
	}

	/************************************
		Zone object
	************************************/

	function Zone (packedString) {
		if (packedString) {
			this._set(unpack(packedString));
		}
	}

	Zone.prototype = {
		_set : function (unpacked) {
			this.name       = unpacked.name;
			this.abbrs      = unpacked.abbrs;
			this.untils     = unpacked.untils;
			this.offsets    = unpacked.offsets;
			this.population = unpacked.population;
		},

		_index : function (timestamp) {
			var target = +timestamp,
				untils = this.untils,
				i;

			for (i = 0; i < untils.length; i++) {
				if (target < untils[i]) {
					return i;
				}
			}
		},

		countries : function () {
			var zone_name = this.name;
			return Object.keys(countries).filter(function (country_code) {
				return countries[country_code].zones.indexOf(zone_name) !== -1;
			});
		},

		parse : function (timestamp) {
			var target  = +timestamp,
				offsets = this.offsets,
				untils  = this.untils,
				max     = untils.length - 1,
				offset, offsetNext, offsetPrev, i;

			for (i = 0; i < max; i++) {
				offset     = offsets[i];
				offsetNext = offsets[i + 1];
				offsetPrev = offsets[i ? i - 1 : i];

				if (offset < offsetNext && tz.moveAmbiguousForward) {
					offset = offsetNext;
				} else if (offset > offsetPrev && tz.moveInvalidForward) {
					offset = offsetPrev;
				}

				if (target < untils[i] - (offset * 60000)) {
					return offsets[i];
				}
			}

			return offsets[max];
		},

		abbr : function (mom) {
			return this.abbrs[this._index(mom)];
		},

		offset : function (mom) {
			logError("zone.offset has been deprecated in favor of zone.utcOffset");
			return this.offsets[this._index(mom)];
		},

		utcOffset : function (mom) {
			return this.offsets[this._index(mom)];
		}
	};

	/************************************
		Country object
	************************************/

	function Country (country_name, zone_names) {
		this.name = country_name;
		this.zones = zone_names;
	}

	/************************************
		Current Timezone
	************************************/

	function OffsetAt(at) {
		var timeString = at.toTimeString();
		var abbr = timeString.match(/\([a-z ]+\)/i);
		if (abbr && abbr[0]) {
			// 17:56:31 GMT-0600 (CST)
			// 17:56:31 GMT-0600 (Central Standard Time)
			abbr = abbr[0].match(/[A-Z]/g);
			abbr = abbr ? abbr.join('') : undefined;
		} else {
			// 17:56:31 CST
			// 17:56:31 GMT+0800 (台北標準時間)
			abbr = timeString.match(/[A-Z]{3,5}/g);
			abbr = abbr ? abbr[0] : undefined;
		}

		if (abbr === 'GMT') {
			abbr = undefined;
		}

		this.at = +at;
		this.abbr = abbr;
		this.offset = at.getTimezoneOffset();
	}

	function ZoneScore(zone) {
		this.zone = zone;
		this.offsetScore = 0;
		this.abbrScore = 0;
	}

	ZoneScore.prototype.scoreOffsetAt = function (offsetAt) {
		this.offsetScore += Math.abs(this.zone.utcOffset(offsetAt.at) - offsetAt.offset);
		if (this.zone.abbr(offsetAt.at).replace(/[^A-Z]/g, '') !== offsetAt.abbr) {
			this.abbrScore++;
		}
	};

	function findChange(low, high) {
		var mid, diff;

		while ((diff = ((high.at - low.at) / 12e4 | 0) * 6e4)) {
			mid = new OffsetAt(new Date(low.at + diff));
			if (mid.offset === low.offset) {
				low = mid;
			} else {
				high = mid;
			}
		}

		return low;
	}

	function userOffsets() {
		var startYear = new Date().getFullYear() - 2,
			last = new OffsetAt(new Date(startYear, 0, 1)),
			offsets = [last],
			change, next, i;

		for (i = 1; i < 48; i++) {
			next = new OffsetAt(new Date(startYear, i, 1));
			if (next.offset !== last.offset) {
				change = findChange(last, next);
				offsets.push(change);
				offsets.push(new OffsetAt(new Date(change.at + 6e4)));
			}
			last = next;
		}

		for (i = 0; i < 4; i++) {
			offsets.push(new OffsetAt(new Date(startYear + i, 0, 1)));
			offsets.push(new OffsetAt(new Date(startYear + i, 6, 1)));
		}

		return offsets;
	}

	function sortZoneScores (a, b) {
		if (a.offsetScore !== b.offsetScore) {
			return a.offsetScore - b.offsetScore;
		}
		if (a.abbrScore !== b.abbrScore) {
			return a.abbrScore - b.abbrScore;
		}
		if (a.zone.population !== b.zone.population) {
			return b.zone.population - a.zone.population;
		}
		return b.zone.name.localeCompare(a.zone.name);
	}

	function addToGuesses (name, offsets) {
		var i, offset;
		arrayToInt(offsets);
		for (i = 0; i < offsets.length; i++) {
			offset = offsets[i];
			guesses[offset] = guesses[offset] || {};
			guesses[offset][name] = true;
		}
	}

	function guessesForUserOffsets (offsets) {
		var offsetsLength = offsets.length,
			filteredGuesses = {},
			out = [],
			i, j, guessesOffset;

		for (i = 0; i < offsetsLength; i++) {
			guessesOffset = guesses[offsets[i].offset] || {};
			for (j in guessesOffset) {
				if (guessesOffset.hasOwnProperty(j)) {
					filteredGuesses[j] = true;
				}
			}
		}

		for (i in filteredGuesses) {
			if (filteredGuesses.hasOwnProperty(i)) {
				out.push(names[i]);
			}
		}

		return out;
	}

	function rebuildGuess () {

		// use Intl API when available and returning valid time zone
		try {
			var intlName = Intl.DateTimeFormat().resolvedOptions().timeZone;
			if (intlName && intlName.length > 3) {
				var name = names[normalizeName(intlName)];
				if (name) {
					return name;
				}
				logError("Moment Timezone found " + intlName + " from the Intl api, but did not have that data loaded.");
			}
		} catch (e) {
			// Intl unavailable, fall back to manual guessing.
		}

		var offsets = userOffsets(),
			offsetsLength = offsets.length,
			guesses = guessesForUserOffsets(offsets),
			zoneScores = [],
			zoneScore, i, j;

		for (i = 0; i < guesses.length; i++) {
			zoneScore = new ZoneScore(getZone(guesses[i]), offsetsLength);
			for (j = 0; j < offsetsLength; j++) {
				zoneScore.scoreOffsetAt(offsets[j]);
			}
			zoneScores.push(zoneScore);
		}

		zoneScores.sort(sortZoneScores);

		return zoneScores.length > 0 ? zoneScores[0].zone.name : undefined;
	}

	function guess (ignoreCache) {
		if (!cachedGuess || ignoreCache) {
			cachedGuess = rebuildGuess();
		}
		return cachedGuess;
	}

	/************************************
		Global Methods
	************************************/

	function normalizeName (name) {
		return (name || '').toLowerCase().replace(/\//g, '_');
	}

	function addZone (packed) {
		var i, name, split, normalized;

		if (typeof packed === "string") {
			packed = [packed];
		}

		for (i = 0; i < packed.length; i++) {
			split = packed[i].split('|');
			name = split[0];
			normalized = normalizeName(name);
			zones[normalized] = packed[i];
			names[normalized] = name;
			addToGuesses(normalized, split[2].split(' '));
		}
	}

	function getZone (name, caller) {

		name = normalizeName(name);

		var zone = zones[name];
		var link;

		if (zone instanceof Zone) {
			return zone;
		}

		if (typeof zone === 'string') {
			zone = new Zone(zone);
			zones[name] = zone;
			return zone;
		}

		// Pass getZone to prevent recursion more than 1 level deep
		if (links[name] && caller !== getZone && (link = getZone(links[name], getZone))) {
			zone = zones[name] = new Zone();
			zone._set(link);
			zone.name = names[name];
			return zone;
		}

		return null;
	}

	function getNames () {
		var i, out = [];

		for (i in names) {
			if (names.hasOwnProperty(i) && (zones[i] || zones[links[i]]) && names[i]) {
				out.push(names[i]);
			}
		}

		return out.sort();
	}

	function getCountryNames () {
		return Object.keys(countries);
	}

	function addLink (aliases) {
		var i, alias, normal0, normal1;

		if (typeof aliases === "string") {
			aliases = [aliases];
		}

		for (i = 0; i < aliases.length; i++) {
			alias = aliases[i].split('|');

			normal0 = normalizeName(alias[0]);
			normal1 = normalizeName(alias[1]);

			links[normal0] = normal1;
			names[normal0] = alias[0];

			links[normal1] = normal0;
			names[normal1] = alias[1];
		}
	}

	function addCountries (data) {
		var i, country_code, country_zones, split;
		if (!data || !data.length) return;
		for (i = 0; i < data.length; i++) {
			split = data[i].split('|');
			country_code = split[0].toUpperCase();
			country_zones = split[1].split(' ');
			countries[country_code] = new Country(
				country_code,
				country_zones
			);
		}
	}

	function getCountry (name) {
		name = name.toUpperCase();
		return countries[name] || null;
	}

	function zonesForCountry(country, with_offset) {
		country = getCountry(country);

		if (!country) return null;

		var zones = country.zones.sort();

		if (with_offset) {
			return zones.map(function (zone_name) {
				var zone = getZone(zone_name);
				return {
					name: zone_name,
					offset: zone.utcOffset(new Date())
				};
			});
		}

		return zones;
	}

	function loadData (data) {
		addZone(data.zones);
		addLink(data.links);
		addCountries(data.countries);
		tz.dataVersion = data.version;
	}

	function zoneExists (name) {
		if (!zoneExists.didShowError) {
			zoneExists.didShowError = true;
				logError("moment.tz.zoneExists('" + name + "') has been deprecated in favor of !moment.tz.zone('" + name + "')");
		}
		return !!getZone(name);
	}

	function needsOffset (m) {
		var isUnixTimestamp = (m._f === 'X' || m._f === 'x');
		return !!(m._a && (m._tzm === undefined) && !isUnixTimestamp);
	}

	function logError (message) {
		if (typeof console !== 'undefined' && typeof console.error === 'function') {
			console.error(message);
		}
	}

	/************************************
		moment.tz namespace
	************************************/

	function tz (input) {
		var args = Array.prototype.slice.call(arguments, 0, -1),
			name = arguments[arguments.length - 1],
			zone = getZone(name),
			out  = moment.utc.apply(null, args);

		if (zone && !moment.isMoment(input) && needsOffset(out)) {
			out.add(zone.parse(out), 'minutes');
		}

		out.tz(name);

		return out;
	}

	tz.version      = VERSION;
	tz.dataVersion  = '';
	tz._zones       = zones;
	tz._links       = links;
	tz._names       = names;
	tz._countries	= countries;
	tz.add          = addZone;
	tz.link         = addLink;
	tz.load         = loadData;
	tz.zone         = getZone;
	tz.zoneExists   = zoneExists; // deprecated in 0.1.0
	tz.guess        = guess;
	tz.names        = getNames;
	tz.Zone         = Zone;
	tz.unpack       = unpack;
	tz.unpackBase60 = unpackBase60;
	tz.needsOffset  = needsOffset;
	tz.moveInvalidForward   = true;
	tz.moveAmbiguousForward = false;
	tz.countries    = getCountryNames;
	tz.zonesForCountry = zonesForCountry;

	/************************************
		Interface with Moment.js
	************************************/

	var fn = moment.fn;

	moment.tz = tz;

	moment.defaultZone = null;

	moment.updateOffset = function (mom, keepTime) {
		var zone = moment.defaultZone,
			offset;

		if (mom._z === undefined) {
			if (zone && needsOffset(mom) && !mom._isUTC) {
				mom._d = moment.utc(mom._a)._d;
				mom.utc().add(zone.parse(mom), 'minutes');
			}
			mom._z = zone;
		}
		if (mom._z) {
			offset = mom._z.utcOffset(mom);
			if (Math.abs(offset) < 16) {
				offset = offset / 60;
			}
			if (mom.utcOffset !== undefined) {
				var z = mom._z;
				mom.utcOffset(-offset, keepTime);
				mom._z = z;
			} else {
				mom.zone(offset, keepTime);
			}
		}
	};

	fn.tz = function (name, keepTime) {
		if (name) {
			if (typeof name !== 'string') {
				throw new Error('Time zone name must be a string, got ' + name + ' [' + typeof name + ']');
			}
			this._z = getZone(name);
			if (this._z) {
				moment.updateOffset(this, keepTime);
			} else {
				logError("Moment Timezone has no data for " + name + ". See http://momentjs.com/timezone/docs/#/data-loading/.");
			}
			return this;
		}
		if (this._z) { return this._z.name; }
	};

	function abbrWrap (old) {
		return function () {
			if (this._z) { return this._z.abbr(this); }
			return old.call(this);
		};
	}

	function resetZoneWrap (old) {
		return function () {
			this._z = null;
			return old.apply(this, arguments);
		};
	}

	function resetZoneWrap2 (old) {
		return function () {
			if (arguments.length > 0) this._z = null;
			return old.apply(this, arguments);
		};
	}

	fn.zoneName  = abbrWrap(fn.zoneName);
	fn.zoneAbbr  = abbrWrap(fn.zoneAbbr);
	fn.utc       = resetZoneWrap(fn.utc);
	fn.local     = resetZoneWrap(fn.local);
	fn.utcOffset = resetZoneWrap2(fn.utcOffset);

	moment.tz.setDefault = function(name) {
		if (major < 2 || (major === 2 && minor < 9)) {
			logError('Moment Timezone setDefault() requires Moment.js >= 2.9.0. You are using Moment.js ' + moment.version + '.');
		}
		moment.defaultZone = name ? getZone(name) : null;
		return moment;
	};

	// Cloning a moment should include the _z property.
	var momentProperties = moment.momentProperties;
	if (Object.prototype.toString.call(momentProperties) === '[object Array]') {
		// moment 2.8.1+
		momentProperties.push('_z');
		momentProperties.push('_a');
	} else if (momentProperties) {
		// moment 2.7.0
		momentProperties._z = null;
	}

	loadData({
		"version": "2022e",
		"zones": [
			"Africa/Abidjan|GMT|0|0||48e5",
			"Africa/Nairobi|EAT|-30|0||47e5",
			"Africa/Algiers|CET|-10|0||26e5",
			"Africa/Lagos|WAT|-10|0||17e6",
			"Africa/Maputo|CAT|-20|0||26e5",
			"Africa/Cairo|EET EEST|-20 -30|01010|1M2m0 gL0 e10 mn0|15e6",
			"Africa/Casablanca|+00 +01|0 -10|010101010101010101010101010101010101|1H3C0 wM0 co0 go0 1o00 s00 dA0 vc0 11A0 A00 e00 y00 11A0 uM0 e00 Dc0 11A0 s00 e00 IM0 WM0 mo0 gM0 LA0 WM0 jA0 e00 28M0 e00 2600 gM0 2600 e00 2600 gM0|32e5",
			"Europe/Paris|CET CEST|-10 -20|01010101010101010101010|1GNB0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|11e6",
			"Africa/Johannesburg|SAST|-20|0||84e5",
			"Africa/Juba|EAT CAT|-30 -20|01|24nx0|",
			"Africa/Khartoum|EAT CAT|-30 -20|01|1Usl0|51e5",
			"Africa/Sao_Tome|GMT WAT|0 -10|010|1UQN0 2q00|",
			"Africa/Tripoli|EET CET CEST|-20 -10 -20|0120|1IlA0 TA0 1o00|11e5",
			"Africa/Windhoek|CAT WAT|-20 -10|0101010101010|1GQo0 11B0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0|32e4",
			"America/Adak|HST HDT|a0 90|01010101010101010101010|1GIc0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0|326",
			"America/Anchorage|AKST AKDT|90 80|01010101010101010101010|1GIb0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0|30e4",
			"America/Santo_Domingo|AST|40|0||29e5",
			"America/Araguaina|-03 -02|30 20|010|1IdD0 Lz0|14e4",
			"America/Fortaleza|-03|30|0||34e5",
			"America/Asuncion|-03 -04|30 40|01010101010101010101010|1GTf0 1cN0 17b0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1fB0 19X0 1fB0 19X0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1fB0 19X0 1fB0|28e5",
			"America/Panama|EST|50|0||15e5",
			"America/Mexico_City|CST CDT|60 50|01010101010101010101010|1GQw0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0|20e6",
			"America/Bahia|-02 -03|20 30|01|1GCq0|27e5",
			"America/Managua|CST|60|0||22e5",
			"America/La_Paz|-04|40|0||19e5",
			"America/Lima|-05|50|0||11e6",
			"America/Denver|MST MDT|70 60|01010101010101010101010|1GI90 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0|26e5",
			"America/Campo_Grande|-03 -04|30 40|0101010101010101|1GCr0 1zd0 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1HB0 FX0|77e4",
			"America/Cancun|CST CDT EST|60 50 50|01010102|1GQw0 1nX0 14p0 1lb0 14p0 1lb0 Dd0|63e4",
			"America/Caracas|-0430 -04|4u 40|01|1QMT0|29e5",
			"America/Chicago|CST CDT|60 50|01010101010101010101010|1GI80 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0|92e5",
			"America/Chihuahua|MST MDT|70 60|01010101010101010101010|1GQx0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0|81e4",
			"America/Phoenix|MST|70|0||42e5",
			"America/Whitehorse|PST PDT MST|80 70 70|0101010101010101012|1GIa0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1z90|23e3",
			"America/New_York|EST EDT|50 40|01010101010101010101010|1GI70 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0|21e6",
			"America/Rio_Branco|-04 -05|40 50|01|1KLE0|31e4",
			"America/Los_Angeles|PST PDT|80 70|01010101010101010101010|1GIa0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0|15e6",
			"America/Fort_Nelson|PST PDT MST|80 70 70|01010102|1GIa0 1zb0 Op0 1zb0 Op0 1zb0 Op0|39e2",
			"America/Halifax|AST ADT|40 30|01010101010101010101010|1GI60 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0|39e4",
			"America/Godthab|-03 -02|30 20|01010101010101010101010|1GNB0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|17e3",
			"America/Grand_Turk|EST EDT AST|50 40 40|010101021010101010|1GI70 1zb0 Op0 1zb0 Op0 1zb0 Op0 7jA0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0|37e2",
			"America/Havana|CST CDT|50 40|01010101010101010101010|1GQt0 1qM0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0|21e5",
			"America/Metlakatla|PST AKST AKDT|80 90 80|01212120121212121|1PAa0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 uM0 jB0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0|14e2",
			"America/Miquelon|-03 -02|30 20|01010101010101010101010|1GI50 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0|61e2",
			"America/Montevideo|-02 -03|20 30|01010101|1GI40 1o10 11z0 1o10 11z0 1o10 11z0|17e5",
			"America/Noronha|-02|20|0||30e2",
			"America/Port-au-Prince|EST EDT|50 40|010101010101010101010|1GI70 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 3iN0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0|23e5",
			"Antarctica/Palmer|-03 -04|30 40|010101010|1H3D0 Op0 1zb0 Rd0 1wn0 Rd0 46n0 Ap0|40",
			"America/Santiago|-03 -04|30 40|010101010101010101010|1H3D0 Op0 1zb0 Rd0 1wn0 Rd0 46n0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1zb0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0|62e5",
			"America/Sao_Paulo|-02 -03|20 30|0101010101010101|1GCq0 1zd0 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1HB0 FX0|20e6",
			"Atlantic/Azores|-01 +00|10 0|01010101010101010101010|1GNB0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|25e4",
			"America/St_Johns|NST NDT|3u 2u|01010101010101010101010|1GI5u 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0|11e4",
			"Antarctica/Casey|+11 +08|-b0 -80|010101010|1GAF0 blz0 3m10 1o30 14k0 1kr0 12l0 1o01|10",
			"Antarctica/Davis|+05 +07|-50 -70|01|1GAI0|70",
			"Pacific/Port_Moresby|+10|-a0|0||25e4",
			"Australia/Sydney|AEDT AEST|-b0 -a0|01010101010101010101010|1GQg0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0|40e5",
			"Asia/Tashkent|+05|-50|0||23e5",
			"Pacific/Auckland|NZDT NZST|-d0 -c0|01010101010101010101010|1GQe0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00|14e5",
			"Asia/Baghdad|+03|-30|0||66e5",
			"Antarctica/Troll|+00 +02|0 -20|01010101010101010101010|1GNB0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|40",
			"Asia/Dhaka|+06|-60|0||16e6",
			"Asia/Amman|EET EEST +03|-20 -30 -30|010101010101010101012|1GPy0 4bX0 Dd0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 LA0 1C00|25e5",
			"Asia/Kamchatka|+12|-c0|0||18e4",
			"Asia/Baku|+04 +05|-40 -50|010101010|1GNA0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00|27e5",
			"Asia/Bangkok|+07|-70|0||15e6",
			"Asia/Barnaul|+07 +06|-70 -60|010|1N7v0 3rd0|",
			"Asia/Beirut|EET EEST|-20 -30|01010101010101010101010|1GNy0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0|22e5",
			"Asia/Kuala_Lumpur|+08|-80|0||71e5",
			"Asia/Kolkata|IST|-5u|0||15e6",
			"Asia/Chita|+10 +08 +09|-a0 -80 -90|012|1N7s0 3re0|33e4",
			"Asia/Ulaanbaatar|+08 +09|-80 -90|01010|1O8G0 1cJ0 1cP0 1cJ0|12e5",
			"Asia/Shanghai|CST|-80|0||23e6",
			"Asia/Colombo|+0530|-5u|0||22e5",
			"Asia/Damascus|EET EEST +03|-20 -30 -30|01010101010101010101012|1GPy0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0|26e5",
			"Asia/Dili|+09|-90|0||19e4",
			"Asia/Dubai|+04|-40|0||39e5",
			"Asia/Famagusta|EET EEST +03|-20 -30 -30|0101010101201010101010|1GNB0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 15U0 2Ks0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|",
			"Asia/Gaza|EET EEST|-20 -30|01010101010101010101010|1GPy0 1a00 1fA0 1cL0 1cN0 1nX0 1210 1nA0 1210 1qL0 WN0 1qL0 WN0 1qL0 11c0 1on0 11B0 1o00 11A0 1qo0 XA0 1qp0|18e5",
			"Asia/Hong_Kong|HKT|-80|0||73e5",
			"Asia/Hovd|+07 +08|-70 -80|01010|1O8H0 1cJ0 1cP0 1cJ0|81e3",
			"Asia/Irkutsk|+09 +08|-90 -80|01|1N7t0|60e4",
			"Europe/Istanbul|EET EEST +03|-20 -30 -30|01010101012|1GNB0 1qM0 11A0 1o00 1200 1nA0 11A0 1tA0 U00 15w0|13e6",
			"Asia/Jakarta|WIB|-70|0||31e6",
			"Asia/Jayapura|WIT|-90|0||26e4",
			"Asia/Jerusalem|IST IDT|-20 -30|01010101010101010101010|1GPA0 1aL0 1eN0 1oL0 10N0 1oL0 10N0 1oL0 10N0 1rz0 W10 1rz0 W10 1rz0 10N0 1oL0 10N0 1oL0 10N0 1rz0 W10 1rz0|81e4",
			"Asia/Kabul|+0430|-4u|0||46e5",
			"Asia/Karachi|PKT|-50|0||24e6",
			"Asia/Kathmandu|+0545|-5J|0||12e5",
			"Asia/Yakutsk|+10 +09|-a0 -90|01|1N7s0|28e4",
			"Asia/Krasnoyarsk|+08 +07|-80 -70|01|1N7u0|10e5",
			"Asia/Magadan|+12 +10 +11|-c0 -a0 -b0|012|1N7q0 3Cq0|95e3",
			"Asia/Makassar|WITA|-80|0||15e5",
			"Asia/Manila|PST|-80|0||24e6",
			"Europe/Athens|EET EEST|-20 -30|01010101010101010101010|1GNB0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|35e5",
			"Asia/Novosibirsk|+07 +06|-70 -60|010|1N7v0 4eN0|15e5",
			"Asia/Omsk|+07 +06|-70 -60|01|1N7v0|12e5",
			"Asia/Pyongyang|KST KST|-90 -8u|010|1P4D0 6BA0|29e5",
			"Asia/Qyzylorda|+06 +05|-60 -50|01|1Xei0|73e4",
			"Asia/Rangoon|+0630|-6u|0||48e5",
			"Asia/Sakhalin|+11 +10|-b0 -a0|010|1N7r0 3rd0|58e4",
			"Asia/Seoul|KST|-90|0||23e6",
			"Asia/Srednekolymsk|+12 +11|-c0 -b0|01|1N7q0|35e2",
			"Asia/Tehran|+0330 +0430|-3u -4u|01010101010101010101010|1GLUu 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0|14e6",
			"Asia/Tokyo|JST|-90|0||38e6",
			"Asia/Tomsk|+07 +06|-70 -60|010|1N7v0 3Qp0|10e5",
			"Asia/Vladivostok|+11 +10|-b0 -a0|01|1N7r0|60e4",
			"Asia/Yekaterinburg|+06 +05|-60 -50|01|1N7w0|14e5",
			"Europe/Lisbon|WET WEST|0 -10|01010101010101010101010|1GNB0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|27e5",
			"Atlantic/Cape_Verde|-01|10|0||50e4",
			"Australia/Adelaide|ACDT ACST|-au -9u|01010101010101010101010|1GQgu 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0|11e5",
			"Australia/Brisbane|AEST|-a0|0||20e5",
			"Australia/Darwin|ACST|-9u|0||12e4",
			"Australia/Eucla|+0845|-8J|0||368",
			"Australia/Lord_Howe|+11 +1030|-b0 -au|01010101010101010101010|1GQf0 1fAu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1fAu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu|347",
			"Australia/Perth|AWST|-80|0||18e5",
			"Pacific/Easter|-05 -06|50 60|010101010101010101010|1H3D0 Op0 1zb0 Rd0 1wn0 Rd0 46n0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1zb0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0|30e2",
			"Europe/Dublin|GMT IST|0 -10|01010101010101010101010|1GNB0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|12e5",
			"Etc/GMT-1|+01|-10|0||",
			"Pacific/Guadalcanal|+11|-b0|0||11e4",
			"Pacific/Fakaofo|+13|-d0|0||483",
			"Pacific/Kiritimati|+14|-e0|0||51e2",
			"Etc/GMT-2|+02|-20|0||",
			"Pacific/Tahiti|-10|a0|0||18e4",
			"Pacific/Niue|-11|b0|0||12e2",
			"Etc/GMT+12|-12|c0|0||",
			"Pacific/Galapagos|-06|60|0||25e3",
			"Etc/GMT+7|-07|70|0||",
			"Pacific/Pitcairn|-08|80|0||56",
			"Pacific/Gambier|-09|90|0||125",
			"Etc/UTC|UTC|0|0||",
			"Europe/Ulyanovsk|+04 +03|-40 -30|010|1N7y0 3rd0|13e5",
			"Europe/London|GMT BST|0 -10|01010101010101010101010|1GNB0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|10e6",
			"Europe/Chisinau|EET EEST|-20 -30|01010101010101010101010|1GNA0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|67e4",
			"Europe/Kaliningrad|+03 EET|-30 -20|01|1N7z0|44e4",
			"Europe/Kirov|+04 +03|-40 -30|01|1N7y0|48e4",
			"Europe/Moscow|MSK MSK|-40 -30|01|1N7y0|16e6",
			"Europe/Saratov|+04 +03|-40 -30|010|1N7y0 5810|",
			"Europe/Simferopol|EET EEST MSK MSK|-20 -30 -40 -30|0101023|1GNB0 1qM0 11A0 1o00 11z0 1nW0|33e4",
			"Europe/Volgograd|+04 +03|-40 -30|0101|1N7y0 9Jd0 5gn0|10e5",
			"Pacific/Honolulu|HST|a0|0||37e4",
			"MET|MET MEST|-10 -20|01010101010101010101010|1GNB0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|",
			"Pacific/Chatham|+1345 +1245|-dJ -cJ|01010101010101010101010|1GQe0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00|600",
			"Pacific/Apia|+14 +13|-e0 -d0|01010101010101010101|1GQe0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0|37e3",
			"Pacific/Bougainville|+10 +11|-a0 -b0|01|1NwE0|18e4",
			"Pacific/Fiji|+13 +12|-d0 -c0|010101010101010101010|1Goe0 1Nc0 Ao0 1Q00 xz0 1SN0 uM0 1SM0 uM0 1VA0 s00 1VA0 s00 1VA0 s00 20o0 pc0 2hc0 bc0 4q00|88e4",
			"Pacific/Guam|ChST|-a0|0||17e4",
			"Pacific/Marquesas|-0930|9u|0||86e2",
			"Pacific/Pago_Pago|SST|b0|0||37e2",
			"Pacific/Norfolk|+1130 +11 +12|-bu -b0 -c0|012121212|1PoCu 9Jcu 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0|25e4",
			"Pacific/Tongatapu|+13 +14|-d0 -e0|010|1S4d0 s00|75e3"
		],
		"links": [
			"Africa/Abidjan|Africa/Accra",
			"Africa/Abidjan|Africa/Bamako",
			"Africa/Abidjan|Africa/Banjul",
			"Africa/Abidjan|Africa/Bissau",
			"Africa/Abidjan|Africa/Conakry",
			"Africa/Abidjan|Africa/Dakar",
			"Africa/Abidjan|Africa/Freetown",
			"Africa/Abidjan|Africa/Lome",
			"Africa/Abidjan|Africa/Monrovia",
			"Africa/Abidjan|Africa/Nouakchott",
			"Africa/Abidjan|Africa/Ouagadougou",
			"Africa/Abidjan|Africa/Timbuktu",
			"Africa/Abidjan|America/Danmarkshavn",
			"Africa/Abidjan|Atlantic/Reykjavik",
			"Africa/Abidjan|Atlantic/St_Helena",
			"Africa/Abidjan|Etc/GMT",
			"Africa/Abidjan|Etc/GMT+0",
			"Africa/Abidjan|Etc/GMT-0",
			"Africa/Abidjan|Etc/GMT0",
			"Africa/Abidjan|Etc/Greenwich",
			"Africa/Abidjan|GMT",
			"Africa/Abidjan|GMT+0",
			"Africa/Abidjan|GMT-0",
			"Africa/Abidjan|GMT0",
			"Africa/Abidjan|Greenwich",
			"Africa/Abidjan|Iceland",
			"Africa/Algiers|Africa/Tunis",
			"Africa/Cairo|Egypt",
			"Africa/Casablanca|Africa/El_Aaiun",
			"Africa/Johannesburg|Africa/Maseru",
			"Africa/Johannesburg|Africa/Mbabane",
			"Africa/Lagos|Africa/Bangui",
			"Africa/Lagos|Africa/Brazzaville",
			"Africa/Lagos|Africa/Douala",
			"Africa/Lagos|Africa/Kinshasa",
			"Africa/Lagos|Africa/Libreville",
			"Africa/Lagos|Africa/Luanda",
			"Africa/Lagos|Africa/Malabo",
			"Africa/Lagos|Africa/Ndjamena",
			"Africa/Lagos|Africa/Niamey",
			"Africa/Lagos|Africa/Porto-Novo",
			"Africa/Maputo|Africa/Blantyre",
			"Africa/Maputo|Africa/Bujumbura",
			"Africa/Maputo|Africa/Gaborone",
			"Africa/Maputo|Africa/Harare",
			"Africa/Maputo|Africa/Kigali",
			"Africa/Maputo|Africa/Lubumbashi",
			"Africa/Maputo|Africa/Lusaka",
			"Africa/Nairobi|Africa/Addis_Ababa",
			"Africa/Nairobi|Africa/Asmara",
			"Africa/Nairobi|Africa/Asmera",
			"Africa/Nairobi|Africa/Dar_es_Salaam",
			"Africa/Nairobi|Africa/Djibouti",
			"Africa/Nairobi|Africa/Kampala",
			"Africa/Nairobi|Africa/Mogadishu",
			"Africa/Nairobi|Indian/Antananarivo",
			"Africa/Nairobi|Indian/Comoro",
			"Africa/Nairobi|Indian/Mayotte",
			"Africa/Tripoli|Libya",
			"America/Adak|America/Atka",
			"America/Adak|US/Aleutian",
			"America/Anchorage|America/Juneau",
			"America/Anchorage|America/Nome",
			"America/Anchorage|America/Sitka",
			"America/Anchorage|America/Yakutat",
			"America/Anchorage|US/Alaska",
			"America/Campo_Grande|America/Cuiaba",
			"America/Chicago|America/Indiana/Knox",
			"America/Chicago|America/Indiana/Tell_City",
			"America/Chicago|America/Knox_IN",
			"America/Chicago|America/Matamoros",
			"America/Chicago|America/Menominee",
			"America/Chicago|America/North_Dakota/Beulah",
			"America/Chicago|America/North_Dakota/Center",
			"America/Chicago|America/North_Dakota/New_Salem",
			"America/Chicago|America/Rainy_River",
			"America/Chicago|America/Rankin_Inlet",
			"America/Chicago|America/Resolute",
			"America/Chicago|America/Winnipeg",
			"America/Chicago|CST6CDT",
			"America/Chicago|Canada/Central",
			"America/Chicago|US/Central",
			"America/Chicago|US/Indiana-Starke",
			"America/Chihuahua|America/Mazatlan",
			"America/Chihuahua|Mexico/BajaSur",
			"America/Denver|America/Boise",
			"America/Denver|America/Cambridge_Bay",
			"America/Denver|America/Edmonton",
			"America/Denver|America/Inuvik",
			"America/Denver|America/Ojinaga",
			"America/Denver|America/Shiprock",
			"America/Denver|America/Yellowknife",
			"America/Denver|Canada/Mountain",
			"America/Denver|MST7MDT",
			"America/Denver|Navajo",
			"America/Denver|US/Mountain",
			"America/Fortaleza|America/Argentina/Buenos_Aires",
			"America/Fortaleza|America/Argentina/Catamarca",
			"America/Fortaleza|America/Argentina/ComodRivadavia",
			"America/Fortaleza|America/Argentina/Cordoba",
			"America/Fortaleza|America/Argentina/Jujuy",
			"America/Fortaleza|America/Argentina/La_Rioja",
			"America/Fortaleza|America/Argentina/Mendoza",
			"America/Fortaleza|America/Argentina/Rio_Gallegos",
			"America/Fortaleza|America/Argentina/Salta",
			"America/Fortaleza|America/Argentina/San_Juan",
			"America/Fortaleza|America/Argentina/San_Luis",
			"America/Fortaleza|America/Argentina/Tucuman",
			"America/Fortaleza|America/Argentina/Ushuaia",
			"America/Fortaleza|America/Belem",
			"America/Fortaleza|America/Buenos_Aires",
			"America/Fortaleza|America/Catamarca",
			"America/Fortaleza|America/Cayenne",
			"America/Fortaleza|America/Cordoba",
			"America/Fortaleza|America/Jujuy",
			"America/Fortaleza|America/Maceio",
			"America/Fortaleza|America/Mendoza",
			"America/Fortaleza|America/Paramaribo",
			"America/Fortaleza|America/Recife",
			"America/Fortaleza|America/Rosario",
			"America/Fortaleza|America/Santarem",
			"America/Fortaleza|Antarctica/Rothera",
			"America/Fortaleza|Atlantic/Stanley",
			"America/Fortaleza|Etc/GMT+3",
			"America/Godthab|America/Nuuk",
			"America/Halifax|America/Glace_Bay",
			"America/Halifax|America/Goose_Bay",
			"America/Halifax|America/Moncton",
			"America/Halifax|America/Thule",
			"America/Halifax|Atlantic/Bermuda",
			"America/Halifax|Canada/Atlantic",
			"America/Havana|Cuba",
			"America/La_Paz|America/Boa_Vista",
			"America/La_Paz|America/Guyana",
			"America/La_Paz|America/Manaus",
			"America/La_Paz|America/Porto_Velho",
			"America/La_Paz|Brazil/West",
			"America/La_Paz|Etc/GMT+4",
			"America/Lima|America/Bogota",
			"America/Lima|America/Guayaquil",
			"America/Lima|Etc/GMT+5",
			"America/Los_Angeles|America/Ensenada",
			"America/Los_Angeles|America/Santa_Isabel",
			"America/Los_Angeles|America/Tijuana",
			"America/Los_Angeles|America/Vancouver",
			"America/Los_Angeles|Canada/Pacific",
			"America/Los_Angeles|Mexico/BajaNorte",
			"America/Los_Angeles|PST8PDT",
			"America/Los_Angeles|US/Pacific",
			"America/Managua|America/Belize",
			"America/Managua|America/Costa_Rica",
			"America/Managua|America/El_Salvador",
			"America/Managua|America/Guatemala",
			"America/Managua|America/Regina",
			"America/Managua|America/Swift_Current",
			"America/Managua|America/Tegucigalpa",
			"America/Managua|Canada/Saskatchewan",
			"America/Mexico_City|America/Bahia_Banderas",
			"America/Mexico_City|America/Merida",
			"America/Mexico_City|America/Monterrey",
			"America/Mexico_City|Mexico/General",
			"America/New_York|America/Detroit",
			"America/New_York|America/Fort_Wayne",
			"America/New_York|America/Indiana/Indianapolis",
			"America/New_York|America/Indiana/Marengo",
			"America/New_York|America/Indiana/Petersburg",
			"America/New_York|America/Indiana/Vevay",
			"America/New_York|America/Indiana/Vincennes",
			"America/New_York|America/Indiana/Winamac",
			"America/New_York|America/Indianapolis",
			"America/New_York|America/Iqaluit",
			"America/New_York|America/Kentucky/Louisville",
			"America/New_York|America/Kentucky/Monticello",
			"America/New_York|America/Louisville",
			"America/New_York|America/Montreal",
			"America/New_York|America/Nassau",
			"America/New_York|America/Nipigon",
			"America/New_York|America/Pangnirtung",
			"America/New_York|America/Thunder_Bay",
			"America/New_York|America/Toronto",
			"America/New_York|Canada/Eastern",
			"America/New_York|EST5EDT",
			"America/New_York|US/East-Indiana",
			"America/New_York|US/Eastern",
			"America/New_York|US/Michigan",
			"America/Noronha|Atlantic/South_Georgia",
			"America/Noronha|Brazil/DeNoronha",
			"America/Noronha|Etc/GMT+2",
			"America/Panama|America/Atikokan",
			"America/Panama|America/Cayman",
			"America/Panama|America/Coral_Harbour",
			"America/Panama|America/Jamaica",
			"America/Panama|EST",
			"America/Panama|Jamaica",
			"America/Phoenix|America/Creston",
			"America/Phoenix|America/Dawson_Creek",
			"America/Phoenix|America/Hermosillo",
			"America/Phoenix|MST",
			"America/Phoenix|US/Arizona",
			"America/Rio_Branco|America/Eirunepe",
			"America/Rio_Branco|America/Porto_Acre",
			"America/Rio_Branco|Brazil/Acre",
			"America/Santiago|Chile/Continental",
			"America/Santo_Domingo|America/Anguilla",
			"America/Santo_Domingo|America/Antigua",
			"America/Santo_Domingo|America/Aruba",
			"America/Santo_Domingo|America/Barbados",
			"America/Santo_Domingo|America/Blanc-Sablon",
			"America/Santo_Domingo|America/Curacao",
			"America/Santo_Domingo|America/Dominica",
			"America/Santo_Domingo|America/Grenada",
			"America/Santo_Domingo|America/Guadeloupe",
			"America/Santo_Domingo|America/Kralendijk",
			"America/Santo_Domingo|America/Lower_Princes",
			"America/Santo_Domingo|America/Marigot",
			"America/Santo_Domingo|America/Martinique",
			"America/Santo_Domingo|America/Montserrat",
			"America/Santo_Domingo|America/Port_of_Spain",
			"America/Santo_Domingo|America/Puerto_Rico",
			"America/Santo_Domingo|America/St_Barthelemy",
			"America/Santo_Domingo|America/St_Kitts",
			"America/Santo_Domingo|America/St_Lucia",
			"America/Santo_Domingo|America/St_Thomas",
			"America/Santo_Domingo|America/St_Vincent",
			"America/Santo_Domingo|America/Tortola",
			"America/Santo_Domingo|America/Virgin",
			"America/Sao_Paulo|Brazil/East",
			"America/St_Johns|Canada/Newfoundland",
			"America/Whitehorse|America/Dawson",
			"America/Whitehorse|Canada/Yukon",
			"Antarctica/Palmer|America/Punta_Arenas",
			"Asia/Baghdad|Antarctica/Syowa",
			"Asia/Baghdad|Asia/Aden",
			"Asia/Baghdad|Asia/Bahrain",
			"Asia/Baghdad|Asia/Kuwait",
			"Asia/Baghdad|Asia/Qatar",
			"Asia/Baghdad|Asia/Riyadh",
			"Asia/Baghdad|Etc/GMT-3",
			"Asia/Baghdad|Europe/Minsk",
			"Asia/Bangkok|Asia/Ho_Chi_Minh",
			"Asia/Bangkok|Asia/Novokuznetsk",
			"Asia/Bangkok|Asia/Phnom_Penh",
			"Asia/Bangkok|Asia/Saigon",
			"Asia/Bangkok|Asia/Vientiane",
			"Asia/Bangkok|Etc/GMT-7",
			"Asia/Bangkok|Indian/Christmas",
			"Asia/Dhaka|Antarctica/Vostok",
			"Asia/Dhaka|Asia/Almaty",
			"Asia/Dhaka|Asia/Bishkek",
			"Asia/Dhaka|Asia/Dacca",
			"Asia/Dhaka|Asia/Kashgar",
			"Asia/Dhaka|Asia/Qostanay",
			"Asia/Dhaka|Asia/Thimbu",
			"Asia/Dhaka|Asia/Thimphu",
			"Asia/Dhaka|Asia/Urumqi",
			"Asia/Dhaka|Etc/GMT-6",
			"Asia/Dhaka|Indian/Chagos",
			"Asia/Dili|Etc/GMT-9",
			"Asia/Dili|Pacific/Palau",
			"Asia/Dubai|Asia/Muscat",
			"Asia/Dubai|Asia/Tbilisi",
			"Asia/Dubai|Asia/Yerevan",
			"Asia/Dubai|Etc/GMT-4",
			"Asia/Dubai|Europe/Samara",
			"Asia/Dubai|Indian/Mahe",
			"Asia/Dubai|Indian/Mauritius",
			"Asia/Dubai|Indian/Reunion",
			"Asia/Gaza|Asia/Hebron",
			"Asia/Hong_Kong|Hongkong",
			"Asia/Jakarta|Asia/Pontianak",
			"Asia/Jerusalem|Asia/Tel_Aviv",
			"Asia/Jerusalem|Israel",
			"Asia/Kamchatka|Asia/Anadyr",
			"Asia/Kamchatka|Etc/GMT-12",
			"Asia/Kamchatka|Kwajalein",
			"Asia/Kamchatka|Pacific/Funafuti",
			"Asia/Kamchatka|Pacific/Kwajalein",
			"Asia/Kamchatka|Pacific/Majuro",
			"Asia/Kamchatka|Pacific/Nauru",
			"Asia/Kamchatka|Pacific/Tarawa",
			"Asia/Kamchatka|Pacific/Wake",
			"Asia/Kamchatka|Pacific/Wallis",
			"Asia/Kathmandu|Asia/Katmandu",
			"Asia/Kolkata|Asia/Calcutta",
			"Asia/Kuala_Lumpur|Asia/Brunei",
			"Asia/Kuala_Lumpur|Asia/Kuching",
			"Asia/Kuala_Lumpur|Asia/Singapore",
			"Asia/Kuala_Lumpur|Etc/GMT-8",
			"Asia/Kuala_Lumpur|Singapore",
			"Asia/Makassar|Asia/Ujung_Pandang",
			"Asia/Rangoon|Asia/Yangon",
			"Asia/Rangoon|Indian/Cocos",
			"Asia/Seoul|ROK",
			"Asia/Shanghai|Asia/Chongqing",
			"Asia/Shanghai|Asia/Chungking",
			"Asia/Shanghai|Asia/Harbin",
			"Asia/Shanghai|Asia/Macao",
			"Asia/Shanghai|Asia/Macau",
			"Asia/Shanghai|Asia/Taipei",
			"Asia/Shanghai|PRC",
			"Asia/Shanghai|ROC",
			"Asia/Tashkent|Antarctica/Mawson",
			"Asia/Tashkent|Asia/Aqtau",
			"Asia/Tashkent|Asia/Aqtobe",
			"Asia/Tashkent|Asia/Ashgabat",
			"Asia/Tashkent|Asia/Ashkhabad",
			"Asia/Tashkent|Asia/Atyrau",
			"Asia/Tashkent|Asia/Dushanbe",
			"Asia/Tashkent|Asia/Oral",
			"Asia/Tashkent|Asia/Samarkand",
			"Asia/Tashkent|Etc/GMT-5",
			"Asia/Tashkent|Indian/Kerguelen",
			"Asia/Tashkent|Indian/Maldives",
			"Asia/Tehran|Iran",
			"Asia/Tokyo|Japan",
			"Asia/Ulaanbaatar|Asia/Choibalsan",
			"Asia/Ulaanbaatar|Asia/Ulan_Bator",
			"Asia/Vladivostok|Asia/Ust-Nera",
			"Asia/Yakutsk|Asia/Khandyga",
			"Atlantic/Azores|America/Scoresbysund",
			"Atlantic/Cape_Verde|Etc/GMT+1",
			"Australia/Adelaide|Australia/Broken_Hill",
			"Australia/Adelaide|Australia/South",
			"Australia/Adelaide|Australia/Yancowinna",
			"Australia/Brisbane|Australia/Lindeman",
			"Australia/Brisbane|Australia/Queensland",
			"Australia/Darwin|Australia/North",
			"Australia/Lord_Howe|Australia/LHI",
			"Australia/Perth|Australia/West",
			"Australia/Sydney|Antarctica/Macquarie",
			"Australia/Sydney|Australia/ACT",
			"Australia/Sydney|Australia/Canberra",
			"Australia/Sydney|Australia/Currie",
			"Australia/Sydney|Australia/Hobart",
			"Australia/Sydney|Australia/Melbourne",
			"Australia/Sydney|Australia/NSW",
			"Australia/Sydney|Australia/Tasmania",
			"Australia/Sydney|Australia/Victoria",
			"Etc/UTC|Etc/UCT",
			"Etc/UTC|Etc/Universal",
			"Etc/UTC|Etc/Zulu",
			"Etc/UTC|UCT",
			"Etc/UTC|UTC",
			"Etc/UTC|Universal",
			"Etc/UTC|Zulu",
			"Europe/Athens|Asia/Nicosia",
			"Europe/Athens|EET",
			"Europe/Athens|Europe/Bucharest",
			"Europe/Athens|Europe/Helsinki",
			"Europe/Athens|Europe/Kiev",
			"Europe/Athens|Europe/Kyiv",
			"Europe/Athens|Europe/Mariehamn",
			"Europe/Athens|Europe/Nicosia",
			"Europe/Athens|Europe/Riga",
			"Europe/Athens|Europe/Sofia",
			"Europe/Athens|Europe/Tallinn",
			"Europe/Athens|Europe/Uzhgorod",
			"Europe/Athens|Europe/Vilnius",
			"Europe/Athens|Europe/Zaporozhye",
			"Europe/Chisinau|Europe/Tiraspol",
			"Europe/Dublin|Eire",
			"Europe/Istanbul|Asia/Istanbul",
			"Europe/Istanbul|Turkey",
			"Europe/Lisbon|Atlantic/Canary",
			"Europe/Lisbon|Atlantic/Faeroe",
			"Europe/Lisbon|Atlantic/Faroe",
			"Europe/Lisbon|Atlantic/Madeira",
			"Europe/Lisbon|Portugal",
			"Europe/Lisbon|WET",
			"Europe/London|Europe/Belfast",
			"Europe/London|Europe/Guernsey",
			"Europe/London|Europe/Isle_of_Man",
			"Europe/London|Europe/Jersey",
			"Europe/London|GB",
			"Europe/London|GB-Eire",
			"Europe/Moscow|W-SU",
			"Europe/Paris|Africa/Ceuta",
			"Europe/Paris|Arctic/Longyearbyen",
			"Europe/Paris|Atlantic/Jan_Mayen",
			"Europe/Paris|CET",
			"Europe/Paris|Europe/Amsterdam",
			"Europe/Paris|Europe/Andorra",
			"Europe/Paris|Europe/Belgrade",
			"Europe/Paris|Europe/Berlin",
			"Europe/Paris|Europe/Bratislava",
			"Europe/Paris|Europe/Brussels",
			"Europe/Paris|Europe/Budapest",
			"Europe/Paris|Europe/Busingen",
			"Europe/Paris|Europe/Copenhagen",
			"Europe/Paris|Europe/Gibraltar",
			"Europe/Paris|Europe/Ljubljana",
			"Europe/Paris|Europe/Luxembourg",
			"Europe/Paris|Europe/Madrid",
			"Europe/Paris|Europe/Malta",
			"Europe/Paris|Europe/Monaco",
			"Europe/Paris|Europe/Oslo",
			"Europe/Paris|Europe/Podgorica",
			"Europe/Paris|Europe/Prague",
			"Europe/Paris|Europe/Rome",
			"Europe/Paris|Europe/San_Marino",
			"Europe/Paris|Europe/Sarajevo",
			"Europe/Paris|Europe/Skopje",
			"Europe/Paris|Europe/Stockholm",
			"Europe/Paris|Europe/Tirane",
			"Europe/Paris|Europe/Vaduz",
			"Europe/Paris|Europe/Vatican",
			"Europe/Paris|Europe/Vienna",
			"Europe/Paris|Europe/Warsaw",
			"Europe/Paris|Europe/Zagreb",
			"Europe/Paris|Europe/Zurich",
			"Europe/Paris|Poland",
			"Europe/Ulyanovsk|Europe/Astrakhan",
			"Pacific/Auckland|Antarctica/McMurdo",
			"Pacific/Auckland|Antarctica/South_Pole",
			"Pacific/Auckland|NZ",
			"Pacific/Chatham|NZ-CHAT",
			"Pacific/Easter|Chile/EasterIsland",
			"Pacific/Fakaofo|Etc/GMT-13",
			"Pacific/Fakaofo|Pacific/Enderbury",
			"Pacific/Fakaofo|Pacific/Kanton",
			"Pacific/Galapagos|Etc/GMT+6",
			"Pacific/Gambier|Etc/GMT+9",
			"Pacific/Guadalcanal|Etc/GMT-11",
			"Pacific/Guadalcanal|Pacific/Efate",
			"Pacific/Guadalcanal|Pacific/Kosrae",
			"Pacific/Guadalcanal|Pacific/Noumea",
			"Pacific/Guadalcanal|Pacific/Pohnpei",
			"Pacific/Guadalcanal|Pacific/Ponape",
			"Pacific/Guam|Pacific/Saipan",
			"Pacific/Honolulu|HST",
			"Pacific/Honolulu|Pacific/Johnston",
			"Pacific/Honolulu|US/Hawaii",
			"Pacific/Kiritimati|Etc/GMT-14",
			"Pacific/Niue|Etc/GMT+11",
			"Pacific/Pago_Pago|Pacific/Midway",
			"Pacific/Pago_Pago|Pacific/Samoa",
			"Pacific/Pago_Pago|US/Samoa",
			"Pacific/Pitcairn|Etc/GMT+8",
			"Pacific/Port_Moresby|Antarctica/DumontDUrville",
			"Pacific/Port_Moresby|Etc/GMT-10",
			"Pacific/Port_Moresby|Pacific/Chuuk",
			"Pacific/Port_Moresby|Pacific/Truk",
			"Pacific/Port_Moresby|Pacific/Yap",
			"Pacific/Tahiti|Etc/GMT+10",
			"Pacific/Tahiti|Pacific/Rarotonga"
		],
		"countries": [
			"AD|Europe/Andorra",
			"AE|Asia/Dubai",
			"AF|Asia/Kabul",
			"AG|America/Puerto_Rico America/Antigua",
			"AI|America/Puerto_Rico America/Anguilla",
			"AL|Europe/Tirane",
			"AM|Asia/Yerevan",
			"AO|Africa/Lagos Africa/Luanda",
			"AQ|Antarctica/Casey Antarctica/Davis Antarctica/Mawson Antarctica/Palmer Antarctica/Rothera Antarctica/Troll Asia/Urumqi Pacific/Auckland Pacific/Port_Moresby Asia/Riyadh Antarctica/McMurdo Antarctica/DumontDUrville Antarctica/Syowa Antarctica/Vostok",
			"AR|America/Argentina/Buenos_Aires America/Argentina/Cordoba America/Argentina/Salta America/Argentina/Jujuy America/Argentina/Tucuman America/Argentina/Catamarca America/Argentina/La_Rioja America/Argentina/San_Juan America/Argentina/Mendoza America/Argentina/San_Luis America/Argentina/Rio_Gallegos America/Argentina/Ushuaia",
			"AS|Pacific/Pago_Pago",
			"AT|Europe/Vienna",
			"AU|Australia/Lord_Howe Antarctica/Macquarie Australia/Hobart Australia/Melbourne Australia/Sydney Australia/Broken_Hill Australia/Brisbane Australia/Lindeman Australia/Adelaide Australia/Darwin Australia/Perth Australia/Eucla",
			"AW|America/Puerto_Rico America/Aruba",
			"AX|Europe/Helsinki Europe/Mariehamn",
			"AZ|Asia/Baku",
			"BA|Europe/Belgrade Europe/Sarajevo",
			"BB|America/Barbados",
			"BD|Asia/Dhaka",
			"BE|Europe/Brussels",
			"BF|Africa/Abidjan Africa/Ouagadougou",
			"BG|Europe/Sofia",
			"BH|Asia/Qatar Asia/Bahrain",
			"BI|Africa/Maputo Africa/Bujumbura",
			"BJ|Africa/Lagos Africa/Porto-Novo",
			"BL|America/Puerto_Rico America/St_Barthelemy",
			"BM|Atlantic/Bermuda",
			"BN|Asia/Kuching Asia/Brunei",
			"BO|America/La_Paz",
			"BQ|America/Puerto_Rico America/Kralendijk",
			"BR|America/Noronha America/Belem America/Fortaleza America/Recife America/Araguaina America/Maceio America/Bahia America/Sao_Paulo America/Campo_Grande America/Cuiaba America/Santarem America/Porto_Velho America/Boa_Vista America/Manaus America/Eirunepe America/Rio_Branco",
			"BS|America/Toronto America/Nassau",
			"BT|Asia/Thimphu",
			"BW|Africa/Maputo Africa/Gaborone",
			"BY|Europe/Minsk",
			"BZ|America/Belize",
			"CA|America/St_Johns America/Halifax America/Glace_Bay America/Moncton America/Goose_Bay America/Toronto America/Nipigon America/Thunder_Bay America/Iqaluit America/Pangnirtung America/Winnipeg America/Rainy_River America/Resolute America/Rankin_Inlet America/Regina America/Swift_Current America/Edmonton America/Cambridge_Bay America/Yellowknife America/Inuvik America/Dawson_Creek America/Fort_Nelson America/Whitehorse America/Dawson America/Vancouver America/Panama America/Puerto_Rico America/Phoenix America/Blanc-Sablon America/Atikokan America/Creston",
			"CC|Asia/Yangon Indian/Cocos",
			"CD|Africa/Maputo Africa/Lagos Africa/Kinshasa Africa/Lubumbashi",
			"CF|Africa/Lagos Africa/Bangui",
			"CG|Africa/Lagos Africa/Brazzaville",
			"CH|Europe/Zurich",
			"CI|Africa/Abidjan",
			"CK|Pacific/Rarotonga",
			"CL|America/Santiago America/Punta_Arenas Pacific/Easter",
			"CM|Africa/Lagos Africa/Douala",
			"CN|Asia/Shanghai Asia/Urumqi",
			"CO|America/Bogota",
			"CR|America/Costa_Rica",
			"CU|America/Havana",
			"CV|Atlantic/Cape_Verde",
			"CW|America/Puerto_Rico America/Curacao",
			"CX|Asia/Bangkok Indian/Christmas",
			"CY|Asia/Nicosia Asia/Famagusta",
			"CZ|Europe/Prague",
			"DE|Europe/Zurich Europe/Berlin Europe/Busingen",
			"DJ|Africa/Nairobi Africa/Djibouti",
			"DK|Europe/Berlin Europe/Copenhagen",
			"DM|America/Puerto_Rico America/Dominica",
			"DO|America/Santo_Domingo",
			"DZ|Africa/Algiers",
			"EC|America/Guayaquil Pacific/Galapagos",
			"EE|Europe/Tallinn",
			"EG|Africa/Cairo",
			"EH|Africa/El_Aaiun",
			"ER|Africa/Nairobi Africa/Asmara",
			"ES|Europe/Madrid Africa/Ceuta Atlantic/Canary",
			"ET|Africa/Nairobi Africa/Addis_Ababa",
			"FI|Europe/Helsinki",
			"FJ|Pacific/Fiji",
			"FK|Atlantic/Stanley",
			"FM|Pacific/Kosrae Pacific/Port_Moresby Pacific/Guadalcanal Pacific/Chuuk Pacific/Pohnpei",
			"FO|Atlantic/Faroe",
			"FR|Europe/Paris",
			"GA|Africa/Lagos Africa/Libreville",
			"GB|Europe/London",
			"GD|America/Puerto_Rico America/Grenada",
			"GE|Asia/Tbilisi",
			"GF|America/Cayenne",
			"GG|Europe/London Europe/Guernsey",
			"GH|Africa/Abidjan Africa/Accra",
			"GI|Europe/Gibraltar",
			"GL|America/Nuuk America/Danmarkshavn America/Scoresbysund America/Thule",
			"GM|Africa/Abidjan Africa/Banjul",
			"GN|Africa/Abidjan Africa/Conakry",
			"GP|America/Puerto_Rico America/Guadeloupe",
			"GQ|Africa/Lagos Africa/Malabo",
			"GR|Europe/Athens",
			"GS|Atlantic/South_Georgia",
			"GT|America/Guatemala",
			"GU|Pacific/Guam",
			"GW|Africa/Bissau",
			"GY|America/Guyana",
			"HK|Asia/Hong_Kong",
			"HN|America/Tegucigalpa",
			"HR|Europe/Belgrade Europe/Zagreb",
			"HT|America/Port-au-Prince",
			"HU|Europe/Budapest",
			"ID|Asia/Jakarta Asia/Pontianak Asia/Makassar Asia/Jayapura",
			"IE|Europe/Dublin",
			"IL|Asia/Jerusalem",
			"IM|Europe/London Europe/Isle_of_Man",
			"IN|Asia/Kolkata",
			"IO|Indian/Chagos",
			"IQ|Asia/Baghdad",
			"IR|Asia/Tehran",
			"IS|Africa/Abidjan Atlantic/Reykjavik",
			"IT|Europe/Rome",
			"JE|Europe/London Europe/Jersey",
			"JM|America/Jamaica",
			"JO|Asia/Amman",
			"JP|Asia/Tokyo",
			"KE|Africa/Nairobi",
			"KG|Asia/Bishkek",
			"KH|Asia/Bangkok Asia/Phnom_Penh",
			"KI|Pacific/Tarawa Pacific/Kanton Pacific/Kiritimati",
			"KM|Africa/Nairobi Indian/Comoro",
			"KN|America/Puerto_Rico America/St_Kitts",
			"KP|Asia/Pyongyang",
			"KR|Asia/Seoul",
			"KW|Asia/Riyadh Asia/Kuwait",
			"KY|America/Panama America/Cayman",
			"KZ|Asia/Almaty Asia/Qyzylorda Asia/Qostanay Asia/Aqtobe Asia/Aqtau Asia/Atyrau Asia/Oral",
			"LA|Asia/Bangkok Asia/Vientiane",
			"LB|Asia/Beirut",
			"LC|America/Puerto_Rico America/St_Lucia",
			"LI|Europe/Zurich Europe/Vaduz",
			"LK|Asia/Colombo",
			"LR|Africa/Monrovia",
			"LS|Africa/Johannesburg Africa/Maseru",
			"LT|Europe/Vilnius",
			"LU|Europe/Brussels Europe/Luxembourg",
			"LV|Europe/Riga",
			"LY|Africa/Tripoli",
			"MA|Africa/Casablanca",
			"MC|Europe/Paris Europe/Monaco",
			"MD|Europe/Chisinau",
			"ME|Europe/Belgrade Europe/Podgorica",
			"MF|America/Puerto_Rico America/Marigot",
			"MG|Africa/Nairobi Indian/Antananarivo",
			"MH|Pacific/Tarawa Pacific/Kwajalein Pacific/Majuro",
			"MK|Europe/Belgrade Europe/Skopje",
			"ML|Africa/Abidjan Africa/Bamako",
			"MM|Asia/Yangon",
			"MN|Asia/Ulaanbaatar Asia/Hovd Asia/Choibalsan",
			"MO|Asia/Macau",
			"MP|Pacific/Guam Pacific/Saipan",
			"MQ|America/Martinique",
			"MR|Africa/Abidjan Africa/Nouakchott",
			"MS|America/Puerto_Rico America/Montserrat",
			"MT|Europe/Malta",
			"MU|Indian/Mauritius",
			"MV|Indian/Maldives",
			"MW|Africa/Maputo Africa/Blantyre",
			"MX|America/Mexico_City America/Cancun America/Merida America/Monterrey America/Matamoros America/Mazatlan America/Chihuahua America/Ojinaga America/Hermosillo America/Tijuana America/Bahia_Banderas",
			"MY|Asia/Kuching Asia/Singapore Asia/Kuala_Lumpur",
			"MZ|Africa/Maputo",
			"NA|Africa/Windhoek",
			"NC|Pacific/Noumea",
			"NE|Africa/Lagos Africa/Niamey",
			"NF|Pacific/Norfolk",
			"NG|Africa/Lagos",
			"NI|America/Managua",
			"NL|Europe/Brussels Europe/Amsterdam",
			"NO|Europe/Berlin Europe/Oslo",
			"NP|Asia/Kathmandu",
			"NR|Pacific/Nauru",
			"NU|Pacific/Niue",
			"NZ|Pacific/Auckland Pacific/Chatham",
			"OM|Asia/Dubai Asia/Muscat",
			"PA|America/Panama",
			"PE|America/Lima",
			"PF|Pacific/Tahiti Pacific/Marquesas Pacific/Gambier",
			"PG|Pacific/Port_Moresby Pacific/Bougainville",
			"PH|Asia/Manila",
			"PK|Asia/Karachi",
			"PL|Europe/Warsaw",
			"PM|America/Miquelon",
			"PN|Pacific/Pitcairn",
			"PR|America/Puerto_Rico",
			"PS|Asia/Gaza Asia/Hebron",
			"PT|Europe/Lisbon Atlantic/Madeira Atlantic/Azores",
			"PW|Pacific/Palau",
			"PY|America/Asuncion",
			"QA|Asia/Qatar",
			"RE|Asia/Dubai Indian/Reunion",
			"RO|Europe/Bucharest",
			"RS|Europe/Belgrade",
			"RU|Europe/Kaliningrad Europe/Moscow Europe/Simferopol Europe/Kirov Europe/Volgograd Europe/Astrakhan Europe/Saratov Europe/Ulyanovsk Europe/Samara Asia/Yekaterinburg Asia/Omsk Asia/Novosibirsk Asia/Barnaul Asia/Tomsk Asia/Novokuznetsk Asia/Krasnoyarsk Asia/Irkutsk Asia/Chita Asia/Yakutsk Asia/Khandyga Asia/Vladivostok Asia/Ust-Nera Asia/Magadan Asia/Sakhalin Asia/Srednekolymsk Asia/Kamchatka Asia/Anadyr",
			"RW|Africa/Maputo Africa/Kigali",
			"SA|Asia/Riyadh",
			"SB|Pacific/Guadalcanal",
			"SC|Asia/Dubai Indian/Mahe",
			"SD|Africa/Khartoum",
			"SE|Europe/Berlin Europe/Stockholm",
			"SG|Asia/Singapore",
			"SH|Africa/Abidjan Atlantic/St_Helena",
			"SI|Europe/Belgrade Europe/Ljubljana",
			"SJ|Europe/Berlin Arctic/Longyearbyen",
			"SK|Europe/Prague Europe/Bratislava",
			"SL|Africa/Abidjan Africa/Freetown",
			"SM|Europe/Rome Europe/San_Marino",
			"SN|Africa/Abidjan Africa/Dakar",
			"SO|Africa/Nairobi Africa/Mogadishu",
			"SR|America/Paramaribo",
			"SS|Africa/Juba",
			"ST|Africa/Sao_Tome",
			"SV|America/El_Salvador",
			"SX|America/Puerto_Rico America/Lower_Princes",
			"SY|Asia/Damascus",
			"SZ|Africa/Johannesburg Africa/Mbabane",
			"TC|America/Grand_Turk",
			"TD|Africa/Ndjamena",
			"TF|Asia/Dubai Indian/Maldives Indian/Kerguelen",
			"TG|Africa/Abidjan Africa/Lome",
			"TH|Asia/Bangkok",
			"TJ|Asia/Dushanbe",
			"TK|Pacific/Fakaofo",
			"TL|Asia/Dili",
			"TM|Asia/Ashgabat",
			"TN|Africa/Tunis",
			"TO|Pacific/Tongatapu",
			"TR|Europe/Istanbul",
			"TT|America/Puerto_Rico America/Port_of_Spain",
			"TV|Pacific/Tarawa Pacific/Funafuti",
			"TW|Asia/Taipei",
			"TZ|Africa/Nairobi Africa/Dar_es_Salaam",
			"UA|Europe/Simferopol Europe/Kyiv",
			"UG|Africa/Nairobi Africa/Kampala",
			"UM|Pacific/Pago_Pago Pacific/Tarawa Pacific/Honolulu Pacific/Midway Pacific/Wake",
			"US|America/New_York America/Detroit America/Kentucky/Louisville America/Kentucky/Monticello America/Indiana/Indianapolis America/Indiana/Vincennes America/Indiana/Winamac America/Indiana/Marengo America/Indiana/Petersburg America/Indiana/Vevay America/Chicago America/Indiana/Tell_City America/Indiana/Knox America/Menominee America/North_Dakota/Center America/North_Dakota/New_Salem America/North_Dakota/Beulah America/Denver America/Boise America/Phoenix America/Los_Angeles America/Anchorage America/Juneau America/Sitka America/Metlakatla America/Yakutat America/Nome America/Adak Pacific/Honolulu",
			"UY|America/Montevideo",
			"UZ|Asia/Samarkand Asia/Tashkent",
			"VA|Europe/Rome Europe/Vatican",
			"VC|America/Puerto_Rico America/St_Vincent",
			"VE|America/Caracas",
			"VG|America/Puerto_Rico America/Tortola",
			"VI|America/Puerto_Rico America/St_Thomas",
			"VN|Asia/Bangkok Asia/Ho_Chi_Minh",
			"VU|Pacific/Efate",
			"WF|Pacific/Tarawa Pacific/Wallis",
			"WS|Pacific/Apia",
			"YE|Asia/Riyadh Asia/Aden",
			"YT|Africa/Nairobi Indian/Mayotte",
			"ZA|Africa/Johannesburg",
			"ZM|Africa/Maputo Africa/Lusaka",
			"ZW|Africa/Maputo Africa/Harare"
		]
	});


	return moment;
}));

},{"moment":87}],87:[function(require,module,exports){
//! moment.js
//! version : 2.29.4
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

    var hookCallback;

    function hooks() {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback(callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return (
            input instanceof Array ||
            Object.prototype.toString.call(input) === '[object Array]'
        );
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return (
            input != null &&
            Object.prototype.toString.call(input) === '[object Object]'
        );
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) {
            return Object.getOwnPropertyNames(obj).length === 0;
        } else {
            var k;
            for (k in obj) {
                if (hasOwnProp(obj, k)) {
                    return false;
                }
            }
            return true;
        }
    }

    function isUndefined(input) {
        return input === void 0;
    }

    function isNumber(input) {
        return (
            typeof input === 'number' ||
            Object.prototype.toString.call(input) === '[object Number]'
        );
    }

    function isDate(input) {
        return (
            input instanceof Date ||
            Object.prototype.toString.call(input) === '[object Date]'
        );
    }

    function map(arr, fn) {
        var res = [],
            i,
            arrLen = arr.length;
        for (i = 0; i < arrLen; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function createUTC(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: false,
            invalidEra: null,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: false,
            parsedDateParts: [],
            era: null,
            meridiem: null,
            rfc2822: false,
            weekdayMismatch: false,
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this),
                len = t.length >>> 0,
                i;

            for (i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m),
                parsedParts = some.call(flags.parsedDateParts, function (i) {
                    return i != null;
                }),
                isNowValid =
                    !isNaN(m._d.getTime()) &&
                    flags.overflow < 0 &&
                    !flags.empty &&
                    !flags.invalidEra &&
                    !flags.invalidMonth &&
                    !flags.invalidWeekday &&
                    !flags.weekdayMismatch &&
                    !flags.nullInput &&
                    !flags.invalidFormat &&
                    !flags.userInvalidated &&
                    (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                isNowValid =
                    isNowValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
                m._isValid = isNowValid;
            } else {
                return isNowValid;
            }
        }
        return m._isValid;
    }

    function createInvalid(flags) {
        var m = createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        } else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = (hooks.momentProperties = []),
        updateInProgress = false;

    function copyConfig(to, from) {
        var i,
            prop,
            val,
            momentPropertiesLen = momentProperties.length;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentPropertiesLen > 0) {
            for (i = 0; i < momentPropertiesLen; i++) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment(obj) {
        return (
            obj instanceof Moment || (obj != null && obj._isAMomentObject != null)
        );
    }

    function warn(msg) {
        if (
            hooks.suppressDeprecationWarnings === false &&
            typeof console !== 'undefined' &&
            console.warn
        ) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [],
                    arg,
                    i,
                    key,
                    argLen = arguments.length;
                for (i = 0; i < argLen; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (key in arguments[0]) {
                            if (hasOwnProp(arguments[0], key)) {
                                arg += key + ': ' + arguments[0][key] + ', ';
                            }
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(
                    msg +
                        '\nArguments: ' +
                        Array.prototype.slice.call(args).join('') +
                        '\n' +
                        new Error().stack
                );
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;

    function isFunction(input) {
        return (
            (typeof Function !== 'undefined' && input instanceof Function) ||
            Object.prototype.toString.call(input) === '[object Function]'
        );
    }

    function set(config) {
        var prop, i;
        for (i in config) {
            if (hasOwnProp(config, i)) {
                prop = config[i];
                if (isFunction(prop)) {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
        // TODO: Remove "ordinalParse" fallback in next major release.
        this._dayOfMonthOrdinalParseLenient = new RegExp(
            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
                '|' +
                /\d{1,2}/.source
        );
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig),
            prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (
                hasOwnProp(parentConfig, prop) &&
                !hasOwnProp(childConfig, prop) &&
                isObject(parentConfig[prop])
            ) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i,
                res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var defaultCalendar = {
        sameDay: '[Today at] LT',
        nextDay: '[Tomorrow at] LT',
        nextWeek: 'dddd [at] LT',
        lastDay: '[Yesterday at] LT',
        lastWeek: '[Last] dddd [at] LT',
        sameElse: 'L',
    };

    function calendar(key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (
            (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) +
            absNumber
        );
    }

    var formattingTokens =
            /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
        formatFunctions = {},
        formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken(token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(
                    func.apply(this, arguments),
                    token
                );
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens),
            i,
            length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '',
                i;
            for (i = 0; i < length; i++) {
                output += isFunction(array[i])
                    ? array[i].call(mom, format)
                    : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] =
            formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(
                localFormattingTokens,
                replaceLongDateFormatTokens
            );
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var defaultLongDateFormat = {
        LTS: 'h:mm:ss A',
        LT: 'h:mm A',
        L: 'MM/DD/YYYY',
        LL: 'MMMM D, YYYY',
        LLL: 'MMMM D, YYYY h:mm A',
        LLLL: 'dddd, MMMM D, YYYY h:mm A',
    };

    function longDateFormat(key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper
            .match(formattingTokens)
            .map(function (tok) {
                if (
                    tok === 'MMMM' ||
                    tok === 'MM' ||
                    tok === 'DD' ||
                    tok === 'dddd'
                ) {
                    return tok.slice(1);
                }
                return tok;
            })
            .join('');

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate() {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d',
        defaultDayOfMonthOrdinalParse = /\d{1,2}/;

    function ordinal(number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        ss: '%d seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        w: 'a week',
        ww: '%d weeks',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years',
    };

    function relativeTime(number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return isFunction(output)
            ? output(number, withoutSuffix, string, isFuture)
            : output.replace(/%d/i, number);
    }

    function pastFuture(diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias(unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string'
            ? aliases[units] || aliases[units.toLowerCase()]
            : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [],
            u;
        for (u in unitsObj) {
            if (hasOwnProp(unitsObj, u)) {
                units.push({ unit: u, priority: priorities[u] });
            }
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function absFloor(number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    function makeGetSet(unit, keepTime) {
        return function (value) {
            if (value != null) {
                set$1(this, unit, value);
                hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get(this, unit);
            }
        };
    }

    function get(mom, unit) {
        return mom.isValid()
            ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]()
            : NaN;
    }

    function set$1(mom, unit, value) {
        if (mom.isValid() && !isNaN(value)) {
            if (
                unit === 'FullYear' &&
                isLeapYear(mom.year()) &&
                mom.month() === 1 &&
                mom.date() === 29
            ) {
                value = toInt(value);
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](
                    value,
                    mom.month(),
                    daysInMonth(value, mom.month())
                );
            } else {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
            }
        }
    }

    // MOMENTS

    function stringGet(units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }

    function stringSet(units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units),
                i,
                prioritizedLen = prioritized.length;
            for (i = 0; i < prioritizedLen; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    var match1 = /\d/, //       0 - 9
        match2 = /\d\d/, //      00 - 99
        match3 = /\d{3}/, //     000 - 999
        match4 = /\d{4}/, //    0000 - 9999
        match6 = /[+-]?\d{6}/, // -999999 - 999999
        match1to2 = /\d\d?/, //       0 - 99
        match3to4 = /\d\d\d\d?/, //     999 - 9999
        match5to6 = /\d\d\d\d\d\d?/, //   99999 - 999999
        match1to3 = /\d{1,3}/, //       0 - 999
        match1to4 = /\d{1,4}/, //       0 - 9999
        match1to6 = /[+-]?\d{1,6}/, // -999999 - 999999
        matchUnsigned = /\d+/, //       0 - inf
        matchSigned = /[+-]?\d+/, //    -inf - inf
        matchOffset = /Z|[+-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, // +00 -00 +00:00 -00:00 +0000 -0000 or Z
        matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
        // any word (or two) characters or numbers including two/three word month in arabic.
        // includes scottish gaelic two word and hyphenated months
        matchWord =
            /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
        regexes;

    regexes = {};

    function addRegexToken(token, regex, strictRegex) {
        regexes[token] = isFunction(regex)
            ? regex
            : function (isStrict, localeData) {
                  return isStrict && strictRegex ? strictRegex : regex;
              };
    }

    function getParseRegexForToken(token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(
            s
                .replace('\\', '')
                .replace(
                    /\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,
                    function (matched, p1, p2, p3, p4) {
                        return p1 || p2 || p3 || p4;
                    }
                )
        );
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken(token, callback) {
        var i,
            func = callback,
            tokenLen;
        if (typeof token === 'string') {
            token = [token];
        }
        if (isNumber(callback)) {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        tokenLen = token.length;
        for (i = 0; i < tokenLen; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken(token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,
        WEEK = 7,
        WEEKDAY = 8;

    function mod(n, x) {
        return ((n % x) + x) % x;
    }

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) {
            return NaN;
        }
        var modMonth = mod(month, 12);
        year += (month - modMonth) / 12;
        return modMonth === 1
            ? isLeapYear(year)
                ? 29
                : 28
            : 31 - ((modMonth % 7) % 2);
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PRIORITY

    addUnitPriority('month', 8);

    // PARSING

    addRegexToken('M', match1to2);
    addRegexToken('MM', match1to2, match2);
    addRegexToken('MMM', function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths =
            'January_February_March_April_May_June_July_August_September_October_November_December'.split(
                '_'
            ),
        defaultLocaleMonthsShort =
            'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
        defaultMonthsShortRegex = matchWord,
        defaultMonthsRegex = matchWord;

    function localeMonths(m, format) {
        if (!m) {
            return isArray(this._months)
                ? this._months
                : this._months['standalone'];
        }
        return isArray(this._months)
            ? this._months[m.month()]
            : this._months[
                  (this._months.isFormat || MONTHS_IN_FORMAT).test(format)
                      ? 'format'
                      : 'standalone'
              ][m.month()];
    }

    function localeMonthsShort(m, format) {
        if (!m) {
            return isArray(this._monthsShort)
                ? this._monthsShort
                : this._monthsShort['standalone'];
        }
        return isArray(this._monthsShort)
            ? this._monthsShort[m.month()]
            : this._monthsShort[
                  MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'
              ][m.month()];
    }

    function handleStrictParse(monthName, format, strict) {
        var i,
            ii,
            mom,
            llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse(monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp(
                    '^' + this.months(mom, '').replace('.', '') + '$',
                    'i'
                );
                this._shortMonthsParse[i] = new RegExp(
                    '^' + this.monthsShort(mom, '').replace('.', '') + '$',
                    'i'
                );
            }
            if (!strict && !this._monthsParse[i]) {
                regex =
                    '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (
                strict &&
                format === 'MMMM' &&
                this._longMonthsParse[i].test(monthName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'MMM' &&
                this._shortMonthsParse[i].test(monthName)
            ) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth(mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (!isNumber(value)) {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth(value) {
        if (value != null) {
            setMonth(this, value);
            hooks.updateOffset(this, true);
            return this;
        } else {
            return get(this, 'Month');
        }
    }

    function getDaysInMonth() {
        return daysInMonth(this.year(), this.month());
    }

    function monthsShortRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict
                ? this._monthsShortStrictRegex
                : this._monthsShortRegex;
        }
    }

    function monthsRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict
                ? this._monthsStrictRegex
                : this._monthsRegex;
        }
    }

    function computeMonthsParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i,
            mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp(
            '^(' + longPieces.join('|') + ')',
            'i'
        );
        this._monthsShortStrictRegex = new RegExp(
            '^(' + shortPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? zeroFill(y, 4) : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY', 4], 0, 'year');
    addFormatToken(0, ['YYYYY', 5], 0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PRIORITIES

    addUnitPriority('year', 1);

    // PARSING

    addRegexToken('Y', matchSigned);
    addRegexToken('YY', match1to2, match2);
    addRegexToken('YYYY', match1to4, match4);
    addRegexToken('YYYYY', match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] =
            input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    // HOOKS

    hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear() {
        return isLeapYear(this.year());
    }

    function createDate(y, m, d, h, M, s, ms) {
        // can't just apply() to create a date:
        // https://stackoverflow.com/q/181348
        var date;
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            date = new Date(y + 400, m, d, h, M, s, ms);
            if (isFinite(date.getFullYear())) {
                date.setFullYear(y);
            }
        } else {
            date = new Date(y, m, d, h, M, s, ms);
        }

        return date;
    }

    function createUTCDate(y) {
        var date, args;
        // the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            args = Array.prototype.slice.call(arguments);
            // preserve leap years using a full 400 year cycle, then reset
            args[0] = y + 400;
            date = new Date(Date.UTC.apply(null, args));
            if (isFinite(date.getUTCFullYear())) {
                date.setUTCFullYear(y);
            }
        } else {
            date = new Date(Date.UTC.apply(null, arguments));
        }

        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear,
            resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear,
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek,
            resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear,
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

    // PARSING

    addRegexToken('w', match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W', match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(
        ['w', 'ww', 'W', 'WW'],
        function (input, week, config, token) {
            week[token.substr(0, 1)] = toInt(input);
        }
    );

    // HELPERS

    // LOCALES

    function localeWeek(mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow: 0, // Sunday is the first day of the week.
        doy: 6, // The week that contains Jan 6th is the first week of the year.
    };

    function localeFirstDayOfWeek() {
        return this._week.dow;
    }

    function localeFirstDayOfYear() {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek(input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek(input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

    // PARSING

    addRegexToken('d', match1to2);
    addRegexToken('e', match1to2);
    addRegexToken('E', match1to2);
    addRegexToken('dd', function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd', function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd', function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES
    function shiftWeekdays(ws, n) {
        return ws.slice(n, 7).concat(ws.slice(0, n));
    }

    var defaultLocaleWeekdays =
            'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        defaultWeekdaysRegex = matchWord,
        defaultWeekdaysShortRegex = matchWord,
        defaultWeekdaysMinRegex = matchWord;

    function localeWeekdays(m, format) {
        var weekdays = isArray(this._weekdays)
            ? this._weekdays
            : this._weekdays[
                  m && m !== true && this._weekdays.isFormat.test(format)
                      ? 'format'
                      : 'standalone'
              ];
        return m === true
            ? shiftWeekdays(weekdays, this._week.dow)
            : m
            ? weekdays[m.day()]
            : weekdays;
    }

    function localeWeekdaysShort(m) {
        return m === true
            ? shiftWeekdays(this._weekdaysShort, this._week.dow)
            : m
            ? this._weekdaysShort[m.day()]
            : this._weekdaysShort;
    }

    function localeWeekdaysMin(m) {
        return m === true
            ? shiftWeekdays(this._weekdaysMin, this._week.dow)
            : m
            ? this._weekdaysMin[m.day()]
            : this._weekdaysMin;
    }

    function handleStrictParse$1(weekdayName, format, strict) {
        var i,
            ii,
            mom,
            llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse(weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return handleStrictParse$1.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdays(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
                this._shortWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
                this._minWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
            }
            if (!this._weekdaysParse[i]) {
                regex =
                    '^' +
                    this.weekdays(mom, '') +
                    '|^' +
                    this.weekdaysShort(mom, '') +
                    '|^' +
                    this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (
                strict &&
                format === 'dddd' &&
                this._fullWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'ddd' &&
                this._shortWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'dd' &&
                this._minWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    function weekdaysRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict
                ? this._weekdaysStrictRegex
                : this._weekdaysRegex;
        }
    }

    function weekdaysShortRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict
                ? this._weekdaysShortStrictRegex
                : this._weekdaysShortRegex;
        }
    }

    function weekdaysMinRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict
                ? this._weekdaysMinStrictRegex
                : this._weekdaysMinRegex;
        }
    }

    function computeWeekdaysParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [],
            shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i,
            mom,
            minp,
            shortp,
            longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);
            minp = regexEscape(this.weekdaysMin(mom, ''));
            shortp = regexEscape(this.weekdaysShort(mom, ''));
            longp = regexEscape(this.weekdays(mom, ''));
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp(
            '^(' + longPieces.join('|') + ')',
            'i'
        );
        this._weekdaysShortStrictRegex = new RegExp(
            '^(' + shortPieces.join('|') + ')',
            'i'
        );
        this._weekdaysMinStrictRegex = new RegExp(
            '^(' + minPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return (
            '' +
            hFormat.apply(this) +
            zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2)
        );
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return (
            '' +
            this.hours() +
            zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2)
        );
    });

    function meridiem(token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(
                this.hours(),
                this.minutes(),
                lowercase
            );
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PRIORITY
    addUnitPriority('hour', 13);

    // PARSING

    function matchMeridiem(isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a', matchMeridiem);
    addRegexToken('A', matchMeridiem);
    addRegexToken('H', match1to2);
    addRegexToken('h', match1to2);
    addRegexToken('k', match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);
    addRegexToken('kk', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['k', 'kk'], function (input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
    });
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4,
            pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4,
            pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM(input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return (input + '').toLowerCase().charAt(0) === 'p';
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i,
        // Setting the hour should keep the time, because the user explicitly
        // specified which hour they want. So trying to maintain the same hour (in
        // a new timezone) makes sense. Adding/subtracting hours does not follow
        // this rule.
        getSetHour = makeGetSet('Hours', true);

    function localeMeridiem(hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }

    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse,
    };

    // internal storage for locale config files
    var locales = {},
        localeFamilies = {},
        globalLocale;

    function commonPrefix(arr1, arr2) {
        var i,
            minl = Math.min(arr1.length, arr2.length);
        for (i = 0; i < minl; i += 1) {
            if (arr1[i] !== arr2[i]) {
                return i;
            }
        }
        return minl;
    }

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0,
            j,
            next,
            locale,
            split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (
                    next &&
                    next.length >= j &&
                    commonPrefix(split, next) >= j - 1
                ) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return globalLocale;
    }

    function isLocaleNameSane(name) {
        // Prevent names that look like filesystem paths, i.e contain '/' or '\'
        return name.match('^[^/\\\\]*$') != null;
    }

    function loadLocale(name) {
        var oldLocale = null,
            aliasedRequire;
        // TODO: Find a better way to register and load all the locales in Node
        if (
            locales[name] === undefined &&
            typeof module !== 'undefined' &&
            module &&
            module.exports &&
            isLocaleNameSane(name)
        ) {
            try {
                oldLocale = globalLocale._abbr;
                aliasedRequire = require;
                aliasedRequire('./locale/' + name);
                getSetGlobalLocale(oldLocale);
            } catch (e) {
                // mark as not found to avoid repeating expensive file require call causing high CPU
                // when trying to find en-US, en_US, en-us for every format call
                locales[name] = null; // null means not found
            }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function getSetGlobalLocale(key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = getLocale(key);
            } else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            } else {
                if (typeof console !== 'undefined' && console.warn) {
                    //warn user if arguments are passed but the locale could not be set
                    console.warn(
                        'Locale ' + key + ' not found. Did you forget to load it?'
                    );
                }
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale(name, config) {
        if (config !== null) {
            var locale,
                parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple(
                    'defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale ' +
                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.'
                );
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    locale = loadLocale(config.parentLocale);
                    if (locale != null) {
                        parentConfig = locale._config;
                    } else {
                        if (!localeFamilies[config.parentLocale]) {
                            localeFamilies[config.parentLocale] = [];
                        }
                        localeFamilies[config.parentLocale].push({
                            name: name,
                            config: config,
                        });
                        return null;
                    }
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            if (localeFamilies[name]) {
                localeFamilies[name].forEach(function (x) {
                    defineLocale(x.name, x.config);
                });
            }

            // backwards compat for now: also set the locale
            // make sure we set the locale AFTER all child locales have been
            // created, so we won't end up with the child locale set.
            getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale,
                tmpLocale,
                parentConfig = baseConfig;

            if (locales[name] != null && locales[name].parentLocale != null) {
                // Update existing child locale in-place to avoid memory-leaks
                locales[name].set(mergeConfigs(locales[name]._config, config));
            } else {
                // MERGE
                tmpLocale = loadLocale(name);
                if (tmpLocale != null) {
                    parentConfig = tmpLocale._config;
                }
                config = mergeConfigs(parentConfig, config);
                if (tmpLocale == null) {
                    // updateLocale is called for creating a new locale
                    // Set abbr so it will have a name (getters return
                    // undefined otherwise).
                    config.abbr = name;
                }
                locale = new Locale(config);
                locale.parentLocale = locales[name];
                locales[name] = locale;
            }

            // backwards compat for now: also set the locale
            getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                    if (name === getSetGlobalLocale()) {
                        getSetGlobalLocale(name);
                    }
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function getLocale(key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function listLocales() {
        return keys(locales);
    }

    function checkOverflow(m) {
        var overflow,
            a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH] < 0 || a[MONTH] > 11
                    ? MONTH
                    : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH])
                    ? DATE
                    : a[HOUR] < 0 ||
                      a[HOUR] > 24 ||
                      (a[HOUR] === 24 &&
                          (a[MINUTE] !== 0 ||
                              a[SECOND] !== 0 ||
                              a[MILLISECOND] !== 0))
                    ? HOUR
                    : a[MINUTE] < 0 || a[MINUTE] > 59
                    ? MINUTE
                    : a[SECOND] < 0 || a[SECOND] > 59
                    ? SECOND
                    : a[MILLISECOND] < 0 || a[MILLISECOND] > 999
                    ? MILLISECOND
                    : -1;

            if (
                getParsingFlags(m)._overflowDayOfYear &&
                (overflow < YEAR || overflow > DATE)
            ) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex =
            /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        basicIsoRegex =
            /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        tzRegex = /Z|[+-]\d\d(?::?\d\d)?/,
        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
            ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
            ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
            ['YYYY-DDD', /\d{4}-\d{3}/],
            ['YYYY-MM', /\d{4}-\d\d/, false],
            ['YYYYYYMMDD', /[+-]\d{10}/],
            ['YYYYMMDD', /\d{8}/],
            ['GGGG[W]WWE', /\d{4}W\d{3}/],
            ['GGGG[W]WW', /\d{4}W\d{2}/, false],
            ['YYYYDDD', /\d{7}/],
            ['YYYYMM', /\d{6}/, false],
            ['YYYY', /\d{4}/, false],
        ],
        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
            ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
            ['HH:mm:ss', /\d\d:\d\d:\d\d/],
            ['HH:mm', /\d\d:\d\d/],
            ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
            ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
            ['HHmmss', /\d\d\d\d\d\d/],
            ['HHmm', /\d\d\d\d/],
            ['HH', /\d\d/],
        ],
        aspNetJsonRegex = /^\/?Date\((-?\d+)/i,
        // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
        rfc2822 =
            /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
        obsOffsets = {
            UT: 0,
            GMT: 0,
            EDT: -4 * 60,
            EST: -5 * 60,
            CDT: -5 * 60,
            CST: -6 * 60,
            MDT: -6 * 60,
            MST: -7 * 60,
            PDT: -7 * 60,
            PST: -8 * 60,
        };

    // date from iso format
    function configFromISO(config) {
        var i,
            l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime,
            dateFormat,
            timeFormat,
            tzFormat,
            isoDatesLen = isoDates.length,
            isoTimesLen = isoTimes.length;

        if (match) {
            getParsingFlags(config).iso = true;
            for (i = 0, l = isoDatesLen; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimesLen; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    function extractFromRFC2822Strings(
        yearStr,
        monthStr,
        dayStr,
        hourStr,
        minuteStr,
        secondStr
    ) {
        var result = [
            untruncateYear(yearStr),
            defaultLocaleMonthsShort.indexOf(monthStr),
            parseInt(dayStr, 10),
            parseInt(hourStr, 10),
            parseInt(minuteStr, 10),
        ];

        if (secondStr) {
            result.push(parseInt(secondStr, 10));
        }

        return result;
    }

    function untruncateYear(yearStr) {
        var year = parseInt(yearStr, 10);
        if (year <= 49) {
            return 2000 + year;
        } else if (year <= 999) {
            return 1900 + year;
        }
        return year;
    }

    function preprocessRFC2822(s) {
        // Remove comments and folding whitespace and replace multiple-spaces with a single space
        return s
            .replace(/\([^()]*\)|[\n\t]/g, ' ')
            .replace(/(\s\s+)/g, ' ')
            .replace(/^\s\s*/, '')
            .replace(/\s\s*$/, '');
    }

    function checkWeekday(weekdayStr, parsedInput, config) {
        if (weekdayStr) {
            // TODO: Replace the vanilla JS Date object with an independent day-of-week check.
            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                weekdayActual = new Date(
                    parsedInput[0],
                    parsedInput[1],
                    parsedInput[2]
                ).getDay();
            if (weekdayProvided !== weekdayActual) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return false;
            }
        }
        return true;
    }

    function calculateOffset(obsOffset, militaryOffset, numOffset) {
        if (obsOffset) {
            return obsOffsets[obsOffset];
        } else if (militaryOffset) {
            // the only allowed military tz is Z
            return 0;
        } else {
            var hm = parseInt(numOffset, 10),
                m = hm % 100,
                h = (hm - m) / 100;
            return h * 60 + m;
        }
    }

    // date and time from ref 2822 format
    function configFromRFC2822(config) {
        var match = rfc2822.exec(preprocessRFC2822(config._i)),
            parsedArray;
        if (match) {
            parsedArray = extractFromRFC2822Strings(
                match[4],
                match[3],
                match[2],
                match[5],
                match[6],
                match[7]
            );
            if (!checkWeekday(match[1], parsedArray, config)) {
                return;
            }

            config._a = parsedArray;
            config._tzm = calculateOffset(match[8], match[9], match[10]);

            config._d = createUTCDate.apply(null, config._a);
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

            getParsingFlags(config).rfc2822 = true;
        } else {
            config._isValid = false;
        }
    }

    // date from 1) ASP.NET, 2) ISO, 3) RFC 2822 formats, or 4) optional fallback if parsing isn't strict
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);
        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        configFromRFC2822(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        if (config._strict) {
            config._isValid = false;
        } else {
            // Final attempt, use Input Fallback
            hooks.createFromInputFallback(config);
        }
    }

    hooks.createFromInputFallback = deprecate(
        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
            'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
            'discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
            return [
                nowValue.getUTCFullYear(),
                nowValue.getUTCMonth(),
                nowValue.getUTCDate(),
            ];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray(config) {
        var i,
            date,
            input = [],
            currentDate,
            expectedWeekday,
            yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear != null) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (
                config._dayOfYear > daysInYear(yearToUse) ||
                config._dayOfYear === 0
            ) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] =
                config._a[i] == null ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (
            config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0
        ) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(
            null,
            input
        );
        expectedWeekday = config._useUTC
            ? config._d.getUTCDay()
            : config._d.getDay();

        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }

        // check for mismatching day of week
        if (
            config._w &&
            typeof config._w.d !== 'undefined' &&
            config._w.d !== expectedWeekday
        ) {
            getParsingFlags(config).weekdayMismatch = true;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(
                w.GG,
                config._a[YEAR],
                weekOfYear(createLocal(), 1, 4).year
            );
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            curWeek = weekOfYear(createLocal(), dow, doy);

            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

            // Default to current week.
            week = defaults(w.w, curWeek.week);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from beginning of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to beginning of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // constant that refers to the ISO standard
    hooks.ISO_8601 = function () {};

    // constant that refers to the RFC 2822 form
    hooks.RFC_2822 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        if (config._f === hooks.RFC_2822) {
            configFromRFC2822(config);
            return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i,
            parsedInput,
            tokens,
            token,
            skipped,
            stringLength = string.length,
            totalParsedInputLength = 0,
            era,
            tokenLen;

        tokens =
            expandFormat(config._f, config._locale).match(formattingTokens) || [];
        tokenLen = tokens.length;
        for (i = 0; i < tokenLen; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) ||
                [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(
                    string.indexOf(parsedInput) + parsedInput.length
                );
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                } else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            } else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver =
            stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (
            config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0
        ) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(
            config._locale,
            config._a[HOUR],
            config._meridiem
        );

        // handle era
        era = getParsingFlags(config).era;
        if (era !== null) {
            config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
        }

        configFromArray(config);
        checkOverflow(config);
    }

    function meridiemFixWrap(locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,
            scoreToBeat,
            i,
            currentScore,
            validFormatFound,
            bestFormatIsValid = false,
            configfLen = config._f.length;

        if (configfLen === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < configfLen; i++) {
            currentScore = 0;
            validFormatFound = false;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (isValid(tempConfig)) {
                validFormatFound = true;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (!bestFormatIsValid) {
                if (
                    scoreToBeat == null ||
                    currentScore < scoreToBeat ||
                    validFormatFound
                ) {
                    scoreToBeat = currentScore;
                    bestMoment = tempConfig;
                    if (validFormatFound) {
                        bestFormatIsValid = true;
                    }
                }
            } else {
                if (currentScore < scoreToBeat) {
                    scoreToBeat = currentScore;
                    bestMoment = tempConfig;
                }
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i),
            dayOrDate = i.day === undefined ? i.date : i.day;
        config._a = map(
            [i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond],
            function (obj) {
                return obj && parseInt(obj, 10);
            }
        );

        configFromArray(config);
    }

    function createFromConfig(config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig(config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return createInvalid({ nullInput: true });
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
            config._d = input;
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else {
            configFromInput(config);
        }

        if (!isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
            config._d = new Date(hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (isObject(input)) {
            configFromObject(config);
        } else if (isNumber(input)) {
            // from milliseconds
            config._d = new Date(input);
        } else {
            hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC(input, format, locale, strict, isUTC) {
        var c = {};

        if (format === true || format === false) {
            strict = format;
            format = undefined;
        }

        if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
        }

        if (
            (isObject(input) && isObjectEmpty(input)) ||
            (isArray(input) && input.length === 0)
        ) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function createLocal(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
            'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
            function () {
                var other = createLocal.apply(null, arguments);
                if (this.isValid() && other.isValid()) {
                    return other < this ? this : other;
                } else {
                    return createInvalid();
                }
            }
        ),
        prototypeMax = deprecate(
            'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
            function () {
                var other = createLocal.apply(null, arguments);
                if (this.isValid() && other.isValid()) {
                    return other > this ? this : other;
                } else {
                    return createInvalid();
                }
            }
        );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +new Date();
    };

    var ordering = [
        'year',
        'quarter',
        'month',
        'week',
        'day',
        'hour',
        'minute',
        'second',
        'millisecond',
    ];

    function isDurationValid(m) {
        var key,
            unitHasDecimal = false,
            i,
            orderLen = ordering.length;
        for (key in m) {
            if (
                hasOwnProp(m, key) &&
                !(
                    indexOf.call(ordering, key) !== -1 &&
                    (m[key] == null || !isNaN(m[key]))
                )
            ) {
                return false;
            }
        }

        for (i = 0; i < orderLen; ++i) {
            if (m[ordering[i]]) {
                if (unitHasDecimal) {
                    return false; // only allow non-integers for smallest unit
                }
                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                    unitHasDecimal = true;
                }
            }
        }

        return true;
    }

    function isValid$1() {
        return this._isValid;
    }

    function createInvalid$1() {
        return createDuration(NaN);
    }

    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        this._isValid = isDurationValid(normalizedInput);

        // representation for dateAddRemove
        this._milliseconds =
            +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days + weeks * 7;
        // It is impossible to translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months + quarters * 3 + years * 12;

        this._data = {};

        this._locale = getLocale();

        this._bubble();
    }

    function isDuration(obj) {
        return obj instanceof Duration;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if (
                (dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))
            ) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    // FORMATTING

    function offset(token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset(),
                sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return (
                sign +
                zeroFill(~~(offset / 60), 2) +
                separator +
                zeroFill(~~offset % 60, 2)
            );
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z', matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = (string || '').match(matcher),
            chunk,
            parts,
            minutes;

        if (matches === null) {
            return null;
        }

        chunk = matches[matches.length - 1] || [];
        parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        minutes = +(parts[1] * 60) + toInt(parts[2]);

        return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff =
                (isMoment(input) || isDate(input)
                    ? input.valueOf()
                    : createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            hooks.updateOffset(res, false);
            return res;
        } else {
            return createLocal(input).local();
        }
    }

    function getDateOffset(m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset());
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset(input, keepLocalTime, keepMinutes) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
                if (input === null) {
                    return this;
                }
            } else if (Math.abs(input) < 16 && !keepMinutes) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    addSubtract(
                        this,
                        createDuration(input - offset, 'm'),
                        1,
                        false
                    );
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone(input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC(keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal(keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset() {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);
            if (tZone != null) {
                this.utcOffset(tZone);
            } else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }

    function hasAlignedHourOffset(input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime() {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted() {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {},
            other;

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
            this._isDSTShifted =
                this.isValid() && compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal() {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset() {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc() {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        // and further modified to allow for strings containing both week and day
        isoRegex =
            /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

    function createDuration(input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months,
            };
        } else if (isNumber(input) || !isNaN(+input)) {
            duration = {};
            if (key) {
                duration[key] = +input;
            } else {
                duration.milliseconds = +input;
            }
        } else if ((match = aspNetRegex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign, // the millisecond decimal point is included in the match
            };
        } else if ((match = isoRegex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: parseIso(match[2], sign),
                M: parseIso(match[3], sign),
                w: parseIso(match[4], sign),
                d: parseIso(match[5], sign),
                h: parseIso(match[6], sign),
                m: parseIso(match[7], sign),
                s: parseIso(match[8], sign),
            };
        } else if (duration == null) {
            // checks for null or undefined
            duration = {};
        } else if (
            typeof duration === 'object' &&
            ('from' in duration || 'to' in duration)
        ) {
            diffRes = momentsDifference(
                createLocal(duration.from),
                createLocal(duration.to)
            );

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        if (isDuration(input) && hasOwnProp(input, '_isValid')) {
            ret._isValid = input._isValid;
        }

        return ret;
    }

    createDuration.fn = Duration.prototype;
    createDuration.invalid = createInvalid$1;

    function parseIso(inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {};

        res.months =
            other.month() - base.month() + (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +base.clone().add(res.months, 'M');

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return { milliseconds: 0, months: 0 };
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(
                    name,
                    'moment().' +
                        name +
                        '(period, number) is deprecated. Please use moment().' +
                        name +
                        '(number, period). ' +
                        'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.'
                );
                tmp = val;
                val = period;
                period = tmp;
            }

            dur = createDuration(val, period);
            addSubtract(this, dur, direction);
            return this;
        };
    }

    function addSubtract(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (months) {
            setMonth(mom, get(mom, 'Month') + months * isAdding);
        }
        if (days) {
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
        }
        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (updateOffset) {
            hooks.updateOffset(mom, days || months);
        }
    }

    var add = createAdder(1, 'add'),
        subtract = createAdder(-1, 'subtract');

    function isString(input) {
        return typeof input === 'string' || input instanceof String;
    }

    // type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined
    function isMomentInput(input) {
        return (
            isMoment(input) ||
            isDate(input) ||
            isString(input) ||
            isNumber(input) ||
            isNumberOrStringArray(input) ||
            isMomentInputObject(input) ||
            input === null ||
            input === undefined
        );
    }

    function isMomentInputObject(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input),
            propertyTest = false,
            properties = [
                'years',
                'year',
                'y',
                'months',
                'month',
                'M',
                'days',
                'day',
                'd',
                'dates',
                'date',
                'D',
                'hours',
                'hour',
                'h',
                'minutes',
                'minute',
                'm',
                'seconds',
                'second',
                's',
                'milliseconds',
                'millisecond',
                'ms',
            ],
            i,
            property,
            propertyLen = properties.length;

        for (i = 0; i < propertyLen; i += 1) {
            property = properties[i];
            propertyTest = propertyTest || hasOwnProp(input, property);
        }

        return objectTest && propertyTest;
    }

    function isNumberOrStringArray(input) {
        var arrayTest = isArray(input),
            dataTypeTest = false;
        if (arrayTest) {
            dataTypeTest =
                input.filter(function (item) {
                    return !isNumber(item) && isString(input);
                }).length === 0;
        }
        return arrayTest && dataTypeTest;
    }

    function isCalendarSpec(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input),
            propertyTest = false,
            properties = [
                'sameDay',
                'nextDay',
                'lastDay',
                'nextWeek',
                'lastWeek',
                'sameElse',
            ],
            i,
            property;

        for (i = 0; i < properties.length; i += 1) {
            property = properties[i];
            propertyTest = propertyTest || hasOwnProp(input, property);
        }

        return objectTest && propertyTest;
    }

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6
            ? 'sameElse'
            : diff < -1
            ? 'lastWeek'
            : diff < 0
            ? 'lastDay'
            : diff < 1
            ? 'sameDay'
            : diff < 2
            ? 'nextDay'
            : diff < 7
            ? 'nextWeek'
            : 'sameElse';
    }

    function calendar$1(time, formats) {
        // Support for single parameter, formats only overload to the calendar function
        if (arguments.length === 1) {
            if (!arguments[0]) {
                time = undefined;
                formats = undefined;
            } else if (isMomentInput(arguments[0])) {
                time = arguments[0];
                formats = undefined;
            } else if (isCalendarSpec(arguments[0])) {
                formats = arguments[0];
                time = undefined;
            }
        }
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = hooks.calendarFormat(this, sod) || 'sameElse',
            output =
                formats &&
                (isFunction(formats[format])
                    ? formats[format].call(this, now)
                    : formats[format]);

        return this.format(
            output || this.localeData().calendar(format, this, createLocal(now))
        );
    }

    function clone() {
        return new Moment(this);
    }

    function isAfter(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween(from, to, units, inclusivity) {
        var localFrom = isMoment(from) ? from : createLocal(from),
            localTo = isMoment(to) ? to : createLocal(to);
        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
            return false;
        }
        inclusivity = inclusivity || '()';
        return (
            (inclusivity[0] === '('
                ? this.isAfter(localFrom, units)
                : !this.isBefore(localFrom, units)) &&
            (inclusivity[1] === ')'
                ? this.isBefore(localTo, units)
                : !this.isAfter(localTo, units))
        );
    }

    function isSame(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return (
                this.clone().startOf(units).valueOf() <= inputMs &&
                inputMs <= this.clone().endOf(units).valueOf()
            );
        }
    }

    function isSameOrAfter(input, units) {
        return this.isSame(input, units) || this.isAfter(input, units);
    }

    function isSameOrBefore(input, units) {
        return this.isSame(input, units) || this.isBefore(input, units);
    }

    function diff(input, units, asFloat) {
        var that, zoneDelta, output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        switch (units) {
            case 'year':
                output = monthDiff(this, that) / 12;
                break;
            case 'month':
                output = monthDiff(this, that);
                break;
            case 'quarter':
                output = monthDiff(this, that) / 3;
                break;
            case 'second':
                output = (this - that) / 1e3;
                break; // 1000
            case 'minute':
                output = (this - that) / 6e4;
                break; // 1000 * 60
            case 'hour':
                output = (this - that) / 36e5;
                break; // 1000 * 60 * 60
            case 'day':
                output = (this - that - zoneDelta) / 864e5;
                break; // 1000 * 60 * 60 * 24, negate dst
            case 'week':
                output = (this - that - zoneDelta) / 6048e5;
                break; // 1000 * 60 * 60 * 24 * 7, negate dst
            default:
                output = this - that;
        }

        return asFloat ? output : absFloor(output);
    }

    function monthDiff(a, b) {
        if (a.date() < b.date()) {
            // end-of-month calculations work correct when the start month has more
            // days than the end month.
            return -monthDiff(b, a);
        }
        // difference in months
        var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2,
            adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString() {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function toISOString(keepOffset) {
        if (!this.isValid()) {
            return null;
        }
        var utc = keepOffset !== true,
            m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) {
            return formatMoment(
                m,
                utc
                    ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]'
                    : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ'
            );
        }
        if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            if (utc) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000)
                    .toISOString()
                    .replace('Z', formatMoment(m, 'Z'));
            }
        }
        return formatMoment(
            m,
            utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ'
        );
    }

    /**
     * Return a human readable representation of a moment that can
     * also be evaluated to get a new moment which is the same
     *
     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
     */
    function inspect() {
        if (!this.isValid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
        }
        var func = 'moment',
            zone = '',
            prefix,
            year,
            datetime,
            suffix;
        if (!this.isLocal()) {
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
            zone = 'Z';
        }
        prefix = '[' + func + '("]';
        year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';
        datetime = '-MM-DD[T]HH:mm:ss.SSS';
        suffix = zone + '[")]';

        return this.format(prefix + year + datetime + suffix);
    }

    function format(inputString) {
        if (!inputString) {
            inputString = this.isUtc()
                ? hooks.defaultFormatUtc
                : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from(time, withoutSuffix) {
        if (
            this.isValid() &&
            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
        ) {
            return createDuration({ to: this, from: time })
                .locale(this.locale())
                .humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow(withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
    }

    function to(time, withoutSuffix) {
        if (
            this.isValid() &&
            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
        ) {
            return createDuration({ from: this, to: time })
                .locale(this.locale())
                .humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow(withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale(key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData() {
        return this._locale;
    }

    var MS_PER_SECOND = 1000,
        MS_PER_MINUTE = 60 * MS_PER_SECOND,
        MS_PER_HOUR = 60 * MS_PER_MINUTE,
        MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

    // actual modulo - handles negative numbers (for dates before 1970):
    function mod$1(dividend, divisor) {
        return ((dividend % divisor) + divisor) % divisor;
    }

    function localStartOfDate(y, m, d) {
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return new Date(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return new Date(y, m, d).valueOf();
        }
    }

    function utcStartOfDate(y, m, d) {
        // Date.UTC remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return Date.UTC(y, m, d);
        }
    }

    function startOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year(), 0, 1);
                break;
            case 'quarter':
                time = startOfDate(
                    this.year(),
                    this.month() - (this.month() % 3),
                    1
                );
                break;
            case 'month':
                time = startOfDate(this.year(), this.month(), 1);
                break;
            case 'week':
                time = startOfDate(
                    this.year(),
                    this.month(),
                    this.date() - this.weekday()
                );
                break;
            case 'isoWeek':
                time = startOfDate(
                    this.year(),
                    this.month(),
                    this.date() - (this.isoWeekday() - 1)
                );
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date());
                break;
            case 'hour':
                time = this._d.valueOf();
                time -= mod$1(
                    time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
                    MS_PER_HOUR
                );
                break;
            case 'minute':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_MINUTE);
                break;
            case 'second':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_SECOND);
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function endOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year() + 1, 0, 1) - 1;
                break;
            case 'quarter':
                time =
                    startOfDate(
                        this.year(),
                        this.month() - (this.month() % 3) + 3,
                        1
                    ) - 1;
                break;
            case 'month':
                time = startOfDate(this.year(), this.month() + 1, 1) - 1;
                break;
            case 'week':
                time =
                    startOfDate(
                        this.year(),
                        this.month(),
                        this.date() - this.weekday() + 7
                    ) - 1;
                break;
            case 'isoWeek':
                time =
                    startOfDate(
                        this.year(),
                        this.month(),
                        this.date() - (this.isoWeekday() - 1) + 7
                    ) - 1;
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
                break;
            case 'hour':
                time = this._d.valueOf();
                time +=
                    MS_PER_HOUR -
                    mod$1(
                        time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
                        MS_PER_HOUR
                    ) -
                    1;
                break;
            case 'minute':
                time = this._d.valueOf();
                time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
                break;
            case 'second':
                time = this._d.valueOf();
                time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function valueOf() {
        return this._d.valueOf() - (this._offset || 0) * 60000;
    }

    function unix() {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate() {
        return new Date(this.valueOf());
    }

    function toArray() {
        var m = this;
        return [
            m.year(),
            m.month(),
            m.date(),
            m.hour(),
            m.minute(),
            m.second(),
            m.millisecond(),
        ];
    }

    function toObject() {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds(),
        };
    }

    function toJSON() {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function isValid$2() {
        return isValid(this);
    }

    function parsingFlags() {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt() {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict,
        };
    }

    addFormatToken('N', 0, 0, 'eraAbbr');
    addFormatToken('NN', 0, 0, 'eraAbbr');
    addFormatToken('NNN', 0, 0, 'eraAbbr');
    addFormatToken('NNNN', 0, 0, 'eraName');
    addFormatToken('NNNNN', 0, 0, 'eraNarrow');

    addFormatToken('y', ['y', 1], 'yo', 'eraYear');
    addFormatToken('y', ['yy', 2], 0, 'eraYear');
    addFormatToken('y', ['yyy', 3], 0, 'eraYear');
    addFormatToken('y', ['yyyy', 4], 0, 'eraYear');

    addRegexToken('N', matchEraAbbr);
    addRegexToken('NN', matchEraAbbr);
    addRegexToken('NNN', matchEraAbbr);
    addRegexToken('NNNN', matchEraName);
    addRegexToken('NNNNN', matchEraNarrow);

    addParseToken(
        ['N', 'NN', 'NNN', 'NNNN', 'NNNNN'],
        function (input, array, config, token) {
            var era = config._locale.erasParse(input, token, config._strict);
            if (era) {
                getParsingFlags(config).era = era;
            } else {
                getParsingFlags(config).invalidEra = input;
            }
        }
    );

    addRegexToken('y', matchUnsigned);
    addRegexToken('yy', matchUnsigned);
    addRegexToken('yyy', matchUnsigned);
    addRegexToken('yyyy', matchUnsigned);
    addRegexToken('yo', matchEraYearOrdinal);

    addParseToken(['y', 'yy', 'yyy', 'yyyy'], YEAR);
    addParseToken(['yo'], function (input, array, config, token) {
        var match;
        if (config._locale._eraYearOrdinalRegex) {
            match = input.match(config._locale._eraYearOrdinalRegex);
        }

        if (config._locale.eraYearOrdinalParse) {
            array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
        } else {
            array[YEAR] = parseInt(input, 10);
        }
    });

    function localeEras(m, format) {
        var i,
            l,
            date,
            eras = this._eras || getLocale('en')._eras;
        for (i = 0, l = eras.length; i < l; ++i) {
            switch (typeof eras[i].since) {
                case 'string':
                    // truncate time
                    date = hooks(eras[i].since).startOf('day');
                    eras[i].since = date.valueOf();
                    break;
            }

            switch (typeof eras[i].until) {
                case 'undefined':
                    eras[i].until = +Infinity;
                    break;
                case 'string':
                    // truncate time
                    date = hooks(eras[i].until).startOf('day').valueOf();
                    eras[i].until = date.valueOf();
                    break;
            }
        }
        return eras;
    }

    function localeErasParse(eraName, format, strict) {
        var i,
            l,
            eras = this.eras(),
            name,
            abbr,
            narrow;
        eraName = eraName.toUpperCase();

        for (i = 0, l = eras.length; i < l; ++i) {
            name = eras[i].name.toUpperCase();
            abbr = eras[i].abbr.toUpperCase();
            narrow = eras[i].narrow.toUpperCase();

            if (strict) {
                switch (format) {
                    case 'N':
                    case 'NN':
                    case 'NNN':
                        if (abbr === eraName) {
                            return eras[i];
                        }
                        break;

                    case 'NNNN':
                        if (name === eraName) {
                            return eras[i];
                        }
                        break;

                    case 'NNNNN':
                        if (narrow === eraName) {
                            return eras[i];
                        }
                        break;
                }
            } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
                return eras[i];
            }
        }
    }

    function localeErasConvertYear(era, year) {
        var dir = era.since <= era.until ? +1 : -1;
        if (year === undefined) {
            return hooks(era.since).year();
        } else {
            return hooks(era.since).year() + (year - era.offset) * dir;
        }
    }

    function getEraName() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].name;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].name;
            }
        }

        return '';
    }

    function getEraNarrow() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].narrow;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].narrow;
            }
        }

        return '';
    }

    function getEraAbbr() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].abbr;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].abbr;
            }
        }

        return '';
    }

    function getEraYear() {
        var i,
            l,
            dir,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            dir = eras[i].since <= eras[i].until ? +1 : -1;

            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (
                (eras[i].since <= val && val <= eras[i].until) ||
                (eras[i].until <= val && val <= eras[i].since)
            ) {
                return (
                    (this.year() - hooks(eras[i].since).year()) * dir +
                    eras[i].offset
                );
            }
        }

        return this.year();
    }

    function erasNameRegex(isStrict) {
        if (!hasOwnProp(this, '_erasNameRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasNameRegex : this._erasRegex;
    }

    function erasAbbrRegex(isStrict) {
        if (!hasOwnProp(this, '_erasAbbrRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasAbbrRegex : this._erasRegex;
    }

    function erasNarrowRegex(isStrict) {
        if (!hasOwnProp(this, '_erasNarrowRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasNarrowRegex : this._erasRegex;
    }

    function matchEraAbbr(isStrict, locale) {
        return locale.erasAbbrRegex(isStrict);
    }

    function matchEraName(isStrict, locale) {
        return locale.erasNameRegex(isStrict);
    }

    function matchEraNarrow(isStrict, locale) {
        return locale.erasNarrowRegex(isStrict);
    }

    function matchEraYearOrdinal(isStrict, locale) {
        return locale._eraYearOrdinalRegex || matchUnsigned;
    }

    function computeErasParse() {
        var abbrPieces = [],
            namePieces = [],
            narrowPieces = [],
            mixedPieces = [],
            i,
            l,
            eras = this.eras();

        for (i = 0, l = eras.length; i < l; ++i) {
            namePieces.push(regexEscape(eras[i].name));
            abbrPieces.push(regexEscape(eras[i].abbr));
            narrowPieces.push(regexEscape(eras[i].narrow));

            mixedPieces.push(regexEscape(eras[i].name));
            mixedPieces.push(regexEscape(eras[i].abbr));
            mixedPieces.push(regexEscape(eras[i].narrow));
        }

        this._erasRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._erasNameRegex = new RegExp('^(' + namePieces.join('|') + ')', 'i');
        this._erasAbbrRegex = new RegExp('^(' + abbrPieces.join('|') + ')', 'i');
        this._erasNarrowRegex = new RegExp(
            '^(' + narrowPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken(token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg', 'weekYear');
    addWeekYearFormatToken('ggggg', 'weekYear');
    addWeekYearFormatToken('GGGG', 'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);

    // PARSING

    addRegexToken('G', matchSigned);
    addRegexToken('g', matchSigned);
    addRegexToken('GG', match1to2, match2);
    addRegexToken('gg', match1to2, match2);
    addRegexToken('GGGG', match1to4, match4);
    addRegexToken('gggg', match1to4, match4);
    addRegexToken('GGGGG', match1to6, match6);
    addRegexToken('ggggg', match1to6, match6);

    addWeekParseToken(
        ['gggg', 'ggggg', 'GGGG', 'GGGGG'],
        function (input, week, config, token) {
            week[token.substr(0, 2)] = toInt(input);
        }
    );

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear(input) {
        return getSetWeekYearHelper.call(
            this,
            input,
            this.week(),
            this.weekday(),
            this.localeData()._week.dow,
            this.localeData()._week.doy
        );
    }

    function getSetISOWeekYear(input) {
        return getSetWeekYearHelper.call(
            this,
            input,
            this.isoWeek(),
            this.isoWeekday(),
            1,
            4
        );
    }

    function getISOWeeksInYear() {
        return weeksInYear(this.year(), 1, 4);
    }

    function getISOWeeksInISOWeekYear() {
        return weeksInYear(this.isoWeekYear(), 1, 4);
    }

    function getWeeksInYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getWeeksInWeekYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PRIORITY

    addUnitPriority('quarter', 7);

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter(input) {
        return input == null
            ? Math.ceil((this.month() + 1) / 3)
            : this.month((input - 1) * 3 + (this.month() % 3));
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PRIORITY
    addUnitPriority('date', 9);

    // PARSING

    addRegexToken('D', match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        // TODO: Remove "ordinalParse" fallback in next major release.
        return isStrict
            ? locale._dayOfMonthOrdinalParse || locale._ordinalParse
            : locale._dayOfMonthOrdinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0]);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PRIORITY
    addUnitPriority('dayOfYear', 4);

    // PARSING

    addRegexToken('DDD', match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear(input) {
        var dayOfYear =
            Math.round(
                (this.clone().startOf('day') - this.clone().startOf('year')) / 864e5
            ) + 1;
        return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PRIORITY

    addUnitPriority('minute', 14);

    // PARSING

    addRegexToken('m', match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PRIORITY

    addUnitPriority('second', 15);

    // PARSING

    addRegexToken('s', match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });

    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PRIORITY

    addUnitPriority('millisecond', 16);

    // PARSING

    addRegexToken('S', match1to3, match1);
    addRegexToken('SS', match1to3, match2);
    addRegexToken('SSS', match1to3, match3);

    var token, getSetMillisecond;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }

    getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z', 0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr() {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName() {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var proto = Moment.prototype;

    proto.add = add;
    proto.calendar = calendar$1;
    proto.clone = clone;
    proto.diff = diff;
    proto.endOf = endOf;
    proto.format = format;
    proto.from = from;
    proto.fromNow = fromNow;
    proto.to = to;
    proto.toNow = toNow;
    proto.get = stringGet;
    proto.invalidAt = invalidAt;
    proto.isAfter = isAfter;
    proto.isBefore = isBefore;
    proto.isBetween = isBetween;
    proto.isSame = isSame;
    proto.isSameOrAfter = isSameOrAfter;
    proto.isSameOrBefore = isSameOrBefore;
    proto.isValid = isValid$2;
    proto.lang = lang;
    proto.locale = locale;
    proto.localeData = localeData;
    proto.max = prototypeMax;
    proto.min = prototypeMin;
    proto.parsingFlags = parsingFlags;
    proto.set = stringSet;
    proto.startOf = startOf;
    proto.subtract = subtract;
    proto.toArray = toArray;
    proto.toObject = toObject;
    proto.toDate = toDate;
    proto.toISOString = toISOString;
    proto.inspect = inspect;
    if (typeof Symbol !== 'undefined' && Symbol.for != null) {
        proto[Symbol.for('nodejs.util.inspect.custom')] = function () {
            return 'Moment<' + this.format() + '>';
        };
    }
    proto.toJSON = toJSON;
    proto.toString = toString;
    proto.unix = unix;
    proto.valueOf = valueOf;
    proto.creationData = creationData;
    proto.eraName = getEraName;
    proto.eraNarrow = getEraNarrow;
    proto.eraAbbr = getEraAbbr;
    proto.eraYear = getEraYear;
    proto.year = getSetYear;
    proto.isLeapYear = getIsLeapYear;
    proto.weekYear = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;
    proto.quarter = proto.quarters = getSetQuarter;
    proto.month = getSetMonth;
    proto.daysInMonth = getDaysInMonth;
    proto.week = proto.weeks = getSetWeek;
    proto.isoWeek = proto.isoWeeks = getSetISOWeek;
    proto.weeksInYear = getWeeksInYear;
    proto.weeksInWeekYear = getWeeksInWeekYear;
    proto.isoWeeksInYear = getISOWeeksInYear;
    proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
    proto.date = getSetDayOfMonth;
    proto.day = proto.days = getSetDayOfWeek;
    proto.weekday = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear = getSetDayOfYear;
    proto.hour = proto.hours = getSetHour;
    proto.minute = proto.minutes = getSetMinute;
    proto.second = proto.seconds = getSetSecond;
    proto.millisecond = proto.milliseconds = getSetMillisecond;
    proto.utcOffset = getSetOffset;
    proto.utc = setOffsetToUTC;
    proto.local = setOffsetToLocal;
    proto.parseZone = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST = isDaylightSavingTime;
    proto.isLocal = isLocal;
    proto.isUtcOffset = isUtcOffset;
    proto.isUtc = isUtc;
    proto.isUTC = isUtc;
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;
    proto.dates = deprecate(
        'dates accessor is deprecated. Use date instead.',
        getSetDayOfMonth
    );
    proto.months = deprecate(
        'months accessor is deprecated. Use month instead',
        getSetMonth
    );
    proto.years = deprecate(
        'years accessor is deprecated. Use year instead',
        getSetYear
    );
    proto.zone = deprecate(
        'moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/',
        getSetZone
    );
    proto.isDSTShifted = deprecate(
        'isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information',
        isDaylightSavingTimeShifted
    );

    function createUnix(input) {
        return createLocal(input * 1000);
    }

    function createInZone() {
        return createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat(string) {
        return string;
    }

    var proto$1 = Locale.prototype;

    proto$1.calendar = calendar;
    proto$1.longDateFormat = longDateFormat;
    proto$1.invalidDate = invalidDate;
    proto$1.ordinal = ordinal;
    proto$1.preparse = preParsePostFormat;
    proto$1.postformat = preParsePostFormat;
    proto$1.relativeTime = relativeTime;
    proto$1.pastFuture = pastFuture;
    proto$1.set = set;
    proto$1.eras = localeEras;
    proto$1.erasParse = localeErasParse;
    proto$1.erasConvertYear = localeErasConvertYear;
    proto$1.erasAbbrRegex = erasAbbrRegex;
    proto$1.erasNameRegex = erasNameRegex;
    proto$1.erasNarrowRegex = erasNarrowRegex;

    proto$1.months = localeMonths;
    proto$1.monthsShort = localeMonthsShort;
    proto$1.monthsParse = localeMonthsParse;
    proto$1.monthsRegex = monthsRegex;
    proto$1.monthsShortRegex = monthsShortRegex;
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

    proto$1.weekdays = localeWeekdays;
    proto$1.weekdaysMin = localeWeekdaysMin;
    proto$1.weekdaysShort = localeWeekdaysShort;
    proto$1.weekdaysParse = localeWeekdaysParse;

    proto$1.weekdaysRegex = weekdaysRegex;
    proto$1.weekdaysShortRegex = weekdaysShortRegex;
    proto$1.weekdaysMinRegex = weekdaysMinRegex;

    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;

    function get$1(format, index, field, setter) {
        var locale = getLocale(),
            utc = createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl(format, index, field) {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return get$1(format, index, field, 'month');
        }

        var i,
            out = [];
        for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl(localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = getLocale(),
            shift = localeSorted ? locale._week.dow : 0,
            i,
            out = [];

        if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
        }

        for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function listMonths(format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function listMonthsShort(format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function listWeekdays(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function listWeekdaysShort(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function listWeekdaysMin(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    getSetGlobalLocale('en', {
        eras: [
            {
                since: '0001-01-01',
                until: +Infinity,
                offset: 1,
                name: 'Anno Domini',
                narrow: 'AD',
                abbr: 'AD',
            },
            {
                since: '0000-12-31',
                until: -Infinity,
                offset: 1,
                name: 'Before Christ',
                narrow: 'BC',
                abbr: 'BC',
            },
        ],
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function (number) {
            var b = number % 10,
                output =
                    toInt((number % 100) / 10) === 1
                        ? 'th'
                        : b === 1
                        ? 'st'
                        : b === 2
                        ? 'nd'
                        : b === 3
                        ? 'rd'
                        : 'th';
            return number + output;
        },
    });

    // Side effect imports

    hooks.lang = deprecate(
        'moment.lang is deprecated. Use moment.locale instead.',
        getSetGlobalLocale
    );
    hooks.langData = deprecate(
        'moment.langData is deprecated. Use moment.localeData instead.',
        getLocale
    );

    var mathAbs = Math.abs;

    function abs() {
        var data = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days = mathAbs(this._days);
        this._months = mathAbs(this._months);

        data.milliseconds = mathAbs(data.milliseconds);
        data.seconds = mathAbs(data.seconds);
        data.minutes = mathAbs(data.minutes);
        data.hours = mathAbs(data.hours);
        data.months = mathAbs(data.months);
        data.years = mathAbs(data.years);

        return this;
    }

    function addSubtract$1(duration, input, value, direction) {
        var other = createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days += direction * other._days;
        duration._months += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function add$1(input, value) {
        return addSubtract$1(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function subtract$1(input, value) {
        return addSubtract$1(this, input, value, -1);
    }

    function absCeil(number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble() {
        var milliseconds = this._milliseconds,
            days = this._days,
            months = this._months,
            data = this._data,
            seconds,
            minutes,
            hours,
            years,
            monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (
            !(
                (milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0)
            )
        ) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds = absFloor(milliseconds / 1000);
        data.seconds = seconds % 60;

        minutes = absFloor(seconds / 60);
        data.minutes = minutes % 60;

        hours = absFloor(minutes / 60);
        data.hours = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days = days;
        data.months = months;
        data.years = years;

        return this;
    }

    function daysToMonths(days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return (days * 4800) / 146097;
    }

    function monthsToDays(months) {
        // the reverse of daysToMonths
        return (months * 146097) / 4800;
    }

    function as(units) {
        if (!this.isValid()) {
            return NaN;
        }
        var days,
            months,
            milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'quarter' || units === 'year') {
            days = this._days + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            switch (units) {
                case 'month':
                    return months;
                case 'quarter':
                    return months / 3;
                case 'year':
                    return months / 12;
            }
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week':
                    return days / 7 + milliseconds / 6048e5;
                case 'day':
                    return days + milliseconds / 864e5;
                case 'hour':
                    return days * 24 + milliseconds / 36e5;
                case 'minute':
                    return days * 1440 + milliseconds / 6e4;
                case 'second':
                    return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond':
                    return Math.floor(days * 864e5) + milliseconds;
                default:
                    throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function valueOf$1() {
        if (!this.isValid()) {
            return NaN;
        }
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs(alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms'),
        asSeconds = makeAs('s'),
        asMinutes = makeAs('m'),
        asHours = makeAs('h'),
        asDays = makeAs('d'),
        asWeeks = makeAs('w'),
        asMonths = makeAs('M'),
        asQuarters = makeAs('Q'),
        asYears = makeAs('y');

    function clone$1() {
        return createDuration(this);
    }

    function get$2(units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + 's']() : NaN;
    }

    function makeGetter(name) {
        return function () {
            return this.isValid() ? this._data[name] : NaN;
        };
    }

    var milliseconds = makeGetter('milliseconds'),
        seconds = makeGetter('seconds'),
        minutes = makeGetter('minutes'),
        hours = makeGetter('hours'),
        days = makeGetter('days'),
        months = makeGetter('months'),
        years = makeGetter('years');

    function weeks() {
        return absFloor(this.days() / 7);
    }

    var round = Math.round,
        thresholds = {
            ss: 44, // a few seconds to seconds
            s: 45, // seconds to minute
            m: 45, // minutes to hour
            h: 22, // hours to day
            d: 26, // days to month/week
            w: null, // weeks to month
            M: 11, // months to year
        };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime$1(posNegDuration, withoutSuffix, thresholds, locale) {
        var duration = createDuration(posNegDuration).abs(),
            seconds = round(duration.as('s')),
            minutes = round(duration.as('m')),
            hours = round(duration.as('h')),
            days = round(duration.as('d')),
            months = round(duration.as('M')),
            weeks = round(duration.as('w')),
            years = round(duration.as('y')),
            a =
                (seconds <= thresholds.ss && ['s', seconds]) ||
                (seconds < thresholds.s && ['ss', seconds]) ||
                (minutes <= 1 && ['m']) ||
                (minutes < thresholds.m && ['mm', minutes]) ||
                (hours <= 1 && ['h']) ||
                (hours < thresholds.h && ['hh', hours]) ||
                (days <= 1 && ['d']) ||
                (days < thresholds.d && ['dd', days]);

        if (thresholds.w != null) {
            a =
                a ||
                (weeks <= 1 && ['w']) ||
                (weeks < thresholds.w && ['ww', weeks]);
        }
        a = a ||
            (months <= 1 && ['M']) ||
            (months < thresholds.M && ['MM', months]) ||
            (years <= 1 && ['y']) || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time strings
    function getSetRelativeTimeRounding(roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof roundingFunction === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function getSetRelativeTimeThreshold(threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === 's') {
            thresholds.ss = limit - 1;
        }
        return true;
    }

    function humanize(argWithSuffix, argThresholds) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var withSuffix = false,
            th = thresholds,
            locale,
            output;

        if (typeof argWithSuffix === 'object') {
            argThresholds = argWithSuffix;
            argWithSuffix = false;
        }
        if (typeof argWithSuffix === 'boolean') {
            withSuffix = argWithSuffix;
        }
        if (typeof argThresholds === 'object') {
            th = Object.assign({}, thresholds, argThresholds);
            if (argThresholds.s != null && argThresholds.ss == null) {
                th.ss = argThresholds.s - 1;
            }
        }

        locale = this.localeData();
        output = relativeTime$1(this, !withSuffix, th, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var abs$1 = Math.abs;

    function sign(x) {
        return (x > 0) - (x < 0) || +x;
    }

    function toISOString$1() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var seconds = abs$1(this._milliseconds) / 1000,
            days = abs$1(this._days),
            months = abs$1(this._months),
            minutes,
            hours,
            years,
            s,
            total = this.asSeconds(),
            totalSign,
            ymSign,
            daysSign,
            hmsSign;

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes = absFloor(seconds / 60);
        hours = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';

        totalSign = total < 0 ? '-' : '';
        ymSign = sign(this._months) !== sign(total) ? '-' : '';
        daysSign = sign(this._days) !== sign(total) ? '-' : '';
        hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

        return (
            totalSign +
            'P' +
            (years ? ymSign + years + 'Y' : '') +
            (months ? ymSign + months + 'M' : '') +
            (days ? daysSign + days + 'D' : '') +
            (hours || minutes || seconds ? 'T' : '') +
            (hours ? hmsSign + hours + 'H' : '') +
            (minutes ? hmsSign + minutes + 'M' : '') +
            (seconds ? hmsSign + s + 'S' : '')
        );
    }

    var proto$2 = Duration.prototype;

    proto$2.isValid = isValid$1;
    proto$2.abs = abs;
    proto$2.add = add$1;
    proto$2.subtract = subtract$1;
    proto$2.as = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds = asSeconds;
    proto$2.asMinutes = asMinutes;
    proto$2.asHours = asHours;
    proto$2.asDays = asDays;
    proto$2.asWeeks = asWeeks;
    proto$2.asMonths = asMonths;
    proto$2.asQuarters = asQuarters;
    proto$2.asYears = asYears;
    proto$2.valueOf = valueOf$1;
    proto$2._bubble = bubble;
    proto$2.clone = clone$1;
    proto$2.get = get$2;
    proto$2.milliseconds = milliseconds;
    proto$2.seconds = seconds;
    proto$2.minutes = minutes;
    proto$2.hours = hours;
    proto$2.days = days;
    proto$2.weeks = weeks;
    proto$2.months = months;
    proto$2.years = years;
    proto$2.humanize = humanize;
    proto$2.toISOString = toISOString$1;
    proto$2.toString = toISOString$1;
    proto$2.toJSON = toISOString$1;
    proto$2.locale = locale;
    proto$2.localeData = localeData;

    proto$2.toIsoString = deprecate(
        'toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)',
        toISOString$1
    );
    proto$2.lang = lang;

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    //! moment.js

    hooks.version = '2.29.4';

    setHookCallback(createLocal);

    hooks.fn = proto;
    hooks.min = min;
    hooks.max = max;
    hooks.now = now;
    hooks.utc = createUTC;
    hooks.unix = createUnix;
    hooks.months = listMonths;
    hooks.isDate = isDate;
    hooks.locale = getSetGlobalLocale;
    hooks.invalid = createInvalid;
    hooks.duration = createDuration;
    hooks.isMoment = isMoment;
    hooks.weekdays = listWeekdays;
    hooks.parseZone = createInZone;
    hooks.localeData = getLocale;
    hooks.isDuration = isDuration;
    hooks.monthsShort = listMonthsShort;
    hooks.weekdaysMin = listWeekdaysMin;
    hooks.defineLocale = defineLocale;
    hooks.updateLocale = updateLocale;
    hooks.locales = listLocales;
    hooks.weekdaysShort = listWeekdaysShort;
    hooks.normalizeUnits = normalizeUnits;
    hooks.relativeTimeRounding = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat = getCalendarFormat;
    hooks.prototype = proto;

    // currently HTML5 input type only supports 24-hour formats
    hooks.HTML5_FMT = {
        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm', // <input type="datetime-local" />
        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss', // <input type="datetime-local" step="1" />
        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS', // <input type="datetime-local" step="0.001" />
        DATE: 'YYYY-MM-DD', // <input type="date" />
        TIME: 'HH:mm', // <input type="time" />
        TIME_SECONDS: 'HH:mm:ss', // <input type="time" step="1" />
        TIME_MS: 'HH:mm:ss.SSS', // <input type="time" step="0.001" />
        WEEK: 'GGGG-[W]WW', // <input type="week" />
        MONTH: 'YYYY-MM', // <input type="month" />
    };

    return hooks;

})));

},{}],88:[function(require,module,exports){
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

},{}]},{},[1]);
