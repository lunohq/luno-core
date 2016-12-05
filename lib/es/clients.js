'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.strictClient = exports.client = undefined;

var _getClient = require('./getClient');

var _getClient2 = _interopRequireDefault(_getClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client = (0, _getClient2.default)({ requestTimeout: 3000 });
var strictClient = (0, _getClient2.default)();

exports.client = client;
exports.strictClient = strictClient;