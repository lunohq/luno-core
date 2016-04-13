'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = undefined;

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _elasticsearch = require('elasticsearch');

var _httpAwsEs = require('http-aws-es');

var _httpAwsEs2 = _interopRequireDefault(_httpAwsEs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var indices = {
  write: 'luno-bot-write',
  read: 'luno-bot-read'
};

var config = exports.config = {
  indices: indices,
  write: {
    index: indices.write
  }
};

exports.default = new _elasticsearch.Client({
  apiVersion: '1.5',
  host: process.env.ES_HOST,
  connectionClass: _httpAwsEs2.default,
  amazonES: {
    region: process.env.AWS_REGION,
    credentials: _awsSdk2.default.Config.prototype.keys.credentials()
  }
});