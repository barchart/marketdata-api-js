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

},{"./../../../lib/connection/Connection":2,"./../../../lib/marketState/Profile":20,"./../../../lib/meta":22,"./../../../lib/utilities/data/AssetClass":27,"./../../../lib/utilities/data/timezones":29,"./../../../lib/utilities/format/decimal":31,"./../../../lib/utilities/format/price":34,"./../../../lib/utilities/format/quote":35,"./../../../lib/utilities/format/specialized/cmdtyView":36}],2:[function(require,module,exports){
const array = require('@barchart/common-js/lang/array'),
  assert = require('@barchart/common-js/lang/assert'),
  object = require('@barchart/common-js/lang/object');
const ConnectionBase = require('./ConnectionBase'),
  parseMessage = require('./../utilities/parse/ddf/message');
const retrieveExchanges = require('./snapshots/exchanges/retrieveExchanges'),
  retrieveProfileExtensions = require('./snapshots/profiles/retrieveExtensions'),
  retrieveQuoteSnapshots = require('./snapshots/quotes/retrieveSnapshots'),
  retrieveQuoteExtensions = require('./snapshots/quotes/retrieveExtensions'),
  SymbolParser = require('./../utilities/parsers/SymbolParser');
const DiagnosticsControllerBase = require('./diagnostics/DiagnosticsControllerBase');
const LoggerFactory = require('./../logging/LoggerFactory');
const version = require('./../meta').version;
module.exports = (() => {
  'use strict';

  const _API_VERSION = 4;
  const mode = {
    credentials: 'credentials',
    token: 'token'
  };
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
  const regex = {};
  regex.hostname = /^(?:(wss|ws):\/\/)?(.+?)(?::(\d+))?$/i;
  function ConnectionInternal(marketState, instance) {
    const __logger = LoggerFactory.getLogger('@barchart/marketdata-api-js');
    const __instance = instance;
    const __marketState = marketState;
    let __connectionFactory = null;
    let __xmlParserFactory = null;
    let __xmlParser = null;
    let __connection = null;
    let __connectionState = state.disconnected;
    let __connectionCount = 0;
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
      mode: null,
      hostname: null,
      username: null,
      password: null,
      jwtProvider: null,
      jwtPromise: null
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
     * @param {String=} username
     * @param {String=} password
     * @param {WebSocketAdapterFactory} webSocketAdapterFactory
     * @param {XmlParserFactory} xmlParserFactory
     * @param {Callbacks.JwtProvider} jwtProvider
     */
    function initializeConnection(hostname, username, password, webSocketAdapterFactory, xmlParserFactory, jwtProvider) {
      __connectionFactory = webSocketAdapterFactory;
      __xmlParserFactory = xmlParserFactory;
      __reconnectAllowed = true;
      connect(hostname, username, password, jwtProvider);
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
      __loginInfo.mode = null;
      __loginInfo.hostname = null;
      __loginInfo.username = null;
      __loginInfo.password = null;
      __loginInfo.jwtProvider = null;
      __loginInfo.jwtPromise = null;
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
     * Attempts to read a JWT from an external provider.
     *
     * @private
     * @param {Callbacks.JwtProvider} jwtProvider
     * @returns {Promise<string|null>}
     */
    function getJwt(jwtProvider) {
      const connectionCount = __connectionCount;
      return Promise.resolve().then(() => {
        __logger.log(`Connection [ ${__instance} ]: Requesting JWT for connection attempt [ ${connectionCount} ].`);
        return jwtProvider();
      }).then(jwt => {
        __logger.log(`Connection [ ${__instance} ]: Request for JWT was successful for connection attempt [ ${connectionCount} ].`);
        if (__connectionCount !== connectionCount) {
          return null;
        }
        if (typeof jwt !== 'string') {
          __logger.warn(`Connection [ ${__instance} ]: Unable to extract JWT.`);
          return null;
        }
        return jwt;
      }).catch(e => {
        __logger.warn(`Connection [ ${__instance} ]: Request for JWT failed for connection attempt [ ${connectionCount} ].`);
        return null;
      });
    }

    /**
     * Attempts to establish a connection to JERQ.
     *
     * @private
     * @param {String} hostname
     * @param {String=} username
     * @param {String=} password
     * @param {Callbacks.JwtProvider=} jwtProvider
     */
    function connect(hostname, username, password, jwtProvider) {
      assert.argumentIsRequired(hostname, 'hostname', String);
      assert.argumentIsOptional(username, 'username', String);
      assert.argumentIsOptional(password, 'password', String);
      assert.argumentIsOptional(jwtProvider, 'jwtProvider', Function);
      if (!username && !jwtProvider) {
        throw new Error('Unable to connect, the "username" argument is required.');
      }
      if (!password && !jwtProvider) {
        throw new Error('Unable to connect, the "password" argument is required.');
      }
      if (__connection !== null) {
        __logger.warn(`Connection [ ${__instance} ]: Unable to connect, a connection already exists.`);
        return;
      }
      ensureExchangeMetadata();
      __connectionCount = __connectionCount + 1;
      __logger.log(`Connection [ ${__instance} ]: Starting connection attempt [ ${__connectionCount} ] using [ ${jwtProvider ? 'JWT' : 'credentials-based'} ] authentication.`);
      let protocol;
      let host;
      let port;
      if (hostname === 'localhost') {
        protocol = 'ws';
        host = 'localhost';
        port = 8080;
      } else {
        const match = hostname.match(regex.hostname);
        if (match !== null && match[1]) {
          protocol = match[1];
        } else {
          protocol = 'wss';
        }
        if (match !== null && match[2]) {
          host = match[2];
        } else {
          host = hostname;
        }
        if (match !== null && match[3]) {
          port = parseInt(match[3]);
        } else {
          port = protocol === 'ws' ? 80 : 443;
        }
      }
      __loginInfo.hostname = hostname;
      __loginInfo.username = null;
      __loginInfo.password = null;
      __loginInfo.jwtProvider = null;
      __loginInfo.jwtPromise = null;
      if (jwtProvider) {
        __loginInfo.mode = mode.token;
        __loginInfo.jwtProvider = jwtProvider;
        __loginInfo.jwtPromise = getJwt(jwtProvider);
      } else {
        __loginInfo.mode = mode.credentials;
        __loginInfo.username = username;
        __loginInfo.password = password;
      }
      __xmlParser = __xmlParserFactory.build();
      __connectionState = state.disconnected;
      __logger.log(`Connection [ ${__instance} ]: Opening connection to [ ${protocol}://${host}:${port} ].`);
      __connection = __connectionFactory.build(`${protocol}://${host}:${port}/jerq`);
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

        const loginFailed = __inboundMessages.length > 0 && __inboundMessages.some(m => m.indexOf('-') === 0);
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
          const reconnectAction = () => connect(__loginInfo.hostname, __loginInfo.username, __loginInfo.password, __loginInfo.jwtProvider);
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
          let connectionCount = __connectionCount;
          if (__loginInfo.mode === mode.credentials) {
            __connection.send(`LOGIN ${__loginInfo.username}:${__loginInfo.password} VERSION=${_API_VERSION}\r\n`);
            return;
          }
          if (__loginInfo.mode === mode.token) {
            const jwtPromise = __loginInfo.jwtPromise || Promise.resolve(null);
            jwtPromise.then(jwt => {
              if (__connectionCount !== connectionCount) {
                return;
              }
              if (__connectionState !== state.authenticating) {
                return;
              }
              if (jwt === null) {
                broadcastEvent('events', {
                  event: 'jwt acquisition failed'
                });
                disconnect();
                return;
              }
              __connection.send(`TOKEN ${jwt} VERSION=${_API_VERSION}\r\n`);
            });
            return;
          }
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
        parsed = parseMessage(message, __xmlParser, __processOptions);
      } catch (e) {
        parsed = null;
        __logger.error(`An error occurred while parsing a market message [ ${message} ]. Continuing.`, e);
      }
      if (parsed !== null) {
        if (parsed.type) {
          processMarketMessage(parsed);
        } else {
          __logger.log('Message parser failed to assign the message type');
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
   * @param {Environment=} environment
   * @extends {ConnectionBase}
   */
  class Connection extends ConnectionBase {
    constructor(environment) {
      super(environment);
      this._internal = ConnectionInternal(this.getMarketState(), this._getInstance());
    }
    _connect(webSocketAdapterFactory, xmlParserFactory) {
      this._internal.connect(this.getHostname(), this.getUsername(), this.getPassword(), webSocketAdapterFactory, xmlParserFactory, this.getJwtProvider());
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

},{"./../logging/LoggerFactory":15,"./../meta":22,"./../utilities/parse/ddf/message":38,"./../utilities/parsers/SymbolParser":41,"./ConnectionBase":3,"./diagnostics/DiagnosticsControllerBase":7,"./snapshots/exchanges/retrieveExchanges":8,"./snapshots/profiles/retrieveExtensions":9,"./snapshots/quotes/retrieveExtensions":10,"./snapshots/quotes/retrieveSnapshots":11,"@barchart/common-js/lang/array":51,"@barchart/common-js/lang/assert":52,"@barchart/common-js/lang/object":54}],3:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');
const Environment = require('./../environment/Environment'),
  EnvironmentForBrowsers = require('./../environment/EnvironmentForBrowsers');
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
   * @param {Environment}
   */
  class ConnectionBase {
    constructor(environment) {
      this._hostname = null;
      this._username = null;
      this._password = null;
      this._jwtProvider = null;
      this._environment = environment || new EnvironmentForBrowsers();
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
     * @param {string=} username - Your username (contact solutions@barchart.com)
     * @param {string=} password - Your password (contact solutions@barchart.com)
     * @param {WebSocketAdapterFactory=} webSocketAdapterFactory - Strategy for creating a {@link WebSocketAdapterFactory} instances (overrides {@link Environment} settings).
     * @param {XmlParserFactory=} xmlParserFactory - Strategy for creating a {@link WebSocketAdapterFactory} instances (overrides {@link Environment} settings).
     * @param {Callbacks.JwtProvider=} jwtProvider - A function which returns a JWT (or a promise for a JWT) that is used as an alternative for actual credentials.
     */
    connect(hostname, username, password, webSocketAdapterFactory, xmlParserFactory, jwtProvider) {
      this._hostname = hostname;
      this._username = username || null;
      this._password = password || null;
      this._jwtProvider = jwtProvider || null;
      this._connect(webSocketAdapterFactory || this._environment.getWebSocketAdapterFactory(), xmlParserFactory || this._environment.getXmlParserFactory());
    }

    /**
     * @protected
     * @param {WebSocketAdapterFactory=} webSocketAdapterFactory
     * @param {XmlParserFactory=} xmlParserFactory
     * @ignore
     */
    _connect(webSocketAdapterFactory, xmlParserFactory) {
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
      this._jwtProvider = null;
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
     * The username used to authenticate to Barchart.
     *
     * @public
     * @returns {null|Callbacks.JwtProvider}
     */
    getJwtProvider() {
      return this._jwtProvider;
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

},{"./../environment/Environment":12,"./../environment/EnvironmentForBrowsers":13,"./../marketState/MarketState":19,"@barchart/common-js/lang/is":53}],4:[function(require,module,exports){
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
   * An implementation of {@link WebSocketAdapterFactory} for use with web browsers. Pass
   * an instance of this class to the {@link Connection.connect} function when operating in
   * a web browser.
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

},{"./../../logging/LoggerFactory":15,"./WebSocketAdapter":4,"./WebSocketAdapterFactory":5}],7:[function(require,module,exports){
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

},{"@barchart/common-js/lang/assert":52,"@barchart/common-js/lang/is":53}],8:[function(require,module,exports){
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

},{"./../../../logging/LoggerFactory":15,"./../../../utilities/parsers/SymbolParser":41,"@barchart/common-js/lang/Day":47,"@barchart/common-js/lang/array":51,"@barchart/common-js/lang/assert":52,"@barchart/common-js/lang/is":53,"axios":57}],10:[function(require,module,exports){
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

},{"./../../../utilities/parsers/SymbolParser":41,"@barchart/common-js/lang/Day":47,"@barchart/common-js/lang/array":51,"@barchart/common-js/lang/is":53,"axios":57}],11:[function(require,module,exports){
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

},{"./../../../logging/LoggerFactory":15,"./../../../utilities/convert/baseCodeToUnitCode":23,"./../../../utilities/convert/dateToDayCode":24,"./../../../utilities/convert/dayCodeToNumber":25,"./../../../utilities/parsers/SymbolParser":41,"@barchart/common-js/lang/array":51,"@barchart/common-js/lang/is":53,"axios":57}],12:[function(require,module,exports){
const assert = require('@barchart/common-js/lang/assert');
const WebSocketAdapterFactory = require('./../connection/adapter/WebSocketAdapterFactory'),
  XmlParserFactory = require('./../utilities/xml/XmlParserFactory');
module.exports = (() => {
  'use strict';

  /**
   * A container of operational strategies for used internally by the
   * SDK (e.g. XML parsing, WebSocket connections, and HTTP requests).
   *
   * The primary purpose of this container is to provide different
   * strategies when in running different environments (e.g. web browser
   * or Node.js).
   *
   * @public
   * @exported
   * @param {WebSocketAdapterFactory} webSocketAdapterFactory
   * @param {XmlParserFactory} xmlParserFactory
   */
  class Environment {
    constructor(webSocketAdapterFactory, xmlParserFactory) {
      assert.argumentIsRequired(webSocketAdapterFactory, 'webSocketAdapterFactory', WebSocketAdapterFactory, 'WebSocketAdapterFactory');
      assert.argumentIsRequired(xmlParserFactory, 'xmlParserFactory', XmlParserFactory, 'XmlParserFactory');
      this._webSocketAdapterFactory = webSocketAdapterFactory;
      this._xmlParserFactory = xmlParserFactory;
    }
    getWebSocketAdapterFactory() {
      return this._webSocketAdapterFactory;
    }
    getXmlParserFactory() {
      return this._xmlParserFactory;
    }
    toString() {
      return '[Environment]';
    }
  }
  return Environment;
})();

},{"./../connection/adapter/WebSocketAdapterFactory":5,"./../utilities/xml/XmlParserFactory":43,"@barchart/common-js/lang/assert":52}],13:[function(require,module,exports){
const Environment = require('./Environment');
const WebSocketAdapterFactoryForBrowsers = require('./../connection/adapter/WebSocketAdapterFactoryForBrowsers'),
  XmlParserFactoryForBrowsers = require('./../utilities/xml/XmlParserFactoryForBrowsers');
module.exports = (() => {
  'use strict';

  const webSocketAdapterFactory = new WebSocketAdapterFactoryForBrowsers();
  const xmlParserFactory = new XmlParserFactoryForBrowsers();

  /**
   * A container for strategies used in a web browser environment. These
   * strategies include WebSocket connections and XML parsing using the
   * browser's built-in capabilities.
   *
   * @public
   * @exported
   * @extends {Environment}
   */
  class EnvironmentForBrowsers extends Environment {
    constructor() {
      super(webSocketAdapterFactory, xmlParserFactory);
    }
    toString() {
      return '[Environment]';
    }
  }
  return EnvironmentForBrowsers;
})();

},{"./../connection/adapter/WebSocketAdapterFactoryForBrowsers":6,"./../utilities/xml/XmlParserFactoryForBrowsers":44,"./Environment":12}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{"./Logger":14,"./LoggerProvider":16}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{"./../logging/LoggerFactory":15,"@barchart/common-js/lang//object":54}],18:[function(require,module,exports){
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

},{"@barchart/common-js/lang/Timezones":50}],19:[function(require,module,exports){
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
          q.settlementPrice = message.value;
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

},{"../utilities/parsers/SymbolParser":41,"./../logging/LoggerFactory":15,"./../meta":22,"./../utilities/convert/dayCodeToNumber":25,"./CumulativeVolume":17,"./Exchange":18,"./Profile":20,"./Quote":21,"@barchart/common-js/lang/Timezones":50,"@barchart/common-js/lang/is":53,"@barchart/common-js/lang/object":54,"@barchart/common-js/lang/timezone":56}],20:[function(require,module,exports){
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
       * @property {number} tickIncrement - The minimum price movement, expressed as an integer multiple of the number of the possible divisions within one unit. For example, the number of discrete divisions of a dollar is 100. If the tick increment is ten, that means quotes and trades can occur at $0.10, $0.20, $0.30, etc.
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

},{"../utilities/format/factories/price":32,"./../utilities/data/AssetClass":27,"./../utilities/format/specialized/cmdtyView":36,"./../utilities/parsers/SymbolParser":41}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
module.exports = (() => {
  'use strict';

  return {
    version: '6.3.1'
  };
})();

},{}],23:[function(require,module,exports){
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

},{"./../data/UnitCode":28,"@barchart/common-js/lang/is":53}],24:[function(require,module,exports){
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

},{"./numberToDayCode":26}],25:[function(require,module,exports){
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

},{"@barchart/common-js/lang/is":53}],26:[function(require,module,exports){
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

},{"@barchart/common-js/lang/is":53}],27:[function(require,module,exports){
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

},{"@barchart/common-js/lang/Enum":49}],28:[function(require,module,exports){
const assert = require('@barchart/common-js/lang/assert'),
  Decimal = require('@barchart/common-js/lang/Decimal'),
  is = require('@barchart/common-js/lang/is');
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

    /**
     * Determines the minimum price fluctuation. In other words, multiples
     * of this value determine the set of valid quote and trade prices
     * for an instrument.
     *
     * @public
     * @param {Number} tickIncrement - Taken from a {@link Profile} instance.
     * @returns {Number}
     */
    getMinimumTick(tickIncrement) {
      assert.argumentIsValid(tickIncrement, 'tickIncrement', is.integer, 'must be an integer');
      const one = new Decimal(1);
      const ten = new Decimal(10);
      let discretePrice;
      if (this.supportsFractions) {
        discretePrice = one.divide(this._fractionFactor);
      } else {
        discretePrice = one.divide(ten.raise(this._decimalDigits));
      }
      const minimumTick = discretePrice.multiply(tickIncrement);
      return minimumTick.toFloat();
    }

    /**
     * Returns the change in value of a position when the instrument's price moves
     * up by the minimum tick.
     *
     * @public
     * @param {Number} tickIncrement - Taken from a {@link Profile} instance.
     * @param {Number} pointValue - Taken from a {@link Profile} instance.
     * @returns {Number}
     */
    getMinimumTickValue(tickIncrement, pointValue) {
      assert.argumentIsValid(tickIncrement, 'tickIncrement', is.integer, 'must be an integer');
      assert.argumentIsValid(pointValue, 'pointValue', is.number, 'must be a number');
      const minimumTick = new Decimal(this.getMinimumTick(tickIncrement));
      const minimumTickValue = minimumTick.multiply(pointValue);
      return minimumTickValue.toFloat();
    }

    /**
     * Rounds a value to the nearest valid tick.
     *
     * @param {Number|Decimal} value - The price to round.
     * @param {Number|Decimal} minimumTick - The minimum tick size (see {@link UnitCode#getMinimumTick})
     * @param {Boolean=} roundToZero - When true, the rounding will always go towards zero.
     * @returns {Number}
     */
    roundToNearestTick(value, minimumTick, roundToZero) {
      assert.argumentIsValid(value, 'value', x => is.number(x) || x instanceof Decimal, 'must be a number primitive or a Decimal instance');
      assert.argumentIsValid(minimumTick, 'minimumTick', x => is.number(x) || x instanceof Decimal, 'must be a number primitive or a Decimal instance');
      assert.argumentIsOptional(roundToZero, 'roundToZero', Boolean);
      let valueToUse;
      if (value instanceof Decimal) {
        valueToUse = value;
      } else {
        valueToUse = new Decimal(value);
      }
      let ticks = valueToUse.divide(minimumTick);
      let remainder = valueToUse.mod(minimumTick);
      if (!remainder.getIsZero()) {
        ticks = ticks.round(0, is.boolean(roundToZero) && roundToZero ? Decimal.ROUNDING_MODE.DOWN : Decimal.ROUNDING_MODE.NORMAL);
      }
      return ticks.multiply(minimumTick).toFloat();
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

},{"@barchart/common-js/lang/Decimal":48,"@barchart/common-js/lang/Enum":49,"@barchart/common-js/lang/assert":52,"@barchart/common-js/lang/is":53}],29:[function(require,module,exports){
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

},{"@barchart/common-js/lang/timezone":56}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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

},{"@barchart/common-js/lang/is":53}],32:[function(require,module,exports){
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

},{"./../price":34}],33:[function(require,module,exports){
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

},{"@barchart/common-js/lang/is":53}],34:[function(require,module,exports){
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

},{"./../data/UnitCode":28,"./decimal":31,"./fraction":33,"@barchart/common-js/lang/is":53}],35:[function(require,module,exports){
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

},{"./date":30,"./time":37,"@barchart/common-js/lang/Timezones":50,"@barchart/common-js/lang/is":53}],36:[function(require,module,exports){
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

},{"./../../data/AssetClass":27,"./../fraction":33,"./../price":34}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
const parseValue = require('./value'),
  parseTimestamp = require('./timestamp');
module.exports = (() => {
  'use strict';

  /**
   * Parses a DDF message, returning a JavaScript object representing the
   * content of the message.
   *
   * @exported
   * @function
   * @param {String} msg
   * @param {XmlParser} xmlParser
   * @param {Object=} options
   * @returns {Object}
   */
  function parseMessage(msg, xmlParser, options) {
    const message = {
      message: msg,
      type: null
    };
    switch (msg.substr(0, 1)) {
      case '%':
        {
          let xmlDocument;
          try {
            xmlDocument = xmlParser.parse(msg.substring(1));
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

},{"./timestamp":39,"./value":40}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
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
      case 'F':
        return sign * (parseInt(str) / 10000000);
      default:
        return sign * parseInt(str);
    }
  }
  return parseValue;
})();

},{}],41:[function(require,module,exports){
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
     * Indicates if a symbol represents a "cash" futures contract (a
     * proprietary Barchart concept).
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */
    static getIsCash(symbol) {
      return SymbolParser.getIsFuture(symbol) && types.futures.cash.test(symbol);
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
  const distantFuturesMonths = {
    F: 'A',
    G: 'B',
    H: 'C',
    J: 'D',
    K: 'E',
    M: 'I',
    N: 'L',
    Q: 'O',
    U: 'P',
    V: 'R',
    X: 'S',
    Z: 'T'
  };
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
  types.futures.cash = /(.*)(Y00)$/;
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
      const matches = symbol.match(types.futures.concrete);
      if (matches !== null) {
        const root = matches[1];
        const month = matches[2];
        const year = getFuturesYear(matches[3], month);
        if (year > getCurrentYear() + 9) {
          const distant = distantFuturesMonths[month];
          if (distant) {
            converted = `${root}${distant}${getYearDigits(year, 1)}`;
          }
        }
      }
    }
    return converted;
  });
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

},{"./../data/AssetClass":27,"@barchart/common-js/lang/is":53,"@barchart/common-js/lang/string":55}],42:[function(require,module,exports){
module.exports = (() => {
  'use strict';

  /**
   * The abstract definition for an object that parses XML and
   * outputs a duck-typed XML document. It is unlikely that SDK
   * consumers will need to implement this class.
   *
   * @public
   * @exported
   * @abstract
   */
  class XmlParser {
    constructor() {}

    /**
     * Accepts a string and returns a (duck-typed) XML document.
     *
     * @public
     * @param {String} text
     * @returns {*}
     */
    parse(text) {
      if (typeof text !== 'string') {
        throw new Error('The "text" argument must be a string.');
      }
      return this._parse(text);
    }

    /**
     * @protected
     * @abstract
     * @param {String} text
     * @returns {*}
     */
    _parse(text) {
      return null;
    }
    toString() {
      return '[XmlParser]';
    }
  }
  return XmlParser;
})();

},{}],43:[function(require,module,exports){
module.exports = (() => {
  'use strict';

  /**
   * An abstract definition for an factory that builds {@link XmlParser}
   * instances. It is unlikely that SDK consumers will need to implement
   * this class.
   *
   * @public
   * @exported
   * @abstract
   */
  class XmlParserFactory {
    constructor() {}

    /**
     * Returns a new {@link XmlParser} instance.
     *
     * @public
     * @abstract
     * @returns {XmlParser}
     */
    build() {
      return null;
    }
    toString() {
      return '[XmlParserFactory]';
    }
  }
  return XmlParserFactory;
})();

},{}],44:[function(require,module,exports){
const XmlParser = require('./XmlParser'),
  XmlParserFactory = require('./XmlParserFactory');
module.exports = (() => {
  'use strict';

  /**
   * An implementation of {@link XmlParserFactory} for use with web browsers. Pass
   * an instance of this class to the {@link Connection.connect} function when operating
   * in a web browser.
   *
   * @public
   * @extends {XmlParserFactory}
   * @exported
   */
  class XmlParserFactoryForBrowsers extends XmlParserFactory {
    constructor() {
      super();
    }

    /**
     * Returns a new {@link XmlParser} instance suitable for use
     * with a web browser.
     *
     * @public
     * @returns {XmlParser}
     */
    build() {
      return new XmlParserForBrowsers();
    }
    toString() {
      return '[XmlParserFactoryForBrowsers]';
    }
  }

  /**
   * The browser implementation of a {@link XmlParser} which uses the browser's
   * built-in [DOMParser](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser)
   * class.
   *
   * @private
   * @extends {XmlParser}
   */
  class XmlParserForBrowsers extends XmlParser {
    constructor() {
      super();
      this._parser = new DOMParser();
    }
    _parse(text) {
      return this._parser.parseFromString(text, 'text/xml');
    }
    toString() {
      return '[XmlParserForBrowsers]';
    }
  }
  return XmlParserFactoryForBrowsers;
})();

},{"./XmlParser":42,"./XmlParserFactory":43}],45:[function(require,module,exports){
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

},{"./../../lang/assert":52,"./comparators":46}],46:[function(require,module,exports){
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

},{"./../../lang/assert":52}],47:[function(require,module,exports){
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
     * @public
     * @static
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

},{"./../collections/sorting/ComparatorBuilder":45,"./../collections/sorting/comparators":46,"./assert":52,"./is":53}],48:[function(require,module,exports){
const assert = require('./assert'),
  Enum = require('./Enum'),
  is = require('./is');
const Big = require('big.js');
module.exports = (() => {
  'use strict';

  /**
   * An immutable object that allows for arbitrary-precision calculations.
   *
   * @public
   * @param {Decimal|Number|String} value - The value.
   */
  class Decimal {
    constructor(value) {
      this._big = getBig(value);
    }

    /**
     * Returns a new {@link Decimal} instance that is the sum of the
     * current instance's value and the value supplied.
     *
     * @public
     * @param {Decimal|Number|String} other - The value to add.
     * @returns {Decimal}
     */
    add(other) {
      return new Decimal(this._big.plus(getBig(other)));
    }

    /**
     * Returns a new {@link Decimal} instance with a value that results
     * from the subtraction of the value supplied from the current instance's
     * value.
     *
     * @public
     * @param {Decimal|Number|String} other - The value to subtract.
     * @returns {Decimal}
     */
    subtract(other) {
      return new Decimal(this._big.minus(getBig(other)));
    }

    /**
     * Returns a new {@link Decimal} instance that is the product of the
     * current instance's value and the value supplied.
     *
     * @public
     * @param {Decimal|Number|String} other - The value to add.
     * @returns {Decimal}
     */
    multiply(other) {
      return new Decimal(this._big.times(getBig(other)));
    }

    /**
     * Returns a new {@link Decimal} instance with a value that results
     * from the division of the current instance's value by the value
     * supplied.
     *
     * @public
     * @param {Decimal|Number|String} other - The value to subtract.
     * @returns {Decimal}
     */
    divide(other) {
      return new Decimal(this._big.div(getBig(other)));
    }

    /**
     * Returns a new {@link Decimal} instance with a value that results
     * from raising the current instance to the power of the exponent
     * provided.
     *
     * @public
     * @param {Number} exponent
     * @returns {Decimal}
     */
    raise(exponent) {
      assert.argumentIsRequired(exponent, 'exponent', Number);
      return new Decimal(this._big.pow(exponent));
    }

    /**
     * Returns a new {@link Decimal} with a value resulting from a rounding
     * operation on the current value.
     *
     * @public
     * @param {Number} places - The number of decimal places to retain.
     * @param {RoundingMode=} mode - The strategy to use for rounding.
     * @returns {Decimal}
     */
    round(places, mode) {
      assert.argumentIsRequired(places, 'places', Number);
      assert.argumentIsOptional(mode, 'mode', RoundingMode, 'RoundingMode');
      const modeToUse = mode || RoundingMode.NORMAL;
      return new Decimal(this._big.round(places, modeToUse.value));
    }

    /**
     * Returns a new {@link Decimal} instance with of the remainder when
     * dividing the current instance by the value supplied.
     *
     * @public
     * @param {Decimal|Number|String} other
     * @returns {Decimal}
     */
    mod(other) {
      return new Decimal(this._big.mod(getBig(other)));
    }

    /**
     * Returns a new {@link Decimal} instance having the absolute value of
     * the current instance's value.
     *
     * @public
     * @returns {Decimal}
     */
    absolute() {
      return new Decimal(this._big.abs());
    }

    /**
     * Returns a new {@link Decimal} instance the opposite sign as the
     * current instance's value.
     *
     * @public
     * @returns {Decimal}
     */
    opposite() {
      return this.multiply(-1);
    }

    /**
     * Returns a Boolean value, indicating if the current instance's value is
     * equal to zero (or approximately equal to zero).
     *
     * @public
     * @param {Boolean=} approximate
     * @param {Number=} places
     * @returns {Boolean}
     */
    getIsZero(approximate, places) {
      assert.argumentIsOptional(approximate, 'approximate', Boolean);
      assert.argumentIsOptional(places, 'places', Number);
      return this._big.eq(zero) || is.boolean(approximate) && approximate && this.round(places || Big.DP, RoundingMode.NORMAL).getIsZero();
    }

    /**
     * Returns true if the current instance is positive; otherwise false.
     *
     * @public
     * @returns {Boolean}
     */
    getIsPositive() {
      return this._big.gt(zero);
    }

    /**
     * Returns true if the current instance is negative; otherwise false.
     *
     * @public
     * @returns {Boolean}
     */
    getIsNegative() {
      return this._big.lt(zero);
    }

    /**
     * Returns true if the current instance is greater than the value.
     *
     * @public
     * @param {Decimal|Number|String} other - The value to compare.
     * @returns {Boolean}
     */
    getIsGreaterThan(other) {
      return this._big.gt(getBig(other));
    }

    /**
     * Returns true if the current instance is greater than or equal to the value.
     *
     * @public
     * @param {Decimal|Number|String} other - The value to compare.
     * @returns {Boolean}
     */
    getIsGreaterThanOrEqual(other) {
      return this._big.gte(getBig(other));
    }

    /**
     * Returns true if the current instance is less than the value.
     *
     * @public
     * @param {Decimal|Number|String} other - The value to compare.
     * @returns {Boolean}
     */
    getIsLessThan(other) {
      return this._big.lt(getBig(other));
    }

    /**
     * Returns true if the current instance is less than or equal to the value.
     *
     * @public
     * @param {Decimal|Number|String} other - The value to compare.
     * @returns {Boolean}
     */
    getIsLessThanOrEqual(other) {
      return this._big.lte(getBig(other));
    }

    /**
     * Returns true if the current instance between two other values. The
     * test is inclusive, by default.
     *
     * @public
     * @param {Decimal|Number|String} minimum - The minimum value.
     * @param {Decimal|Number|String} minimum - The maximum value.
     * @param {Boolean=} exclusive - If true, the value cannot equal the minimum or maximum value and still be considered "between" the other values.
     * @returns {Boolean}
     */
    getIsBetween(minimum, maximum, exclusive) {
      assert.argumentIsOptional(exclusive, 'exclusive', Boolean);
      if (is.boolean(exclusive) && exclusive) {
        return this.getIsGreaterThan(minimum) && this.getIsLessThan(maximum);
      } else {
        return this.getIsGreaterThanOrEqual(minimum) && this.getIsLessThanOrEqual(maximum);
      }
    }

    /**
     * Returns true if the current instance is equal to the value.
     *
     * @public
     * @param {Decimal|Number|String} other - The value to compare.
     * @returns {Boolean}
     */
    getIsEqual(other) {
      return this._big.eq(getBig(other));
    }

    /**
     * Returns true is close to another value.
     *
     * @public
     * @param {Decimal|Number|String} other - The value to compare.
     * @param {Number} places - The significant digits.
     * @returns {Boolean}
     */
    getIsApproximate(other, places) {
      if (places === 0) {
        return this.getIsEqual(other);
      }
      const difference = this.subtract(other).absolute();
      const tolerance = Decimal.ONE.divide(new Decimal(10).raise(places));
      return difference.getIsLessThan(tolerance);
    }

    /**
     * Returns true if the current instance is an integer (i.e. has no decimal
     * component).
     *
     * @public
     * @return {Boolean}
     */
    getIsInteger() {
      return this.getIsEqual(this.round(0));
    }

    /**
     * Returns the number of decimal places used.
     *
     * @public
     * @returns {Number}
     */
    getDecimalPlaces() {
      const matches = this.toFixed().match(/-?\d*\.(\d*)/);
      let returnVal;
      if (matches === null) {
        returnVal = 0;
      } else {
        returnVal = matches[1].length;
      }
      return returnVal;
    }

    /**
     * Emits a floating point value that approximates the value of the current
     * instance.
     *
     * @public
     * @param {Number=} places
     * @returns {Number}
     */
    toFloat(places) {
      assert.argumentIsOptional(places, 'places', Number);

      // Accepting places might be a mistake here; perhaps
      // the consumer should be forced to use the round
      // function.

      return parseFloat(this._big.toFixed(places || 16));
    }

    /**
     * Returns a string-based representation of the instance's value.
     *
     * @public
     * @returns {String}
     */
    toFixed() {
      return this._big.toFixed();
    }

    /**
     * Returns a {@link Number} that is approximately equal to the value of
     * this {@link Decimal} instance.
     *
     * @public
     * @returns {String}
     */
    toNumber() {
      return this._big.toNumber();
    }

    /**
     * Returns the JSON representation.
     *
     * @public
     * @returns {String}
     */
    toJSON() {
      return this.toFixed();
    }

    /**
     * Clones a {@link Decimal} instance.
     *
     * @public
     * @static
     * @param {Decimal} value
     * @returns {Decimal}
     */
    static clone(value) {
      assert.argumentIsRequired(value, 'value', Decimal, 'Decimal');
      return new Decimal(value._big);
    }

    /**
     * An alias for the constructor. Creates a new instance. Suitable for
     * use with the value emitted by {@link Decimal#toJSON}.
     *
     * @public
     * @static
     * @param {Decimal|Number|String} value
     * @returns {Decimal}
     */
    static parse(value) {
      return new Decimal(value);
    }

    /**
     * Returns an instance with the value of zero.
     *
     * @public
     * @static
     * @returns {Decimal}
     */
    static get ZERO() {
      return decimalZero;
    }

    /**
     * Returns an instance with the value of one.
     *
     * @public
     * @static
     * @returns {Decimal}
     */
    static get ONE() {
      return decimalOne;
    }

    /**
     * Returns an instance with the value of one.
     *
     * @public
     * @static
     * @returns {Decimal}
     */
    static get NEGATIVE_ONE() {
      return decimalNegativeOne;
    }

    /**
     * Return the {@link RoundingMode} enumeration.
     *
     * @public
     * @static
     * @returns {RoundingMode}
     */
    static get ROUNDING_MODE() {
      return RoundingMode;
    }

    /**
     * Runs {@link Decimal#getIsZero} and returns the result.
     *
     * @public
     * @static
     * @param {Decimal} instance
     * @returns {Boolean}
     */
    static getIsZero(instance) {
      assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');
      return instance.getIsZero();
    }

    /**
     * Runs {@link Decimal#getIsZero} and returns the inverse.
     *
     * @public
     * @static
     * @param {Decimal} instance
     * @returns {Boolean}
     */
    static getIsNotZero(instance) {
      assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');
      return !instance.getIsZero();
    }

    /**
     * Runs {@link Decimal#getIsPositive} and returns the result.
     *
     * @public
     * @static
     * @param {Decimal} instance
     * @returns {Boolean}
     */
    static getIsPositive(instance) {
      assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');
      return instance.getIsPositive();
    }

    /**
     * Checks an instance to see if its negative or zero.
     *
     * @public
     * @static
     * @param {Decimal} instance
     * @returns {Boolean}
     */
    static getIsNotPositive(instance) {
      assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');
      return instance.getIsNegative() || instance.getIsZero();
    }

    /**
     * Runs {@link Decimal#getIsNegative} and returns the result.
     *
     * @public
     * @static
     * @param {Decimal} instance
     * @returns {Boolean}
     */
    static getIsNegative(instance) {
      assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');
      return instance.getIsNegative();
    }

    /**
     * Checks an instance to see if its positive or zero.
     *
     * @public
     * @static
     * @param {Decimal} instance
     * @returns {Boolean}
     */
    static getIsNotNegative(instance) {
      assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');
      return instance.getIsPositive() || instance.getIsZero();
    }

    /**
     * A comparator function for {@link Decimal} instances.
     *
     * @public
     * @static
     * @param {Decimal} a
     * @param {Decimal} b
     * @returns {Number}
     */
    static compareDecimals(a, b) {
      assert.argumentIsRequired(a, 'a', Decimal, 'Decimal');
      assert.argumentIsRequired(b, 'b', Decimal, 'Decimal');
      if (a._big.gt(b._big)) {
        return 1;
      } else if (a._big.lt(b._big)) {
        return -1;
      } else {
        return 0;
      }
    }
    toString() {
      return '[Decimal]';
    }
  }
  const zero = new Big(0);
  const positiveOne = new Big(1);
  const negativeOne = new Big(-1);
  const decimalZero = new Decimal(zero);
  const decimalOne = new Decimal(positiveOne);
  const decimalNegativeOne = new Decimal(negativeOne);
  function getBig(value) {
    if (value instanceof Big) {
      return value;
    } else if (value instanceof Decimal) {
      return value._big;
    } else {
      return new Big(value);
    }
  }

  /**
   * An enumeration of strategies for rounding a {@link Decimal} instance.
   *
   * @public
   * @inner
   * @extends {Enum}
   */
  class RoundingMode extends Enum {
    constructor(value, description) {
      super(value.toString(), description);
      this._value = value;
    }

    /**
     * The code used by the Big.js library.
     *
     * @ignore
     * @returns {Number}
     */
    get value() {
      return this._value;
    }

    /**
     * Rounds away from zero.
     *
     * @public
     * @static
     * @returns {RoundingMode}
     */
    static get UP() {
      return up;
    }

    /**
     * Rounds towards zero.
     *
     * @public
     * @static
     * @returns {RoundingMode}
     */
    static get DOWN() {
      return down;
    }

    /**
     * Rounds towards nearest neighbor. If equidistant, rounds away from zero.
     *
     * @public
     * @static
     * @returns {RoundingMode}
     */
    static get NORMAL() {
      return normal;
    }
    toString() {
      return '[RoundingMode]';
    }
  }
  const up = new RoundingMode(3, 'up');
  const down = new RoundingMode(0, 'down');
  const normal = new RoundingMode(1, 'normal');
  return Decimal;
})();

},{"./Enum":49,"./assert":52,"./is":53,"big.js":86}],49:[function(require,module,exports){
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

},{"./assert":52}],50:[function(require,module,exports){
const assert = require('./assert'),
  Enum = require('./Enum'),
  is = require('./is'),
  timezone = require('./timezone');
const getTimezoneOffsetA = require('date-fns-tz/getTimezoneOffset'),
  getTimezoneOffsetB = require('date-fns-tz/getTimezoneOffset').default;
const getTimezoneOffset = is.fn(getTimezoneOffsetB) ? getTimezoneOffsetB : getTimezoneOffsetA;
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
     * @returns {Boolean}
     */
    getIsDaylightSavingsTime(timestamp) {
      assert.argumentIsOptional(timestamp, 'timestamp', Number);
      const now = new Date();
      let baseline = Date.UTC(now.getFullYear(), 0, 1);
      let candidate;
      if (timestamp) {
        candidate = timestamp;
      } else {
        candidate = now.getTime();
      }
      const baselineOffset = this.getUtcOffset(baseline);
      const candidateOffset = this.getUtcOffset(candidate);
      return baselineOffset !== candidateOffset;
    }

    /**
     * Calculates and returns the offset of a timezone from UTC.
     *
     * @public
     * @param {Number=} timestamp - The moment at which the offset is calculated, otherwise now.
     * @param {Boolean=} milliseconds - If true, the offset is returned in milliseconds; otherwise minutes.
     * @returns {Number}
     */
    getUtcOffset(timestamp, milliseconds) {
      assert.argumentIsOptional(timestamp, 'timestamp', Number);
      assert.argumentIsOptional(milliseconds, milliseconds, Boolean);
      let timestampToUse;
      if (is.number(timestamp)) {
        timestampToUse = timestamp;
      } else {
        timestampToUse = new Date().getTime();
      }
      let divisor;
      if (is.boolean(milliseconds) && milliseconds) {
        divisor = 1;
      } else {
        divisor = 60 * 1000;
      }
      return getTimezoneOffset(this.code, new Date(timestampToUse)) / divisor;
    }

    /**
     *
     * Given a code, returns the enumeration item.
     *
     * @public
     * @static
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

},{"./Enum":49,"./assert":52,"./is":53,"./timezone":56,"date-fns-tz/getTimezoneOffset":90}],51:[function(require,module,exports){
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
     * original array). Unlike the {@link array#groupBy} function, only one item can have a
     * given key value.
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

},{"./assert":52,"./is":53}],52:[function(require,module,exports){
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

},{"./is":53}],53:[function(require,module,exports){
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
     * @param {*} candidate
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

},{}],54:[function(require,module,exports){
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

},{"./array":51,"./is":53}],55:[function(require,module,exports){
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

},{"./assert":52,"./is":53}],56:[function(require,module,exports){
const assert = require('./assert');
module.exports = (() => {
  'use strict';

  /**
   * Utilities for working with timezones.
   *
   * @public
   * @module lang/timezone
   */
  const timezone = {
    /**
     * Gets a list of names in the tz database (see https://en.wikipedia.org/wiki/Tz_database
     * and https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
     *
     * @public
     * @static
     * @returns {String[]}
     */
    getTimezones() {
      return timezoneNames;
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
      let guess;
      try {
        guess = Intl.DateTimeFormat().resolvedOptions().timeZone;
      } catch (e) {
        guess = null;
      }
      return guess;
    }
  };
  const timezoneData = [["Africa", "Abidjan", "Accra", "Addis_Ababa", "Algiers", "Asmara", "Asmera", "Bamako", "Bangui", "Banjul", "Bissau", "Blantyre", "Brazzaville", "Bujumbura", "Cairo", "Casablanca", "Ceuta", "Conakry", "Dakar", "Dar_es_Salaam", "Djibouti", "Douala", "El_Aaiun", "Freetown", "Gaborone", "Harare", "Johannesburg", "Juba", "Kampala", "Khartoum", "Kigali", "Kinshasa", "Lagos", "Libreville", "Lome", "Luanda", "Lubumbashi", "Lusaka", "Malabo", "Maputo", "Maseru", "Mbabane", "Mogadishu", "Monrovia", "Nairobi", "Ndjamena", "Niamey", "Nouakchott", "Ouagadougou", "Porto-Novo", "Sao_Tome", "Timbuktu", "Tripoli", "Tunis", "Windhoek"], ["America", "Adak", "Anchorage", "Anguilla", "Antigua", "Araguaina", "Argentina/Buenos_Aires", "Argentina/Catamarca", "Argentina/ComodRivadavia", "Argentina/Cordoba", "Argentina/Jujuy", "Argentina/La_Rioja", "Argentina/Mendoza", "Argentina/Rio_Gallegos", "Argentina/Salta", "Argentina/San_Juan", "Argentina/San_Luis", "Argentina/Tucuman", "Argentina/Ushuaia", "Aruba", "Asuncion", "Atikokan", "Atka", "Bahia", "Bahia_Banderas", "Barbados", "Belem", "Belize", "Blanc-Sablon", "Boa_Vista", "Bogota", "Boise", "Buenos_Aires", "Cambridge_Bay", "Campo_Grande", "Cancun", "Caracas", "Catamarca", "Cayenne", "Cayman", "Chicago", "Chihuahua", "Ciudad_Juarez", "Coral_Harbour", "Cordoba", "Costa_Rica", "Creston", "Cuiaba", "Curacao", "Danmarkshavn", "Dawson", "Dawson_Creek", "Denver", "Detroit", "Dominica", "Edmonton", "Eirunepe", "El_Salvador", "Ensenada", "Fort_Nelson", "Fort_Wayne", "Fortaleza", "Glace_Bay", "Godthab", "Goose_Bay", "Grand_Turk", "Grenada", "Guadeloupe", "Guatemala", "Guayaquil", "Guyana", "Halifax", "Havana", "Hermosillo", "Indiana/Indianapolis", "Indiana/Knox", "Indiana/Marengo", "Indiana/Petersburg", "Indiana/Tell_City", "Indiana/Vevay", "Indiana/Vincennes", "Indiana/Winamac", "Indianapolis", "Inuvik", "Iqaluit", "Jamaica", "Jujuy", "Juneau", "Kentucky/Louisville", "Kentucky/Monticello", "Knox_IN", "Kralendijk", "La_Paz", "Lima", "Los_Angeles", "Louisville", "Lower_Princes", "Maceio", "Managua", "Manaus", "Marigot", "Martinique", "Matamoros", "Mazatlan", "Mendoza", "Menominee", "Merida", "Metlakatla", "Mexico_City", "Miquelon", "Moncton", "Monterrey", "Montevideo", "Montreal", "Montserrat", "Nassau", "New_York", "Nipigon", "Nome", "Noronha", "North_Dakota/Beulah", "North_Dakota/Center", "North_Dakota/New_Salem", "Nuuk", "Ojinaga", "Panama", "Pangnirtung", "Paramaribo", "Phoenix", "Port-au-Prince", "Port_of_Spain", "Porto_Acre", "Porto_Velho", "Puerto_Rico", "Punta_Arenas", "Rainy_River", "Rankin_Inlet", "Recife", "Regina", "Resolute", "Rio_Branco", "Rosario", "Santa_Isabel", "Santarem", "Santiago", "Santo_Domingo", "Sao_Paulo", "Scoresbysund", "Shiprock", "Sitka", "St_Barthelemy", "St_Johns", "St_Kitts", "St_Lucia", "St_Thomas", "St_Vincent", "Swift_Current", "Tegucigalpa", "Thule", "Thunder_Bay", "Tijuana", "Toronto", "Tortola", "Vancouver", "Virgin", "Whitehorse", "Winnipeg", "Yakutat", "Yellowknife"], ["Antarctica", "Casey", "Davis", "DumontDUrville", "Macquarie", "Mawson", "McMurdo", "Palmer", "Rothera", "South_Pole", "Syowa", "Troll", "Vostok"], ["Arctic", "Longyearbyen"], ["Asia", "Aden", "Almaty", "Amman", "Anadyr", "Aqtau", "Aqtobe", "Ashgabat", "Ashkhabad", "Atyrau", "Baghdad", "Bahrain", "Baku", "Bangkok", "Barnaul", "Beirut", "Bishkek", "Brunei", "Calcutta", "Chita", "Choibalsan", "Chongqing", "Chungking", "Colombo", "Dacca", "Damascus", "Dhaka", "Dili", "Dubai", "Dushanbe", "Famagusta", "Gaza", "Harbin", "Hebron", "Ho_Chi_Minh", "Hong_Kong", "Hovd", "Irkutsk", "Istanbul", "Jakarta", "Jayapura", "Jerusalem", "Kabul", "Kamchatka", "Karachi", "Kashgar", "Kathmandu", "Katmandu", "Khandyga", "Kolkata", "Krasnoyarsk", "Kuala_Lumpur", "Kuching", "Kuwait", "Macao", "Macau", "Magadan", "Makassar", "Manila", "Muscat", "Nicosia", "Novokuznetsk", "Novosibirsk", "Omsk", "Oral", "Phnom_Penh", "Pontianak", "Pyongyang", "Qatar", "Qostanay", "Qyzylorda", "Rangoon", "Riyadh", "Saigon", "Sakhalin", "Samarkand", "Seoul", "Shanghai", "Singapore", "Srednekolymsk", "Taipei", "Tashkent", "Tbilisi", "Tehran", "Tel_Aviv", "Thimbu", "Thimphu", "Tokyo", "Tomsk", "Ujung_Pandang", "Ulaanbaatar", "Ulan_Bator", "Urumqi", "Ust-Nera", "Vientiane", "Vladivostok", "Yakutsk", "Yangon", "Yekaterinburg", "Yerevan"], ["Atlantic", "Azores", "Bermuda", "Canary", "Cape_Verde", "Faeroe", "Faroe", "Jan_Mayen", "Madeira", "Reykjavik", "South_Georgia", "St_Helena", "Stanley"], ["Australia", "ACT", "Adelaide", "Brisbane", "Broken_Hill", "Canberra", "Currie", "Darwin", "Eucla", "Hobart", "LHI", "Lindeman", "Lord_Howe", "Melbourne", "NSW", "North", "Perth", "Queensland", "South", "Sydney", "Tasmania", "Victoria", "West", "Yancowinna"], ["Brazil", "Acre", "DeNoronha", "East", "West"], ["Canada", "Atlantic", "Central", "Eastern", "Mountain", "Newfoundland", "Pacific", "Saskatchewan", "Yukon"], ["CET"], ["Chile", "Continental", "EasterIsland"], ["CST6CDT"], ["Cuba"], ["EET"], ["Egypt"], ["Eire"], ["EST"], ["EST5EDT"], ["Etc", "GMT", "GMT+0", "GMT+1", "GMT+10", "GMT+11", "GMT+12", "GMT+2", "GMT+3", "GMT+4", "GMT+5", "GMT+6", "GMT+7", "GMT+8", "GMT+9", "GMT-0", "GMT-1", "GMT-10", "GMT-11", "GMT-12", "GMT-13", "GMT-14", "GMT-2", "GMT-3", "GMT-4", "GMT-5", "GMT-6", "GMT-7", "GMT-8", "GMT-9", "GMT0", "Greenwich", "UCT", "UTC", "Universal", "Zulu"], ["Europe", "Amsterdam", "Andorra", "Astrakhan", "Athens", "Belfast", "Belgrade", "Berlin", "Bratislava", "Brussels", "Bucharest", "Budapest", "Busingen", "Chisinau", "Copenhagen", "Dublin", "Gibraltar", "Guernsey", "Helsinki", "Isle_of_Man", "Istanbul", "Jersey", "Kaliningrad", "Kiev", "Kirov", "Kyiv", "Lisbon", "Ljubljana", "London", "Luxembourg", "Madrid", "Malta", "Mariehamn", "Minsk", "Monaco", "Moscow", "Nicosia", "Oslo", "Paris", "Podgorica", "Prague", "Riga", "Rome", "Samara", "San_Marino", "Sarajevo", "Saratov", "Simferopol", "Skopje", "Sofia", "Stockholm", "Tallinn", "Tirane", "Tiraspol", "Ulyanovsk", "Uzhgorod", "Vaduz", "Vatican", "Vienna", "Vilnius", "Volgograd", "Warsaw", "Zagreb", "Zaporozhye", "Zurich"], ["GB"], ["GB-Eire"], ["GMT"], ["GMT-0"], ["GMT+0"], ["GMT0"], ["Greenwich"], ["Hongkong"], ["HST"], ["Iceland"], ["Indian", "Antananarivo", "Chagos", "Christmas", "Cocos", "Comoro", "Kerguelen", "Mahe", "Maldives", "Mauritius", "Mayotte", "Reunion"], ["Iran"], ["Israel"], ["Jamaica"], ["Japan"], ["Kwajalein"], ["Libya"], ["MET"], ["Mexico", "BajaNorte", "BajaSur", "General"], ["MST"], ["MST7MDT"], ["Navajo"], ["NZ"], ["NZ-CHAT"], ["Pacific", "Apia", "Auckland", "Bougainville", "Chatham", "Chuuk", "Easter", "Efate", "Enderbury", "Fakaofo", "Fiji", "Funafuti", "Galapagos", "Gambier", "Guadalcanal", "Guam", "Honolulu", "Johnston", "Kanton", "Kiritimati", "Kosrae", "Kwajalein", "Majuro", "Marquesas", "Midway", "Nauru", "Niue", "Norfolk", "Noumea", "Pago_Pago", "Palau", "Pitcairn", "Pohnpei", "Ponape", "Port_Moresby", "Rarotonga", "Saipan", "Samoa", "Tahiti", "Tarawa", "Tongatapu", "Truk", "Wake", "Wallis", "Yap"], ["Poland"], ["Portugal"], ["PRC"], ["PST8PDT"], ["ROC"], ["ROK"], ["Singapore"], ["Turkey"], ["UCT"], ["Universal"], ["US", "Alaska", "Aleutian", "Arizona", "Central", "East-Indiana", "Eastern", "Hawaii", "Indiana-Starke", "Michigan", "Mountain", "Pacific", "Samoa"], ["UTC"], ["W-SU"], ["WET"], ["Zulu"]];
  const timezoneNames = timezoneData.reduce((accumulator, a) => {
    if (a.length === 1) {
      accumulator.push(a[0]);
    } else {
      a.forEach((b, i) => {
        if (i === 0) {
          return;
        }
        accumulator.push(`${a[0]}/${b}`);
      });
    }
    return accumulator;
  }, []);
  return timezone;
})();

},{"./assert":52}],57:[function(require,module,exports){
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
},{"./adapters/http":58,"./adapters/xhr":58,"./core/enhanceError":68,"./helpers/normalizeHeaderName":80,"./utils":84,"_process":91}],73:[function(require,module,exports){
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
/*
 *  big.js v6.2.1
 *  A small, fast, easy-to-use library for arbitrary-precision decimal arithmetic.
 *  Copyright (c) 2022 Michael Mclaughlin
 *  https://github.com/MikeMcl/big.js/LICENCE.md
 */
;(function (GLOBAL) {
  'use strict';
  var Big,


/************************************** EDITABLE DEFAULTS *****************************************/


    // The default values below must be integers within the stated ranges.

    /*
     * The maximum number of decimal places (DP) of the results of operations involving division:
     * div and sqrt, and pow with negative exponents.
     */
    DP = 20,            // 0 to MAX_DP

    /*
     * The rounding mode (RM) used when rounding to the above decimal places.
     *
     *  0  Towards zero (i.e. truncate, no rounding).       (ROUND_DOWN)
     *  1  To nearest neighbour. If equidistant, round up.  (ROUND_HALF_UP)
     *  2  To nearest neighbour. If equidistant, to even.   (ROUND_HALF_EVEN)
     *  3  Away from zero.                                  (ROUND_UP)
     */
    RM = 1,             // 0, 1, 2 or 3

    // The maximum value of DP and Big.DP.
    MAX_DP = 1E6,       // 0 to 1000000

    // The maximum magnitude of the exponent argument to the pow method.
    MAX_POWER = 1E6,    // 1 to 1000000

    /*
     * The negative exponent (NE) at and beneath which toString returns exponential notation.
     * (JavaScript numbers: -7)
     * -1000000 is the minimum recommended exponent value of a Big.
     */
    NE = -7,            // 0 to -1000000

    /*
     * The positive exponent (PE) at and above which toString returns exponential notation.
     * (JavaScript numbers: 21)
     * 1000000 is the maximum recommended exponent value of a Big, but this limit is not enforced.
     */
    PE = 21,            // 0 to 1000000

    /*
     * When true, an error will be thrown if a primitive number is passed to the Big constructor,
     * or if valueOf is called, or if toNumber is called on a Big which cannot be converted to a
     * primitive number without a loss of precision.
     */
    STRICT = false,     // true or false


/**************************************************************************************************/


    // Error messages.
    NAME = '[big.js] ',
    INVALID = NAME + 'Invalid ',
    INVALID_DP = INVALID + 'decimal places',
    INVALID_RM = INVALID + 'rounding mode',
    DIV_BY_ZERO = NAME + 'Division by zero',

    // The shared prototype object.
    P = {},
    UNDEFINED = void 0,
    NUMERIC = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;


  /*
   * Create and return a Big constructor.
   */
  function _Big_() {

    /*
     * The Big constructor and exported function.
     * Create and return a new instance of a Big number object.
     *
     * n {number|string|Big} A numeric value.
     */
    function Big(n) {
      var x = this;

      // Enable constructor usage without new.
      if (!(x instanceof Big)) return n === UNDEFINED ? _Big_() : new Big(n);

      // Duplicate.
      if (n instanceof Big) {
        x.s = n.s;
        x.e = n.e;
        x.c = n.c.slice();
      } else {
        if (typeof n !== 'string') {
          if (Big.strict === true && typeof n !== 'bigint') {
            throw TypeError(INVALID + 'value');
          }

          // Minus zero?
          n = n === 0 && 1 / n < 0 ? '-0' : String(n);
        }

        parse(x, n);
      }

      // Retain a reference to this Big constructor.
      // Shadow Big.prototype.constructor which points to Object.
      x.constructor = Big;
    }

    Big.prototype = P;
    Big.DP = DP;
    Big.RM = RM;
    Big.NE = NE;
    Big.PE = PE;
    Big.strict = STRICT;
    Big.roundDown = 0;
    Big.roundHalfUp = 1;
    Big.roundHalfEven = 2;
    Big.roundUp = 3;

    return Big;
  }


  /*
   * Parse the number or string value passed to a Big constructor.
   *
   * x {Big} A Big number instance.
   * n {number|string} A numeric value.
   */
  function parse(x, n) {
    var e, i, nl;

    if (!NUMERIC.test(n)) {
      throw Error(INVALID + 'number');
    }

    // Determine sign.
    x.s = n.charAt(0) == '-' ? (n = n.slice(1), -1) : 1;

    // Decimal point?
    if ((e = n.indexOf('.')) > -1) n = n.replace('.', '');

    // Exponential form?
    if ((i = n.search(/e/i)) > 0) {

      // Determine exponent.
      if (e < 0) e = i;
      e += +n.slice(i + 1);
      n = n.substring(0, i);
    } else if (e < 0) {

      // Integer.
      e = n.length;
    }

    nl = n.length;

    // Determine leading zeros.
    for (i = 0; i < nl && n.charAt(i) == '0';) ++i;

    if (i == nl) {

      // Zero.
      x.c = [x.e = 0];
    } else {

      // Determine trailing zeros.
      for (; nl > 0 && n.charAt(--nl) == '0';);
      x.e = e - i - 1;
      x.c = [];

      // Convert string to array of digits without leading/trailing zeros.
      for (e = 0; i <= nl;) x.c[e++] = +n.charAt(i++);
    }

    return x;
  }


  /*
   * Round Big x to a maximum of sd significant digits using rounding mode rm.
   *
   * x {Big} The Big to round.
   * sd {number} Significant digits: integer, 0 to MAX_DP inclusive.
   * rm {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
   * [more] {boolean} Whether the result of division was truncated.
   */
  function round(x, sd, rm, more) {
    var xc = x.c;

    if (rm === UNDEFINED) rm = x.constructor.RM;
    if (rm !== 0 && rm !== 1 && rm !== 2 && rm !== 3) {
      throw Error(INVALID_RM);
    }

    if (sd < 1) {
      more =
        rm === 3 && (more || !!xc[0]) || sd === 0 && (
        rm === 1 && xc[0] >= 5 ||
        rm === 2 && (xc[0] > 5 || xc[0] === 5 && (more || xc[1] !== UNDEFINED))
      );

      xc.length = 1;

      if (more) {

        // 1, 0.1, 0.01, 0.001, 0.0001 etc.
        x.e = x.e - sd + 1;
        xc[0] = 1;
      } else {

        // Zero.
        xc[0] = x.e = 0;
      }
    } else if (sd < xc.length) {

      // xc[sd] is the digit after the digit that may be rounded up.
      more =
        rm === 1 && xc[sd] >= 5 ||
        rm === 2 && (xc[sd] > 5 || xc[sd] === 5 &&
          (more || xc[sd + 1] !== UNDEFINED || xc[sd - 1] & 1)) ||
        rm === 3 && (more || !!xc[0]);

      // Remove any digits after the required precision.
      xc.length = sd;

      // Round up?
      if (more) {

        // Rounding up may mean the previous digit has to be rounded up.
        for (; ++xc[--sd] > 9;) {
          xc[sd] = 0;
          if (sd === 0) {
            ++x.e;
            xc.unshift(1);
            break;
          }
        }
      }

      // Remove trailing zeros.
      for (sd = xc.length; !xc[--sd];) xc.pop();
    }

    return x;
  }


  /*
   * Return a string representing the value of Big x in normal or exponential notation.
   * Handles P.toExponential, P.toFixed, P.toJSON, P.toPrecision, P.toString and P.valueOf.
   */
  function stringify(x, doExponential, isNonzero) {
    var e = x.e,
      s = x.c.join(''),
      n = s.length;

    // Exponential notation?
    if (doExponential) {
      s = s.charAt(0) + (n > 1 ? '.' + s.slice(1) : '') + (e < 0 ? 'e' : 'e+') + e;

    // Normal notation.
    } else if (e < 0) {
      for (; ++e;) s = '0' + s;
      s = '0.' + s;
    } else if (e > 0) {
      if (++e > n) {
        for (e -= n; e--;) s += '0';
      } else if (e < n) {
        s = s.slice(0, e) + '.' + s.slice(e);
      }
    } else if (n > 1) {
      s = s.charAt(0) + '.' + s.slice(1);
    }

    return x.s < 0 && isNonzero ? '-' + s : s;
  }


  // Prototype/instance methods


  /*
   * Return a new Big whose value is the absolute value of this Big.
   */
  P.abs = function () {
    var x = new this.constructor(this);
    x.s = 1;
    return x;
  };


  /*
   * Return 1 if the value of this Big is greater than the value of Big y,
   *       -1 if the value of this Big is less than the value of Big y, or
   *        0 if they have the same value.
   */
  P.cmp = function (y) {
    var isneg,
      x = this,
      xc = x.c,
      yc = (y = new x.constructor(y)).c,
      i = x.s,
      j = y.s,
      k = x.e,
      l = y.e;

    // Either zero?
    if (!xc[0] || !yc[0]) return !xc[0] ? !yc[0] ? 0 : -j : i;

    // Signs differ?
    if (i != j) return i;

    isneg = i < 0;

    // Compare exponents.
    if (k != l) return k > l ^ isneg ? 1 : -1;

    j = (k = xc.length) < (l = yc.length) ? k : l;

    // Compare digit by digit.
    for (i = -1; ++i < j;) {
      if (xc[i] != yc[i]) return xc[i] > yc[i] ^ isneg ? 1 : -1;
    }

    // Compare lengths.
    return k == l ? 0 : k > l ^ isneg ? 1 : -1;
  };


  /*
   * Return a new Big whose value is the value of this Big divided by the value of Big y, rounded,
   * if necessary, to a maximum of Big.DP decimal places using rounding mode Big.RM.
   */
  P.div = function (y) {
    var x = this,
      Big = x.constructor,
      a = x.c,                  // dividend
      b = (y = new Big(y)).c,   // divisor
      k = x.s == y.s ? 1 : -1,
      dp = Big.DP;

    if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
      throw Error(INVALID_DP);
    }

    // Divisor is zero?
    if (!b[0]) {
      throw Error(DIV_BY_ZERO);
    }

    // Dividend is 0? Return +-0.
    if (!a[0]) {
      y.s = k;
      y.c = [y.e = 0];
      return y;
    }

    var bl, bt, n, cmp, ri,
      bz = b.slice(),
      ai = bl = b.length,
      al = a.length,
      r = a.slice(0, bl),   // remainder
      rl = r.length,
      q = y,                // quotient
      qc = q.c = [],
      qi = 0,
      p = dp + (q.e = x.e - y.e) + 1;    // precision of the result

    q.s = k;
    k = p < 0 ? 0 : p;

    // Create version of divisor with leading zero.
    bz.unshift(0);

    // Add zeros to make remainder as long as divisor.
    for (; rl++ < bl;) r.push(0);

    do {

      // n is how many times the divisor goes into current remainder.
      for (n = 0; n < 10; n++) {

        // Compare divisor and remainder.
        if (bl != (rl = r.length)) {
          cmp = bl > rl ? 1 : -1;
        } else {
          for (ri = -1, cmp = 0; ++ri < bl;) {
            if (b[ri] != r[ri]) {
              cmp = b[ri] > r[ri] ? 1 : -1;
              break;
            }
          }
        }

        // If divisor < remainder, subtract divisor from remainder.
        if (cmp < 0) {

          // Remainder can't be more than 1 digit longer than divisor.
          // Equalise lengths using divisor with extra leading zero?
          for (bt = rl == bl ? b : bz; rl;) {
            if (r[--rl] < bt[rl]) {
              ri = rl;
              for (; ri && !r[--ri];) r[ri] = 9;
              --r[ri];
              r[rl] += 10;
            }
            r[rl] -= bt[rl];
          }

          for (; !r[0];) r.shift();
        } else {
          break;
        }
      }

      // Add the digit n to the result array.
      qc[qi++] = cmp ? n : ++n;

      // Update the remainder.
      if (r[0] && cmp) r[rl] = a[ai] || 0;
      else r = [a[ai]];

    } while ((ai++ < al || r[0] !== UNDEFINED) && k--);

    // Leading zero? Do not remove if result is simply zero (qi == 1).
    if (!qc[0] && qi != 1) {

      // There can't be more than one zero.
      qc.shift();
      q.e--;
      p--;
    }

    // Round?
    if (qi > p) round(q, p, Big.RM, r[0] !== UNDEFINED);

    return q;
  };


  /*
   * Return true if the value of this Big is equal to the value of Big y, otherwise return false.
   */
  P.eq = function (y) {
    return this.cmp(y) === 0;
  };


  /*
   * Return true if the value of this Big is greater than the value of Big y, otherwise return
   * false.
   */
  P.gt = function (y) {
    return this.cmp(y) > 0;
  };


  /*
   * Return true if the value of this Big is greater than or equal to the value of Big y, otherwise
   * return false.
   */
  P.gte = function (y) {
    return this.cmp(y) > -1;
  };


  /*
   * Return true if the value of this Big is less than the value of Big y, otherwise return false.
   */
  P.lt = function (y) {
    return this.cmp(y) < 0;
  };


  /*
   * Return true if the value of this Big is less than or equal to the value of Big y, otherwise
   * return false.
   */
  P.lte = function (y) {
    return this.cmp(y) < 1;
  };


  /*
   * Return a new Big whose value is the value of this Big minus the value of Big y.
   */
  P.minus = P.sub = function (y) {
    var i, j, t, xlty,
      x = this,
      Big = x.constructor,
      a = x.s,
      b = (y = new Big(y)).s;

    // Signs differ?
    if (a != b) {
      y.s = -b;
      return x.plus(y);
    }

    var xc = x.c.slice(),
      xe = x.e,
      yc = y.c,
      ye = y.e;

    // Either zero?
    if (!xc[0] || !yc[0]) {
      if (yc[0]) {
        y.s = -b;
      } else if (xc[0]) {
        y = new Big(x);
      } else {
        y.s = 1;
      }
      return y;
    }

    // Determine which is the bigger number. Prepend zeros to equalise exponents.
    if (a = xe - ye) {

      if (xlty = a < 0) {
        a = -a;
        t = xc;
      } else {
        ye = xe;
        t = yc;
      }

      t.reverse();
      for (b = a; b--;) t.push(0);
      t.reverse();
    } else {

      // Exponents equal. Check digit by digit.
      j = ((xlty = xc.length < yc.length) ? xc : yc).length;

      for (a = b = 0; b < j; b++) {
        if (xc[b] != yc[b]) {
          xlty = xc[b] < yc[b];
          break;
        }
      }
    }

    // x < y? Point xc to the array of the bigger number.
    if (xlty) {
      t = xc;
      xc = yc;
      yc = t;
      y.s = -y.s;
    }

    /*
     * Append zeros to xc if shorter. No need to add zeros to yc if shorter as subtraction only
     * needs to start at yc.length.
     */
    if ((b = (j = yc.length) - (i = xc.length)) > 0) for (; b--;) xc[i++] = 0;

    // Subtract yc from xc.
    for (b = i; j > a;) {
      if (xc[--j] < yc[j]) {
        for (i = j; i && !xc[--i];) xc[i] = 9;
        --xc[i];
        xc[j] += 10;
      }

      xc[j] -= yc[j];
    }

    // Remove trailing zeros.
    for (; xc[--b] === 0;) xc.pop();

    // Remove leading zeros and adjust exponent accordingly.
    for (; xc[0] === 0;) {
      xc.shift();
      --ye;
    }

    if (!xc[0]) {

      // n - n = +0
      y.s = 1;

      // Result must be zero.
      xc = [ye = 0];
    }

    y.c = xc;
    y.e = ye;

    return y;
  };


  /*
   * Return a new Big whose value is the value of this Big modulo the value of Big y.
   */
  P.mod = function (y) {
    var ygtx,
      x = this,
      Big = x.constructor,
      a = x.s,
      b = (y = new Big(y)).s;

    if (!y.c[0]) {
      throw Error(DIV_BY_ZERO);
    }

    x.s = y.s = 1;
    ygtx = y.cmp(x) == 1;
    x.s = a;
    y.s = b;

    if (ygtx) return new Big(x);

    a = Big.DP;
    b = Big.RM;
    Big.DP = Big.RM = 0;
    x = x.div(y);
    Big.DP = a;
    Big.RM = b;

    return this.minus(x.times(y));
  };
  
  
  /*
   * Return a new Big whose value is the value of this Big negated.
   */
  P.neg = function () {
    var x = new this.constructor(this);
    x.s = -x.s;
    return x;
  };


  /*
   * Return a new Big whose value is the value of this Big plus the value of Big y.
   */
  P.plus = P.add = function (y) {
    var e, k, t,
      x = this,
      Big = x.constructor;

    y = new Big(y);

    // Signs differ?
    if (x.s != y.s) {
      y.s = -y.s;
      return x.minus(y);
    }

    var xe = x.e,
      xc = x.c,
      ye = y.e,
      yc = y.c;

    // Either zero?
    if (!xc[0] || !yc[0]) {
      if (!yc[0]) {
        if (xc[0]) {
          y = new Big(x);
        } else {
          y.s = x.s;
        }
      }
      return y;
    }

    xc = xc.slice();

    // Prepend zeros to equalise exponents.
    // Note: reverse faster than unshifts.
    if (e = xe - ye) {
      if (e > 0) {
        ye = xe;
        t = yc;
      } else {
        e = -e;
        t = xc;
      }

      t.reverse();
      for (; e--;) t.push(0);
      t.reverse();
    }

    // Point xc to the longer array.
    if (xc.length - yc.length < 0) {
      t = yc;
      yc = xc;
      xc = t;
    }

    e = yc.length;

    // Only start adding at yc.length - 1 as the further digits of xc can be left as they are.
    for (k = 0; e; xc[e] %= 10) k = (xc[--e] = xc[e] + yc[e] + k) / 10 | 0;

    // No need to check for zero, as +x + +y != 0 && -x + -y != 0

    if (k) {
      xc.unshift(k);
      ++ye;
    }

    // Remove trailing zeros.
    for (e = xc.length; xc[--e] === 0;) xc.pop();

    y.c = xc;
    y.e = ye;

    return y;
  };


  /*
   * Return a Big whose value is the value of this Big raised to the power n.
   * If n is negative, round to a maximum of Big.DP decimal places using rounding
   * mode Big.RM.
   *
   * n {number} Integer, -MAX_POWER to MAX_POWER inclusive.
   */
  P.pow = function (n) {
    var x = this,
      one = new x.constructor('1'),
      y = one,
      isneg = n < 0;

    if (n !== ~~n || n < -MAX_POWER || n > MAX_POWER) {
      throw Error(INVALID + 'exponent');
    }

    if (isneg) n = -n;

    for (;;) {
      if (n & 1) y = y.times(x);
      n >>= 1;
      if (!n) break;
      x = x.times(x);
    }

    return isneg ? one.div(y) : y;
  };


  /*
   * Return a new Big whose value is the value of this Big rounded to a maximum precision of sd
   * significant digits using rounding mode rm, or Big.RM if rm is not specified.
   *
   * sd {number} Significant digits: integer, 1 to MAX_DP inclusive.
   * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
   */
  P.prec = function (sd, rm) {
    if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
      throw Error(INVALID + 'precision');
    }
    return round(new this.constructor(this), sd, rm);
  };


  /*
   * Return a new Big whose value is the value of this Big rounded to a maximum of dp decimal places
   * using rounding mode rm, or Big.RM if rm is not specified.
   * If dp is negative, round to an integer which is a multiple of 10**-dp.
   * If dp is not specified, round to 0 decimal places.
   *
   * dp? {number} Integer, -MAX_DP to MAX_DP inclusive.
   * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
   */
  P.round = function (dp, rm) {
    if (dp === UNDEFINED) dp = 0;
    else if (dp !== ~~dp || dp < -MAX_DP || dp > MAX_DP) {
      throw Error(INVALID_DP);
    }
    return round(new this.constructor(this), dp + this.e + 1, rm);
  };


  /*
   * Return a new Big whose value is the square root of the value of this Big, rounded, if
   * necessary, to a maximum of Big.DP decimal places using rounding mode Big.RM.
   */
  P.sqrt = function () {
    var r, c, t,
      x = this,
      Big = x.constructor,
      s = x.s,
      e = x.e,
      half = new Big('0.5');

    // Zero?
    if (!x.c[0]) return new Big(x);

    // Negative?
    if (s < 0) {
      throw Error(NAME + 'No square root');
    }

    // Estimate.
    s = Math.sqrt(x + '');

    // Math.sqrt underflow/overflow?
    // Re-estimate: pass x coefficient to Math.sqrt as integer, then adjust the result exponent.
    if (s === 0 || s === 1 / 0) {
      c = x.c.join('');
      if (!(c.length + e & 1)) c += '0';
      s = Math.sqrt(c);
      e = ((e + 1) / 2 | 0) - (e < 0 || e & 1);
      r = new Big((s == 1 / 0 ? '5e' : (s = s.toExponential()).slice(0, s.indexOf('e') + 1)) + e);
    } else {
      r = new Big(s + '');
    }

    e = r.e + (Big.DP += 4);

    // Newton-Raphson iteration.
    do {
      t = r;
      r = half.times(t.plus(x.div(t)));
    } while (t.c.slice(0, e).join('') !== r.c.slice(0, e).join(''));

    return round(r, (Big.DP -= 4) + r.e + 1, Big.RM);
  };


  /*
   * Return a new Big whose value is the value of this Big times the value of Big y.
   */
  P.times = P.mul = function (y) {
    var c,
      x = this,
      Big = x.constructor,
      xc = x.c,
      yc = (y = new Big(y)).c,
      a = xc.length,
      b = yc.length,
      i = x.e,
      j = y.e;

    // Determine sign of result.
    y.s = x.s == y.s ? 1 : -1;

    // Return signed 0 if either 0.
    if (!xc[0] || !yc[0]) {
      y.c = [y.e = 0];
      return y;
    }

    // Initialise exponent of result as x.e + y.e.
    y.e = i + j;

    // If array xc has fewer digits than yc, swap xc and yc, and lengths.
    if (a < b) {
      c = xc;
      xc = yc;
      yc = c;
      j = a;
      a = b;
      b = j;
    }

    // Initialise coefficient array of result with zeros.
    for (c = new Array(j = a + b); j--;) c[j] = 0;

    // Multiply.

    // i is initially xc.length.
    for (i = b; i--;) {
      b = 0;

      // a is yc.length.
      for (j = a + i; j > i;) {

        // Current sum of products at this digit position, plus carry.
        b = c[j] + yc[i] * xc[j - i - 1] + b;
        c[j--] = b % 10;

        // carry
        b = b / 10 | 0;
      }

      c[j] = b;
    }

    // Increment result exponent if there is a final carry, otherwise remove leading zero.
    if (b) ++y.e;
    else c.shift();

    // Remove trailing zeros.
    for (i = c.length; !c[--i];) c.pop();
    y.c = c;

    return y;
  };


  /*
   * Return a string representing the value of this Big in exponential notation rounded to dp fixed
   * decimal places using rounding mode rm, or Big.RM if rm is not specified.
   *
   * dp? {number} Decimal places: integer, 0 to MAX_DP inclusive.
   * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
   */
  P.toExponential = function (dp, rm) {
    var x = this,
      n = x.c[0];

    if (dp !== UNDEFINED) {
      if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
        throw Error(INVALID_DP);
      }
      x = round(new x.constructor(x), ++dp, rm);
      for (; x.c.length < dp;) x.c.push(0);
    }

    return stringify(x, true, !!n);
  };


  /*
   * Return a string representing the value of this Big in normal notation rounded to dp fixed
   * decimal places using rounding mode rm, or Big.RM if rm is not specified.
   *
   * dp? {number} Decimal places: integer, 0 to MAX_DP inclusive.
   * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
   *
   * (-0).toFixed(0) is '0', but (-0.1).toFixed(0) is '-0'.
   * (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
   */
  P.toFixed = function (dp, rm) {
    var x = this,
      n = x.c[0];

    if (dp !== UNDEFINED) {
      if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
        throw Error(INVALID_DP);
      }
      x = round(new x.constructor(x), dp + x.e + 1, rm);

      // x.e may have changed if the value is rounded up.
      for (dp = dp + x.e + 1; x.c.length < dp;) x.c.push(0);
    }

    return stringify(x, false, !!n);
  };


  /*
   * Return a string representing the value of this Big.
   * Return exponential notation if this Big has a positive exponent equal to or greater than
   * Big.PE, or a negative exponent equal to or less than Big.NE.
   * Omit the sign for negative zero.
   */
  P.toJSON = P.toString = function () {
    var x = this,
      Big = x.constructor;
    return stringify(x, x.e <= Big.NE || x.e >= Big.PE, !!x.c[0]);
  };


  /*
   * Return the value of this Big as a primitve number.
   */
  P.toNumber = function () {
    var n = Number(stringify(this, true, true));
    if (this.constructor.strict === true && !this.eq(n.toString())) {
      throw Error(NAME + 'Imprecise conversion');
    }
    return n;
  };


  /*
   * Return a string representing the value of this Big rounded to sd significant digits using
   * rounding mode rm, or Big.RM if rm is not specified.
   * Use exponential notation if sd is less than the number of digits necessary to represent
   * the integer part of the value in normal notation.
   *
   * sd {number} Significant digits: integer, 1 to MAX_DP inclusive.
   * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
   */
  P.toPrecision = function (sd, rm) {
    var x = this,
      Big = x.constructor,
      n = x.c[0];

    if (sd !== UNDEFINED) {
      if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
        throw Error(INVALID + 'precision');
      }
      x = round(new Big(x), sd, rm);
      for (; x.c.length < sd;) x.c.push(0);
    }

    return stringify(x, sd <= x.e || x.e <= Big.NE || x.e >= Big.PE, !!n);
  };


  /*
   * Return a string representing the value of this Big.
   * Return exponential notation if this Big has a positive exponent equal to or greater than
   * Big.PE, or a negative exponent equal to or less than Big.NE.
   * Include the sign for negative zero.
   */
  P.valueOf = function () {
    var x = this,
      Big = x.constructor;
    if (Big.strict === true) {
      throw Error(NAME + 'valueOf disallowed');
    }
    return stringify(x, x.e <= Big.NE || x.e >= Big.PE, true);
  };


  // Export


  Big = _Big_();

  Big['default'] = Big.Big = Big;

  //AMD.
  if (typeof define === 'function' && define.amd) {
    define(function () { return Big; });

  // Node and other CommonJS-like environments that support module.exports.
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Big;

  //Browser.
  } else {
    GLOBAL.Big = Big;
  }
})(this);

},{}],87:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = newDateUTC;

/**
 * Use instead of `new Date(Date.UTC(...))` to support years below 100 which doesn't work
 * otherwise due to the nature of the
 * [`Date` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#interpretation_of_two-digit_years.
 *
 * For `Date.UTC(...)`, use `newDateUTC(...).getTime()`.
 */
function newDateUTC(fullYear, month, day, hour, minute, second, millisecond) {
  var utcDate = new Date(0);
  utcDate.setUTCFullYear(fullYear, month, day);
  utcDate.setUTCHours(hour, minute, second, millisecond);
  return utcDate;
}

module.exports = exports.default;
},{}],88:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = tzParseTimezone;

var _index = _interopRequireDefault(require("../tzTokenizeDate/index.js"));

var _index2 = _interopRequireDefault(require("../newDateUTC/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MILLISECONDS_IN_HOUR = 3600000;
var MILLISECONDS_IN_MINUTE = 60000;
var patterns = {
  timezone: /([Z+-].*)$/,
  timezoneZ: /^(Z)$/,
  timezoneHH: /^([+-]\d{2})$/,
  timezoneHHMM: /^([+-])(\d{2}):?(\d{2})$/
}; // Parse various time zone offset formats to an offset in milliseconds

function tzParseTimezone(timezoneString, date, isUtcDate) {
  var token;
  var absoluteOffset; // Empty string

  if (!timezoneString) {
    return 0;
  } // Z


  token = patterns.timezoneZ.exec(timezoneString);

  if (token) {
    return 0;
  }

  var hours; // ±hh

  token = patterns.timezoneHH.exec(timezoneString);

  if (token) {
    hours = parseInt(token[1], 10);

    if (!validateTimezone(hours)) {
      return NaN;
    }

    return -(hours * MILLISECONDS_IN_HOUR);
  } // ±hh:mm or ±hhmm


  token = patterns.timezoneHHMM.exec(timezoneString);

  if (token) {
    hours = parseInt(token[2], 10);
    var minutes = parseInt(token[3], 10);

    if (!validateTimezone(hours, minutes)) {
      return NaN;
    }

    absoluteOffset = Math.abs(hours) * MILLISECONDS_IN_HOUR + minutes * MILLISECONDS_IN_MINUTE;
    return token[1] === '+' ? -absoluteOffset : absoluteOffset;
  } // IANA time zone


  if (isValidTimezoneIANAString(timezoneString)) {
    date = new Date(date || Date.now());
    var utcDate = isUtcDate ? date : toUtcDate(date);
    var offset = calcOffset(utcDate, timezoneString);
    var fixedOffset = isUtcDate ? offset : fixOffset(date, offset, timezoneString);
    return -fixedOffset;
  }

  return NaN;
}

function toUtcDate(date) {
  return (0, _index2.default)(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
}

function calcOffset(date, timezoneString) {
  var tokens = (0, _index.default)(date, timezoneString); // ms dropped because it's not provided by tzTokenizeDate

  var asUTC = (0, _index2.default)(tokens[0], tokens[1] - 1, tokens[2], tokens[3] % 24, tokens[4], tokens[5], 0).getTime();
  var asTS = date.getTime();
  var over = asTS % 1000;
  asTS -= over >= 0 ? over : 1000 + over;
  return asUTC - asTS;
}

function fixOffset(date, offset, timezoneString) {
  var localTS = date.getTime(); // Our UTC time is just a guess because our offset is just a guess

  var utcGuess = localTS - offset; // Test whether the zone matches the offset for this ts

  var o2 = calcOffset(new Date(utcGuess), timezoneString); // If so, offset didn't change, and we're done

  if (offset === o2) {
    return offset;
  } // If not, change the ts by the difference in the offset


  utcGuess -= o2 - offset; // If that gives us the local time we want, we're done

  var o3 = calcOffset(new Date(utcGuess), timezoneString);

  if (o2 === o3) {
    return o2;
  } // If it's different, we're in a hole time. The offset has changed, but we don't adjust the time


  return Math.max(o2, o3);
}

function validateTimezone(hours, minutes) {
  return -23 <= hours && hours <= 23 && (minutes == null || 0 <= minutes && minutes <= 59);
}

var validIANATimezoneCache = {};

function isValidTimezoneIANAString(timeZoneString) {
  if (validIANATimezoneCache[timeZoneString]) return true;

  try {
    new Intl.DateTimeFormat(undefined, {
      timeZone: timeZoneString
    });
    validIANATimezoneCache[timeZoneString] = true;
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = exports.default;
},{"../newDateUTC/index.js":87,"../tzTokenizeDate/index.js":89}],89:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = tzTokenizeDate;

/**
 * Returns the [year, month, day, hour, minute, seconds] tokens of the provided
 * `date` as it will be rendered in the `timeZone`.
 */
function tzTokenizeDate(date, timeZone) {
  var dtf = getDateTimeFormat(timeZone);
  return dtf.formatToParts ? partsOffset(dtf, date) : hackyOffset(dtf, date);
}

var typeToPos = {
  year: 0,
  month: 1,
  day: 2,
  hour: 3,
  minute: 4,
  second: 5
};

function partsOffset(dtf, date) {
  try {
    var formatted = dtf.formatToParts(date);
    var filled = [];

    for (var i = 0; i < formatted.length; i++) {
      var pos = typeToPos[formatted[i].type];

      if (pos >= 0) {
        filled[pos] = parseInt(formatted[i].value, 10);
      }
    }

    return filled;
  } catch (error) {
    if (error instanceof RangeError) {
      return [NaN];
    }

    throw error;
  }
}

function hackyOffset(dtf, date) {
  var formatted = dtf.format(date);
  var parsed = /(\d+)\/(\d+)\/(\d+),? (\d+):(\d+):(\d+)/.exec(formatted); // var [, fMonth, fDay, fYear, fHour, fMinute, fSecond] = parsed
  // return [fYear, fMonth, fDay, fHour, fMinute, fSecond]

  return [parsed[3], parsed[1], parsed[2], parsed[4], parsed[5], parsed[6]];
} // Get a cached Intl.DateTimeFormat instance for the IANA `timeZone`. This can be used
// to get deterministic local date/time output according to the `en-US` locale which
// can be used to extract local time parts as necessary.


var dtfCache = {};

function getDateTimeFormat(timeZone) {
  if (!dtfCache[timeZone]) {
    // New browsers use `hourCycle`, IE and Chrome <73 does not support it and uses `hour12`
    var testDateFormatted = new Intl.DateTimeFormat('en-US', {
      hourCycle: 'h23',
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date('2014-06-25T04:00:00.123Z'));
    var hourCycleSupported = testDateFormatted === '06/25/2014, 00:00:00' || testDateFormatted === '‎06‎/‎25‎/‎2014‎ ‎00‎:‎00‎:‎00';
    dtfCache[timeZone] = hourCycleSupported ? new Intl.DateTimeFormat('en-US', {
      hourCycle: 'h23',
      timeZone: timeZone,
      year: 'numeric',
      month: 'numeric',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) : new Intl.DateTimeFormat('en-US', {
      hour12: false,
      timeZone: timeZone,
      year: 'numeric',
      month: 'numeric',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  return dtfCache[timeZone];
}

module.exports = exports.default;
},{}],90:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getTimezoneOffset;

var _index = _interopRequireDefault(require("../_lib/tzParseTimezone/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @name getTimezoneOffset
 * @category Time Zone Helpers
 * @summary Gets the offset in milliseconds between the time zone and Universal Coordinated Time (UTC)
 *
 * @description
 * Returns the time zone offset from UTC time in milliseconds for IANA time zones as well
 * as other time zone offset string formats.
 *
 * For time zones where daylight savings time is applicable a `Date` should be passed on
 * the second parameter to ensure the offset correctly accounts for DST at that time of
 * year. When omitted, the current date is used.
 *
 * @param {String} timeZone - the time zone of this local time, can be an offset or IANA time zone
 * @param {Date|Number} [date] - the date with values representing the local time
 * @returns {Number} the time zone offset in milliseconds
 *
 * @example
 * const result = getTimezoneOffset('-07:00')
 *   //=> -18000000 (-7 * 60 * 60 * 1000)
 * const result = getTimezoneOffset('Africa/Johannesburg')
 *   //=> 7200000 (2 * 60 * 60 * 1000)
 * const result = getTimezoneOffset('America/New_York', new Date(2016, 0, 1))
 *   //=> -18000000 (-5 * 60 * 60 * 1000)
 * const result = getTimezoneOffset('America/New_York', new Date(2016, 6, 1))
 *   //=> -14400000 (-4 * 60 * 60 * 1000)
 */
function getTimezoneOffset(timeZone, date) {
  return -(0, _index.default)(timeZone, date);
}

module.exports = exports.default;
},{"../_lib/tzParseTimezone/index.js":88}],91:[function(require,module,exports){
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
