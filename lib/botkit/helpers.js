'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFormalName = getFormalName;
exports.getSummonVerb = getSummonVerb;
exports.getSummonName = getSummonName;
function getFormalName(_ref) {
  var bot = _ref.identities.bot;

  return '' + bot.name.charAt(0).toUpperCase() + bot.name.slice(1);
}

function getSummonVerb(_ref2) {
  var _directMessage = _ref2._directMessage;

  var summon = '@mention';
  if (_directMessage) {
    summon = 'message';
  }
  return summon;
}

function getSummonName(_ref3) {
  var ctx = _ref3.ctx;
  var message = _ref3.message;
  var bot = ctx.identities.bot;

  var summonName = '@' + bot.name + ' ';
  if (message._directMessage) {
    summonName = '';
  }
  return summonName;
}