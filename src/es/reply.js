import getClient, { config } from './getClient'

const type = 'reply'

const client = getClient()

function newTopicPrefix(topics) {
  const names = topics.map(topic => `[${topic.name}]`)
  return names.join(' ')
}

export function indexReply({ reply: { id, title, ...body }, topics }) {
  const prefix = newTopicPrefix(topics)
  const prefixedTitle = `${prefix} ${title}`.trim()
  body.title = prefixedTitle
  return client.index({
    ...config.write,
    type,
    id,
    body,
    routing: body.teamId,
  })
}

export async function deleteReply({ teamId, id }) {
  let res
  try {
    res = await client.delete({
      ...config.write,
      type,
      id,
      routing: teamId,
    })
  } catch (err) {
    if (err.status !== 404) throw err
  }
  return res
}

function getQuery({ teamId, query }) {
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
          term: { teamId },
        },
      },
    },
  }
}

export function search({ teamId, query, options = {} }) {
  const body = getQuery({ teamId, query })
  return client.search({
    ...config.read,
    ...options,
    type,
    body,
  })
}

export function explain({ teamId, query, answerId }) {
  const body = getQuery({ teamId, query })
  return client.explain({
    ...config.read,
    ...config.explain,
    type,
    body,
    id: answerId,
    routing: teamId,
  })
}

export function validate({ teamId, query }) {
  const body = getQuery({ teamId, query })
  return client.indices.validateQuery({
    ...config.read,
    ...config.explain,
    type,
    body,
    explain: true,
    routing: teamId,
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
