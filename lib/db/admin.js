'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.endToken = exports.trackToken = exports.createToken = exports.getToken = exports.AdminToken = undefined;

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
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(id) {
    var params, data, token;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            params = {
              TableName: table,
              Key: { id: id }
            };
            _context.next = 3;
            return _client2.default.get(params).promise();

          case 3:
            data = _context.sent;
            token = void 0;

            if (data.Item) {
              token = (0, _client.fromDB)(AdminToken, data.Item);
            }
            return _context.abrupt('return', token);

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function getToken(_x) {
    return ref.apply(this, arguments);
  };
}();

var createToken = exports.createToken = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref) {
    var adminSlackUserId = _ref.adminSlackUserId;
    var targetUserId = _ref.targetUserId;
    var targetTeamId = _ref.targetTeamId;
    var data = (0, _objectWithoutProperties3.default)(_ref, ['adminSlackUserId', 'targetUserId', 'targetTeamId']);
    var token, now, params;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            token = new AdminToken();
            now = new Date().toISOString();

            (0, _assign2.default)(token, data);
            token.id = _nodeUuid2.default.v4();
            token.adminSlackUserId = adminSlackUserId;
            token.targetUserId = targetUserId;
            token.targetTeamId = targetTeamId;
            token.created = now;
            token.changed = now;

            params = {
              TableName: table,
              Item: token
            };
            _context2.next = 12;
            return _client2.default.put(params).promise();

          case 12:
            return _context2.abrupt('return', token);

          case 13:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return function createToken(_x2) {
    return ref.apply(this, arguments);
  };
}();

var trackToken = exports.trackToken = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_ref2) {
    var id = _ref2.id;
    var targetTokenId = _ref2.targetTokenId;
    var now, params, data;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            now = new Date().toISOString();
            params = {
              TableName: table,
              Key: { id: id },
              UpdateExpression: '\n      SET\n        #targetTokenId = :targetTokenId,\n        #changed = :changed\n    ',
              ExpressionAttributeNames: {
                '#targetTokenId': 'targetTokenId',
                '#changed': 'changed'
              },
              ExpressionAttributeValues: {
                ':targetTokenId': targetTokenId,
                ':changed': now
              },
              ReturnValues: 'ALL_NEW'
            };
            _context3.next = 4;
            return _client2.default.update(params).promise();

          case 4:
            data = _context3.sent;
            return _context3.abrupt('return', (0, _client.fromDB)(AdminToken, data.Attributes));

          case 6:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return function trackToken(_x3) {
    return ref.apply(this, arguments);
  };
}();

var endToken = exports.endToken = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(_ref3) {
    var id = _ref3.id;
    var now, params, data;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            now = new Date().toISOString();
            params = {
              TableName: table,
              Key: { id: id },
              UpdateExpression: '\n      SET\n        #ended = :ended,\n        #changed = :changed\n    ',
              ExpressionAttributeNames: {
                '#ended': 'ended',
                '#changed': 'changed'
              },
              ExpressionAttributeValues: {
                ':ended': now,
                ':changed': now
              },
              ReturnValues: 'ALL_NEW'
            };
            _context4.next = 4;
            return _client2.default.update(params).promise();

          case 4:
            data = _context4.sent;
            return _context4.abrupt('return', (0, _client.fromDB)(AdminToken, data.Attributes));

          case 6:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return function endToken(_x4) {
    return ref.apply(this, arguments);
  };
}();

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var table = (0, _client.resolveTableName)('admin-token-v1');

var AdminToken = exports.AdminToken = function AdminToken() {
  (0, _classCallCheck3.default)(this, AdminToken);
};