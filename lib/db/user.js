'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnonymousUser = exports.User = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

exports.getUser = getUser;
exports.updateUser = updateUser;
exports.getUsers = getUsers;

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var table = (0, _client.resolveTableName)('user-v1');

var User = exports.User = function User() {
  (0, _classCallCheck3.default)(this, User);
  this.anonymous = false;
};

;

var AnonymousUser = exports.AnonymousUser = function (_User) {
  (0, _inherits3.default)(AnonymousUser, _User);

  function AnonymousUser() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, AnonymousUser);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(AnonymousUser)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.anonymous = true, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  return AnonymousUser;
}(User);

;

function getUser(id) {
  return new _promise2.default(function (resolve, reject) {
    var params = {
      TableName: table,
      Key: { id: id }
    };

    _client2.default.get(params, function (err, data) {
      if (err) return reject(err);

      var user = void 0;
      if (data.Item) {
        user = (0, _client.fromDB)(User, data.Item);
      }

      return resolve(user);
    });
  });
}

function updateUser(user) {
  var now = new Date().toISOString();
  var params = {
    TableName: table,
    Key: { id: user.id },
    UpdateExpression: '\n      SET\n        #accessToken = :accessToken,\n        #scopes = :scopes,\n        #teamId = :teamId,\n        #user = :user,\n        #created = if_not_exists(#created, :created),\n        #changed = :changed\n    ',
    ExpressionAttributeNames: {
      '#accessToken': 'accessToken',
      '#scopes': 'scopes',
      '#teamId': 'teamId',
      '#user': 'user',
      '#created': 'created',
      '#changed': 'changed'
    },
    ExpressionAttributeValues: {
      ':accessToken': user.accessToken,
      ':scopes': user.scopes,
      ':teamId': user.teamId,
      ':user': user.user,
      ':created': now,
      ':changed': now
    },
    ReturnValues: 'ALL_NEW'
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.update(params, function (err, data) {
      if (err) return reject(err);
      user = (0, _client.fromDB)(User, data.Attributes);
      return resolve(user);
    });
  });
}

function getUsers(teamId) {
  var params = {
    TableName: table,
    FilterExpression: 'teamId = :teamId',
    ExpressionAttributeValues: {
      ':teamId': teamId
    }
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.scan(params, function (err, data) {
      if (err) return reject(err);
      return resolve(data.Items.map(function (item) {
        return (0, _client.fromDB)(User, item);
      }));
    });
  });
}