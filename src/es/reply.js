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

function newAttachmentsFooter(attachments) {
  const formattedAttachments = attachments.map(({ file: { permalink, name } }) => `<${permalink}|${name}>`)
  return `_Attachments: ${formattedAttachments.join(', ')}_`
}

function toArray(commaDelimitedValue) {
  const values = commaDelimitedValue.trim().split(',')
  const output = []
  values.forEach(value => {
    if (value.trim()) {
      output.push(value)
    }
  })
  return output
}

export async function indexReply({ reply: { id, title: rawTitle, keywords, attachments = [], ...body }, topics }) {
  let title = rawTitle
  let displayTitle = rawTitle
  body.titleV2 = rawTitle
  if (topics) {
    const prefix = newTopicPrefix(topics)
    title = `${prefix} ${title}`.trim()
    displayTitle = title
    body.topic = topics[0].name
  }

  if (keywords) {
    const suffix = newKeywordsSuffix(keywords)
    title = `${title} ${suffix}`.trim()
    body.keywords = toArray(keywords)
  }

  if (attachments.length) {
    const footer = newAttachmentsFooter(attachments)
    body.body = `${body.body}\n---\n${footer}`
  }

  body.title = title
  body.displayTitle = displayTitle
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
      let title = `[${name}] ${reply.title}`
      const displayTitle = title
      if (reply.keywords) {
        const suffix = newKeywordsSuffix(reply.keywords)
        title = `${title} ${suffix}`.trim()
      }
      actions.push({ update: { _index: index, _id: reply.id } })
      actions.push({ doc: { title, displayTitle, topic: name } })
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

function getTieredQuery({ teamId, query, minimumShouldMatch }) {
  return {
    query: {
      filtered: {
        query: {
          multi_match: {
            query,
            type: 'cross_fields',
            fields: [
              'titleV2',
              'body',
              'keywords',
              'topic',
            ],
            minimum_should_match: minimumShouldMatch,
          },
        },
        filter: {
          term: { teamId },
        },
      },
    },
  }
}

export async function msearch({ teamId, query, options = {} }) {
  const meta = {
    ...config.read,
    type,
  }

  const { requestTimeout, ...rest } = options

  function tier(minimumShouldMatch) {
    const main = getTieredQuery({ teamId, query, minimumShouldMatch })
    return {
      ...main,
      ...rest,
    }
  }

  const tiers = [
    // tier 1
    meta,
    tier('100%'),
    // tier 2
    meta,
    tier('1<50% 2<65% 3<75%'),
    // tier 3
    meta,
    tier(1),
  ]
  return strictClient.msearch({ body: tiers, requestTimeout, ...rest })
}

export function explain({ teamId, query, replyId }) {
  const body = getQuery({ teamId, query })
  return client.explain({
    ...config.read,
    ...config.explain,
    type,
    body,
    id: replyId,
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
