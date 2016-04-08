(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("aws-sdk"), (function webpackLoadOptionalExternalModule() { try { return require("crypto"); } catch(e) {} }()));
	else if(typeof define === 'function' && define.amd)
		define(["aws-sdk", "crypto"], factory);
	else if(typeof exports === 'object')
		exports["luno"] = factory(require("aws-sdk"), (function webpackLoadOptionalExternalModule() { try { return require("crypto"); } catch(e) {} }()));
	else
		root["luno"] = factory(root["aws-sdk"], root["crypto"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_7__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.db = undefined;
	
	var _db2 = __webpack_require__(1);
	
	var _db = _interopRequireWildcard(_db2);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	exports.db = _db;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.answer = exports.bot = exports.user = exports.team = exports.client = undefined;
	
	var _client2 = __webpack_require__(2);
	
	var _client = _interopRequireWildcard(_client2);
	
	var _team2 = __webpack_require__(4);
	
	var _team = _interopRequireWildcard(_team2);
	
	var _user2 = __webpack_require__(5);
	
	var _user = _interopRequireWildcard(_user2);
	
	var _bot2 = __webpack_require__(8);
	
	var _bot = _interopRequireWildcard(_bot2);
	
	var _answer2 = __webpack_require__(9);
	
	var _answer = _interopRequireWildcard(_answer2);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	exports.client = _client;
	exports.team = _team;
	exports.user = _user;
	exports.bot = _bot;
	exports.answer = _answer;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.resolveTableName = resolveTableName;
	exports.fromDB = fromDB;
	var config = {
	  region: process.env.AWS_REGION
	};
	
	/**
	 * Return a table name for the model based on env variables.
	 *
	 * @param {String} model model name
	 * @return {String} resolved table name
	 */
	function resolveTableName(model) {
	  var _process = process;
	  var STAGE = _process.env.STAGE;
	
	  return STAGE + '-' + model;
	}
	
	/**
	 * Return a model type with the values from the db.
	 *
	 * @param {Type} Model type of model
	 * @param {Object} data data to copy to the model
	 * @return {Object} returns the inflated model
	 */
	function fromDB(Model, data) {
	  var model = new Model();
	  return Object.assign({}, model, data);
	}
	
	exports.default = function () {
	  var AWS = __webpack_require__(3);
	  var DocumentClient = AWS.DynamoDB.DocumentClient;
	  return new DocumentClient(config);
	}();

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Team = undefined;
	exports.createTeam = createTeam;
	exports.getTeam = getTeam;
	
	var _client = __webpack_require__(2);
	
	var _client2 = _interopRequireDefault(_client);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var table = (0, _client.resolveTableName)('team');
	
	var Team = exports.Team = function (_Object) {
	  _inherits(Team, _Object);
	
	  function Team() {
	    _classCallCheck(this, Team);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Team).apply(this, arguments));
	  }
	
	  return Team;
	}(Object);
	
	;
	
	function createTeam(team) {
	  return new Promise(function (resolve, reject) {
	    var params = {
	      TableName: table,
	      Item: team
	    };
	
	    _client2.default.put(params, function (err, data) {
	      if (err) return reject(err);
	      return resolve(team);
	    });
	  });
	}
	
	function getTeam(id) {
	  return new Promise(function (resolve, reject) {
	    var params = {
	      TableName: table,
	      Key: { id: id }
	    };
	
	    _client2.default.get(params, function (err, data) {
	      if (err) return reject(err);
	      var team = (0, _client.fromDB)(Team, data.Item);
	      return resolve(team);
	    });
	  });
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.User = undefined;
	exports.createUser = createUser;
	exports.getUser = getUser;
	exports.getUsers = getUsers;
	
	var _nodeUuid = __webpack_require__(6);
	
	var _nodeUuid2 = _interopRequireDefault(_nodeUuid);
	
	var _client = __webpack_require__(2);
	
	var _client2 = _interopRequireDefault(_client);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var table = (0, _client.resolveTableName)('user');
	
	var User = exports.User = function (_Object) {
	  _inherits(User, _Object);
	
	  function User() {
	    _classCallCheck(this, User);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(User).apply(this, arguments));
	  }
	
	  return User;
	}(Object);
	
	;
	
	function createUser(user) {
	  return new Promise(function (resolve, reject) {
	    user.id = _nodeUuid2.default.v4();
	    var params = {
	      TableName: table,
	      Item: user
	    };
	
	    _client2.default.put(params, function (err, data) {
	      if (err) return reject(err);
	      return resolve(user);
	    });
	  });
	}
	
	function getUser(teamId, id) {
	  return new Promise(function (resolve, reject) {
	    var params = {
	      TableName: table,
	      Key: { id: id, teamId: teamId }
	    };
	
	    _client2.default.get(params, function (err, data) {
	      if (err) return reject(err);
	      var user = (0, _client.fromDB)(User, data.Item);
	      return resolve(user);
	    });
	  });
	}
	
	function getUsers(teamId) {
	  return new Promise(function (resolve, reject) {
	    var params = {
	      TableName: table,
	      KeyConditionExpression: 'HashKey = :hkey',
	      ExpressionAttributeValues: {
	        ':hkey': teamId
	      }
	    };
	
	    _client2.default.query(params, function (err, data) {
	      if (err) return reject(err);
	      return data.Items.map(function (item) {
	        return (0, _client.fromDB)(User, item);
	      });
	    });
	  });
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;//     uuid.js
	//
	//     Copyright (c) 2010-2012 Robert Kieffer
	//     MIT License - http://opensource.org/licenses/mit-license.php
	
	/*global window, require, define */
	(function(_window) {
	  'use strict';
	
	  // Unique ID creation requires a high quality random # generator.  We feature
	  // detect to determine the best RNG source, normalizing to a function that
	  // returns 128-bits of randomness, since that's what's usually required
	  var _rng, _mathRNG, _nodeRNG, _whatwgRNG, _previousRoot;
	
	  function setupBrowser() {
	    // Allow for MSIE11 msCrypto
	    var _crypto = _window.crypto || _window.msCrypto;
	
	    if (!_rng && _crypto && _crypto.getRandomValues) {
	      // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
	      //
	      // Moderately fast, high quality
	      try {
	        var _rnds8 = new Uint8Array(16);
	        _whatwgRNG = _rng = function whatwgRNG() {
	          _crypto.getRandomValues(_rnds8);
	          return _rnds8;
	        };
	        _rng();
	      } catch(e) {}
	    }
	
	    if (!_rng) {
	      // Math.random()-based (RNG)
	      //
	      // If all else fails, use Math.random().  It's fast, but is of unspecified
	      // quality.
	      var  _rnds = new Array(16);
	      _mathRNG = _rng = function() {
	        for (var i = 0, r; i < 16; i++) {
	          if ((i & 0x03) === 0) { r = Math.random() * 0x100000000; }
	          _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
	        }
	
	        return _rnds;
	      };
	      if ('undefined' !== typeof console && console.warn) {
	        console.warn("[SECURITY] node-uuid: crypto not usable, falling back to insecure Math.random()");
	      }
	    }
	  }
	
	  function setupNode() {
	    // Node.js crypto-based RNG - http://nodejs.org/docs/v0.6.2/api/crypto.html
	    //
	    // Moderately fast, high quality
	    if (true) {
	      try {
	        var _rb = __webpack_require__(7).randomBytes;
	        _nodeRNG = _rng = _rb && function() {return _rb(16);};
	        _rng();
	      } catch(e) {}
	    }
	  }
	
	  if (_window) {
	    setupBrowser();
	  } else {
	    setupNode();
	  }
	
	  // Buffer class to use
	  var BufferClass = ('function' === typeof Buffer) ? Buffer : Array;
	
	  // Maps for number <-> hex string conversion
	  var _byteToHex = [];
	  var _hexToByte = {};
	  for (var i = 0; i < 256; i++) {
	    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
	    _hexToByte[_byteToHex[i]] = i;
	  }
	
	  // **`parse()` - Parse a UUID into it's component bytes**
	  function parse(s, buf, offset) {
	    var i = (buf && offset) || 0, ii = 0;
	
	    buf = buf || [];
	    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
	      if (ii < 16) { // Don't overflow!
	        buf[i + ii++] = _hexToByte[oct];
	      }
	    });
	
	    // Zero out remaining bytes if string was short
	    while (ii < 16) {
	      buf[i + ii++] = 0;
	    }
	
	    return buf;
	  }
	
	  // **`unparse()` - Convert UUID byte array (ala parse()) into a string**
	  function unparse(buf, offset) {
	    var i = offset || 0, bth = _byteToHex;
	    return  bth[buf[i++]] + bth[buf[i++]] +
	            bth[buf[i++]] + bth[buf[i++]] + '-' +
	            bth[buf[i++]] + bth[buf[i++]] + '-' +
	            bth[buf[i++]] + bth[buf[i++]] + '-' +
	            bth[buf[i++]] + bth[buf[i++]] + '-' +
	            bth[buf[i++]] + bth[buf[i++]] +
	            bth[buf[i++]] + bth[buf[i++]] +
	            bth[buf[i++]] + bth[buf[i++]];
	  }
	
	  // **`v1()` - Generate time-based UUID**
	  //
	  // Inspired by https://github.com/LiosK/UUID.js
	  // and http://docs.python.org/library/uuid.html
	
	  // random #'s we need to init node and clockseq
	  var _seedBytes = _rng();
	
	  // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
	  var _nodeId = [
	    _seedBytes[0] | 0x01,
	    _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
	  ];
	
	  // Per 4.2.2, randomize (14 bit) clockseq
	  var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;
	
	  // Previous uuid creation time
	  var _lastMSecs = 0, _lastNSecs = 0;
	
	  // See https://github.com/broofa/node-uuid for API details
	  function v1(options, buf, offset) {
	    var i = buf && offset || 0;
	    var b = buf || [];
	
	    options = options || {};
	
	    var clockseq = (options.clockseq != null) ? options.clockseq : _clockseq;
	
	    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
	    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
	    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
	    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
	    var msecs = (options.msecs != null) ? options.msecs : new Date().getTime();
	
	    // Per 4.2.1.2, use count of uuid's generated during the current clock
	    // cycle to simulate higher resolution clock
	    var nsecs = (options.nsecs != null) ? options.nsecs : _lastNSecs + 1;
	
	    // Time since last uuid creation (in msecs)
	    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;
	
	    // Per 4.2.1.2, Bump clockseq on clock regression
	    if (dt < 0 && options.clockseq == null) {
	      clockseq = clockseq + 1 & 0x3fff;
	    }
	
	    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
	    // time interval
	    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs == null) {
	      nsecs = 0;
	    }
	
	    // Per 4.2.1.2 Throw error if too many uuids are requested
	    if (nsecs >= 10000) {
	      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
	    }
	
	    _lastMSecs = msecs;
	    _lastNSecs = nsecs;
	    _clockseq = clockseq;
	
	    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
	    msecs += 12219292800000;
	
	    // `time_low`
	    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
	    b[i++] = tl >>> 24 & 0xff;
	    b[i++] = tl >>> 16 & 0xff;
	    b[i++] = tl >>> 8 & 0xff;
	    b[i++] = tl & 0xff;
	
	    // `time_mid`
	    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
	    b[i++] = tmh >>> 8 & 0xff;
	    b[i++] = tmh & 0xff;
	
	    // `time_high_and_version`
	    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
	    b[i++] = tmh >>> 16 & 0xff;
	
	    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
	    b[i++] = clockseq >>> 8 | 0x80;
	
	    // `clock_seq_low`
	    b[i++] = clockseq & 0xff;
	
	    // `node`
	    var node = options.node || _nodeId;
	    for (var n = 0; n < 6; n++) {
	      b[i + n] = node[n];
	    }
	
	    return buf ? buf : unparse(b);
	  }
	
	  // **`v4()` - Generate random UUID**
	
	  // See https://github.com/broofa/node-uuid for API details
	  function v4(options, buf, offset) {
	    // Deprecated - 'format' argument, as supported in v1.2
	    var i = buf && offset || 0;
	
	    if (typeof(options) === 'string') {
	      buf = (options === 'binary') ? new BufferClass(16) : null;
	      options = null;
	    }
	    options = options || {};
	
	    var rnds = options.random || (options.rng || _rng)();
	
	    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
	    rnds[6] = (rnds[6] & 0x0f) | 0x40;
	    rnds[8] = (rnds[8] & 0x3f) | 0x80;
	
	    // Copy bytes to buffer, if provided
	    if (buf) {
	      for (var ii = 0; ii < 16; ii++) {
	        buf[i + ii] = rnds[ii];
	      }
	    }
	
	    return buf || unparse(rnds);
	  }
	
	  // Export public API
	  var uuid = v4;
	  uuid.v1 = v1;
	  uuid.v4 = v4;
	  uuid.parse = parse;
	  uuid.unparse = unparse;
	  uuid.BufferClass = BufferClass;
	  uuid._rng = _rng;
	  uuid._mathRNG = _mathRNG;
	  uuid._nodeRNG = _nodeRNG;
	  uuid._whatwgRNG = _whatwgRNG;
	
	  if (('undefined' !== typeof module) && module.exports) {
	    // Publish as node.js module
	    module.exports = uuid;
	  } else if (true) {
	    // Publish as AMD module
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {return uuid;}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	
	
	  } else {
	    // Publish as global (in browsers)
	    _previousRoot = _window.uuid;
	
	    // **`noConflict()` - (browser only) to reset global 'uuid' var**
	    uuid.noConflict = function() {
	      _window.uuid = _previousRoot;
	      return uuid;
	    };
	
	    _window.uuid = uuid;
	  }
	})('undefined' !== typeof window ? window : null);


/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Bot = exports.uuid = undefined;
	exports.createBot = createBot;
	exports.getBot = getBot;
	exports.getBots = getBots;
	
	var _nodeUuid = __webpack_require__(6);
	
	var _nodeUuid2 = _interopRequireDefault(_nodeUuid);
	
	var _client = __webpack_require__(2);
	
	var _client2 = _interopRequireDefault(_client);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	exports.uuid = _nodeUuid2.default;
	
	var Bot = exports.Bot = function (_Object) {
	  _inherits(Bot, _Object);
	
	  function Bot() {
	    _classCallCheck(this, Bot);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Bot).apply(this, arguments));
	  }
	
	  return Bot;
	}(Object);
	
	;
	
	function createBot(bot) {
	  return new Promise(function (resolve, reject) {
	    bot.id = uuid.v4();
	    var params = {
	      TableName: table,
	      Item: bot
	    };
	
	    _client2.default.put(params, function (err, data) {
	      if (err) return reject(err);
	      return resolve(bot);
	    });
	  });
	}
	
	function getBot(teamId, id) {
	  return new Promise(function (resolve, reject) {
	    var params = {
	      TableName: table,
	      Key: { teamId: teamId, id: id }
	    };
	
	    _client2.default.get(params, function (err, data) {
	      if (err) return reject(err);
	      var bot = (0, _client.fromDB)(Bot, data.Item);
	      return resolve(bot);
	    });
	  });
	}
	
	function getBots(teamId) {
	  return new Promise(function (resolve, reject) {
	    var params = {
	      TableName: table,
	      KeyConditionExpression: 'HashKey = :hkey',
	      ExpressionAttributeValues: {
	        ':hkey': teamId
	      }
	    };
	
	    _client2.default.query(params, function (err, data) {
	      if (err) return reject(err);
	      return data.Items.map(function (item) {
	        return (0, _client.fromDB)(Bot, item);
	      });
	    });
	  });
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Answer = undefined;
	exports.createAnswer = createAnswer;
	exports.getAnswer = getAnswer;
	exports.getAnswers = getAnswers;
	
	var _nodeUuid = __webpack_require__(6);
	
	var _nodeUuid2 = _interopRequireDefault(_nodeUuid);
	
	var _client = __webpack_require__(2);
	
	var _client2 = _interopRequireDefault(_client);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var table = (0, _client.resolveTableName)('answer');
	
	var Answer = exports.Answer = function (_Object) {
	  _inherits(Answer, _Object);
	
	  function Answer() {
	    _classCallCheck(this, Answer);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Answer).apply(this, arguments));
	  }
	
	  return Answer;
	}(Object);
	
	;
	
	function getCompositeId(teamId, botId) {
	  return teamId + '=' + botId;
	}
	
	function createAnswer(answer) {
	  return new Promise(function (resolve, reject) {
	    answer.id = _nodeUuid2.default.v4();
	    var params = {
	      TableName: table,
	      Item: user
	    };
	
	    _client2.default.put(params, function (err, data) {
	      if (err) return reject(err);
	      return resovle(answer);
	    });
	  });
	}
	
	function getAnswer(teamId, botId, id) {
	  var compositeId = getCompositeId(teamId, botId);
	  return new Promise(function (resolve, reject) {
	    var params = {
	      TableName: table,
	      Key: { id: id, compositeId: compositeId }
	    };
	
	    _client2.default.get(params, function (err, data) {
	      if (err) return reject(err);
	      var answer = (0, _client.fromDB)(Answer, data.Item);
	      return resolve(answer);
	    });
	  });
	}
	
	function getAnswers(teamId, botId) {
	  var compositeId = getCompositeId(teamId, botId);
	  return new Promise(function (resolve, reject) {
	    var params = {
	      TableName: table,
	      KeyConditionExpression: 'HashKey = :hkey',
	      ExpressionAttributeValues: {
	        ':hkey': compositeId
	      }
	    };
	
	    _client2.default.query(params, function (err, data) {
	      if (err) return reject(err);
	      return data.Items.map(function (item) {
	        return (0, _client.fromDB)(Answer, item);
	      });
	    });
	  });
	}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=index.js.map