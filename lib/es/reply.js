'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteReply = exports.indexReply = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

exports.search = search;
exports.explain = explain;
exports.validate = validate;
exports.analyze = analyze;

var _getClient = require('./getClient');

var _clients = require('./clients');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('core:es:reply');

var type = 'reply';

function newTopicPrefix(topics) {
  var names = topics.map(function (topic) {
    return topic.name ? '[' + topic.name + ']' : '';
  });
  return names.join(' ');
}

function getQuery(_ref3) {
  var teamId = _ref3.teamId;
  var query = _ref3.query;

  return {
    query: {
      filtered: {
        query: {
          match: {
            title: {
              query: query
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

function search(_ref4) {
  var teamId = _ref4.teamId;
  var query = _ref4.query;
  var _ref4$options = _ref4.options;
  var options = _ref4$options === undefined ? {} : _ref4$options;

  var body = getQuery({ teamId: teamId, query: query });
  return _clients.strictClient.search((0, _extends3.default)({}, _getClient.config.read, options, {
    type: type,
    body: body
  }));
}

function explain(_ref5) {
  var teamId = _ref5.teamId;
  var query = _ref5.query;
  var answerId = _ref5.answerId;

  var body = getQuery({ teamId: teamId, query: query });
  return _clients.client.explain((0, _extends3.default)({}, _getClient.config.read, _getClient.config.explain, {
    type: type,
    body: body,
    id: answerId,
    routing: teamId
  }));
}

function validate(_ref6) {
  var teamId = _ref6.teamId;
  var query = _ref6.query;

  var body = getQuery({ teamId: teamId, query: query });
  return _clients.client.indices.validateQuery((0, _extends3.default)({}, _getClient.config.read, _getClient.config.explain, {
    type: type,
    body: body,
    explain: true,
    routing: teamId
  }));
}

function analyze(_ref7) {
  var query = _ref7.query;
  var rest = (0, _objectWithoutProperties3.default)(_ref7, ['query']);

  return _clients.client.indices.analyze((0, _extends3.default)({}, _getClient.config.read, rest, {
    type: type,
    text: query
  }));
}