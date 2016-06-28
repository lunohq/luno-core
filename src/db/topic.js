import uuid from 'node-uuid'

import client, { compositeId, fromDB, resolveTableName } from './client'

const topicTable = resolveTableName('topic-v1')
const topicNameTable = resolveTableName('topic-name-v1')

export const DUPLICATE_TOPIC_NAME_EXCEPTION = 'DuplicateTopicNameException'

export class Topic {}

export async function createTopic({ teamId, ...data }) {
  if (!data.isDefault && !isValidName({ teamId, name: data.name })) {
    const error = new Error('Duplicate team name')
    error.code = DUPLICATE_TOPIC_NAME_EXCEPTION
    throw error
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
    if (err.code === 'ConditionalCheckFailedException') {
      throw err
    }
  }

  // TODO delete topicItems and replies within the topic

  let reply
  if (data) {
    reply = fromDB(Reply, data.Attributes)
  }
  return reply
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
    const resp = await client.put(params).promise()
    return resp.statusCode === 200
  } catch (err) {
    if (err.code === 'ConditionalCheckFailedException') {
      return false
    }
    throw err
  }
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
