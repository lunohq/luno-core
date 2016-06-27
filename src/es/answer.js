import getClient, { config, getWriteIndices } from './getClient'

const debug = require('debug')('core:es:answer')

const type = 'answer'

// Create two clients to allow for longer requests while indexing
const client = getClient({ requestTimeout: 3000 })
const strictClient = getClient()

export async function indexAnswer({ id, ...body }) {
  const indices = await getWriteIndices(client)
  const actions = []
  for (const index of indices) {
    actions.push({ index: { _index: index, _id: id } })
    actions.push(body)
  }
  return client.bulk({
    type,
    body: actions,
    routing: body.botId,
  })
}

export async function deleteAnswer(botId, id) {
  const indices = await getWriteIndices(client)
  const actions = []
  for (const index of indices) {
    actions.push({ delete: { _index: index, _id: id } })
  }
  return client.bulk({
    type,
    body: actions,
    routing: botId,
  })
}

function getQuery(botId, query) {
  return {
    query: {
      filtered: {
        query: {
          common: {
            title: {
              query,
              cutoff_frequency: 0.001,
            },
          },
        },
        filter: {
          term: { botId: botId },
        },
      },
    },
  }
}

export function search(botId, query, options = {}) {
  const body = getQuery(botId, query)
  return strictClient.search({
    ...config.read,
    ...options,
    type,
    body,
  })
}

export function explain(botId, query, answerId) {
  const body = getQuery(botId, query)
  return client.explain({
    ...config.read,
    ...config.explain,
    type,
    body,
    id: answerId,
    routing: botId,
  })
}

export function validate(botId, query) {
  const body = getQuery(botId, query)
  return client.indices.validateQuery({
    ...config.read,
    ...config.explain,
    type,
    body,
    explain: true,
    routing: botId,
  })
}

export function analyze({ query, ...rest }) {
  return client.indices.analyze({
    ...config.read,
    ...rest,
    type,
    text: query,
  })
}
