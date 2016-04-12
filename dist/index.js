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
	exports.botkit = exports.db = undefined;
	
	var _db2 = __webpack_require__(1);
	
	var _db = _interopRequireWildcard(_db2);
	
	var _botkit2 = __webpack_require__(11);
	
	var _botkit = _interopRequireWildcard(_botkit2);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	exports.db = _db;
	exports.botkit = _botkit;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.token = exports.answer = exports.bot = exports.user = exports.team = exports.client = undefined;
	
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
	
	var _token2 = __webpack_require__(10);
	
	var _token = _interopRequireWildcard(_token2);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	exports.client = _client;
	exports.team = _team;
	exports.user = _user;
	exports.bot = _bot;
	exports.answer = _answer;
	exports.token = _token;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.resolveTableName = resolveTableName;
	exports.fromDB = fromDB;
	exports.compositeId = compositeId;
	exports.deconstructId = deconstructId;
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
	  return Object.assign(model, data);
	}
	
	/**
	 * Helper for returning a composite key in our standard format.
	 *
	 * @param {Array[String]} parts composite id parts
	 * @return {String} returns the composite id
	 */
	function compositeId() {
	  for (var _len = arguments.length, parts = Array(_len), _key = 0; _key < _len; _key++) {
	    parts[_key] = arguments[_key];
	  }
	
	  return parts.join('_');
	}
	
	/**
	 * Helper for deconstructing a composite key in our standard foramt.
	 *
	 * @param {String} id composite id
	 * @return {Array[String]} composite id parts
	 */
	function deconstructId(id) {
	  return id.split('_');
	}
	
	exports.default = function () {
	  var AWS = __webpack_require__(3);
	  var DocumentClient = AWS.DynamoDB.DocumentClient;
	  return new DocumentClient();
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
	exports.getTeam = getTeam;
	exports.updateTeam = updateTeam;
	exports.getTeams = getTeams;
	
	var _client = __webpack_require__(2);
	
	var _client2 = _interopRequireDefault(_client);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var table = (0, _client.resolveTableName)('team-v1');
	
	var Team = exports.Team = function Team() {
	  _classCallCheck(this, Team);
	};
	
	;
	
	function getTeam(id) {
	  var params = {
	    TableName: table,
	    Key: { id: id }
	  };
	
	  return new Promise(function (resolve, reject) {
	    _client2.default.get(params, function (err, data) {
	      if (err) return reject(err);
	
	      var team = void 0;
	      if (data.Item) {
	        team = (0, _client.fromDB)(Team, data.Item);
	      }
	
	      return resolve(team);
	    });
	  });
	}
	
	function updateTeam(team) {
	
	  // normalize to camel case
	  team.bot.userId = team.bot.user_id;
	  delete team.bot.user_id;
	
	  var now = new Date().toISOString();
	  var params = {
	    TableName: table,
	    Key: { id: team.id },
	    UpdateExpression: '\n      SET\n        #createdBy = if_not_exists(createdBy, :createdBy),\n        #name = :name,\n        #slack = :slack,\n        #created = if_not_exists(#created, :created),\n        #changed = :changed\n    ',
	    ExpressionAttributeNames: {
	      '#createdBy': 'createdBy',
	      '#name': 'name',
	      '#slack': 'slack',
	      '#created': 'created',
	      '#changed': 'changed'
	    },
	    ExpressionAttributeValues: {
	      ':createdBy': team.createdBy,
	      ':name': team.name,
	      ':slack': {
	        bot: team.bot,
	        url: team.url,
	        token: team.token
	      },
	      ':created': now,
	      ':changed': now
	    },
	    ReturnValues: 'ALL_NEW'
	  };
	
	  return new Promise(function (resolve, reject) {
	    _client2.default.update(params, function (err, data) {
	      if (err) return reject(err);
	      var team = (0, _client.fromDB)(Team, data.Attributes);
	      return resolve(team);
	    });
	  });
	}
	
	function getTeams() {
	  var params = {
	    TableName: table
	  };
	  return new Promise(function (resolve, reject) {
	    _client2.default.query(params, function (err, data) {
	      if (err) return reject(err);
	      return resolve(data.Items.map(function (item) {
	        return (0, _client.fromDB)(Team, item);
	      }));
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
	exports.getUser = getUser;
	exports.updateUser = updateUser;
	
	var _nodeUuid = __webpack_require__(6);
	
	var _nodeUuid2 = _interopRequireDefault(_nodeUuid);
	
	var _client = __webpack_require__(2);
	
	var _client2 = _interopRequireDefault(_client);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var table = (0, _client.resolveTableName)('user-v1');
	
	var User = exports.User = function User() {
	  _classCallCheck(this, User);
	};
	
	;
	
	function getUser(id) {
	  return new Promise(function (resolve, reject) {
	    var params = {
	      TableName: table,
	      Key: { id: id }
	    };
	
	    _client2.default.get(params, function (err, data) {
	      if (err) return reject(err);
	
	      var user = void 0;
	      if (data.Item) {
	        user = (0, _client.fromDB)(User, data.Item);
	      }
	
	      return resolve(user);
	    });
	  });
	}
	
	function updateUser(user) {
	  var now = new Date().toISOString();
	  var params = {
	    TableName: table,
	    Key: { id: user.id },
	    UpdateExpression: '\n      SET\n        #accessToken = :accessToken,\n        #scopes = :scopes,\n        #teamId = :teamId,\n        #user = :user,\n        #created = if_not_exists(#created, :created),\n        #changed = :changed\n    ',
	    ExpressionAttributeNames: {
	      '#accessToken': 'accessToken',
	      '#scopes': 'scopes',
	      '#teamId': 'teamId',
	      '#user': 'user',
	      '#created': 'created',
	      '#changed': 'changed'
	    },
	    ExpressionAttributeValues: {
	      ':accessToken': user.accessToken,
	      ':scopes': user.scopes,
	      ':teamId': user.teamId,
	      ':user': user.user,
	      ':created': now,
	      ':changed': now
	    },
	    ReturnValues: 'ALL_NEW'
	  };
	
	  return new Promise(function (resolve, reject) {
	    _client2.default.update(params, function (err, data) {
	      if (err) return reject(err);
	      user = (0, _client.fromDB)(User, data.Attributes);
	      return resolve(user);
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
	exports.Bot = undefined;
	exports.createBot = createBot;
	exports.getBot = getBot;
	exports.getBots = getBots;
	
	var _nodeUuid = __webpack_require__(6);
	
	var _nodeUuid2 = _interopRequireDefault(_nodeUuid);
	
	var _client = __webpack_require__(2);
	
	var _client2 = _interopRequireDefault(_client);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var table = (0, _client.resolveTableName)('bot-v1');
	
	var Bot = exports.Bot = function Bot() {
	  _classCallCheck(this, Bot);
	};
	
	;
	
	function createBot(data) {
	  var bot = new Bot();
	  var now = new Date().toISOString();
	
	  Object.assign(bot, data);
	  bot.id = _nodeUuid2.default.v4();
	  bot.created = now;
	  bot.changed = now;
	
	  var params = {
	    TableName: table,
	    Item: bot
	  };
	  return new Promise(function (resolve, reject) {
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
	      KeyConditionExpression: 'teamId = :teamId',
	      ExpressionAttributeValues: {
	        ':teamId': teamId
	      }
	    };
	
	    _client2.default.query(params, function (err, data) {
	      if (err) return reject(err);
	      return resolve(data.Items.map(function (item) {
	        return (0, _client.fromDB)(Bot, item);
	      }));
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
	exports.deleteAnswer = deleteAnswer;
	exports.updateAnswer = updateAnswer;
	
	var _nodeUuid = __webpack_require__(6);
	
	var _nodeUuid2 = _interopRequireDefault(_nodeUuid);
	
	var _client = __webpack_require__(2);
	
	var _client2 = _interopRequireDefault(_client);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var table = (0, _client.resolveTableName)('answer-v1');
	
	var Answer = exports.Answer = function Answer() {
	  _classCallCheck(this, Answer);
	};
	
	;
	
	function createAnswer(_ref) {
	  var botId = _ref.botId;
	
	  var data = _objectWithoutProperties(_ref, ['botId']);
	
	  var answer = new Answer();
	  Object.assign(answer, data);
	  answer.id = _nodeUuid2.default.v4();
	  answer.botId = botId;
	
	  now = new Date().toISOString();
	  answer.created = now;
	  answer.changed = now;
	
	  var params = {
	    TableName: table,
	    Item: answer
	  };
	
	  return new Promise(function (resolve, reject) {
	    _client2.default.put(params, function (err, data) {
	      if (err) return reject(err);
	      return resolve(answer);
	    });
	  });
	}
	
	function getAnswer(botId, id) {
	  var params = {
	    TableName: table,
	    Key: { id: id, botId: botId }
	  };
	
	  return new Promise(function (resolve, reject) {
	    _client2.default.get(params, function (err, data) {
	      if (err) return reject(err);
	
	      var answer = void 0;
	      if (data.Item) {
	        answer = (0, _client.fromDB)(Answer, data.Item);
	      }
	
	      return resolve(answer);
	    });
	  });
	}
	
	function getAnswers(botId) {
	  var params = {
	    TableName: table,
	    KeyConditionExpression: 'botId = :botId',
	    ExpressionAttributeValues: {
	      ':botId': botId
	    }
	  };
	
	  return new Promise(function (resolve, reject) {
	    _client2.default.query(params, function (err, data) {
	      if (err) return reject(err);
	      return resolve(data.Items.map(function (item) {
	        return (0, _client.fromDB)(Answer, item);
	      }));
	    });
	  });
	}
	
	function deleteAnswer(botId, id) {
	  var params = {
	    TableName: table,
	    Key: { id: id, botId: botId },
	    ReturnValues: 'ALL_OLD'
	  };
	
	  return new Promise(function (resolve, reject) {
	    _client2.default.delete(params, function (err, data) {
	      if (err) return reject(err);
	      return resolve((0, _client.fromDB)(Answer, data.Attributes));
	    });
	  });
	}
	
	function updateAnswer(_ref2) {
	  var botId = _ref2.botId;
	  var id = _ref2.id;
	  var title = _ref2.title;
	  var body = _ref2.body;
	
	  var params = {
	    TableName: table,
	    Key: { id: id, botId: botId },
	    UpdateExpression: '\n      SET\n        #title = :title,\n        #body = :body,\n        #changed = :changed\n    ',
	    ExpressionAttributeNames: {
	      '#title': 'title',
	      '#body': 'body',
	      '#changed': 'changed'
	    },
	    ExpressionAttributeValues: {
	      ':title': title,
	      ':body': body,
	      ':changed': new Date().toISOString()
	    },
	    ReturnValues: 'ALL_NEW'
	  };
	
	  return new Promise(function (resolve, reject) {
	    _client2.default.update(params, function (err, data) {
	      if (err) return reject(err);
	      return resolve((0, _client.fromDB)(Answer, data.Attributes));
	    });
	  });
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Token = undefined;
	exports.getToken = getToken;
	exports.createToken = createToken;
	exports.deleteToken = deleteToken;
	
	var _nodeUuid = __webpack_require__(6);
	
	var _nodeUuid2 = _interopRequireDefault(_nodeUuid);
	
	var _client = __webpack_require__(2);
	
	var _client2 = _interopRequireDefault(_client);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var table = (0, _client.resolveTableName)('token-v1');
	
	var Token = exports.Token = function Token() {
	  _classCallCheck(this, Token);
	};
	
	;
	
	function getToken(userId, id) {
	  var params = {
	    TableName: table,
	    Key: { id: id, userId: userId }
	  };
	
	  return new Promise(function (resolve, reject) {
	    _client2.default.get(params, function (err, data) {
	      if (err) return reject(err);
	
	      var token = void 0;
	      if (data.Item) {
	        token = (0, _client.fromDB)(Token, data.Item);
	      }
	
	      return resolve(token);
	    });
	  });
	}
	
	function createToken(_ref) {
	  var userId = _ref.userId;
	
	  var data = _objectWithoutProperties(_ref, ['userId']);
	
	  var token = new Token();
	  var now = new Date().toISOString();
	  Object.assign(token, data);
	  token.id = _nodeUuid2.default.v4();
	  token.userId = userId;
	  token.active = true;
	  token.created = now;
	  token.changed = now;
	
	  var params = {
	    TableName: table,
	    Item: token
	  };
	
	  return new Promise(function (resolve, reject) {
	    _client2.default.put(params, function (err, data) {
	      if (err) return reject(err);
	      return resolve(token);
	    });
	  });
	}
	
	function deleteToken(id, userId) {
	  var params = {
	    TableName: table,
	    Key: { id: id, userId: userId }
	  };
	
	  return new Promise(function (resolve, reject) {
	    _client2.default.delete(params, function (err, data) {
	      if (err) return reject(err);
	      return resolve();
	    });
	  });
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _storage = __webpack_require__(12);
	
	Object.defineProperty(exports, 'storage', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_storage).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _team = __webpack_require__(4);
	
	var _user = __webpack_require__(5);
	
	var _bot = __webpack_require__(8);
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }
	
	exports.default = {
	  teams: {
	    get: function () {
	      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(id, cb) {
	        var team;
	        return regeneratorRuntime.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                team = void 0;
	                _context.prev = 1;
	                _context.next = 4;
	                return (0, _team.getTeam)(id);
	
	              case 4:
	                team = _context.sent;
	                _context.next = 10;
	                break;
	
	              case 7:
	                _context.prev = 7;
	                _context.t0 = _context['catch'](1);
	                return _context.abrupt('return', cb(_context.t0));
	
	              case 10:
	                return _context.abrupt('return', cb(null, team));
	
	              case 11:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[1, 7]]);
	      }));
	
	      return function get(_x, _x2) {
	        return ref.apply(this, arguments);
	      };
	    }(),
	
	    save: function () {
	      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(_ref, cb) {
	        var data = _ref.team;
	        var isnew = _ref.isnew;
	        var team;
	        return regeneratorRuntime.wrap(function _callee2$(_context2) {
	          while (1) {
	            switch (_context2.prev = _context2.next) {
	              case 0:
	                team = void 0;
	                _context2.prev = 1;
	                _context2.next = 4;
	                return (0, _team.updateTeam)(data);
	
	              case 4:
	                team = _context2.sent;
	                _context2.next = 10;
	                break;
	
	              case 7:
	                _context2.prev = 7;
	                _context2.t0 = _context2['catch'](1);
	                return _context2.abrupt('return', cb(_context2.t0));
	
	              case 10:
	                if (!isnew) {
	                  _context2.next = 19;
	                  break;
	                }
	
	                _context2.prev = 11;
	                _context2.next = 14;
	                return (0, _bot.createBot)({ teamId: team.id });
	
	              case 14:
	                _context2.next = 19;
	                break;
	
	              case 16:
	                _context2.prev = 16;
	                _context2.t1 = _context2['catch'](11);
	                return _context2.abrupt('return', cb(_context2.t1));
	
	              case 19:
	                return _context2.abrupt('return', cb(null, team));
	
	              case 20:
	              case 'end':
	                return _context2.stop();
	            }
	          }
	        }, _callee2, undefined, [[1, 7], [11, 16]]);
	      }));
	
	      return function save(_x3, _x4) {
	        return ref.apply(this, arguments);
	      };
	    }(),
	
	    all: function () {
	      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(cb) {
	        var teams;
	        return regeneratorRuntime.wrap(function _callee3$(_context3) {
	          while (1) {
	            switch (_context3.prev = _context3.next) {
	              case 0:
	                teams = void 0;
	                _context3.prev = 1;
	                _context3.next = 4;
	                return (0, _team.getTeams)();
	
	              case 4:
	                teams = _context3.sent;
	                _context3.next = 10;
	                break;
	
	              case 7:
	                _context3.prev = 7;
	                _context3.t0 = _context3['catch'](1);
	                return _context3.abrupt('return', cb(_context3.t0));
	
	              case 10:
	                return _context3.abrupt('return', cb(null, teams));
	
	              case 11:
	              case 'end':
	                return _context3.stop();
	            }
	          }
	        }, _callee3, undefined, [[1, 7]]);
	      }));
	
	      return function all(_x5) {
	        return ref.apply(this, arguments);
	      };
	    }()
	
	  },
	  users: {
	    get: function () {
	      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(id, cb) {
	        var user;
	        return regeneratorRuntime.wrap(function _callee4$(_context4) {
	          while (1) {
	            switch (_context4.prev = _context4.next) {
	              case 0:
	                user = void 0;
	                _context4.prev = 1;
	                _context4.next = 4;
	                return (0, _user.getUser)(id);
	
	              case 4:
	                user = _context4.sent;
	                _context4.next = 10;
	                break;
	
	              case 7:
	                _context4.prev = 7;
	                _context4.t0 = _context4['catch'](1);
	                return _context4.abrupt('return', cb(_context4.t0));
	
	              case 10:
	                return _context4.abrupt('return', cb(null, user));
	
	              case 11:
	              case 'end':
	                return _context4.stop();
	            }
	          }
	        }, _callee4, undefined, [[1, 7]]);
	      }));
	
	      return function get(_x6, _x7) {
	        return ref.apply(this, arguments);
	      };
	    }(),
	
	    save: function () {
	      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(_ref2, cb) {
	        var data = _ref2.user;
	        var isnew = _ref2.isnew;
	        var user;
	        return regeneratorRuntime.wrap(function _callee5$(_context5) {
	          while (1) {
	            switch (_context5.prev = _context5.next) {
	              case 0:
	                // transform values from slack to camelcase
	                if (data.access_token) {
	                  data.accessToken = data.access_token;
	                  delete data.access_token;
	                }
	
	                if (data.team_id) {
	                  data.teamId = data.team_id;
	                  delete data.team_id;
	                }
	
	                user = void 0;
	                _context5.prev = 3;
	                _context5.next = 6;
	                return (0, _user.updateUser)(data);
	
	              case 6:
	                user = _context5.sent;
	                _context5.next = 12;
	                break;
	
	              case 9:
	                _context5.prev = 9;
	                _context5.t0 = _context5['catch'](3);
	                return _context5.abrupt('return', cb(_context5.t0));
	
	              case 12:
	                return _context5.abrupt('return', cb(null, user));
	
	              case 13:
	              case 'end':
	                return _context5.stop();
	            }
	          }
	        }, _callee5, undefined, [[3, 9]]);
	      }));
	
	      return function save(_x8, _x9) {
	        return ref.apply(this, arguments);
	      };
	    }(),
	
	    // We should never want to return all the users in the system
	    all: function all(cb) {
	      return cb(new Error('Not implemented'));
	    }
	  },
	  channels: {
	    get: function get(_, cb) {
	      return cb(new Error('Not implemented'));
	    },
	    save: function save(_, cb) {
	      return cb(new Error('Not implemented'));
	    },
	    all: function all(cb) {
	      return cb(new Error('Not implemented'));
	    }
	  }
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=index.js.map