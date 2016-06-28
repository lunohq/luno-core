import uuid from 'node-uuid'

import client, { lock, compositeId, fromDB, resolveTableName } from './client'
import {
  getTopicsForItem,
  removeItemFromTopics,
  addItemToTopics,
  getItemsForTopic,
  getTopicIdsForItem,
  removeItem,
} from './topicItem'
import { getTopicsWithIds } from './topic'
import * as es from '../es/reply'

const debug = require('debug')('core:db:reply')

export const table = resolveTableName('reply-v1')

export class Reply {}

export function lockReply({ teamId, id }) {
  return lock(`reply-mutex-${teamId}:${id}`)
}

export async function createReply({ id, teamId, topicId, createdBy, ...data }) {
  const reply = new Reply()
  Object.assign(reply, data)

  // NOTE: while rolling out replies, we allow the id to be set to the answer
  // id to make it easier to sync during the roll out
  reply.id = id
  if (!id) {
    reply.id = uuid.v4()
  }
  reply.teamId = teamId
  reply.topicId = topicId
  reply.createdBy = createdBy

  const now = new Date().toISOString()
  reply.created = now
  reply.changed = now

  const params = {
    TableName: table,
    Item: reply,
  }

  const res = await Promise.all([
    addItemToTopics({ teamId, createdBy, itemId: reply.id, topicIds: [topicId] }),
    client.put(params).promise(),
    getTopicsWithIds({ teamId, topicIds: [topicId] }),
  ])
  const topics = res[2]
  // TODO this should be a transaction
  await es.indexReply({ reply, topics })
  return reply
}

export async function deleteReply({ teamId, topicId, id }) {
  let params = {
    TableName: table,
    Key: { id, teamId },
    ReturnValues: 'ALL_OLD',
    ConditionExpression: 'attribute_exists(#id)',
    ExpressionAttributeNames: {
      '#id': 'id',
    },
  }

  let data
  try {
    data = await client.delete(params).promise()
  } catch (err) {
    if (err.code === 'ConditionalCheckFailedException') {
      return null
    }
    throw err
  }

  // TODO this should all be a transaction
  const results = await Promise.all([
    es.deleteReply({ teamId, id }),
    removeItem({ teamId, itemId: id }),
  ])
  return fromDB(Reply, data.Attributes)
}

export async function getReply({ teamId, id }) {
  const params = {
    TableName: table,
    Key: { id, teamId },
  }

  const data = await client.get(params).promise()
  let reply
  if (data.Item) {
    reply = fromDB(Reply, data.Item)
  }
  return reply
}

export async function updateReply({ teamId, id, topicId, title, body, updatedBy }) {
  const params = {
    TableName: table,
    Key: { id, teamId },
    ConditionExpression: 'attribute_exists(#id)',
    UpdateExpression:`
      SET
        #title = :title,
        #body = :body,
        #changed = :changed,
        #updatedBy = :updatedBy
    `,
    ExpressionAttributeNames: {
      '#id': 'id',
      '#title': 'title',
      '#body': 'body',
      '#changed': 'changed',
      '#updatedBy': 'updatedBy',
    },
    ExpressionAttributeValues: {
      ':title': title,
      ':body': body,
      ':changed': new Date().toISOString(),
      ':updatedBy': updatedBy,
    },
    ReturnValues: 'ALL_NEW',
  }

  const mutex = await lockReply({ teamId, id })
  const topicIds = []
  const removeFrom = []
  const addTo = []
  const existingTopicIds = await getTopicIdsForItem({ teamId, itemId: id })
  debug('Existing topicIds', { existingTopicIds })
  for (const existingTopicId of existingTopicIds) {
    if (existingTopicId !== topicId) {
      removeFrom.push(existingTopicId)
    } else {
      topicIds.push(existingTopicId)
    }
  }

  if (!existingTopicIds.includes(topicId)) {
    addTo.push(topicId)
  }

  debug('Updating reply', { params })
  let data
  try {
    data = await client.update(params).promise()
  } catch (err) {
    if (err.code === 'ConditionalCheckFailedException') {
      debug('Reply does not exist')
      return null
    }
    throw err
  }

  const reply = fromDB(Reply, data.Attributes)
  const promises = [
    getTopicsWithIds({ teamId, topicIds: topicIds.concat(addTo) }),
  ]
  if (addTo.length) {
    promises.push(addItemToTopics({ teamId, itemId: id, topicIds: addTo, createdBy: updatedBy }))
  }
  if (removeFrom.length) {
    promises.push(removeItemFromTopics({ teamId, itemId: id, topicIds: removeFrom }))
  }

  debug('Updating associated reply records', { promises: promises.length, addTo, removeFrom, topicIds })
  const res = await Promise.all(promises)
  debug('Associated records results', { res })
  mutex.unlock()
  const topics = res[0]
  await es.indexReply({ reply, topics })
  return reply
}

// TODO need to handle pagination or just fetch all
export async function getRepliesForTopic({ teamId, topicId }) {
  const items = await getItemsForTopic({ teamId, topicId })
  if (!items.length) {
    return []
  }

  const params = {
    RequestItems: {
      [table]: {
        Keys: items.map(({ itemId }) => ({ teamId, id: itemId })),
      },
    },
  }
  const data = await client.batchGet(params).promise()
  let replyMap = {}
  if (data.Responses && data.Responses[table]) {
    data.Responses[table].forEach(reply => {
      replyMap[reply.id] = fromDB(Reply, reply)
    })
  }
  const replies = items.map(({ itemId }) => replyMap[itemId])
  return replies
}
