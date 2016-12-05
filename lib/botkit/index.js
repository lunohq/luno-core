'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.helpers = exports.storage = undefined;

var _storage = require('./storage');

Object.defineProperty(exports, 'storage', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_storage).default;
  }
});

var _helpers2 = require('./helpers');

var _helpers = _interopRequireWildcard(_helpers2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.helpers = _helpers;