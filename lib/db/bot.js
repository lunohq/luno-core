'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePurpose = exports.updatePointsOfContact = exports.allBots = exports.getBots = exports.getBot = exports.createBot = exports.Bot = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var createBot = exports.createBot = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(data) {
    var bot, now, params;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            bot = new Bot();
            now = new Date().toISOString();


            (0, _assign2.default)(bot, data);
            bot.id = _nodeUuid2.default.v4();
            bot.created = now;
            bot.changed = now;

            params = {
              TableName: table,
              Item: bot
            };
            _context.next = 9;
            return _client2.default.put(params).promise();

          case 9:
            return _context.abrupt('return', bot);

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function createBot(_x) {
    return ref.apply(this, arguments);
  };
}();

var getBot = exports.getBot = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(teamId, id) {
    var params, data;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            params = {
              TableName: table,
              Key: { teamId: teamId, id: id }
            };
            _context2.next = 3;
            return _client2.default.get(params).promise();

          case 3:
            data = _context2.sent;
            return _context2.abrupt('return', (0, _client.fromDB)(Bot, data.Item));

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return function getBot(_x2, _x3) {
    return ref.apply(this, arguments);
  };
}();

var getBots = exports.getBots = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(teamId) {
    var params, data;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            params = {
              TableName: table,
              KeyConditionExpression: 'teamId = :teamId',
              ExpressionAttributeValues: {
                ':teamId': teamId
              }
            };
            _context3.next = 3;
            return _client2.default.query(params).promise();

          case 3:
            data = _context3.sent;
            return _context3.abrupt('return', data.Items.map(function (item) {
              return (0, _client.fromDB)(Bot, item);
            }));

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return function getBots(_x4) {
    return ref.apply(this, arguments);
  };
}();

var allBots = exports.allBots = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
    var params, data;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            params = {
              TableName: table
            };
            _context4.next = 3;
            return _client2.default.scan(params).promise();

          case 3:
            data = _context4.sent;
            return _context4.abrupt('return', data.Items.map(function (item) {
              return (0, _client.fromDB)(Bot, item);
            }));

          case 5:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return function allBots() {
    return ref.apply(this, arguments);
  };
}();

var update = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(params) {
    var data;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _client2.default.update(params).promise();

          case 2:
            data = _context5.sent;
            return _context5.abrupt('return', (0, _client.fromDB)(Bot, data.Attributes));

          case 4:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return function update(_x5) {
    return ref.apply(this, arguments);
  };
}();

var updatePointsOfContact = exports.updatePointsOfContact = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(_ref) {
    var id = _ref.id;
    var teamId = _ref.teamId;
    var pointsOfContact = _ref.pointsOfContact;
    var now, params;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            now = new Date().toISOString();
            params = {
              TableName: table,
              Key: { id: id, teamId: teamId },
              UpdateExpression: '\n      SET\n        #pointsOfContact = :pointsOfContact,\n        #changed = :changed\n    ',
              ExpressionAttributeNames: {
                '#pointsOfContact': 'pointsOfContact',
                '#changed': 'changed'
              },
              ExpressionAttributeValues: {
                ':pointsOfContact': pointsOfContact,
                ':changed': now
              },
              ReturnValues: 'ALL_NEW'
            };
            _context6.next = 4;
            return update(params);

          case 4:
            return _context6.abrupt('return', _context6.sent);

          case 5:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));
  return function updatePointsOfContact(_x6) {
    return ref.apply(this, arguments);
  };
}();

var updatePurpose = exports.updatePurpose = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(_ref2) {
    var id = _ref2.id;
    var teamId = _ref2.teamId;
    var purpose = _ref2.purpose;
    var now, params;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            now = new Date().toISOString();
            params = {
              TableName: table,
              Key: { id: id, teamId: teamId },
              UpdateExpression: '\n      SET\n        #purpose = :purpose,\n        #changed = :changed\n    ',
              ExpressionAttributeNames: {
                '#purpose': 'purpose',
                '#changed': 'changed'
              },
              ExpressionAttributeValues: {
                ':purpose': purpose,
                ':changed': now
              },
              ReturnValues: 'ALL_NEW'
            };
            _context7.next = 4;
            return update(params);

          case 4:
            return _context7.abrupt('return', _context7.sent);

          case 5:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));
  return function updatePurpose(_x7) {
    return ref.apply(this, arguments);
  };
}();

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var table = (0, _client.resolveTableName)('bot-v1');

var Bot = exports.Bot = function Bot() {
  (0, _classCallCheck3.default)(this, Bot);
};