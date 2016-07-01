import uuid from 'node-uuid'

import LunoError from '../LunoError'
import client, { compositeId, fromDB, resolveTableName } from './client'
import { table as replyTable, getRepliesForTopic } from './reply'
import { deleteTopic as deleteTopicFromES, updateTopicName } from '../es/reply'
import { table as topicItemTable, generateTopicItem } from './topicItem'

const debug = require('debug')('core:db:topic')

const topicTable = resolveTableName('topic-v1')
const topicNameTable = resolveTableName('topic-name-v1')

export const DUPLICATE_TOPIC_NAME_EXCEPTION = 'DuplicateTopicNameException'

export class Topic {}

async function rollbackUpdateTopic({ previousTopic }) {
  debug('Rolling back updateTopic', { previousTopic })
  const res = await updateTopic({ rollback: true, ...previousTopic })
  debug('Rolled back updateTopic', res)
  return res
}

async function rollbackDeleteTopic({ topic, replies }) {
  debug('Rolling back deleteTopic', { topic, replies })
  const promises = [createTopic({ ...topic })]
  if (replies.length) {
    const topicItems = []
    replies.forEach(reply => {
      const topicItem = generateTopicItem({
        teamId: reply.teamId,
        topicId: topic.id,
        itemId: reply.id,
        createdBy: reply.createdBy,
      })
      topicItems.push(topicItem)
    })
    promises.push(client.batchWriteAll({ table: replyTable, items: replies }))
    promises.push(client.batchWriteAll({ table: topicItemTable, items: topicItems }))
    promises.push(updateTopicName({ teamId: topic.teamId, topicId: topic.id, name: topic.name, replies }))
  }
  const res = await Promise.all(promises)
  debug('Rolled back deleteTopic', res)
}

async function validateName({ teamId, name }) {
  const validName = await isValidName({ teamId, name })
  if (!validName) {
    throw new LunoError('Duplicate team name', DUPLICATE_TOPIC_NAME_EXCEPTION)
  }
}

export async function createTopic({ id = uuid.v4(), teamId, rollback = false, ...data }) {
  if (!data.isDefault) {
    await validateName({ teamId, name: data.name })
  }

  const topic = new Topic()
  Object.assign(topic, data)
  topic.id = id
  topic.teamId = teamId

  if (!rollback) {
    const now = new Date().toISOString()
    topic.created = now
    topic.changed = now
  }

  const params = {
    TableName: topicTable,
    Item: topic,
  }

  await client.put(params).promise()
  return topic
}

export async function updateTopic({ id, teamId, name, updatedBy, pointsOfContact, changed = new Date().toISOString(), rollback = false }) {
  // we can't return old and new values from dynamodb, so we have to fetch the
  // current topic so we can delete the name if necessary
  const results = await Promise.all([
    getTopic({ teamId, id }),
    validateName({ teamId, name }),
  ])
  const previousTopic = results[0]
  const params = {
    TableName: topicTable,
    Key: { id, teamId },
    UpdateExpression:`
      SET
        #pointsOfContact = :pointsOfContact
        , #changed = :changed
        , #name = :name
        ${updatedBy ? ', #updatedBy = :updatedBy' : ''}
    `,
    ExpressionAttributeNames: {
      '#pointsOfContact': 'pointsOfContact',
      '#changed': 'changed',
      '#name': 'name',
    },
    ExpressionAttributeValues: {
      ':pointsOfContact': pointsOfContact,
      ':changed': changed,
      ':name': name,
    },
    ReturnValues: 'ALL_NEW',
  }

  if (updatedBy) {
    params.ExpressionAttributeNames['#updatedBy'] = 'updatedBy'
    params.ExpressionAttributeValues[':updatedBy'] = updatedBy
  }

  const data = await client.update(params).promise()
  if (name !== previousTopic.name) {
    try {
      await Promise.all([
        deleteTopicName({ teamId, name: previousTopic.name }),
        updateTopicName({ teamId, name, topicId: id }),
      ])
    } catch (err) {
      if (!rollback) {
        await rollbackUpdateTopic({ previousTopic })
      }
      throw err
    }
  }
  return fromDB(Topic, data.Attributes)
}

export async function deleteTopic({ teamId, id, rollback = false }) {
  let params = {
    TableName: topicTable,
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
    if (err.code !== 'ConditionalCheckFailedException') {
      throw err
    }
  }

  let topic
  if (data) {
    topic = fromDB(Topic, data.Attributes)
  }

  const promises = []
  if (topic) {
    promises.push(deleteTopicName({ teamId, name: topic.name }))
    promises.push(deleteTopicFromES({ teamId, topicId: id }))
  }

  const replies = await getRepliesForTopic({ teamId, topicId: id })
  if (replies.length) {
    const replyKeys = []
    const topicItemKeys = []
    replies.forEach(reply => {
      replyKeys.push({ teamId, id: reply.id })
      topicItemKeys.push({ teamIdTopicId: compositeId(teamId, id), itemId: reply.id })
    })
    promises.push(client.batchDeleteAll({ table: replyTable, keys: replyKeys }))
    promises.push(client.batchDeleteAll({ table: topicItemTable, keys: topicItemKeys }))
  }

  if (promises.length) {
    try {
      await Promise.all(promises)
    } catch (err) {
      if (!rollback) {
        await rollbackDeleteTopic({ topic, replies })
      }
      throw err
    }
  }
  return topic
}

export async function deleteTopicName({ teamId, name }) {
  let params = {
    TableName: topicNameTable,
    Key: { teamId, name },
    ConditionExpression: 'attribute_exists(#name)',
    ExpressionAttributeNames: {
      '#name': 'name',
    },
  }

  let data
  try {
    data = await client.delete(params).promise()
  } catch (err) {
    if (err.code !== 'ConditionalCheckFailedException') {
      throw err
    }
  }
}

export async function isValidName({ teamId, name }) {
  const params = {
    TableName: topicNameTable,
    Item: { teamId, name },
    ConditionExpression: 'attribute_not_exists(#name)',
    ExpressionAttributeNames: {
      '#name': 'name',
    },
  }

  try {
    await client.put(params).promise()
  } catch (err) {
    if (err.code === 'ConditionalCheckFailedException') {
      return false
    }
    throw err
  }
  return true
}

export async function getTopic({ teamId, id }) {
  const params = {
    TableName: topicTable,
    Key: { id, teamId },
  }

  const data = await client.get(params).promise()
  let topic
  if (data.Item) {
    topic = fromDB(Topic, data.Item)
  }
  return topic
}

export async function getDefaultTopic(teamId) {
  const params = {
    TableName: topicTable,
    IndexName: 'TeamIdIsDefaultIndex',
    KeyConditionExpression: 'teamId = :teamId AND isDefault = :default',
    ExpressionAttributeValues: {
      ':teamId': teamId,
      ':default': 1,
    },
  }
  const data = await client.query(params).promise()
  let topic
  if (data.Items && data.Items.length) {
    topic = fromDB(Topic, data.Items[0])
  }
  return topic
}

export async function getTopicsWithIds({ teamId, topicIds }) {
  const params = {
    RequestItems: {
      [topicTable]: {
        Keys: topicIds.map(topicId => ({ teamId, id: topicId })),
      },
    },
  }
  const data = await client.batchGet(params).promise()
  let topics = []
  if (data.Responses && data.Responses[topicTable]) {
    topics = data.Responses[topicTable].map(topic => fromDB(Topic, topic))
  }
  return topics
}

export async function getTopic({ teamId, id }) {
  const params = {
    TableName: topicTable,
    Key: { teamId, id },
  }
  const data = await client.get(params).promise()
  let topic
  if (data.Item) {
    topic = fromDB(Topic, data.Item)
  }
  return topic
}

export async function getTopics(teamId) {
  const params = {
    TableName: topicTable,
    IndexName: 'TeamIdNameIndex',
    KeyConditionExpression: 'teamId = :teamId',
    ExpressionAttributeValues: {
      ':teamId': teamId,
    },
  }
  const items = await client.queryAll(params)
  return items.map(item => fromDB(Topic, item))
}
