'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.closeThread = exports.getOpenThread = exports.lookupThread = exports.getThread = exports.getThreadEvents = exports.createEvent = exports.createThread = exports.ThreadEvent = exports.Thread = exports.FLOW_EVENTS = exports.EVENT_CLARIFICATION = exports.EVENT_NO_RESULTS = exports.EVENT_MULTIPLE_RESULTS = exports.EVENT_SMART_ANSWER = exports.EVENT_FEEDBACK = exports.EVENT_ANSWER_FLOW = exports.EVENT_HUMAN_FLOW = exports.EVENT_HELP_FLOW = exports.EVENT_GREETING_FLOW = undefined;

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

var createThread = exports.createThread = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref) {
    var botId = _ref.botId;
    var channelId = _ref.channelId;
    var userId = _ref.userId;
    var data = (0, _objectWithoutProperties3.default)(_ref, ['botId', 'channelId', 'userId']);
    var thread, now, params;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            validate({ botId: botId, channelId: channelId, userId: userId });

            thread = new Thread();

            (0, _assign2.default)(thread, data);
            thread.id = _nodeUuid2.default.v4();
            thread.botIdChannelIdUserId = (0, _client.compositeId)(botId, channelId, userId);
            thread.botId = botId;
            thread.channelId = channelId;
            thread.userId = userId;

            now = new Date().toISOString();

            thread.created = now;
            thread.changed = now;

            thread.status = THREAD_STATUS_OPEN;

            params = {
              TableName: threadTable,
              Item: thread
            };
            _context.next = 15;
            return _client2.default.put(params).promise();

          case 15:
            return _context.abrupt('return', thread);

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function createThread(_x) {
    return ref.apply(this, arguments);
  };
}();

var createEvent = exports.createEvent = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref2) {
    var threadId = _ref2.threadId;
    var botId = _ref2.botId;
    var channelId = _ref2.channelId;
    var messageId = _ref2.messageId;
    var userId = _ref2.userId;
    var data = (0, _objectWithoutProperties3.default)(_ref2, ['threadId', 'botId', 'channelId', 'messageId', 'userId']);
    var event, now, params;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            validate({ threadId: threadId, botId: botId, channelId: channelId, userId: userId });

            event = new ThreadEvent();

            (0, _assign2.default)(event, data);
            event.threadId = threadId;
            event.botId = botId;
            event.channelId = channelId;
            event.userId = userId;
            if (messageId) {
              event.botIdChannelIdMessageId = (0, _client.compositeId)(botId, channelId, messageId);
              event.messageId = messageId;
            }

            now = new Date().toISOString();

            event.created = now;
            event.changed = now;

            params = {
              TableName: threadEventTable,
              Item: event
            };
            _context2.next = 14;
            return _client2.default.put(params).promise();

          case 14:
            return _context2.abrupt('return', event);

          case 15:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return function createEvent(_x2) {
    return ref.apply(this, arguments);
  };
}();

var getThreadEvents = exports.getThreadEvents = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(threadId) {
    var params, items;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            params = {
              TableName: threadEventTable,
              KeyConditionExpression: 'threadId = :threadId',
              ExpressionAttributeValues: {
                ':threadId': threadId
              }
            };
            _context3.next = 3;
            return _client2.default.queryAll(params);

          case 3:
            items = _context3.sent;
            return _context3.abrupt('return', items.map(function (item) {
              return (0, _client.fromDB)(ThreadEvent, item);
            }));

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return function getThreadEvents(_x3) {
    return ref.apply(this, arguments);
  };
}();

var getThread = exports.getThread = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(_ref3) {
    var botId = _ref3.botId;
    var channelId = _ref3.channelId;
    var userId = _ref3.userId;
    var id = _ref3.id;
    var params, data, response;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            params = {
              TableName: threadTable,
              Key: { id: id, botIdChannelIdUserId: (0, _client.compositeId)(botId, channelId, userId) }
            };
            _context4.next = 3;
            return _client2.default.get(params).promise();

          case 3:
            data = _context4.sent;
            response = {};


            if (data.Item) {
              response.thread = (0, _client.fromDB)(Thread, data.Item);
            }

            if (!response.thread) {
              _context4.next = 10;
              break;
            }

            _context4.next = 9;
            return getThreadEvents(response.thread.id);

          case 9:
            response.events = _context4.sent;

          case 10:
            return _context4.abrupt('return', response);

          case 11:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return function getThread(_x4) {
    return ref.apply(this, arguments);
  };
}();

var lookupThread = exports.lookupThread = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(_ref4) {
    var botId = _ref4.botId;
    var channelId = _ref4.channelId;
    var messageId = _ref4.messageId;
    var params, items, item, thread;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            params = {
              TableName: threadEventTable,
              KeyConditionExpression: 'botIdChannelIdMessageId = :botIdChannelIdMessageId',
              ExpressionAttributeValues: {
                ':botIdChannelIdMessageId': (0, _client.compositeId)(botId, channelId, messageId)
              },
              IndexName: 'ThreadEventBotIdChannelIdMessageId'
            };
            _context5.next = 3;
            return _client2.default.queryAll(params);

          case 3:
            items = _context5.sent;
            item = items[0];
            thread = void 0;

            if (!item) {
              _context5.next = 10;
              break;
            }

            _context5.next = 9;
            return getThread({ botId: botId, channelId: channelId, userId: item.userId, id: item.threadId });

          case 9:
            thread = _context5.sent;

          case 10:
            return _context5.abrupt('return', thread);

          case 11:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return function lookupThread(_x5) {
    return ref.apply(this, arguments);
  };
}();

var getOpenThread = exports.getOpenThread = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(_ref5) {
    var botId = _ref5.botId;
    var channelId = _ref5.channelId;
    var userId = _ref5.userId;
    var params, items, response;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            params = {
              TableName: threadTable,
              KeyConditionExpression: 'botIdChannelIdUserId = :botIdChannelIdUserId AND #status = :status',
              ExpressionAttributeValues: {
                ':botIdChannelIdUserId': (0, _client.compositeId)(botId, channelId, userId),
                ':status': THREAD_STATUS_OPEN
              },
              ExpressionAttributeNames: {
                '#status': 'status'
              },
              IndexName: 'ThreadBotIdChannelIdUserIdStatus'
            };
            _context6.next = 3;
            return _client2.default.queryAll(params);

          case 3:
            items = _context6.sent;
            response = {};

            if (items.length) {
              response.thread = (0, _client.fromDB)(Thread, items[0]);
            }

            if (!response.thread) {
              _context6.next = 10;
              break;
            }

            _context6.next = 9;
            return getThreadEvents(response.thread.id);

          case 9:
            response.events = _context6.sent;

          case 10:
            return _context6.abrupt('return', response);

          case 11:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));
  return function getOpenThread(_x6) {
    return ref.apply(this, arguments);
  };
}();

var closeThread = exports.closeThread = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(_ref6) {
    var botId = _ref6.botId;
    var channelId = _ref6.channelId;
    var userId = _ref6.userId;
    var id = _ref6.id;
    var params, data;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            validate({ botId: botId, channelId: channelId, userId: userId, id: id });
            params = {
              TableName: threadTable,
              Key: {
                id: id,
                botIdChannelIdUserId: (0, _client.compositeId)(botId, channelId, userId)
              },
              UpdateExpression: '\n      SET\n        #status = :status,\n        #changed = :changed\n    ',
              ExpressionAttributeNames: {
                '#status': 'status',
                '#changed': 'changed'
              },
              ExpressionAttributeValues: {
                ':status': THREAD_STATUS_CLOSED,
                ':changed': new Date().toISOString()
              },
              ReturnValues: 'ALL_NEW'
            };
            _context7.next = 4;
            return _client2.default.update(params);

          case 4:
            data = _context7.sent;
            return _context7.abrupt('return', (0, _client.fromDB)(Thread, data.Attributes));

          case 6:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));
  return function closeThread(_x7) {
    return ref.apply(this, arguments);
  };
}();

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var threadTable = (0, _client.resolveTableName)('thread-v1');
var threadEventTable = (0, _client.resolveTableName)('thread-event-v1');

var THREAD_STATUS_OPEN = 0;
var THREAD_STATUS_CLOSED = 1;

var EVENT_GREETING_FLOW = exports.EVENT_GREETING_FLOW = 0;
var EVENT_HELP_FLOW = exports.EVENT_HELP_FLOW = 1;
var EVENT_HUMAN_FLOW = exports.EVENT_HUMAN_FLOW = 2;
var EVENT_ANSWER_FLOW = exports.EVENT_ANSWER_FLOW = 3;
var EVENT_FEEDBACK = exports.EVENT_FEEDBACK = 4;
var EVENT_SMART_ANSWER = exports.EVENT_SMART_ANSWER = 5;
var EVENT_MULTIPLE_RESULTS = exports.EVENT_MULTIPLE_RESULTS = 7;
var EVENT_NO_RESULTS = exports.EVENT_NO_RESULTS = 8;
var EVENT_CLARIFICATION = exports.EVENT_CLARIFICATION = 9;

var FLOW_EVENTS = exports.FLOW_EVENTS = [EVENT_GREETING_FLOW, EVENT_HELP_FLOW, EVENT_HUMAN_FLOW, EVENT_ANSWER_FLOW];

var Thread = exports.Thread = function Thread() {
  (0, _classCallCheck3.default)(this, Thread);
};

var ThreadEvent = exports.ThreadEvent = function ThreadEvent() {
  (0, _classCallCheck3.default)(this, ThreadEvent);
};

function validate(required) {
  for (var key in required) {
    if (!required[key]) {
      throw new Error('missing required field: (' + key + ')');
    }
  }
}