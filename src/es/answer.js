import getClient, { config } from './getClient'

const type = 'answer'

const client = getClient()

export function indexAnswer({ id, ...body }) {
  return client.index({
    ...config.write,
    type,
    id,
    body,
    routing: body.botId,
  })
}

export async function deleteAnswer(botId, id) {
  let res
  try {
    res = await client.delete({
      ...config.write,
      type,
      id,
      routing: botId,
    })
  } catch (err) {
    if (err.status !== 404) throw err
  }
  return res
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
  return client.search({
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
