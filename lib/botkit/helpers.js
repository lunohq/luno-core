'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFormalName = getFormalName;
exports.getSummonVerb = getSummonVerb;
exports.getSummonName = getSummonName;
function getFormalName(bot) {
  return '' + bot.identity.name.charAt(0).toUpperCase() + bot.identity.name.slice(1);
}

function getSummonVerb(message) {
  var directMessage = message.luno.directMessage;

  var summon = '@mention';
  if (directMessage) {
    summon = 'message';
  }
  return summon;
}

function getSummonName(bot, message) {
  var directMessage = message.luno.directMessage;

  var summonName = '@' + bot.identity.name + ' ';
  if (directMessage) {
    summonName = '';
  }
  return summonName;
}