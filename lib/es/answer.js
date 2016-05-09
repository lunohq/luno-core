'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.indexAnswer = indexAnswer;
exports.deleteAnswer = deleteAnswer;
exports.search = search;
exports.explain = explain;

var _getClient = require('./getClient');

var _getClient2 = _interopRequireDefault(_getClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var type = 'answer';

var client = (0, _getClient2.default)();

function indexAnswer(_ref) {
  var id = _ref.id;
  var body = (0, _objectWithoutProperties3.default)(_ref, ['id']);

  return new _promise2.default(function (resolve, reject) {
    client.index((0, _extends3.default)({}, _getClient.config.write, {
      type: type,
      id: id,
      body: body,
      routing: body.botId
    }), function (err, res) {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}

function deleteAnswer(botId, id) {
  return new _promise2.default(function (resolve, reject) {
    client.delete((0, _extends3.default)({}, _getClient.config.write, {
      type: type,
      id: id,
      routing: botId
    }), function (err, res) {
      if (err && err.status !== 404) return reject(err);
      return resolve(res);
    });
  });
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
  var body = getQuery(botId, query);
  return new _promise2.default(function (resolve, reject) {
    client.search((0, _extends3.default)({}, _getClient.config.read, {
      type: type,
      body: body,
      explain: true
    }), function (err, res) {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}

function explain(botId, query, answerId) {
  var body = getQuery(botId, query);
  return new _promise2.default(function (resolve, reject) {
    client.explain((0, _extends3.default)({}, _getClient.config.read, {
      type: type,
      body: body,
      id: answerId,
      routing: botId
    }), function (err, res) {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}