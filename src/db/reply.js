import uuid from 'node-uuid'

import client, { lock, compositeId, fromDB, resolveTableName } from './client'
import {
  getTopicsForItem,
  removeItemFromTopics,
  addItemToTopics,
  getItemsForTopic,
  removeItem,
} from './topicItem'
import { getTopicsWithIds } from './topic'
import * as es from '../es/reply'

const table = resolveTableName('reply-v1')

export class Reply {}

export function lockReply({ teamId, id }) {
  return lock(`reply-mutex-${teamId}:${id}`)
}

export async function createReply({ teamId, topicId, createdBy, ...data }) {
  const reply = new Reply()
  Object.assign(reply, data)
  reply.id = uuid.v4()
  reply.teamId = teamId
  reply.topicId = topicId

  const now = new Date().toISOString()
  reply.created = now
  reply.changed = now

  const params = {
    TableName: table,
    Item: reply,
  }

  const res = await Promise.all([
    addItemToTopics({ teamId, createdBy, itemId: id, topicIds: [topicId] }),
    client.put(params).promise(),
    getTopicsWithIds([topicId]),
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
  }

  // TODO this should all be a transaction
  const results = await Promise.all([
    client.delete(parms).promise(),
    es.deleteReply({ teamId, id }),
    removeItem({ teamId, itemId: id }),
  ])
  const data = results[0]
  return fromDB(Reply, data.Attributes)
}

export async function updateReply({ teamId, id, topicId, title, body, updatedBy }) {
  const params = {
    TableName: table,
    Key: { id, teamId },
    UpdateExpression:`
      SET
        #title = :title,
        #body = :body,
        #changed = :changed,
        #updatedBy = :updatedBy
    `,
    ExpressionAttributeNames: {
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

  const res = await Promise.all([
    removeItemFromTopics({ teamId, itemId: id, topicIds: removeFrom }),
    addItemToTopics({ teamId, itemId: id, topicIds: addTo, createdBy: updatedBy }),
    client.update(params).promise(),
    getTopicsWithIds(topicIds.concat(addTo)),
  ])
  mutex.unlock()
  const data = res[2]
  const topics = res[3]
  const reply = fromDB(Reply, data.Attributes)
  await es.indexReply({ reply, topics })
  return reply
}

export async function getRepliesForTopic({ teamId, topicId }) {
  const items = getItemsForTopic({ teamId, topicId })
  const params = {
    RequestItems: {
      [table]: {
        Keys: items.map(({ id }) => { teamId, id }),
      },
    },
  }
  const data = client.batchGet(params).promise()
  console.log(data)
  return data
}
