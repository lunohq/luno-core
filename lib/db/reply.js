'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRepliesForTopic = exports.updateReply = exports.getReply = exports.deleteReply = exports.createReply = exports.Reply = exports.table = undefined;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var createReply = exports.createReply = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref5) {
    var id = _ref5.id;
    var teamId = _ref5.teamId;
    var topicId = _ref5.topicId;
    var createdBy = _ref5.createdBy;
    var _ref5$rollback = _ref5.rollback;
    var rollback = _ref5$rollback === undefined ? false : _ref5$rollback;
    var data = (0, _objectWithoutProperties3.default)(_ref5, ['id', 'teamId', 'topicId', 'createdBy', 'rollback']);
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

            if (!rollback) {
              now = new Date().toISOString();

              reply.created = now;
              reply.changed = now;
            }

            params = {
              TableName: table,
              Item: reply
            };
            res = void 0;
            _context.prev = 10;
            _context.next = 13;
            return _promise2.default.all([(0, _topicItem.addItemToTopics)({ teamId: teamId, createdBy: createdBy, itemId: reply.id, topicIds: [topicId] }), _client2.default.put(params).promise(), (0, _topic.getTopicsWithIds)({ teamId: teamId, topicIds: [topicId] })]);

          case 13:
            res = _context.sent;
            _context.next = 22;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context['catch'](10);

            if (rollback) {
              _context.next = 21;
              break;
            }

            _context.next = 21;
            return rollbackCreateReply({ id: id, teamId: teamId, topicId: topicId });

          case 21:
            throw _context.t0;

          case 22:
            topics = res[2];
            _context.prev = 23;
            _context.next = 26;
            return es.indexReply({ reply: reply, topics: topics });

          case 26:
            _context.next = 34;
            break;

          case 28:
            _context.prev = 28;
            _context.t1 = _context['catch'](23);

            if (rollback) {
              _context.next = 33;
              break;
            }

            _context.next = 33;
            return rollbackCreateReply({ id: id, teamId: teamId, topicId: topicId });

          case 33:
            throw _context.t1;

          case 34:
            return _context.abrupt('return', reply);

          case 35:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[10, 16], [23, 28]]);
  }));
  return function createReply(_x) {
    return ref.apply(this, arguments);
  };
}();

var deleteReply = exports.deleteReply = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref6) {
    var teamId = _ref6.teamId;
    var topicId = _ref6.topicId;
    var id = _ref6.id;
    var _ref6$rollback = _ref6.rollback;
    var rollback = _ref6$rollback === undefined ? false : _ref6$rollback;
    var params, data, reply;
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
            reply = (0, _client.fromDB)(Reply, data.Attributes);

            if (rollback) {
              _context2.next = 26;
              break;
            }

            _context2.prev = 15;
            _context2.next = 18;
            return _promise2.default.all([es.deleteReply({ teamId: teamId, id: id }), (0, _topicItem.removeItem)({ teamId: teamId, itemId: id })]);

          case 18:
            _context2.next = 26;
            break;

          case 20:
            _context2.prev = 20;
            _context2.t1 = _context2['catch'](15);

            if (rollback) {
              _context2.next = 25;
              break;
            }

            _context2.next = 25;
            return rollbackDeleteReply({ reply: reply, topicId: topicId });

          case 25:
            throw _context2.t1;

          case 26:
            return _context2.abrupt('return', reply);

          case 27:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[2, 8], [15, 20]]);
  }));
  return function deleteReply(_x2) {
    return ref.apply(this, arguments);
  };
}();

var getReply = exports.getReply = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_ref7) {
    var teamId = _ref7.teamId;
    var id = _ref7.id;
    var _ref7$options = _ref7.options;
    var options = _ref7$options === undefined ? {} : _ref7$options;
    var params, data, reply;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            params = {
              TableName: table,
              Key: { id: id, teamId: teamId }
            };

            (0, _assign2.default)(params, options);

            _context3.next = 4;
            return _client2.default.get(params).promise();

          case 4:
            data = _context3.sent;
            reply = void 0;

            if (data.Item) {
              reply = (0, _client.fromDB)(Reply, data.Item);
            }
            return _context3.abrupt('return', reply);

          case 8:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return function getReply(_x3) {
    return ref.apply(this, arguments);
  };
}();

var updateReply = exports.updateReply = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(_ref8) {
    var teamId = _ref8.teamId;
    var id = _ref8.id;
    var topicId = _ref8.topicId;
    var title = _ref8.title;
    var body = _ref8.body;
    var updatedBy = _ref8.updatedBy;
    var _ref8$changed = _ref8.changed;
    var changed = _ref8$changed === undefined ? new Date().toISOString() : _ref8$changed;
    var _ref8$rollback = _ref8.rollback;
    var rollback = _ref8$rollback === undefined ? false : _ref8$rollback;

    var params, mutex, topicIds, removeFrom, addTo, existingTopicIds, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, existingTopicId, data, previousReply, promises, res, topics, reply;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            params = {
              TableName: table,
              Key: { id: id, teamId: teamId },
              ConditionExpression: 'attribute_exists(#id)',
              UpdateExpression: '\n      SET\n        #title = :title\n        , #body = :body\n        , #changed = :changed\n        ' + (updatedBy ? ', #updatedBy = :updatedBy' : '') + '\n    ',
              ExpressionAttributeNames: {
                '#id': 'id',
                '#title': 'title',
                '#body': 'body',
                '#changed': 'changed'
              },
              ExpressionAttributeValues: {
                ':title': title,
                ':body': body,
                ':changed': changed
              },
              ReturnValues: 'ALL_OLD'
            };


            if (updatedBy) {
              params.ExpressionAttributeNames['#updatedBy'] = 'updatedBy';
              params.ExpressionAttributeValues[':updatedBy'] = updatedBy;
            }

            _context4.next = 4;
            return lockReply({ teamId: teamId, id: id });

          case 4:
            mutex = _context4.sent;
            topicIds = [];
            removeFrom = [];
            addTo = [];
            _context4.next = 10;
            return (0, _topicItem.getTopicIdsForItem)({ teamId: teamId, itemId: id });

          case 10:
            existingTopicIds = _context4.sent;

            debug('Existing topicIds', { existingTopicIds: existingTopicIds });
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context4.prev = 15;
            for (_iterator = (0, _getIterator3.default)(existingTopicIds); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              existingTopicId = _step.value;

              if (existingTopicId !== topicId) {
                removeFrom.push(existingTopicId);
              } else {
                topicIds.push(existingTopicId);
              }
            }

            _context4.next = 23;
            break;

          case 19:
            _context4.prev = 19;
            _context4.t0 = _context4['catch'](15);
            _didIteratorError = true;
            _iteratorError = _context4.t0;

          case 23:
            _context4.prev = 23;
            _context4.prev = 24;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 26:
            _context4.prev = 26;

            if (!_didIteratorError) {
              _context4.next = 29;
              break;
            }

            throw _iteratorError;

          case 29:
            return _context4.finish(26);

          case 30:
            return _context4.finish(23);

          case 31:
            if (!existingTopicIds.includes(topicId)) {
              addTo.push(topicId);
            }

            debug('Updating reply', { params: params });
            data = void 0;
            _context4.prev = 34;
            _context4.next = 37;
            return _client2.default.update(params).promise();

          case 37:
            data = _context4.sent;
            _context4.next = 48;
            break;

          case 40:
            _context4.prev = 40;
            _context4.t1 = _context4['catch'](34);

            if (!(_context4.t1.code === 'ConditionalCheckFailedException')) {
              _context4.next = 46;
              break;
            }

            debug('Reply does not exist');
            mutex.unlock();
            return _context4.abrupt('return', null);

          case 46:
            mutex.unlock();
            throw _context4.t1;

          case 48:
            previousReply = (0, _client.fromDB)(Reply, data.Attributes);
            promises = [(0, _topic.getTopicsWithIds)({ teamId: teamId, topicIds: topicIds.concat(addTo) })];

            if (addTo.length) {
              promises.push((0, _topicItem.addItemToTopics)({ teamId: teamId, itemId: id, topicIds: addTo, createdBy: updatedBy }));
            }
            if (removeFrom.length) {
              promises.push((0, _topicItem.removeItemFromTopics)({ teamId: teamId, itemId: id, topicIds: removeFrom }));
            }

            res = void 0;
            _context4.prev = 53;
            _context4.next = 56;
            return _promise2.default.all(promises);

          case 56:
            res = _context4.sent;
            _context4.next = 66;
            break;

          case 59:
            _context4.prev = 59;
            _context4.t2 = _context4['catch'](53);

            mutex.unlock();

            if (rollback) {
              _context4.next = 65;
              break;
            }

            _context4.next = 65;
            return rollbackUpdateReply({ previousReply: previousReply, topicId: topicId });

          case 65:
            throw _context4.t2;

          case 66:
            topics = res[0];
            _context4.prev = 67;
            _context4.next = 70;
            return es.indexReply({ reply: reply, topics: topics });

          case 70:
            _context4.next = 79;
            break;

          case 72:
            _context4.prev = 72;
            _context4.t3 = _context4['catch'](67);

            mutex.unlock();

            if (rollback) {
              _context4.next = 78;
              break;
            }

            _context4.next = 78;
            return rollbackUpdateReply({ previousReply: previousReply, topicId: topicId });

          case 78:
            throw _context4.t3;

          case 79:
            _context4.next = 81;
            return getReply({ teamId: teamId, id: id, options: { ConsistentRead: true } });

          case 81:
            reply = _context4.sent;

            mutex.unlock();
            return _context4.abrupt('return', reply);

          case 84:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[15, 19, 23, 31], [24,, 26, 30], [34, 40], [53, 59], [67, 72]]);
  }));
  return function updateReply(_x4) {
    return ref.apply(this, arguments);
  };
}();

var getRepliesForTopic = exports.getRepliesForTopic = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(_ref9) {
    var teamId = _ref9.teamId;
    var topicId = _ref9.topicId;
    var items, replies, replyMap;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return (0, _topicItem.getItemsForTopic)({ teamId: teamId, topicId: topicId });

          case 2:
            items = _context5.sent;

            if (items.length) {
              _context5.next = 5;
              break;
            }

            return _context5.abrupt('return', []);

          case 5:
            _context5.next = 7;
            return _client2.default.batchGetAll({
              table: table,
              items: items,
              getKey: function getKey(_ref10) {
                var itemId = _ref10.itemId;
                return { teamId: teamId, id: itemId };
              }
            });

          case 7:
            replies = _context5.sent;
            replyMap = {};

            if (replies.length) {
              replies.forEach(function (reply) {
                replyMap[reply.id] = (0, _client.fromDB)(Reply, reply);
              });
            }
            return _context5.abrupt('return', items.map(function (_ref11) {
              var itemId = _ref11.itemId;
              return replyMap[itemId];
            }));

          case 11:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return function getRepliesForTopic(_x5) {
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

function rollbackCreateReply(_ref2) {
  var id = _ref2.id;
  var teamId = _ref2.teamId;
  var topicId = _ref2.topicId;

  debug('Rolling back createReply', { id: id, teamId: teamId, topicId: topicId });
  return _promise2.default.all([(0, _topicItem.removeItemFromTopics)({ itemId: id, topicIds: [topicId], teamId: teamId }), deleteReply({ teamId: teamId, topicId: topicId, id: id, rollback: true })]);
}

function rollbackDeleteReply(_ref3) {
  var reply = _ref3.reply;
  var topicId = _ref3.topicId;

  debug('Rolling back deleteReply', { reply: reply, topicId: topicId });
  return createReply((0, _extends3.default)({ topicId: topicId, rollback: true }, reply));
}

function rollbackUpdateReply(_ref4) {
  var previousReply = _ref4.previousReply;
  var topicId = _ref4.topicId;

  debug('Rolling back updateReply', { previousReply: previousReply, topicId: topicId });
  return updateReply((0, _extends3.default)({ topicId: topicId, rollback: true }, previousReply));
}