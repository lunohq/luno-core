'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteTopic = exports.updateTopicName = exports.deleteReply = exports.indexReply = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var indexReply = exports.indexReply = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref2) {
    var _ref2$reply = _ref2.reply;
    var id = _ref2$reply.id;
    var rawTitle = _ref2$reply.title;
    var keywords = _ref2$reply.keywords;
    var attachments = _ref2$reply.attachments;
    var body = (0, _objectWithoutProperties3.default)(_ref2$reply, ['id', 'title', 'keywords', 'attachments']);
    var topics = _ref2.topics;

    var title, displayTitle, prefix, suffix, footer, indices, actions, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, index;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            title = rawTitle;
            displayTitle = rawTitle;

            body.titleV2 = rawTitle;
            if (topics) {
              prefix = newTopicPrefix(topics);

              title = (prefix + ' ' + title).trim();
              displayTitle = title;
              body.topic = topics[0].name;
            }

            if (keywords) {
              suffix = newKeywordsSuffix(keywords);

              title = (title + ' ' + suffix).trim();
              body.keywords = toArray(keywords);
            }

            if (attachments) {
              footer = newAttachmentsFooter(attachments);

              body.body = body.body + '\n---\n' + footer;
            }

            body.title = title;
            body.displayTitle = displayTitle;
            _context.next = 10;
            return (0, _getClient.getWriteIndices)(_clients.client);

          case 10:
            indices = _context.sent;
            actions = [];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 15;

            for (_iterator = (0, _getIterator3.default)(indices); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              index = _step.value;

              actions.push({ index: { _index: index, _id: id } });
              actions.push(body);
            }
            _context.next = 23;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context['catch'](15);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 23:
            _context.prev = 23;
            _context.prev = 24;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 26:
            _context.prev = 26;

            if (!_didIteratorError) {
              _context.next = 29;
              break;
            }

            throw _iteratorError;

          case 29:
            return _context.finish(26);

          case 30:
            return _context.finish(23);

          case 31:
            return _context.abrupt('return', _clients.client.bulk({
              type: type,
              body: actions,
              routing: body.teamId
            }));

          case 32:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[15, 19, 23, 31], [24,, 26, 30]]);
  }));
  return function indexReply(_x) {
    return ref.apply(this, arguments);
  };
}();

var deleteReply = exports.deleteReply = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref3) {
    var teamId = _ref3.teamId;
    var id = _ref3.id;

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
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_ref4) {
    var teamId = _ref4.teamId;
    var topicId = _ref4.topicId;
    var name = _ref4.name;
    var replies = _ref4.replies;

    var _require,
    // avoid circular import
    getRepliesForTopic, promises, res, indices, actions, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, reply, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, index, title, displayTitle, suffix, resp;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _require = require('../db/reply');
            getRepliesForTopic = _require.getRepliesForTopic;
            promises = [(0, _getClient.getWriteIndices)(_clients.client)];

            if (replies === undefined) {
              promises.push(getRepliesForTopic({ teamId: teamId, topicId: topicId }));
            }
            _context3.next = 6;
            return _promise2.default.all(promises);

          case 6:
            res = _context3.sent;
            indices = res[0];

            if (replies === undefined) {
              replies = res[1];
            }

            actions = [];
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context3.prev = 13;
            _iterator3 = (0, _getIterator3.default)(replies);

          case 15:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context3.next = 39;
              break;
            }

            reply = _step3.value;
            _iteratorNormalCompletion4 = true;
            _didIteratorError4 = false;
            _iteratorError4 = undefined;
            _context3.prev = 20;

            for (_iterator4 = (0, _getIterator3.default)(indices); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              index = _step4.value;
              title = '[' + name + '] ' + reply.title;
              displayTitle = title;

              if (reply.keywords) {
                suffix = newKeywordsSuffix(reply.keywords);

                title = (title + ' ' + suffix).trim();
              }
              actions.push({ update: { _index: index, _id: reply.id } });
              actions.push({ doc: { title: title, displayTitle: displayTitle, topic: name } });
            }
            _context3.next = 28;
            break;

          case 24:
            _context3.prev = 24;
            _context3.t0 = _context3['catch'](20);
            _didIteratorError4 = true;
            _iteratorError4 = _context3.t0;

          case 28:
            _context3.prev = 28;
            _context3.prev = 29;

            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }

          case 31:
            _context3.prev = 31;

            if (!_didIteratorError4) {
              _context3.next = 34;
              break;
            }

            throw _iteratorError4;

          case 34:
            return _context3.finish(31);

          case 35:
            return _context3.finish(28);

          case 36:
            _iteratorNormalCompletion3 = true;
            _context3.next = 15;
            break;

          case 39:
            _context3.next = 45;
            break;

          case 41:
            _context3.prev = 41;
            _context3.t1 = _context3['catch'](13);
            _didIteratorError3 = true;
            _iteratorError3 = _context3.t1;

          case 45:
            _context3.prev = 45;
            _context3.prev = 46;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 48:
            _context3.prev = 48;

            if (!_didIteratorError3) {
              _context3.next = 51;
              break;
            }

            throw _iteratorError3;

          case 51:
            return _context3.finish(48);

          case 52:
            return _context3.finish(45);

          case 53:
            resp = void 0;

            if (actions.length) {
              resp = _clients.client.bulk({
                type: type,
                body: actions,
                routing: teamId
              });
            }
            return _context3.abrupt('return', resp);

          case 56:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[13, 41, 45, 53], [20, 24, 28, 36], [29,, 31, 35], [46,, 48, 52]]);
  }));
  return function updateTopicName(_x3) {
    return ref.apply(this, arguments);
  };
}();

var deleteTopic = exports.deleteTopic = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(_ref5) {
    var teamId = _ref5.teamId;
    var topicId = _ref5.topicId;

    var _ref6, _ref7, items, indices, actions, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, item, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, index, resp;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _promise2.default.all([(0, _topicItem.getItemsForTopic)({ teamId: teamId, topicId: topicId }), (0, _getClient.getWriteIndices)(_clients.client)]);

          case 2:
            _ref6 = _context4.sent;
            _ref7 = (0, _slicedToArray3.default)(_ref6, 2);
            items = _ref7[0];
            indices = _ref7[1];
            actions = [];
            _iteratorNormalCompletion5 = true;
            _didIteratorError5 = false;
            _iteratorError5 = undefined;
            _context4.prev = 10;
            _iterator5 = (0, _getIterator3.default)(items);

          case 12:
            if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
              _context4.next = 36;
              break;
            }

            item = _step5.value;
            _iteratorNormalCompletion6 = true;
            _didIteratorError6 = false;
            _iteratorError6 = undefined;
            _context4.prev = 17;

            for (_iterator6 = (0, _getIterator3.default)(indices); !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              index = _step6.value;

              actions.push({ delete: { _index: index, _id: item.itemId } });
            }
            _context4.next = 25;
            break;

          case 21:
            _context4.prev = 21;
            _context4.t0 = _context4['catch'](17);
            _didIteratorError6 = true;
            _iteratorError6 = _context4.t0;

          case 25:
            _context4.prev = 25;
            _context4.prev = 26;

            if (!_iteratorNormalCompletion6 && _iterator6.return) {
              _iterator6.return();
            }

          case 28:
            _context4.prev = 28;

            if (!_didIteratorError6) {
              _context4.next = 31;
              break;
            }

            throw _iteratorError6;

          case 31:
            return _context4.finish(28);

          case 32:
            return _context4.finish(25);

          case 33:
            _iteratorNormalCompletion5 = true;
            _context4.next = 12;
            break;

          case 36:
            _context4.next = 42;
            break;

          case 38:
            _context4.prev = 38;
            _context4.t1 = _context4['catch'](10);
            _didIteratorError5 = true;
            _iteratorError5 = _context4.t1;

          case 42:
            _context4.prev = 42;
            _context4.prev = 43;

            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }

          case 45:
            _context4.prev = 45;

            if (!_didIteratorError5) {
              _context4.next = 48;
              break;
            }

            throw _iteratorError5;

          case 48:
            return _context4.finish(45);

          case 49:
            return _context4.finish(42);

          case 50:
            resp = void 0;

            if (actions.length) {
              resp = _clients.client.bulk({
                type: type,
                body: actions,
                routing: teamId
              });
            }
            return _context4.abrupt('return', resp);

          case 53:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[10, 38, 42, 50], [17, 21, 25, 33], [26,, 28, 32], [43,, 45, 49]]);
  }));
  return function deleteTopic(_x4) {
    return ref.apply(this, arguments);
  };
}();

exports.search = search;
exports.searchV2 = searchV2;
exports.explain = explain;
exports.validate = validate;
exports.analyze = analyze;

var _getClient = require('./getClient');

var _clients = require('./clients');

var _topicItem = require('../db/topicItem');

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

function newKeywordsSuffix(keywords) {
  var words = keywords.trim().split(',');
  return words.map(function (word) {
    return word.trim();
  }).join(' ');
}

function newAttachmentsFooter(attachments) {
  var formattedAttachments = attachments.map(function (_ref) {
    var _ref$file = _ref.file;
    var permalink = _ref$file.permalink;
    var name = _ref$file.name;
    return '<' + permalink + '|' + name + '>';
  });
  return '_Attachments: ' + formattedAttachments.join(', ') + '_';
}

function toArray(commaDelimitedValue) {
  var values = commaDelimitedValue.trim().split(',');
  var output = [];
  values.forEach(function (value) {
    if (value.trim()) {
      output.push(value);
    }
  });
  return output;
}

function getQuery(_ref8) {
  var teamId = _ref8.teamId;
  var query = _ref8.query;

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

function getQueryV2(_ref9) {
  var teamId = _ref9.teamId;
  var query = _ref9.query;

  return {
    query: {
      filtered: {
        query: {
          bool: {
            should: [{
              bool: {
                should: [{ match: { titleV2: { query: query } } }, { match: { 'titleV2.raw': { query: query } } }, { match: { 'titleV2.shingles': { query: query } } }]
              }
            }, {
              bool: {
                should: [{ match: { body: { query: query } } }, { match: { 'body.shingles': { query: query } } }]
              }
            }, {
              bool: {
                should: [{ match: { keywords: { query: query } } }, { match: { 'keywords.raw': { query: query } } }, { match: { 'keywords.shingles': { query: query } } }]
              }
            }, {
              bool: {
                should: [{ match: { topic: { query: query } } }, { match: { 'topic.raw': { query: query } } }, { match: { 'topic.shingles': { query: query } } }]
              }
            }]
          }
        },
        filter: {
          term: { teamId: teamId }
        }
      }
    }
  };
}

function search(_ref10) {
  var teamId = _ref10.teamId;
  var query = _ref10.query;
  var _ref10$options = _ref10.options;
  var options = _ref10$options === undefined ? {} : _ref10$options;

  var body = getQuery({ teamId: teamId, query: query });
  return _clients.strictClient.search((0, _extends3.default)({}, _getClient.config.read, options, {
    type: type,
    body: body
  }));
}

function searchV2(_ref11) {
  var teamId = _ref11.teamId;
  var query = _ref11.query;
  var _ref11$options = _ref11.options;
  var options = _ref11$options === undefined ? {} : _ref11$options;

  var body = getQueryV2({ teamId: teamId, query: query });
  return _clients.strictClient.search((0, _extends3.default)({}, _getClient.config.read, options, {
    type: type,
    body: body
  }));
}

function explain(_ref12) {
  var teamId = _ref12.teamId;
  var query = _ref12.query;
  var replyId = _ref12.replyId;

  var body = getQuery({ teamId: teamId, query: query });
  return _clients.client.explain((0, _extends3.default)({}, _getClient.config.read, _getClient.config.explain, {
    type: type,
    body: body,
    id: replyId,
    routing: teamId
  }));
}

function validate(_ref13) {
  var teamId = _ref13.teamId;
  var query = _ref13.query;

  var body = getQuery({ teamId: teamId, query: query });
  return _clients.client.indices.validateQuery((0, _extends3.default)({}, _getClient.config.read, _getClient.config.explain, {
    type: type,
    body: body,
    explain: true,
    routing: teamId
  }));
}

function analyze(_ref14) {
  var query = _ref14.query;
  var rest = (0, _objectWithoutProperties3.default)(_ref14, ['query']);

  return _clients.client.indices.analyze((0, _extends3.default)({}, _getClient.config.read, rest, {
    type: type,
    text: query
  }));
}