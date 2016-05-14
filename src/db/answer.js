import uuid from 'node-uuid'

import client, { fromDB, resolveTableName } from './client'
import * as es from '../es/answer'

const table = resolveTableName('answer-v1')

export class Answer {}

export async function createAnswer({ botId, ...data }) {
  const answer = new Answer()
  Object.assign(answer, data)
  answer.id = uuid.v4()
  answer.botId = botId

  const now = new Date().toISOString()
  answer.created = now
  answer.changed = now

  const params = {
    TableName: table,
    Item: answer,
  }

  await client.put(params).promise()
  await es.indexAnswer(answer)
  return answer
}

export async function getAnswer(botId, id) {
  const params = {
    TableName: table,
    Key: { id, botId },
  }

  const data = await client.get(params).promise()
  let answer
  if (data.Item) {
    answer = fromDB(Answer, data.Item)
  }
  return answer
}

export async function getAnswers(botId) {
  const params = {
    TableName: table,
    KeyConditionExpression: 'botId = :botId',
    ExpressionAttributeValues: {
      ':botId': botId,
    },
    IndexName: 'AnswerBotIdCreated',
    ScanIndexForward: false,
  }

  const items = await client.queryAll(params)
  return items.map((item) => fromDB(Answer, item))
}

export async function deleteAnswer(botId, id) {
  const params = {
    TableName: table,
    Key: { id, botId },
    ReturnValues: 'ALL_OLD',
  }

  const data = await client.delete(params).promise()
  await es.deleteAnswer(botId, id)
  return fromDB(Answer, data.Attributes)
}

export async function updateAnswer({ botId, id, title, body }) {
  const params = {
    TableName: table,
    Key: { id, botId },
    UpdateExpression:`
      SET
        #title = :title,
        #body = :body,
        #changed = :changed
    `,
    ExpressionAttributeNames: {
      '#title': 'title',
      '#body': 'body',
      '#changed': 'changed',
    },
    ExpressionAttributeValues: {
      ':title': title,
      ':body': body,
      ':changed': new Date().toISOString(),
    },
    ReturnValues: 'ALL_NEW',
  }

  const data = await client.update(params).promise()
  const answer = fromDB(Answer, data.Attributes)
  await es.indexAnswer(answer)
  return answer
}
