'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteToken = exports.createToken = exports.getToken = exports.Token = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var getToken = exports.getToken = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(userId, id) {
    var params, data, token;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            params = {
              TableName: table,
              Key: { id: id, userId: userId }
            };
            _context.next = 3;
            return _client2.default.get(params).promise();

          case 3:
            data = _context.sent;
            token = void 0;

            if (data.Item) {
              token = (0, _client.fromDB)(Token, data.Item);
            }
            return _context.abrupt('return', token);

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function getToken(_x, _x2) {
    return ref.apply(this, arguments);
  };
}();

var createToken = exports.createToken = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref) {
    var userId = _ref.userId;
    var data = (0, _objectWithoutProperties3.default)(_ref, ['userId']);
    var token, now, params;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            token = new Token();
            now = new Date().toISOString();

            (0, _assign2.default)(token, data);
            token.id = _nodeUuid2.default.v4();
            token.userId = userId;
            token.active = true;
            token.created = now;
            token.changed = now;

            params = {
              TableName: table,
              Item: token
            };
            _context2.next = 11;
            return _client2.default.put(params).promise();

          case 11:
            return _context2.abrupt('return', token);

          case 12:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return function createToken(_x3) {
    return ref.apply(this, arguments);
  };
}();

var deleteToken = exports.deleteToken = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(id, userId) {
    var params;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            params = {
              TableName: table,
              Key: { id: id, userId: userId }
            };
            _context3.next = 3;
            return _client2.default.delete(params).promise();

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return function deleteToken(_x4, _x5) {
    return ref.apply(this, arguments);
  };
}();

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var table = (0, _client.resolveTableName)('token-v1');

var Token = exports.Token = function Token() {
  (0, _classCallCheck3.default)(this, Token);
};