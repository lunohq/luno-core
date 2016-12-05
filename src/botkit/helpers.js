export function getFormalName(bot) {
  return `${bot.name.charAt(0).toUpperCase()}${bot.name.slice(1)}`
}

export function getSummonVerb(isDM) {
  let summon = '@mention'
  if (isDM) {
    summon = 'message'
  }
  return summon
}

export function getSummonName({ bot, isDM }) {
  let summonName = `@${bot.name} `
  if (isDM) {
    summonName = ''
  }
  return summonName
}
