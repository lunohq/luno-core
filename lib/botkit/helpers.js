'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFormalName = getFormalName;
exports.getSummonVerb = getSummonVerb;
exports.getSummonName = getSummonName;
function getFormalName(bot) {
  return '' + bot.name.charAt(0).toUpperCase() + bot.name.slice(1);
}

function getSummonVerb(isDM) {
  var summon = '@mention';
  if (isDM) {
    summon = 'message';
  }
  return summon;
}

function getSummonName(_ref) {
  var bot = _ref.bot;
  var isDM = _ref.isDM;

  var summonName = '@' + bot.name + ' ';
  if (isDM) {
    summonName = '';
  }
  return summonName;
}