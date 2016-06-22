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
