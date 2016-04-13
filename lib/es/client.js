'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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

function credentials() {
  return new _promise2.default(function (resolve, reject) {
    var provider = new _awsSdk2.default.CredentialProviderChain();
    provider.resolve(function (err, creds) {
      if (err) return reject(err);
      resolve(creds);
    });
  });
}

exports.default = new _elasticsearch.Client({
  apiVersion: '1.5',
  host: process.env.ES_HOST,
  connectionClass: _httpAwsEs2.default,
  amazonES: {
    region: process.env.AWS_REGION,
    credentials: credentials()
  }
});