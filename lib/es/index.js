'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.answer = exports.client = undefined;

var _client2 = require('./client');

var _client = _interopRequireWildcard(_client2);

var _answer2 = require('./answer');

var _answer = _interopRequireWildcard(_answer2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.client = _client;
exports.answer = _answer;