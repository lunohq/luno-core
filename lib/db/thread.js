'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThreadLogs = exports.createThreadLog = exports.commitThread = exports.getOrOpenThread = exports.closeThread = exports.getOpenThread = exports.lookupThread = exports.getThread = exports.getThreadEvents = exports.createEvent = exports.createThread = exports.ThreadLog = exports.ThreadEvent = exports.Thread = exports.FLOW_EVENTS = exports.THREAD_LOG_NEGATIVE_FEEDBACK = exports.THREAD_LOG_POSITIVE_FEEDBACK = exports.THREAD_LOG_NO_FEEDBACK = exports.EVENT_ESCALATION_FLOW = exports.EVENT_CLARIFICATION = exports.EVENT_NO_RESULTS = exports.EVENT_MULTIPLE_RESULTS = exports.EVENT_SMART_ANSWER = exports.EVENT_FEEDBACK = exports.EVENT_ANSWER_FLOW = exports.EVENT_HUMAN_FLOW = exports.EVENT_HELP_FLOW = exports.EVENT_GREETING_FLOW = exports.EVENT_MESSAGE_SENT = exports.EVENT_MESSAGE_RECEIVED = exports.THREAD_STATUS_CLOSED = exports.THREAD_STATUS_OPEN = exports.threadLogTable = exports.threadEventTable = exports.threadTable = undefined;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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
    var teamId = _ref.teamId;
    var open = _ref.open;
    var data = (0, _objectWithoutProperties3.default)(_ref, ['botId', 'channelId', 'userId', 'teamId', 'open']);
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
            thread.teamId = teamId;

            now = new Date().toISOString();

            thread.created = now;
            thread.changed = now;

            thread.status = THREAD_STATUS_OPEN;

            params = {
              TableName: threadTable,
              Item: thread
            };
            _context.next = 16;
            return _client2.default.put(params).promise();

          case 16:
            return _context.abrupt('return', thread);

          case 17:
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
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(args) {
    var event, params;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            event = generateEvent(args);
            params = {
              TableName: threadEventTable,
              Item: event
            };
            _context2.next = 4;
            return _client2.default.put(params).promise();

          case 4:
            return _context2.abrupt('return', event);

          case 5:
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
            return _client2.default.update(params).promise();

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

var getOrOpenThread = exports.getOrOpenThread = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(params) {
    var response, thread;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return getOpenThread(params);

          case 2:
            response = _context8.sent;

            if (!(!response.thread && params.open)) {
              _context8.next = 8;
              break;
            }

            _context8.next = 6;
            return createThread(params);

          case 6:
            thread = _context8.sent;

            response = { thread: thread, events: [] };

          case 8:
            return _context8.abrupt('return', response);

          case 9:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));
  return function getOrOpenThread(_x8) {
    return ref.apply(this, arguments);
  };
}();

var commitThread = exports.commitThread = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(_ref7) {
    var thread = _ref7.thread;
    var close = _ref7.close;
    var params, events, commit, index, event, generated, closePromise, promises, results;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            params = {
              RequestItems: {}
            };
            events = [];
            commit = false;
            _context9.t0 = _regenerator2.default.keys(thread.events);

          case 4:
            if ((_context9.t1 = _context9.t0()).done) {
              _context9.next = 17;
              break;
            }

            index = _context9.t1.value;
            event = thread.events[index];

            if (!event.id) {
              _context9.next = 10;
              break;
            }

            events.push(event);
            return _context9.abrupt('continue', 4);

          case 10:

            if (!params.RequestItems[threadEventTable]) {
              params.RequestItems[threadEventTable] = [];
            }

            commit = true;
            generated = generateEvent((0, _extends3.default)({ offset: index }, event));

            events.push(generated);
            params.RequestItems[threadEventTable].push({ PutRequest: { Item: generated } });
            _context9.next = 4;
            break;

          case 17:
            closePromise = void 0;

            if (close && thread.model && thread.model.status !== THREAD_STATUS_CLOSED) {
              closePromise = closeThread(thread.model);
            }

            promises = [];

            if (closePromise) {
              promises.push(closePromise);
              // TODO remove teamId check once we have backfilled teamId
              if (thread.model.teamId) {
                promises.push(createThreadLog(thread));
              }
            }
            if (commit) {
              promises.push(_client2.default.batchWrite(params).promise());
            }

            _context9.next = 24;
            return _promise2.default.all(promises);

          case 24:
            results = _context9.sent;

            if (closePromise) {
              thread.model = results[0];
            }

            if (events.length) {
              thread.events = events;
            }
            return _context9.abrupt('return', results);

          case 28:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));
  return function commitThread(_x9) {
    return ref.apply(this, arguments);
  };
}();

var createThreadLog = exports.createThreadLog = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(thread) {
    var model, log, events, message, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, event, params;

    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            model = thread.model;
            log = new ThreadLog();

            log.userId = model.userId;
            log.threadId = model.id;
            log.channelId = model.channelId;
            log.created = model.created;
            log.teamId = model.teamId;
            log.createdThreadId = (0, _client.compositeId)(model.created, model.id);

            events = thread.events ? thread.events : [];

            log.length = events.length;

            message = void 0;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context10.prev = 14;
            _iterator = (0, _getIterator3.default)(events);

          case 16:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context10.next = 26;
              break;
            }

            event = _step.value;
            _context10.t0 = event.type;
            _context10.next = _context10.t0 === EVENT_MESSAGE_RECEIVED ? 21 : 23;
            break;

          case 21:
            if (!message && event.message) {
              message = {
                threadEventId: event.id,
                message: event.message
              };
            }
            return _context10.abrupt('break', 23);

          case 23:
            _iteratorNormalCompletion = true;
            _context10.next = 16;
            break;

          case 26:
            _context10.next = 32;
            break;

          case 28:
            _context10.prev = 28;
            _context10.t1 = _context10['catch'](14);
            _didIteratorError = true;
            _iteratorError = _context10.t1;

          case 32:
            _context10.prev = 32;
            _context10.prev = 33;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 35:
            _context10.prev = 35;

            if (!_didIteratorError) {
              _context10.next = 38;
              break;
            }

            throw _iteratorError;

          case 38:
            return _context10.finish(35);

          case 39:
            return _context10.finish(32);

          case 40:
            if (message) {
              _context10.next = 42;
              break;
            }

            throw new Error('ThreadLog must contain a message');

          case 42:

            log.message = message;

            params = {
              TableName: threadLogTable,
              Item: log
            };

            debug('Creating thread log', params);
            _context10.next = 47;
            return _client2.default.put(params).promise();

          case 47:
            return _context10.abrupt('return', log);

          case 48:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this, [[14, 28, 32, 40], [33,, 35, 39]]);
  }));
  return function createThreadLog(_x10) {
    return ref.apply(this, arguments);
  };
}();

var getThreadLogs = exports.getThreadLogs = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(teamId) {
    var params, data;
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            params = {
              TableName: threadLogTable,
              ScanIndexForward: false,
              KeyConditionExpression: '#teamId = :teamId',
              ExpressionAttributeNames: {
                '#teamId': 'teamId'
              },
              ExpressionAttributeValues: {
                ':teamId': teamId
              }
            };
            // TODO support pagination

            _context11.next = 3;
            return _client2.default.query(params).promise();

          case 3:
            data = _context11.sent;
            return _context11.abrupt('return', data.Items.map(function (item) {
              return (0, _client.fromDB)(ThreadLog, item);
            }));

          case 5:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, this);
  }));
  return function getThreadLogs(_x11) {
    return ref.apply(this, arguments);
  };
}();

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('core:db:thread');

var threadTable = exports.threadTable = (0, _client.resolveTableName)('thread-v1');
var threadEventTable = exports.threadEventTable = (0, _client.resolveTableName)('thread-event-v1');
var threadLogTable = exports.threadLogTable = (0, _client.resolveTableName)('thread-log-v1');

var THREAD_STATUS_OPEN = exports.THREAD_STATUS_OPEN = 0;
var THREAD_STATUS_CLOSED = exports.THREAD_STATUS_CLOSED = 1;

var EVENT_MESSAGE_RECEIVED = exports.EVENT_MESSAGE_RECEIVED = 0;
var EVENT_MESSAGE_SENT = exports.EVENT_MESSAGE_SENT = 1;
var EVENT_GREETING_FLOW = exports.EVENT_GREETING_FLOW = 2;
var EVENT_HELP_FLOW = exports.EVENT_HELP_FLOW = 3;
var EVENT_HUMAN_FLOW = exports.EVENT_HUMAN_FLOW = 4;
var EVENT_ANSWER_FLOW = exports.EVENT_ANSWER_FLOW = 5;
var EVENT_FEEDBACK = exports.EVENT_FEEDBACK = 6;
var EVENT_SMART_ANSWER = exports.EVENT_SMART_ANSWER = 7;
var EVENT_MULTIPLE_RESULTS = exports.EVENT_MULTIPLE_RESULTS = 9;
var EVENT_NO_RESULTS = exports.EVENT_NO_RESULTS = 10;
var EVENT_CLARIFICATION = exports.EVENT_CLARIFICATION = 11;
var EVENT_ESCALATION_FLOW = exports.EVENT_ESCALATION_FLOW = 12;

var THREAD_LOG_NO_FEEDBACK = exports.THREAD_LOG_NO_FEEDBACK = 0;
var THREAD_LOG_POSITIVE_FEEDBACK = exports.THREAD_LOG_POSITIVE_FEEDBACK = 1;
var THREAD_LOG_NEGATIVE_FEEDBACK = exports.THREAD_LOG_NEGATIVE_FEEDBACK = 2;

var FLOW_EVENTS = exports.FLOW_EVENTS = [EVENT_GREETING_FLOW, EVENT_HELP_FLOW, EVENT_HUMAN_FLOW, EVENT_ANSWER_FLOW, EVENT_ESCALATION_FLOW];

var Thread = exports.Thread = function Thread() {
  (0, _classCallCheck3.default)(this, Thread);
};

var ThreadEvent = exports.ThreadEvent = function ThreadEvent() {
  (0, _classCallCheck3.default)(this, ThreadEvent);
};

var ThreadLog = exports.ThreadLog = function ThreadLog() {
  (0, _classCallCheck3.default)(this, ThreadLog);
};

function validate(required) {
  for (var key in required) {
    if (!required[key]) {
      throw new Error('missing required field: (' + key + ')');
    }
  }
}

function generateEvent(_ref2) {
  var offset = _ref2.offset;
  var threadId = _ref2.threadId;
  var botId = _ref2.botId;
  var channelId = _ref2.channelId;
  var messageId = _ref2.messageId;
  var userId = _ref2.userId;
  var teamId = _ref2.teamId;
  var data = (0, _objectWithoutProperties3.default)(_ref2, ['offset', 'threadId', 'botId', 'channelId', 'messageId', 'userId', 'teamId']);

  validate({ threadId: threadId, botId: botId, channelId: channelId, userId: userId });
  var event = new ThreadEvent();
  (0, _assign2.default)(event, data);
  event.id = _nodeUuid2.default.v4();
  event.threadId = threadId;
  event.botId = botId;
  event.channelId = channelId;
  event.userId = userId;
  event.teamId = teamId;
  if (messageId) {
    event.botIdChannelIdMessageId = (0, _client.compositeId)(botId, channelId, messageId);
    event.messageId = messageId;
  }

  var now = new Date();
  if (offset) {
    now = new Date(Date.now() + parseInt(offset));
  }

  now = now.toISOString();
  event.created = now;
  event.changed = now;
  return event;
}