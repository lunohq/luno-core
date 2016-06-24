'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeItem = exports.addItemToTopics = exports.removeItemFromTopics = exports.getItemsForTopic = exports.getTopicIdsForItem = exports.createTopicItem = exports.TopicItem = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var createTopicItem = exports.createTopicItem = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(data) {
    var topicItem, params;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            topicItem = generateTopicItem(data);
            params = {
              TableName: table,
              Item: topicItem
            };
            _context.next = 4;
            return _client2.default.put(params).promise();

          case 4:
            return _context.abrupt('return', topicItem);

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function createTopicItem(_x) {
    return ref.apply(this, arguments);
  };
}();

var getTopicIdsForItem = exports.getTopicIdsForItem = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref2) {
    var teamId = _ref2.teamId;
    var itemId = _ref2.itemId;

    var params, data, topicIds, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            params = {
              TableName: table,
              IndexName: 'TeamIdItemIdIndex',
              KeyConditionExpression: 'teamId = :teamId and itemId = :itemId',
              ExpressionAttributeValues: {
                ':teamId': teamId,
                ':itemId': itemId
              }
            };
            _context2.next = 3;
            return _client2.default.query(params).promise();

          case 3:
            data = _context2.sent;
            topicIds = [];

            if (!data.Items) {
              _context2.next = 25;
              break;
            }

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 9;

            for (_iterator = (0, _getIterator3.default)(data.Items); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              item = _step.value;

              topicIds.push(item.topicId);
            }
            _context2.next = 17;
            break;

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2['catch'](9);
            _didIteratorError = true;
            _iteratorError = _context2.t0;

          case 17:
            _context2.prev = 17;
            _context2.prev = 18;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 20:
            _context2.prev = 20;

            if (!_didIteratorError) {
              _context2.next = 23;
              break;
            }

            throw _iteratorError;

          case 23:
            return _context2.finish(20);

          case 24:
            return _context2.finish(17);

          case 25:
            return _context2.abrupt('return', topicIds);

          case 26:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[9, 13, 17, 25], [18,, 20, 24]]);
  }));
  return function getTopicIdsForItem(_x2) {
    return ref.apply(this, arguments);
  };
}();

var getItemsForTopic = exports.getItemsForTopic = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_ref3) {
    var teamId = _ref3.teamId;
    var topicId = _ref3.topicId;
    var params, data;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            params = {
              TableName: table,
              KeyConditionExpression: 'teamIdTopicId = :teamIdTopicId',
              ExpressionAttributeValues: {
                ':teamIdTopicId': (0, _client.compositeId)(teamId, topicId)
              }
            };
            _context3.next = 3;
            return _client2.default.query(params).promise();

          case 3:
            data = _context3.sent;
            return _context3.abrupt('return', data.Items.map(function (item) {
              return (0, _client.fromDB)(TopicItem, item);
            }));

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return function getItemsForTopic(_x3) {
    return ref.apply(this, arguments);
  };
}();

var removeItemFromTopics = exports.removeItemFromTopics = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(_ref4) {
    var itemId = _ref4.itemId;
    var topicIds = _ref4.topicIds;
    var teamId = _ref4.teamId;

    var params, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, topicId;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            params = {
              RequestItems: (0, _defineProperty3.default)({}, table, [])
            };
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context4.prev = 4;

            for (_iterator2 = (0, _getIterator3.default)(topicIds); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              topicId = _step2.value;

              params.RequestItems[table].push({
                DeleteRequest: {
                  Key: { teamIdTopicId: (0, _client.compositeId)(teamId, topicId), itemId: itemId }
                }
              });
            }
            _context4.next = 12;
            break;

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4['catch'](4);
            _didIteratorError2 = true;
            _iteratorError2 = _context4.t0;

          case 12:
            _context4.prev = 12;
            _context4.prev = 13;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 15:
            _context4.prev = 15;

            if (!_didIteratorError2) {
              _context4.next = 18;
              break;
            }

            throw _iteratorError2;

          case 18:
            return _context4.finish(15);

          case 19:
            return _context4.finish(12);

          case 20:
            return _context4.abrupt('return', _client2.default.batchWrite(params).promise());

          case 21:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[4, 8, 12, 20], [13,, 15, 19]]);
  }));
  return function removeItemFromTopics(_x4) {
    return ref.apply(this, arguments);
  };
}();

var addItemToTopics = exports.addItemToTopics = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(_ref5) {
    var itemId = _ref5.itemId;
    var topicIds = _ref5.topicIds;
    var teamId = _ref5.teamId;
    var createdBy = _ref5.createdBy;

    var params, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, topicId;

    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            params = {
              RequestItems: (0, _defineProperty3.default)({}, table, [])
            };
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context5.prev = 4;

            for (_iterator3 = (0, _getIterator3.default)(topicIds); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              topicId = _step3.value;

              params.RequestItems[table].push({
                PutRequest: {
                  Item: generateTopicItem({ itemId: itemId, topicId: topicId, teamId: teamId, createdBy: createdBy })
                }
              });
            }
            _context5.next = 12;
            break;

          case 8:
            _context5.prev = 8;
            _context5.t0 = _context5['catch'](4);
            _didIteratorError3 = true;
            _iteratorError3 = _context5.t0;

          case 12:
            _context5.prev = 12;
            _context5.prev = 13;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 15:
            _context5.prev = 15;

            if (!_didIteratorError3) {
              _context5.next = 18;
              break;
            }

            throw _iteratorError3;

          case 18:
            return _context5.finish(15);

          case 19:
            return _context5.finish(12);

          case 20:
            return _context5.abrupt('return', _client2.default.batchWrite(params).promise());

          case 21:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[4, 8, 12, 20], [13,, 15, 19]]);
  }));
  return function addItemToTopics(_x5) {
    return ref.apply(this, arguments);
  };
}();

var removeItem = exports.removeItem = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(_ref6) {
    var teamId = _ref6.teamId;
    var itemId = _ref6.itemId;
    var topicIds;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return getTopicIdsForItem({ teamId: teamId, itemId: itemId });

          case 2:
            topicIds = _context6.sent;
            return _context6.abrupt('return', removeItemFromTopics({ teamId: teamId, topicIds: topicIds, itemId: itemId }));

          case 4:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));
  return function removeItem(_x6) {
    return ref.apply(this, arguments);
  };
}();

var _redlock = require('redlock');

var _redlock2 = _interopRequireDefault(_redlock);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var table = (0, _client.resolveTableName)('topic-item-v1');

var TopicItem = exports.TopicItem = function TopicItem() {
  (0, _classCallCheck3.default)(this, TopicItem);
};

function generateTopicItem(_ref) {
  var teamId = _ref.teamId;
  var topicId = _ref.topicId;
  var itemId = _ref.itemId;
  var createdBy = _ref.createdBy;

  var topicItem = new TopicItem();
  topicItem.teamId = teamId;
  topicItem.topicId = topicId;
  topicItem.itemId = itemId;
  topicItem.createdBy = createdBy;
  topicItem.teamIdTopicId = (0, _client.compositeId)(teamId, topicId);

  var now = new Date().toISOString();
  topicItem.created = now;
  return topicItem;
}