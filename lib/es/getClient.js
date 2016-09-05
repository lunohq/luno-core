'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWriteIndices = exports.config = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var getWriteIndices = exports.getWriteIndices = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(client) {
    var aliases;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return client.indices.getAliases({ name: indices.write });

          case 2:
            aliases = _context.sent;
            return _context.abrupt('return', (0, _keys2.default)(aliases));

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function getWriteIndices(_x) {
    return ref.apply(this, arguments);
  };
}();

exports.default = getClient;

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _elasticsearch = require('elasticsearch');

var _httpAwsEs = require('http-aws-es');

var _httpAwsEs2 = _interopRequireDefault(_httpAwsEs);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var indices = {
  write: 'luno-bot-write',
  read: 'luno-bot-read'
};

var config = exports.config = {
  indices: indices,
  write: {
    index: indices.write
  },
  read: {
    index: indices.read
  },
  explain: _config2.default.es.explain
};

function credentials() {
  return new _promise2.default(function (resolve, reject) {
    var provider = new _awsSdk2.default.CredentialProviderChain();
    provider.resolve(function (err, creds) {
      if (err) return reject(err);
      resolve(creds);
    });
  });
}

function getClient() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$requestTimeout = _ref.requestTimeout;
  var requestTimeout = _ref$requestTimeout === undefined ? 1000 : _ref$requestTimeout;

  return new _elasticsearch.Client({
    apiVersion: '1.5',
    host: _config2.default.es.host,
    connectionClass: _httpAwsEs2.default,
    log: 'info',
    amazonES: {
      region: _config2.default.es.region,
      credentials: credentials()
    },
    requestTimeout: requestTimeout
  });
}