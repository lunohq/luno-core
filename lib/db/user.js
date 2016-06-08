'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scan = exports.getAdmins = exports.getStaff = exports.getUsers = exports.updateUser = exports.getUser = exports.AnonymousUser = exports.User = exports.CONSUMER = exports.TRAINER = exports.ADMIN = exports.table = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

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

var updateUser = exports.updateUser = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(user) {
    var now, params, profile, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, key, value, data;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            now = new Date().toISOString();
            params = {
              TableName: table,
              Key: { id: user.id },
              UpdateExpression: '\n      SET\n        #created = if_not_exists(#created, :created)\n        , #teamId = :teamId\n        , #changed = :changed\n        ' + (user.role !== undefined ? ', #role = :role' : '') + '\n        ' + (user.accessToken ? ', #accessToken = :accessToken' : '') + '\n        ' + (user.user ? ', #user = :user' : '') + '\n        ' + (user.email ? ', #email = :email' : '') + '\n        ' + (user.scopes ? ', #scopes = :scopes' : '') + '\n        ' + (user.invite ? ', #invite = :invite' : '') + '\n        ' + (user.profile ? ', #profile = :profile' : '') + '\n    ',
              ExpressionAttributeNames: {
                '#teamId': 'teamId',
                '#created': 'created',
                '#changed': 'changed'
              },
              ExpressionAttributeValues: {
                ':teamId': user.teamId,
                ':created': now,
                ':changed': now
              },
              ReturnValues: 'ALL_NEW'
            };

            if (!(user.role !== undefined)) {
              _context2.next = 7;
              break;
            }

            if (isValidRole(user.role)) {
              _context2.next = 5;
              break;
            }

            throw new Error('Invalid role');

          case 5:
            params.ExpressionAttributeNames['#role'] = 'role';
            params.ExpressionAttributeValues[':role'] = user.role;

          case 7:

            if (user.user) {
              params.ExpressionAttributeNames['#user'] = 'user';
              params.ExpressionAttributeValues[':user'] = user.user;
            }

            if (user.email) {
              params.ExpressionAttributeNames['#email'] = 'email';
              params.ExpressionAttributeValues[':email'] = user.email;
            }

            if (user.scopes) {
              params.ExpressionAttributeNames['#scopes'] = 'scopes';
              params.ExpressionAttributeValues[':scopes'] = user.scopes;
            }

            if (user.accessToken) {
              params.ExpressionAttributeNames['#accessToken'] = 'accessToken';
              params.ExpressionAttributeValues[':accessToken'] = user.accessToken;
            }

            if (user.invite) {
              params.ExpressionAttributeNames['#invite'] = 'invite';
              params.ExpressionAttributeValues[':invite'] = user.invite;
            }

            if (!user.profile) {
              _context2.next = 35;
              break;
            }

            profile = {};
            // dynamodb will throw an error if we attempt to save empty strings

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 17;
            for (_iterator = (0, _getIterator3.default)((0, _keys2.default)(user.profile)); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              key = _step.value;
              value = user.profile[key];

              if (value !== '') {
                profile[key] = value;
              }
            }
            _context2.next = 25;
            break;

          case 21:
            _context2.prev = 21;
            _context2.t0 = _context2['catch'](17);
            _didIteratorError = true;
            _iteratorError = _context2.t0;

          case 25:
            _context2.prev = 25;
            _context2.prev = 26;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 28:
            _context2.prev = 28;

            if (!_didIteratorError) {
              _context2.next = 31;
              break;
            }

            throw _iteratorError;

          case 31:
            return _context2.finish(28);

          case 32:
            return _context2.finish(25);

          case 33:
            params.ExpressionAttributeNames['#profile'] = 'profile';
            params.ExpressionAttributeValues[':profile'] = profile;

          case 35:
            _context2.next = 37;
            return _client2.default.update(params).promise();

          case 37:
            data = _context2.sent;
            return _context2.abrupt('return', (0, _client.fromDB)(User, data.Attributes));

          case 39:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[17, 21, 25, 33], [26,, 28, 32]]);
  }));
  return function updateUser(_x2) {
    return ref.apply(this, arguments);
  };
}();

var executeScan = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(params) {
    var users, items;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            users = void 0;
            _context3.next = 3;
            return _client2.default.scanAll(params);

          case 3:
            items = _context3.sent;

            if (items) {
              users = items.map(function (item) {
                return (0, _client.fromDB)(User, item);
              });
            }
            return _context3.abrupt('return', users);

          case 6:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return function executeScan(_x3) {
    return ref.apply(this, arguments);
  };
}();

var getUsers = exports.getUsers = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(teamId) {
    var params;
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
            return _context4.abrupt('return', executeScan(params));

          case 2:
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

var getStaff = exports.getStaff = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(teamId) {
    var params;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            params = {
              TableName: table,
              FilterExpression: 'teamId = :teamId AND #role IN (:admin, :trainer)',
              ExpressionAttributeNames: {
                '#role': 'role'
              },
              ExpressionAttributeValues: {
                ':teamId': teamId,
                ':admin': ADMIN,
                ':trainer': TRAINER
              }
            };
            return _context5.abrupt('return', executeScan(params));

          case 2:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return function getStaff(_x5) {
    return ref.apply(this, arguments);
  };
}();

var getAdmins = exports.getAdmins = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(teamId) {
    var params;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            params = {
              TableName: table,
              FilterExpression: 'teamId = :teamId AND #role = :admin',
              ExpressionAttributeNames: {
                '#role': 'role'
              },
              ExpressionAttributeValues: {
                ':admin': ADMIN,
                ':teamId': teamId
              }
            };
            return _context6.abrupt('return', executeScan(params));

          case 2:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));
  return function getAdmins(_x6) {
    return ref.apply(this, arguments);
  };
}();

var scan = exports.scan = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var params;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            params = (0, _extends3.default)({
              TableName: table
            }, options);
            return _context7.abrupt('return', executeScan(params));

          case 2:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));
  return function scan(_x7) {
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
    key: 'isAdmin',
    get: function get() {
      // this.role === undefined is for backwards compatibility for existing
      // admin users.
      return !this.anonymous && (this.role === undefined || this.role === ADMIN);
    }
  }, {
    key: 'isTrainer',
    get: function get() {
      return !this.anonymous && this.role === TRAINER;
    }
  }, {
    key: 'isConsumer',
    get: function get() {
      return !this.anonymous && this.role === CONSUMER;
    }
  }, {
    key: 'isStaff',
    get: function get() {
      return this.isAdmin || this.isTrainer;
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