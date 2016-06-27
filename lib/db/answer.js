'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAnswer = exports.deleteAnswer = exports.getAnswers = exports.getAnswer = exports.createAnswer = exports.Answer = undefined;

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

var createAnswer = exports.createAnswer = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref) {
    var id = _ref.id;
    var botId = _ref.botId;
    var data = (0, _objectWithoutProperties3.default)(_ref, ['id', 'botId']);
    var answer, now, params;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            answer = new Answer();

            (0, _assign2.default)(answer, data);

            // NOTE: while rolling out replies, we allow the id to be set to the reply
            // id as a backup.
            answer.id = id;
            if (!id) {
              answer.id = _nodeUuid2.default.v4();
            }
            answer.botId = botId;

            now = new Date().toISOString();

            answer.created = now;
            answer.changed = now;

            params = {
              TableName: table,
              Item: answer
            };
            _context.next = 11;
            return _client2.default.put(params).promise();

          case 11:
            _context.next = 13;
            return es.indexAnswer(answer);

          case 13:
            return _context.abrupt('return', answer);

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function createAnswer(_x) {
    return ref.apply(this, arguments);
  };
}();

var getAnswer = exports.getAnswer = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(botId, id) {
    var params, data, answer;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            params = {
              TableName: table,
              Key: { id: id, botId: botId }
            };
            _context2.next = 3;
            return _client2.default.get(params).promise();

          case 3:
            data = _context2.sent;
            answer = void 0;

            if (data.Item) {
              answer = (0, _client.fromDB)(Answer, data.Item);
            }
            return _context2.abrupt('return', answer);

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return function getAnswer(_x2, _x3) {
    return ref.apply(this, arguments);
  };
}();

var getAnswers = exports.getAnswers = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(botId) {
    var params, items;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            params = {
              TableName: table,
              KeyConditionExpression: 'botId = :botId',
              ExpressionAttributeValues: {
                ':botId': botId
              },
              IndexName: 'AnswerBotIdCreated',
              ScanIndexForward: false
            };
            _context3.next = 3;
            return _client2.default.queryAll(params);

          case 3:
            items = _context3.sent;
            return _context3.abrupt('return', items.map(function (item) {
              return (0, _client.fromDB)(Answer, item);
            }));

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return function getAnswers(_x4) {
    return ref.apply(this, arguments);
  };
}();

var deleteAnswer = exports.deleteAnswer = function () {
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
            _context4.next = 6;
            return es.deleteAnswer(botId, id);

          case 6:
            return _context4.abrupt('return', (0, _client.fromDB)(Answer, data.Attributes));

          case 7:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return function deleteAnswer(_x5, _x6) {
    return ref.apply(this, arguments);
  };
}();

var updateAnswer = exports.updateAnswer = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(_ref2) {
    var botId = _ref2.botId;
    var id = _ref2.id;
    var title = _ref2.title;
    var body = _ref2.body;
    var updatedBy = _ref2.updatedBy;
    var params, data, answer;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            params = {
              TableName: table,
              Key: { id: id, botId: botId },
              UpdateExpression: '\n      SET\n        #title = :title,\n        #body = :body,\n        #changed = :changed,\n        #updatedBy = :updatedBy\n    ',
              ExpressionAttributeNames: {
                '#title': 'title',
                '#body': 'body',
                '#changed': 'changed',
                '#updatedBy': 'updatedBy'
              },
              ExpressionAttributeValues: {
                ':title': title,
                ':body': body,
                ':changed': new Date().toISOString(),
                ':updatedBy': updatedBy
              },
              ReturnValues: 'ALL_NEW'
            };
            _context5.next = 3;
            return _client2.default.update(params).promise();

          case 3:
            data = _context5.sent;
            answer = (0, _client.fromDB)(Answer, data.Attributes);
            _context5.next = 7;
            return es.indexAnswer(answer);

          case 7:
            return _context5.abrupt('return', answer);

          case 8:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return function updateAnswer(_x7) {
    return ref.apply(this, arguments);
  };
}();

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _answer = require('../es/answer');

var es = _interopRequireWildcard(_answer);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var table = (0, _client.resolveTableName)('answer-v1');

var Answer = exports.Answer = function Answer() {
  (0, _classCallCheck3.default)(this, Answer);
};