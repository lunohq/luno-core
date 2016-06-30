'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteTopic = exports.updateTopicName = exports.deleteReply = exports.indexReply = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var indexReply = exports.indexReply = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref) {
    var _ref$reply = _ref.reply;
    var id = _ref$reply.id;
    var title = _ref$reply.title;
    var body = (0, _objectWithoutProperties3.default)(_ref$reply, ['id', 'title']);
    var topics = _ref.topics;

    var prefix, prefixedTitle, indices, actions, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, index;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            prefix = newTopicPrefix(topics);
            prefixedTitle = (prefix + ' ' + title).trim();

            body.title = prefixedTitle;
            _context.next = 5;
            return (0, _getClient.getWriteIndices)(_clients.client);

          case 5:
            indices = _context.sent;
            actions = [];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 10;

            for (_iterator = (0, _getIterator3.default)(indices); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              index = _step.value;

              actions.push({ index: { _index: index, _id: id } });
              actions.push(body);
            }
            _context.next = 18;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context['catch'](10);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 18:
            _context.prev = 18;
            _context.prev = 19;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 21:
            _context.prev = 21;

            if (!_didIteratorError) {
              _context.next = 24;
              break;
            }

            throw _iteratorError;

          case 24:
            return _context.finish(21);

          case 25:
            return _context.finish(18);

          case 26:
            return _context.abrupt('return', _clients.client.bulk({
              type: type,
              body: actions,
              routing: body.teamId
            }));

          case 27:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[10, 14, 18, 26], [19,, 21, 25]]);
  }));
  return function indexReply(_x) {
    return ref.apply(this, arguments);
  };
}();

var deleteReply = exports.deleteReply = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref2) {
    var teamId = _ref2.teamId;
    var id = _ref2.id;

    var indices, actions, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, index;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _getClient.getWriteIndices)(_clients.client);

          case 2:
            indices = _context2.sent;
            actions = [];
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context2.prev = 7;

            for (_iterator2 = (0, _getIterator3.default)(indices); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              index = _step2.value;

              actions.push({ delete: { _index: index, _id: id } });
            }
            _context2.next = 15;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2['catch'](7);
            _didIteratorError2 = true;
            _iteratorError2 = _context2.t0;

          case 15:
            _context2.prev = 15;
            _context2.prev = 16;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 18:
            _context2.prev = 18;

            if (!_didIteratorError2) {
              _context2.next = 21;
              break;
            }

            throw _iteratorError2;

          case 21:
            return _context2.finish(18);

          case 22:
            return _context2.finish(15);

          case 23:
            return _context2.abrupt('return', _clients.client.bulk({
              type: type,
              body: actions,
              routing: teamId
            }));

          case 24:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[7, 11, 15, 23], [16,, 18, 22]]);
  }));
  return function deleteReply(_x2) {
    return ref.apply(this, arguments);
  };
}();

var updateTopicName = exports.updateTopicName = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_ref3) {
    var teamId = _ref3.teamId;
    var topicId = _ref3.topicId;
    var name = _ref3.name;

    var _require, getRepliesForTopic, _ref4, _ref5, replies, indices, actions, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, reply, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, index, title, resp;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _require = require('../db/reply');
            getRepliesForTopic = _require.getRepliesForTopic;
            _context3.next = 4;
            return _promise2.default.all([getRepliesForTopic({ teamId: teamId, topicId: topicId }), (0, _getClient.getWriteIndices)(_clients.client)]);

          case 4:
            _ref4 = _context3.sent;
            _ref5 = (0, _slicedToArray3.default)(_ref4, 2);
            replies = _ref5[0];
            indices = _ref5[1];
            actions = [];
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context3.prev = 12;
            _iterator3 = (0, _getIterator3.default)(replies);

          case 14:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context3.next = 38;
              break;
            }

            reply = _step3.value;
            _iteratorNormalCompletion4 = true;
            _didIteratorError4 = false;
            _iteratorError4 = undefined;
            _context3.prev = 19;

            for (_iterator4 = (0, _getIterator3.default)(indices); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              index = _step4.value;
              title = '[' + name + '] ' + reply.title;

              actions.push({ update: { _index: index, _id: reply.id } });
              actions.push({ doc: { title: title } });
            }
            _context3.next = 27;
            break;

          case 23:
            _context3.prev = 23;
            _context3.t0 = _context3['catch'](19);
            _didIteratorError4 = true;
            _iteratorError4 = _context3.t0;

          case 27:
            _context3.prev = 27;
            _context3.prev = 28;

            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }

          case 30:
            _context3.prev = 30;

            if (!_didIteratorError4) {
              _context3.next = 33;
              break;
            }

            throw _iteratorError4;

          case 33:
            return _context3.finish(30);

          case 34:
            return _context3.finish(27);

          case 35:
            _iteratorNormalCompletion3 = true;
            _context3.next = 14;
            break;

          case 38:
            _context3.next = 44;
            break;

          case 40:
            _context3.prev = 40;
            _context3.t1 = _context3['catch'](12);
            _didIteratorError3 = true;
            _iteratorError3 = _context3.t1;

          case 44:
            _context3.prev = 44;
            _context3.prev = 45;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 47:
            _context3.prev = 47;

            if (!_didIteratorError3) {
              _context3.next = 50;
              break;
            }

            throw _iteratorError3;

          case 50:
            return _context3.finish(47);

          case 51:
            return _context3.finish(44);

          case 52:
            resp = null;

            if (actions) {
              resp = _clients.client.bulk({
                type: type,
                body: actions,
                routing: teamId
              });
            }
            return _context3.abrupt('return', resp);

          case 55:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[12, 40, 44, 52], [19, 23, 27, 35], [28,, 30, 34], [45,, 47, 51]]);
  }));
  return function updateTopicName(_x3) {
    return ref.apply(this, arguments);
  };
}();

var deleteTopic = exports.deleteTopic = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(_ref6) {
    var teamId = _ref6.teamId;
    var topicId = _ref6.topicId;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt('return', _clients.client.deleteByQuery((0, _extends3.default)({}, _getClient.config.write, {
              type: type,
              routing: teamId,
              body: {
                query: (0, _defineProperty3.default)({
                  term: { topicId: topicId }
                }, 'term', { teamId: teamId })
              }
            })));

          case 1:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return function deleteTopic(_x4) {
    return ref.apply(this, arguments);
  };
}();

exports.search = search;
exports.explain = explain;
exports.validate = validate;
exports.analyze = analyze;

var _getClient = require('./getClient');

var _clients = require('./clients');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('core:es:reply');

var type = 'reply';

function newTopicPrefix(topics) {
  var names = topics.map(function (topic) {
    return topic.name ? '[' + topic.name + ']' : '';
  });
  return names.join(' ');
}

function getQuery(_ref7) {
  var teamId = _ref7.teamId;
  var query = _ref7.query;

  return {
    query: {
      filtered: {
        query: {
          match: {
            title: {
              query: query,
              minimum_should_match: _config2.default.es.reply.minimum_should_match
            }
          }
        },
        filter: {
          term: { teamId: teamId }
        }
      }
    }
  };
}

function search(_ref8) {
  var teamId = _ref8.teamId;
  var query = _ref8.query;
  var _ref8$options = _ref8.options;
  var options = _ref8$options === undefined ? {} : _ref8$options;

  var body = getQuery({ teamId: teamId, query: query });
  return _clients.strictClient.search((0, _extends3.default)({}, _getClient.config.read, options, {
    type: type,
    body: body
  }));
}

function explain(_ref9) {
  var teamId = _ref9.teamId;
  var query = _ref9.query;
  var answerId = _ref9.answerId;

  var body = getQuery({ teamId: teamId, query: query });
  return _clients.client.explain((0, _extends3.default)({}, _getClient.config.read, _getClient.config.explain, {
    type: type,
    body: body,
    id: answerId,
    routing: teamId
  }));
}

function validate(_ref10) {
  var teamId = _ref10.teamId;
  var query = _ref10.query;

  var body = getQuery({ teamId: teamId, query: query });
  return _clients.client.indices.validateQuery((0, _extends3.default)({}, _getClient.config.read, _getClient.config.explain, {
    type: type,
    body: body,
    explain: true,
    routing: teamId
  }));
}

function analyze(_ref11) {
  var query = _ref11.query;
  var rest = (0, _objectWithoutProperties3.default)(_ref11, ['query']);

  return _clients.client.indices.analyze((0, _extends3.default)({}, _getClient.config.read, rest, {
    type: type,
    text: query
  }));
}