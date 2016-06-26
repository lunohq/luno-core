'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRepliesForTopic = exports.updateReply = exports.deleteReply = exports.createReply = exports.Reply = exports.table = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var createReply = exports.createReply = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref2) {
    var id = _ref2.id;
    var teamId = _ref2.teamId;
    var topicId = _ref2.topicId;
    var createdBy = _ref2.createdBy;
    var data = (0, _objectWithoutProperties3.default)(_ref2, ['id', 'teamId', 'topicId', 'createdBy']);
    var reply, now, params, res, topics;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            reply = new Reply();

            (0, _assign2.default)(reply, data);

            // NOTE: while rolling out replies, we allow the id to be set to the answer
            // id to make it easier to sync during the roll out
            reply.id = id;
            if (!id) {
              reply.id = _nodeUuid2.default.v4();
            }
            reply.teamId = teamId;
            reply.topicId = topicId;
            reply.createdBy = createdBy;

            now = new Date().toISOString();

            reply.created = now;
            reply.changed = now;

            params = {
              TableName: table,
              Item: reply
            };
            _context.next = 13;
            return _promise2.default.all([(0, _topicItem.addItemToTopics)({ teamId: teamId, createdBy: createdBy, itemId: reply.id, topicIds: [topicId] }), _client2.default.put(params).promise(), (0, _topic.getTopicsWithIds)({ teamId: teamId, topicIds: [topicId] })]);

          case 13:
            res = _context.sent;
            topics = res[2];
            // TODO this should be a transaction

            _context.next = 17;
            return es.indexReply({ reply: reply, topics: topics });

          case 17:
            return _context.abrupt('return', reply);

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function createReply(_x) {
    return ref.apply(this, arguments);
  };
}();

var deleteReply = exports.deleteReply = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref3) {
    var teamId = _ref3.teamId;
    var topicId = _ref3.topicId;
    var id = _ref3.id;
    var params, data, results;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            params = {
              TableName: table,
              Key: { id: id, teamId: teamId },
              ReturnValues: 'ALL_OLD',
              ConditionExpression: 'attribute_exists(#id)',
              ExpressionAttributeNames: {
                '#id': 'id'
              }
            };
            data = void 0;
            _context2.prev = 2;
            _context2.next = 5;
            return _client2.default.delete(params).promise();

          case 5:
            data = _context2.sent;
            _context2.next = 13;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2['catch'](2);

            if (!(_context2.t0.code === 'ConditionalCheckFailedException')) {
              _context2.next = 12;
              break;
            }

            return _context2.abrupt('return', null);

          case 12:
            throw _context2.t0;

          case 13:
            _context2.next = 15;
            return _promise2.default.all([es.deleteReply({ teamId: teamId, id: id }), (0, _topicItem.removeItem)({ teamId: teamId, itemId: id })]);

          case 15:
            results = _context2.sent;
            return _context2.abrupt('return', (0, _client.fromDB)(Reply, data.Attributes));

          case 17:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[2, 8]]);
  }));
  return function deleteReply(_x2) {
    return ref.apply(this, arguments);
  };
}();

var updateReply = exports.updateReply = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_ref4) {
    var teamId = _ref4.teamId;
    var id = _ref4.id;
    var topicId = _ref4.topicId;
    var title = _ref4.title;
    var body = _ref4.body;
    var updatedBy = _ref4.updatedBy;

    var params, mutex, topicIds, removeFrom, addTo, existingTopicIds, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, existingTopicId, data, reply, promises, res, topics;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            params = {
              TableName: table,
              Key: { id: id, teamId: teamId },
              ConditionExpression: 'attribute_exists(#id)',
              UpdateExpression: '\n      SET\n        #title = :title,\n        #body = :body,\n        #changed = :changed,\n        #updatedBy = :updatedBy\n    ',
              ExpressionAttributeNames: {
                '#id': 'id',
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
            _context3.next = 3;
            return lockReply({ teamId: teamId, id: id });

          case 3:
            mutex = _context3.sent;
            topicIds = [];
            removeFrom = [];
            addTo = [];
            _context3.next = 9;
            return (0, _topicItem.getTopicIdsForItem)({ teamId: teamId, itemId: id });

          case 9:
            existingTopicIds = _context3.sent;

            debug('Existing topicIds', { existingTopicIds: existingTopicIds });
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context3.prev = 14;
            for (_iterator = (0, _getIterator3.default)(existingTopicIds); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              existingTopicId = _step.value;

              if (existingTopicId !== topicId) {
                removeFrom.push(existingTopicId);
              } else {
                topicIds.push(existingTopicId);
              }
            }

            _context3.next = 22;
            break;

          case 18:
            _context3.prev = 18;
            _context3.t0 = _context3['catch'](14);
            _didIteratorError = true;
            _iteratorError = _context3.t0;

          case 22:
            _context3.prev = 22;
            _context3.prev = 23;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 25:
            _context3.prev = 25;

            if (!_didIteratorError) {
              _context3.next = 28;
              break;
            }

            throw _iteratorError;

          case 28:
            return _context3.finish(25);

          case 29:
            return _context3.finish(22);

          case 30:
            if (!existingTopicIds.includes(topicId)) {
              addTo.push(topicId);
            }

            debug('Updating reply', { params: params });
            data = void 0;
            _context3.prev = 33;
            _context3.next = 36;
            return _client2.default.update(params).promise();

          case 36:
            data = _context3.sent;
            _context3.next = 45;
            break;

          case 39:
            _context3.prev = 39;
            _context3.t1 = _context3['catch'](33);

            if (!(_context3.t1.code === 'ConditionalCheckFailedException')) {
              _context3.next = 44;
              break;
            }

            debug('Reply does not exist');
            return _context3.abrupt('return', null);

          case 44:
            throw _context3.t1;

          case 45:
            reply = (0, _client.fromDB)(Reply, data.Attributes);
            promises = [(0, _topic.getTopicsWithIds)({ teamId: teamId, topicIds: topicIds.concat(addTo) })];

            if (addTo.length) {
              promises.push((0, _topicItem.addItemToTopics)({ teamId: teamId, itemId: id, topicIds: addTo, createdBy: updatedBy }));
            }
            if (removeFrom.length) {
              promises.push((0, _topicItem.removeItemFromTopics)({ teamId: teamId, itemId: id, topicIds: removeFrom }));
            }

            debug('Updating associated reply records', { promises: promises.length, addTo: addTo, removeFrom: removeFrom, topicIds: topicIds });
            _context3.next = 52;
            return _promise2.default.all(promises);

          case 52:
            res = _context3.sent;

            debug('Associated records results', { res: res });
            mutex.unlock();
            topics = res[0];
            _context3.next = 58;
            return es.indexReply({ reply: reply, topics: topics });

          case 58:
            return _context3.abrupt('return', reply);

          case 59:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[14, 18, 22, 30], [23,, 25, 29], [33, 39]]);
  }));
  return function updateReply(_x3) {
    return ref.apply(this, arguments);
  };
}();

var getRepliesForTopic = exports.getRepliesForTopic = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(_ref5) {
    var teamId = _ref5.teamId;
    var topicId = _ref5.topicId;
    var items, params, data, replies;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            items = (0, _topicItem.getItemsForTopic)({ teamId: teamId, topicId: topicId });
            params = {
              RequestItems: (0, _defineProperty3.default)({}, table, {
                Keys: items.map(function (_ref6) {
                  var id = _ref6.id;
                  return { teamId: teamId, id: id };
                })
              })
            };
            data = _client2.default.batchGet(params).promise();
            replies = [];

            if (data.Responses && data.Responses[table]) {
              replies = data.Responses[table].map(function (reply) {
                return (0, _client.fromDB)(Reply, reply);
              });
            }
            return _context4.abrupt('return', replies);

          case 6:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return function getRepliesForTopic(_x4) {
    return ref.apply(this, arguments);
  };
}();

exports.lockReply = lockReply;

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _topicItem = require('./topicItem');

var _topic = require('./topic');

var _reply = require('../es/reply');

var es = _interopRequireWildcard(_reply);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('core:db:reply');

var table = exports.table = (0, _client.resolveTableName)('reply-v1');

var Reply = exports.Reply = function Reply() {
  (0, _classCallCheck3.default)(this, Reply);
};

function lockReply(_ref) {
  var teamId = _ref.teamId;
  var id = _ref.id;

  return (0, _client.lock)('reply-mutex-' + teamId + ':' + id);
}