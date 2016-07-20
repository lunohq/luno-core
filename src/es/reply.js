import { config, getWriteIndices } from './getClient'
import { client, strictClient } from './clients'
import { getItemsForTopic } from '../db/topicItem'
import env from '../config'

const debug = require('debug')('core:es:reply')

const type = 'reply'

function newTopicPrefix(topics) {
  const names = topics.map(topic => topic.name ? `[${topic.name}]` : '')
  return names.join(' ')
}

function newKeywordsSuffix(keywords) {
  const words = keywords.trim().split(',')
  return words.map(word => word.trim()).join(' ')
}

export async function indexReply({ reply: { id, title: rawTitle, keywords, ...body }, topics }) {
  let title = rawTitle
  if (topics) {
    const prefix = newTopicPrefix(topics)
    title = `${prefix} ${title}`.trim()
  }

  if (keywords) {
    const suffix = newKeywordsSuffix(keywords)
    title = `${title} ${suffix}`.trim()
  }

  body.title = title
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

export async function updateTopicName({ teamId, topicId, name, replies }) {
  // avoid circular import
  const { getRepliesForTopic } = require('../db/reply')

  const promises = [getWriteIndices(client)]
  if (replies === undefined) {
    promises.push(getRepliesForTopic({ teamId, topicId }))
  }
  const res = await Promise.all(promises)
  const indices = res[0]
  if (replies === undefined) {
    replies = res[1]
  }

  const actions = []
  for (const reply of replies) {
    for (const index of indices)  {
      const title = `[${name}] ${reply.title}`
      actions.push({ update: { _index: index, _id: reply.id } })
      actions.push({ doc: { title } })
    }
  }

  let resp
  if (actions.length) {
    resp = client.bulk({
      type,
      body: actions,
      routing: teamId,
    })
  }
  return resp
}

export async function deleteTopic({ teamId, topicId }) {
  const [items, indices] = await Promise.all([
    getItemsForTopic({ teamId, topicId }),
    getWriteIndices(client),
  ])

  const actions = []
  for (const item of items) {
    for (const index of indices) {
      actions.push({ delete: { _index: index, _id: item.itemId } })
    }
  }

  let resp
  if (actions.length) {
    resp = client.bulk({
      type,
      body: actions,
      routing: teamId,
    })
  }
  return resp
}

function getQuery({ teamId, query }) {
  return {
    query: {
      filtered: {
        query: {
          match: {
            title: {
              query,
              minimum_should_match: env.es.reply.minimum_should_match,
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
