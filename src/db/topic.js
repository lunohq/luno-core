import uuid from 'node-uuid'

import LunoError from '../LunoError'
import client, { compositeId, fromDB, resolveTableName } from './client'
import { table as replyTable, getRepliesForTopic } from './reply'
import { deleteTopic as deleteTopicFromES, updateTopicName } from '../es/reply'
import { table as topicItemTable } from './topicItem'

const topicTable = resolveTableName('topic-v1')
const topicNameTable = resolveTableName('topic-name-v1')

export const DUPLICATE_TOPIC_NAME_EXCEPTION = 'DuplicateTopicNameException'

export class Topic {}

async function validateName({ teamId, name }) {
  const validName = await isValidName({ teamId, name })
  if (!validName) {
    throw new LunoError('Duplicate team name', DUPLICATE_TOPIC_NAME_EXCEPTION)
  }
}

export async function createTopic({ teamId, ...data }) {
  if (!data.isDefault) {
    await validateName({ teamId, name: data.name })
  }

  const topic = new Topic()
  Object.assign(topic, data)
  topic.id = uuid.v4()
  topic.teamId = teamId

  const now = new Date().toISOString()
  topic.created = now
  topic.changed = now

  const params = {
    TableName: topicTable,
    Item: topic,
  }

  await client.put(params).promise()
  return topic
}

export async function updateTopic({ id, teamId, name, updatedBy, pointsOfContact }) {
  // we can't return old and new values from dynamodb, so we have to fetch the
  // current topic so we can delete the name if necessary
  const results = await Promise.all([
    getTopic({ teamId, id }),
    validateName({ teamId, name }),
  ])
  const oldTopic = results[0]
  const now = new Date().toISOString()
  const params = {
    TableName: topicTable,
    Key: { id, teamId },
    UpdateExpression:`
      SET
        #pointsOfContact = :pointsOfContact,
        #changed = :changed,
        #name = :name,
        #updatedBy = :updatedBy
    `,
    ExpressionAttributeNames: {
      '#pointsOfContact': 'pointsOfContact',
      '#changed': 'changed',
      '#name': 'name',
      '#updatedBy': 'updatedBy',
    },
    ExpressionAttributeValues: {
      ':pointsOfContact': pointsOfContact,
      ':changed': now,
      ':name': name,
      ':updatedBy': updatedBy,
    },
    ReturnValues: 'ALL_NEW',
  }
  const data = await client.update(params).promise()
  if (name !== oldTopic.name) {
    await Promise.all([
      deleteTopicName({ teamId, name: oldTopic.name }),
      updateTopicName({ teamId, name, topicId: id }),
    ])
  }
  return fromDB(Topic, data.Attributes)
}

export async function deleteTopic({ teamId, id }) {
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
    promises.push(deleteTopicFromES({ teamId, topicId }))
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
    await Promise.all(promises)
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
