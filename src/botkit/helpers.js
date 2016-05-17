
export function getFormalName({ identities: { bot } }) {
  return `${bot.name.charAt(0).toUpperCase()}${bot.name.slice(1)}`
}

export function getSummonVerb({ _directMessage }) {
  let summon = '@mention'
  if (_directMessage) {
    summon = 'message'
  }
  return summon
}

export function getSummonName({ ctx, message }) {
  const { identities: { bot } } = ctx
  let summonName = `@${bot.name} `
  if (message._directMessage) {
    summonName = ''
  }
  return summonName
}
