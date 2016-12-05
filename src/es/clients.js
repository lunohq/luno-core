import getClient from './getClient'

const client = getClient({ requestTimeout: 3000 })
const strictClient = getClient()

export {
  client,
  strictClient,
}
