'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Answer = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

exports.createAnswer = createAnswer;
exports.getAnswer = getAnswer;
exports.getAnswers = getAnswers;
exports.deleteAnswer = deleteAnswer;
exports.updateAnswer = updateAnswer;

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

;

function createAnswer(_ref) {
  var _this = this;

  var botId = _ref.botId;
  var data = (0, _objectWithoutProperties3.default)(_ref, ['botId']);

  var answer = new Answer();
  (0, _assign2.default)(answer, data);
  answer.id = _nodeUuid2.default.v4();
  answer.botId = botId;

  var now = new Date().toISOString();
  answer.created = now;
  answer.changed = now;

  var params = {
    TableName: table,
    Item: answer
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.put(params, function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(err, data) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!err) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return', reject(err));

              case 2:
                _context.prev = 2;
                _context.next = 5;
                return es.indexAnswer(answer);

              case 5:
                _context.next = 10;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context['catch'](2);
                return _context.abrupt('return', reject(_context.t0));

              case 10:
                return _context.abrupt('return', resolve(answer));

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this, [[2, 7]]);
      }));
      return function (_x, _x2) {
        return ref.apply(this, arguments);
      };
    }());
  });
}

function getAnswer(botId, id) {
  var params = {
    TableName: table,
    Key: { id: id, botId: botId }
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.get(params, function (err, data) {
      if (err) return reject(err);

      var answer = void 0;
      if (data.Item) {
        answer = (0, _client.fromDB)(Answer, data.Item);
      }

      return resolve(answer);
    });
  });
}

function getAnswers(botId) {
  var params = {
    TableName: table,
    KeyConditionExpression: 'botId = :botId',
    ExpressionAttributeValues: {
      ':botId': botId
    }
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.query(params, function (err, data) {
      if (err) return reject(err);
      return resolve(data.Items.map(function (item) {
        return (0, _client.fromDB)(Answer, item);
      }));
    });
  });
}

function deleteAnswer(botId, id) {
  var _this2 = this;

  var params = {
    TableName: table,
    Key: { id: id, botId: botId },
    ReturnValues: 'ALL_OLD'
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.delete(params, function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(err, data) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!err) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt('return', reject(err));

              case 2:
                _context2.prev = 2;
                _context2.next = 5;
                return es.deleteAnswer(id);

              case 5:
                _context2.next = 10;
                break;

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2['catch'](2);
                return _context2.abrupt('return', reject(_context2.t0));

              case 10:
                return _context2.abrupt('return', resolve((0, _client.fromDB)(Answer, data.Attributes)));

              case 11:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this2, [[2, 7]]);
      }));
      return function (_x3, _x4) {
        return ref.apply(this, arguments);
      };
    }());
  });
}

function updateAnswer(_ref2) {
  var _this3 = this;

  var botId = _ref2.botId;
  var id = _ref2.id;
  var title = _ref2.title;
  var body = _ref2.body;

  var params = {
    TableName: table,
    Key: { id: id, botId: botId },
    UpdateExpression: '\n      SET\n        #title = :title,\n        #body = :body,\n        #changed = :changed\n    ',
    ExpressionAttributeNames: {
      '#title': 'title',
      '#body': 'body',
      '#changed': 'changed'
    },
    ExpressionAttributeValues: {
      ':title': title,
      ':body': body,
      ':changed': new Date().toISOString()
    },
    ReturnValues: 'ALL_NEW'
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.update(params, function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(err, data) {
        var answer;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!err) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt('return', reject(err));

              case 2:
                answer = (0, _client.fromDB)(Answer, data.Attributes);
                _context3.prev = 3;
                _context3.next = 6;
                return es.indexAnswer(answer);

              case 6:
                _context3.next = 11;
                break;

              case 8:
                _context3.prev = 8;
                _context3.t0 = _context3['catch'](3);
                return _context3.abrupt('return', reject(_context3.t0));

              case 11:
                return _context3.abrupt('return', resolve(answer));

              case 12:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, _this3, [[3, 8]]);
      }));
      return function (_x5, _x6) {
        return ref.apply(this, arguments);
      };
    }());
  });
}