import { config, getWriteIndices } from './getClient'
import { client, strictClient } from './clients'

const debug = require('debug')('core:es:reply')

const type = 'reply'

function newTopicPrefix(topics) {
  const names = topics.map(topic => topic.name ? `[${topic.name}]` : '')
  return names.join(' ')
}

export async function indexReply({ reply: { id, title, ...body }, topics }) {
  const prefix = newTopicPrefix(topics)
  const prefixedTitle = `${prefix} ${title}`.trim()
  body.title = prefixedTitle
  const indices = await getWriteIndices(client)
  const actions = []
  for (const index of indices) {
    actions.push({ index: { _index: index, _id: id } })
    actions.push(body)
  }
  return client.bulk({
    type,
    body: actions,
    routing: body.teamId,
  })
}

export async function deleteReply({ teamId, id }) {
  const indices = await getWriteIndices(client)
  const actions = []
  for (const index of indices) {
    actions.push({ delete: { _index: index, _id: id } })
  }
  return client.bulk({
    type,
    body: actions,
    routing: teamId,
  })
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
  return strictClient.search({
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
