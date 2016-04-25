'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Token = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

exports.getToken = getToken;
exports.createToken = createToken;
exports.deleteToken = deleteToken;

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var table = (0, _client.resolveTableName)('token-v1');

var Token = exports.Token = function Token() {
  (0, _classCallCheck3.default)(this, Token);
};

function getToken(userId, id) {
  var params = {
    TableName: table,
    Key: { id: id, userId: userId }
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.get(params, function (err, data) {
      if (err) return reject(err);

      var token = void 0;
      if (data.Item) {
        token = (0, _client.fromDB)(Token, data.Item);
      }

      return resolve(token);
    });
  });
}

function createToken(_ref) {
  var userId = _ref.userId;
  var data = (0, _objectWithoutProperties3.default)(_ref, ['userId']);

  var token = new Token();
  var now = new Date().toISOString();
  (0, _assign2.default)(token, data);
  token.id = _nodeUuid2.default.v4();
  token.userId = userId;
  token.active = true;
  token.created = now;
  token.changed = now;

  var params = {
    TableName: table,
    Item: token
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.put(params, function (err, data) {
      if (err) return reject(err);
      return resolve(token);
    });
  });
}

function deleteToken(id, userId) {
  var params = {
    TableName: table,
    Key: { id: id, userId: userId }
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.delete(params, function (err, data) {
      if (err) return reject(err);
      return resolve();
    });
  });
}