'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reply = exports.answer = exports.getClient = undefined;

var _getClient = require('./getClient');

Object.defineProperty(exports, 'getClient', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_getClient).default;
  }
});

var _answer2 = require('./answer');

var _answer = _interopRequireWildcard(_answer2);

var _reply2 = require('./reply');

var _reply = _interopRequireWildcard(_reply2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.answer = _answer;
exports.reply = _reply;