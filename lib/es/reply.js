'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteReply = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var deleteReply = exports.deleteReply = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref2) {
    var teamId = _ref2.teamId;
    var id = _ref2.id;
    var res;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            res = void 0;
            _context.prev = 1;
            _context.next = 4;
            return client.delete((0, _extends3.default)({}, _getClient.config.write, {
              type: type,
              id: id,
              routing: teamId
            }));

          case 4:
            res = _context.sent;
            _context.next = 11;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](1);

            if (!(_context.t0.status !== 404)) {
              _context.next = 11;
              break;
            }

            throw _context.t0;

          case 11:
            return _context.abrupt('return', res);

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 7]]);
  }));
  return function deleteReply(_x) {
    return ref.apply(this, arguments);
  };
}();

exports.indexReply = indexReply;
exports.search = search;
exports.explain = explain;
exports.validate = validate;
exports.analyze = analyze;

var _getClient = require('./getClient');

var _getClient2 = _interopRequireDefault(_getClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var type = 'reply';

var client = (0, _getClient2.default)();

function newTopicPrefix(topics) {
  var names = topics.map(function (topic) {
    return '[' + topic.name + ']';
  });
  return names.join(' ');
}

function indexReply(_ref) {
  var _ref$reply = _ref.reply;
  var id = _ref$reply.id;
  var title = _ref$reply.title;
  var body = (0, _objectWithoutProperties3.default)(_ref$reply, ['id', 'title']);
  var topics = _ref.topics;

  var prefix = newTopicPrefix(topics);
  var prefixedTitle = (prefix + ' ' + title).trim();
  body.title = prefixedTitle;
  return client.index((0, _extends3.default)({}, _getClient.config.write, {
    type: type,
    id: id,
    body: body,
    routing: body.teamId
  }));
}

function getQuery(_ref3) {
  var teamId = _ref3.teamId;
  var query = _ref3.query;

  return {
    query: {
      filtered: {
        query: {
          common: {
            title: {
              query: query,
              cutoff_frequency: 0.001
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
  return client.search((0, _extends3.default)({}, _getClient.config.read, options, {
    type: type,
    body: body
  }));
}

function explain(_ref5) {
  var teamId = _ref5.teamId;
  var query = _ref5.query;
  var answerId = _ref5.answerId;

  var body = getQuery({ teamId: teamId, query: query });
  return client.explain((0, _extends3.default)({}, _getClient.config.read, _getClient.config.explain, {
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
  return client.indices.validateQuery((0, _extends3.default)({}, _getClient.config.read, _getClient.config.explain, {
    type: type,
    body: body,
    explain: true,
    routing: teamId
  }));
}

function analyze(_ref7) {
  var query = _ref7.query;
  var rest = (0, _objectWithoutProperties3.default)(_ref7, ['query']);

  return client.indices.analyze((0, _extends3.default)({}, _getClient.config.read, rest, {
    type: type,
    text: query
  }));
}