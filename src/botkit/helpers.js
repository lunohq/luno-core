
export function getFormalName(bot) {
  return `${bot.identity.name.charAt(0).toUpperCase()}${bot.identity.name.slice(1)}`
}

export function getSummonVerb(message) {
  const { luno: { directMessage } } = message
  let summon = '@mention'
  if (directMessage) {
    summon = 'message'
  }
  return summon
}

export function getSummonName(bot, message) {
  const { luno: { directMessage } } = message
  let summonName = `@${bot.identity.name} `
  if (directMessage) {
    summonName = ''
  }
  return summonName
}
