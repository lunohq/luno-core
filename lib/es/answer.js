'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteAnswer = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var deleteAnswer = exports.deleteAnswer = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(botId, id) {
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
              routing: botId
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
  return function deleteAnswer(_x, _x2) {
    return ref.apply(this, arguments);
  };
}();

exports.indexAnswer = indexAnswer;
exports.search = search;
exports.explain = explain;
exports.validate = validate;
exports.analyze = analyze;

var _getClient = require('./getClient');

var _getClient2 = _interopRequireDefault(_getClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var type = 'answer';

var client = (0, _getClient2.default)();

function indexAnswer(_ref) {
  var id = _ref.id;
  var body = (0, _objectWithoutProperties3.default)(_ref, ['id']);

  return client.index((0, _extends3.default)({}, _getClient.config.write, {
    type: type,
    id: id,
    body: body,
    routing: body.botId
  }));
}

function getQuery(botId, query) {
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
          term: { botId: botId }
        }
      }
    }
  };
}

function search(botId, query) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var body = getQuery(botId, query);
  return client.search((0, _extends3.default)({}, _getClient.config.read, options, {
    type: type,
    body: body
  }));
}

function explain(botId, query, answerId) {
  var body = getQuery(botId, query);
  return client.explain((0, _extends3.default)({}, _getClient.config.read, _getClient.config.explain, {
    type: type,
    body: body,
    id: answerId,
    routing: botId
  }));
}

function validate(botId, query) {
  var body = getQuery(botId, query);
  return client.indices.validateQuery((0, _extends3.default)({}, _getClient.config.read, _getClient.config.explain, {
    type: type,
    body: body,
    explain: true,
    routing: botId
  }));
}

function analyze(_ref2) {
  var query = _ref2.query;
  var rest = (0, _objectWithoutProperties3.default)(_ref2, ['query']);

  return client.indices.analyze((0, _extends3.default)({}, _getClient.config.read, rest, {
    type: type,
    text: query
  }));
}