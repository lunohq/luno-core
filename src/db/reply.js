import uuid from 'node-uuid'

import client, { lock, compositeId, fromDB, resolveTableName } from './client'
import {
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

async function rollbackCreateReply({ id, teamId, topicId }) {
  debug('Rolling back createReply', { id, teamId, topicId })
  const res = await Promise.all([
    removeItemFromTopics({ itemId: id, topicIds: [topicId], teamId }),
    deleteReply({ teamId, topicId, id, rollback: true }),
  ])
  debug('Rolled back createReply', res)
  return res
}

async function rollbackDeleteReply({ reply, topicId }) {
  debug('Rolling back deleteReply', { reply, topicId })
  const res = await createReply({ topicId, rollback: true, ...reply })
  debug('Rolled back deleteReply', res)
  return res
}

async function rollbackUpdateReply({ previousReply, topicId }) {
  debug('Rolling back updateReply', { previousReply, topicId })
  const res = await updateReply({ topicId, rollback: true, ...previousReply })
  debug('Rolled back updateReply', res)
  return res
}

export async function createReply({ id, teamId, topicId, createdBy, rollback = false, ...data }) {
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

  if (!rollback) {
    const now = new Date().toISOString()
    reply.created = now
    reply.changed = now
  }

  const params = {
    TableName: table,
    Item: reply,
  }

  let res
  try {
    res = await Promise.all([
      addItemToTopics({ teamId, createdBy, itemId: reply.id, topicIds: [topicId] }),
      client.put(params).promise(),
      getTopicsWithIds({ teamId, topicIds: [topicId] }),
    ])
  } catch (err) {
    if (!rollback) {
      await rollbackCreateReply({ id: reply.id, teamId, topicId })
    }
    throw err
  }
  const topics = res[2]
  try {
    await es.indexReply({ reply, topics })
  } catch (err) {
    if (!rollback) {
      await rollbackCreateReply({ id: reply.id, teamId, topicId })
    }
    throw err
  }
  debug('Created reply', { reply })
  return reply
}

export async function deleteReply({ teamId, topicId, id, rollback = false }) {
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

  const reply = fromDB(Reply, data.Attributes)
  if (!rollback) {
    try {
      await Promise.all([
        es.deleteReply({ teamId, id }),
        removeItem({ teamId, itemId: id }),
      ])
    } catch (err) {
      if (!rollback) {
        await rollbackDeleteReply({ reply, topicId })
      }
      throw err
    }
  }
  debug('Deleted reply', { reply })
  return reply
}

export async function getReply({ teamId, id, options = {} }) {
  const params = {
    TableName: table,
    Key: { id, teamId },
  }
  Object.assign(params, options)

  const data = await client.get(params).promise()
  let reply
  if (data.Item) {
    reply = fromDB(Reply, data.Item)
  }
  return reply
}

export async function updateReply({ teamId, id, topicId, title, body, keywords: rawKeywords, updatedBy, changed = new Date().toISOString(), rollback = false }) {
  const keywords = rawKeywords && rawKeywords.trim()
  const params = {
    TableName: table,
    Key: { id, teamId },
    ConditionExpression: 'attribute_exists(#id)',
    UpdateExpression:`
      SET
        #title = :title
        , #body = :body
        , #changed = :changed
        ${updatedBy ? ', #updatedBy = :updatedBy' : ''}
        ${keywords ? ', #keywords = :keywords' : ''}
    `,
    ExpressionAttributeNames: {
      '#id': 'id',
      '#title': 'title',
      '#body': 'body',
      '#changed': 'changed',
    },
    ExpressionAttributeValues: {
      ':title': title,
      ':body': body,
      ':changed': changed,
    },
    ReturnValues: 'ALL_OLD',
  }

  if (updatedBy) {
    params.ExpressionAttributeNames['#updatedBy'] = 'updatedBy'
    params.ExpressionAttributeValues[':updatedBy'] = updatedBy
  }

  if (keywords) {
    params.ExpressionAttributeNames['#keywords'] = 'keywords'
    params.ExpressionAttributeValues[':keywords'] = keywords
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
      mutex.unlock()
      return null
    }
    mutex.unlock()
    throw err
  }

  const previousReply = fromDB(Reply, data.Attributes)
  const promises = [
    getTopicsWithIds({ teamId, topicIds: topicIds.concat(addTo) }),
  ]
  if (addTo.length) {
    promises.push(addItemToTopics({ teamId, itemId: id, topicIds: addTo, createdBy: updatedBy }))
  }
  if (removeFrom.length) {
    promises.push(removeItemFromTopics({ teamId, itemId: id, topicIds: removeFrom }))
  }

  let res
  try {
    res = await Promise.all(promises)
  } catch (err) {
    mutex.unlock()
    if (!rollback) {
      await rollbackUpdateReply({ previousReply, topicId })
    }
    throw err
  }

  const reply = await getReply({ teamId, id, options: { ConsistentRead: true } })
  const topics = res[0]
  try {
    await es.indexReply({ reply, topics })
  } catch (err) {
    mutex.unlock()
    if (!rollback) {
      await rollbackUpdateReply({ previousReply, topicId })
    }
    throw err
  }
  mutex.unlock()
  debug('Updated reply', { reply })
  return reply
}

export async function getRepliesForTopic({ teamId, topicId }) {
  const items = await getItemsForTopic({ teamId, topicId })
  if (!items.length) {
    return []
  }
  const replies = await client.batchGetAll({
    table,
    items,
    getKey: ({ itemId }) => ({ teamId, id: itemId }),
  })
  const replyMap = {}
  if (replies.length) {
    replies.forEach(reply => {
      replyMap[reply.id] = fromDB(Reply, reply)
    })
  }
  return items.map(({ itemId }) => replyMap[itemId])
}

export async function getReplies(teamId) {
  const params = {
    TableName: table,
    KeyConditionExpression: 'teamId = :teamId',
    ExpressionAttributeValues: {
      ':teamId': teamId,
    },
  }
  const items = await client.queryAll(params)
  return items.map(item => fromDB(Reply, item))
}

export async function getTopicsForReply({ teamId, id }) {
  const topicIds = await getTopicIdsForItem({ teamId, itemId: id })
  return getTopicsWithIds({ teamId, topicIds })
}
