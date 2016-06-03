'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _storage = require('./storage');

Object.defineProperty(exports, 'storage', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_storage).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }