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

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var type = 'answer';

function indexAnswer(_ref) {
  var id = _ref.id;
  var body = (0, _objectWithoutProperties3.default)(_ref, ['id']);

  return new _promise2.default(function (resolve, reject) {
    _client2.default.index((0, _extends3.default)({}, _client.config.write, {
      type: type,
      id: id,
      body: body
    }), function (err, res) {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}

function deleteAnswer(id) {
  return new _promise2.default(function (resolve, reject) {
    _client2.default.delete((0, _extends3.default)({}, _client.config.write, {
      type: type,
      id: id
    }), function (err, res) {
      if (err && err.status !== 404) return reject(err);
      return resolve(res);
    });
  });
}

function search(botId, query) {
  var body = {
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

  return new _promise2.default(function (resolve, reject) {
    _client2.default.search((0, _extends3.default)({}, _client.config.read, {
      type: type,
      body: body,
      explain: true
    }), function (err, res) {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}