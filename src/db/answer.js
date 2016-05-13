import uuid from 'node-uuid'

import client, { fromDB, resolveTableName } from './client'
import * as es from '../es/answer'

const table = resolveTableName('answer-v1')

export class Answer {}

export function createAnswer({ botId, ...data }) {
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

  return new Promise((resolve, reject) => {
    client.put(params, async (err, data) => {
      if (err) return reject(err)

      try {
        await es.indexAnswer(answer)
      } catch (err) {
        return reject(err)
      }

      return resolve(answer)
    })
  })
}

export function getAnswer(botId, id) {
  const params = {
    TableName: table,
    Key: { id, botId },
  }

  return new Promise((resolve, reject) => {
    client.get(params, (err, data) => {
      if (err) return reject(err)

      let answer
      if (data.Item) {
        answer = fromDB(Answer, data.Item)
      }

      return resolve(answer)
    })
  })
}

export function getAnswers(botId) {
  const params = {
    TableName: table,
    KeyConditionExpression: 'botId = :botId',
    ExpressionAttributeValues: {
      ':botId': botId,
    },
    IndexName: 'AnswerBotIdCreated',
    ScanIndexForward: false,
  }

  return new Promise((resolve, reject) => {
    client.queryAll(params, (err, items) => {
      if (err) return reject(err)
      return resolve(items.map((item) => fromDB(Answer, item)))
    })
  })
}

export function deleteAnswer(botId, id) {
  const params = {
    TableName: table,
    Key: { id, botId },
    ReturnValues: 'ALL_OLD',
  }

  return new Promise((resolve, reject) => {
    client.delete(params, async (err, data) => {
      if (err) return reject(err)

      try {
        await es.deleteAnswer(botId, id)
      } catch (err) {
        return reject(err)
      }

      return resolve(fromDB(Answer, data.Attributes))
    })
  })
}

export function updateAnswer({ botId, id, title, body }) {
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

  return new Promise((resolve, reject) => {
    client.update(params, async (err, data) => {
      if (err) return reject(err)
      const answer = fromDB(Answer, data.Attributes)

      try {
        await es.indexAnswer(answer)
      } catch (err) {
        return reject(err)
      }

      return resolve(answer)
    })
  })
}
