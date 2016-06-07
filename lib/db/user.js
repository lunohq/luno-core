'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scan = exports.getUsers = exports.updateUser = exports.updateUserRole = exports.getUser = exports.AnonymousUser = exports.User = exports.CONSUMER = exports.TRAINER = exports.ADMIN = exports.table = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var getUser = exports.getUser = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(id) {
    var params, data, user;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            params = {
              TableName: table,
              Key: { id: id }
            };
            _context.next = 3;
            return _client2.default.get(params).promise();

          case 3:
            data = _context.sent;
            user = void 0;

            if (data.Item) {
              user = (0, _client.fromDB)(User, data.Item);
            }
            return _context.abrupt('return', user);

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function getUser(_x) {
    return ref.apply(this, arguments);
  };
}();

var updateUserRole = exports.updateUserRole = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref) {
    var id = _ref.id;
    var role = _ref.role;
    var now, params, data;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (isValidRole(role)) {
              _context2.next = 2;
              break;
            }

            throw new Error('Invalid Role');

          case 2:
            now = new Date().toISOString();
            params = {
              TableName: table,
              Key: { id: id },
              UpdateExpression: '\n      SET #role = :role\n    ',
              ExpressionAttributeNames: {
                '#role': 'role'
              },
              ExpressionAttributeValues: {
                ':role': role
              },
              ReturnValues: 'ALL_NEW'
            };
            _context2.next = 6;
            return _client2.default.update(params).promise();

          case 6:
            data = _context2.sent;
            return _context2.abrupt('return', (0, _client.fromDB)(User, data.Attributes));

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return function updateUserRole(_x2) {
    return ref.apply(this, arguments);
  };
}();

var updateUser = exports.updateUser = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(user) {
    var now, params, role, data;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            now = new Date().toISOString();
            params = {
              TableName: table,
              Key: { id: user.id },
              UpdateExpression: '\n      SET\n        #accessToken = :accessToken\n        , #scopes = :scopes\n        , #teamId = :teamId\n        ' + (user.user ? ', #user = :user' : '') + '\n        , #created = if_not_exists(#created, :created)\n        , #changed = :changed\n        , #role = :role\n        ' + (user.email ? ', #email = :email' : '') + '\n    ',
              ExpressionAttributeNames: {
                '#accessToken': 'accessToken',
                '#scopes': 'scopes',
                '#teamId': 'teamId',
                '#created': 'created',
                '#changed': 'changed'
              },
              ExpressionAttributeValues: {
                ':accessToken': user.accessToken,
                ':scopes': user.scopes,
                ':teamId': user.teamId,
                ':created': now,
                ':changed': now
              },
              ReturnValues: 'ALL_NEW'
            };


            if (user.user) {
              params.ExpressionAttributeNames['#user'] = 'user';
              params.ExpressionAttributeValues[':user'] = user.user;
            }

            if (user.email) {
              params.ExpressionAttributeNames['#email'] = 'email';
              params.ExpressionAttributeValues[':email'] = user.email;
            }

            role = user.role;

            params.ExpressionAttributeNames['#role'] = 'role';
            if (role === undefined) {
              role = CONSUMER;
            }
            params.ExpressionAttributeValues[':role'] = role;

            if (isValidRole(role)) {
              _context3.next = 10;
              break;
            }

            throw new Error('Invalid role');

          case 10:
            _context3.next = 12;
            return _client2.default.update(params).promise();

          case 12:
            data = _context3.sent;
            return _context3.abrupt('return', (0, _client.fromDB)(User, data.Attributes));

          case 14:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return function updateUser(_x3) {
    return ref.apply(this, arguments);
  };
}();

var getUsers = exports.getUsers = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(teamId) {
    var params, data;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            params = {
              TableName: table,
              FilterExpression: 'teamId = :teamId',
              ExpressionAttributeValues: {
                ':teamId': teamId
              }
            };
            _context4.next = 3;
            return _client2.default.scanAll(params);

          case 3:
            data = _context4.sent;
            return _context4.abrupt('return', data.Items.map(function (item) {
              return (0, _client.fromDB)(User, item);
            }));

          case 5:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return function getUsers(_x4) {
    return ref.apply(this, arguments);
  };
}();

var scan = exports.scan = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var params, users, items;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            params = (0, _extends3.default)({
              TableName: table
            }, options);
            users = void 0;
            _context5.next = 4;
            return _client2.default.scanAll(params);

          case 4:
            items = _context5.sent;

            if (items) {
              users = items.map(function (item) {
                return (0, _client.fromDB)(User, item);
              });
            }
            return _context5.abrupt('return', users);

          case 7:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return function scan(_x5) {
    return ref.apply(this, arguments);
  };
}();

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var table = exports.table = (0, _client.resolveTableName)('user-v1');

var ADMIN = exports.ADMIN = 0;
var TRAINER = exports.TRAINER = 1;
var CONSUMER = exports.CONSUMER = 2;

var ROLES = [ADMIN, TRAINER, CONSUMER];

function isValidRole(role) {
  return ROLES.includes(role);
}

var User = exports.User = function () {
  function User() {
    (0, _classCallCheck3.default)(this, User);
    this.anonymous = false;
  }

  (0, _createClass3.default)(User, [{
    key: 'canTrain',
    value: function canTrain() {
      return this.admin || this.trainer;
    }
  }, {
    key: 'admin',
    get: function get() {
      // this.role === undefined is for backwards compatibility for existing
      // admin users.
      return !this.anonymous && (this.role === undefined || this.role === ADMIN);
    }
  }, {
    key: 'trainer',
    get: function get() {
      return !this.anonymous && this.role === TRAINER;
    }
  }, {
    key: 'consumer',
    get: function get() {
      return !this.anonymous && this.role === CONSUMER;
    }
  }]);
  return User;
}();

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