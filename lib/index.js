'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.botkit = exports.db = undefined;

var _db2 = require('./db');

var _db = _interopRequireWildcard(_db2);

var _botkit2 = require('./botkit');

var _botkit = _interopRequireWildcard(_botkit2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.db = _db;
exports.botkit = _botkit;