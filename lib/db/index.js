'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.admin = exports.thread = exports.token = exports.answer = exports.bot = exports.user = exports.team = exports.client = undefined;

var _client2 = require('./client');

var _client = _interopRequireWildcard(_client2);

var _team2 = require('./team');

var _team = _interopRequireWildcard(_team2);

var _user2 = require('./user');

var _user = _interopRequireWildcard(_user2);

var _bot2 = require('./bot');

var _bot = _interopRequireWildcard(_bot2);

var _answer2 = require('./answer');

var _answer = _interopRequireWildcard(_answer2);

var _token2 = require('./token');

var _token = _interopRequireWildcard(_token2);

var _thread2 = require('./thread');

var _thread = _interopRequireWildcard(_thread2);

var _admin2 = require('./admin');

var _admin = _interopRequireWildcard(_admin2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.client = _client;
exports.team = _team;
exports.user = _user;
exports.bot = _bot;
exports.answer = _answer;
exports.token = _token;
exports.thread = _thread;
exports.admin = _admin;