'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteAnswer = exports.indexAnswer = undefined;

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

var indexAnswer = exports.indexAnswer = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref) {
    var id = _ref.id;
    var body = (0, _objectWithoutProperties3.default)(_ref, ['id']);

    var indices, actions, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, index;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _getClient.getWriteIndices)(_clients.client);

          case 2:
            indices = _context.sent;
            actions = [];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 7;

            for (_iterator = (0, _getIterator3.default)(indices); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              index = _step.value;

              actions.push({ index: { _index: index, _id: id } });
              actions.push(body);
            }
            _context.next = 15;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context['catch'](7);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 15:
            _context.prev = 15;
            _context.prev = 16;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 18:
            _context.prev = 18;

            if (!_didIteratorError) {
              _context.next = 21;
              break;
            }

            throw _iteratorError;

          case 21:
            return _context.finish(18);

          case 22:
            return _context.finish(15);

          case 23:
            return _context.abrupt('return', _clients.client.bulk({
              type: type,
              body: actions,
              routing: body.botId
            }));

          case 24:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[7, 11, 15, 23], [16,, 18, 22]]);
  }));
  return function indexAnswer(_x) {
    return ref.apply(this, arguments);
  };
}();

var deleteAnswer = exports.deleteAnswer = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(botId, id) {
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
              routing: botId
            }));

          case 24:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[7, 11, 15, 23], [16,, 18, 22]]);
  }));
  return function deleteAnswer(_x2, _x3) {
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

var debug = require('debug')('core:es:answer');

var type = 'answer';

function getQuery(botId, query) {
  return {
    query: {
      filtered: {
        query: {
          match: {
            title: {
              query: query,
              minimum_should_match: '50%'
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
  return _clients.strictClient.search((0, _extends3.default)({}, _getClient.config.read, options, {
    type: type,
    body: body
  }));
}

function explain(botId, query, answerId) {
  var body = getQuery(botId, query);
  return _clients.client.explain((0, _extends3.default)({}, _getClient.config.read, _getClient.config.explain, {
    type: type,
    body: body,
    id: answerId,
    routing: botId
  }));
}

function validate(botId, query) {
  var body = getQuery(botId, query);
  return _clients.client.indices.validateQuery((0, _extends3.default)({}, _getClient.config.read, _getClient.config.explain, {
    type: type,
    body: body,
    explain: true,
    routing: botId
  }));
}

function analyze(_ref2) {
  var query = _ref2.query;
  var rest = (0, _objectWithoutProperties3.default)(_ref2, ['query']);

  return _clients.client.indices.analyze((0, _extends3.default)({}, _getClient.config.read, rest, {
    type: type,
    text: query
  }));
}