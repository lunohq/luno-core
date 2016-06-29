import uuid from 'node-uuid'

import client, { compositeId, fromDB, resolveTableName } from './client'
import { table as replyTable, getRepliesForTopic } from './reply'
import { table as topicItemTable } from './topicItem'

const topicTable = resolveTableName('topic-v1')
const topicNameTable = resolveTableName('topic-name-v1')

export const DUPLICATE_TOPIC_NAME_EXCEPTION = 'DuplicateTopicNameException'

export class Topic {}

export async function createTopic({ teamId, ...data }) {
  if (!data.isDefault) {
    const validName = await isValidName({ teamId, name: data.name })
    if (!validName) {
      const error = new Error('Duplicate team name')
      error.code = DUPLICATE_TOPIC_NAME_EXCEPTION
      throw error
    }
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
  }
  const data = await client.update(params).promise()
  // TODO update any items in ES with the correct topic name
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
    promises.push(deleteTopic({ teamId, name: topic.name }))
  }

  const replies = await getRepliesForTopic({ teamId, topicId: id })
  if (replies) {
    const replyKeys = []
    const topicItemKeys = []
    replies.forEach(reply => {
      replyKeys.push({ teamId, id: reply.id })
      topicItemKeys.push({ teamIdTopicId: compositeId(teamId, id), itemId: reply.id })
    })
    promises.push(client.batchDeleteAll({ table: replyTable, keys: replyKeys }))
    promises.push(client.batchDeleteAll({ table: topicItemTable, keys: topicItemKeys }))
  }

  // TODO need to delete from ES, not sure how we're going to store the topic yet though.

  if (promises.length) {
    await Promise.all(promises)
  }
  return topic
}

export async function deleteTopicName({ teamId, name }) {
  let params = {
    TableName: topicNameTable,
    Item: { teamId, name },
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
