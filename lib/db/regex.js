'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRegex = exports.deleteRegex = exports.getRegex = exports.getRegexes = exports.createRegex = exports.Regex = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var createRegex = exports.createRegex = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref) {
    var botId = _ref.botId;
    var data = (0, _objectWithoutProperties3.default)(_ref, ['botId']);
    var instance, now, params;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            instance = new Regex();

            (0, _assign2.default)(instance, data);
            instance.id = _nodeUuid2.default.v4();
            instance.botId = botId;

            now = new Date().toISOString();

            instance.created = now;
            instance.changed = now;

            params = {
              TableName: table,
              Item: instance
            };
            _context.next = 10;
            return _client2.default.put(params).promise();

          case 10:
            return _context.abrupt('return', instance);

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function createRegex(_x) {
    return ref.apply(this, arguments);
  };
}();

var getRegexes = exports.getRegexes = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(botId) {
    var params, items;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            params = {
              TableName: table,
              KeyConditionExpression: 'botId = :botId',
              ExpressionAttributeValues: {
                ':botId': botId
              },
              IndexName: 'RegexBotIdPosition'
            };
            _context2.next = 3;
            return _client2.default.queryAll(params);

          case 3:
            items = _context2.sent;
            return _context2.abrupt('return', items.map(function (item) {
              return (0, _client.fromDB)(Regex, item);
            }));

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return function getRegexes(_x2) {
    return ref.apply(this, arguments);
  };
}();

var getRegex = exports.getRegex = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(id) {
    var params, data, instance;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            params = {
              TableName: table,
              Key: { id: id }
            };
            _context3.next = 3;
            return _client2.default.get(params).promise();

          case 3:
            data = _context3.sent;
            instance = void 0;

            if (data.Item) {
              instance = (0, _client.fromDB)(Regex, data.Item);
            }
            return _context3.abrupt('return', instance);

          case 7:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return function getRegex(_x3) {
    return ref.apply(this, arguments);
  };
}();

var deleteRegex = exports.deleteRegex = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(botId, id) {
    var params, data;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            params = {
              TableName: table,
              Key: { id: id, botId: botId },
              ReturnValues: 'ALL_OLD'
            };
            _context4.next = 3;
            return _client2.default.delete(params).promise();

          case 3:
            data = _context4.sent;
            return _context4.abrupt('return', (0, _client.fromDB)(Regex, data.Attributes));

          case 5:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return function deleteRegex(_x4, _x5) {
    return ref.apply(this, arguments);
  };
}();

var updateRegex = exports.updateRegex = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(_ref2) {
    var botId = _ref2.botId;
    var id = _ref2.id;
    var regex = _ref2.regex;
    var body = _ref2.body;
    var position = _ref2.position;
    var now, params, data;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            now = new Date().toISOString();
            params = {
              TableName: table,
              Key: { id: regexResponse },
              UpdateExpression: '\n      SET\n        #regex = :regex,\n        #body = :body,\n        #changed = :changed,\n        #position = :position\n    ',
              ExpressionAttributeNames: {
                '#regex': 'regex',
                '#body': 'body',
                '#changed': 'changed',
                '#position': 'position'
              },
              ExpressionAttributeValues: {
                ':regex': regex,
                ':body': body,
                ':changed': new Date().toISOString(),
                ':position': position
              },
              ReturnValues: 'ALL_NEW'
            };
            _context5.next = 4;
            return _client2.default.update(params).promise();

          case 4:
            data = _context5.sent;
            return _context5.abrupt('return', (0, _client.fromDB)(Regex, data.Attributes));

          case 6:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return function updateRegex(_x6) {
    return ref.apply(this, arguments);
  };
}();

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var table = (0, _client.resolveTableName)('regex-v1');

var Regex = exports.Regex = function Regex() {
  (0, _classCallCheck3.default)(this, Regex);
};