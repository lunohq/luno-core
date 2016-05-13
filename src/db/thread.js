import uuid from 'node-uuid'

import client, { compositeId, fromDB, resolveTableName } from './client'

const threadTable = resolveTableName('thread-v1')
const threadEventTable = resolveTableName('thread-event-v1')

const THREAD_STATUS_OPEN = 0
const THREAD_STATUS_CLOSED = 1

export const GREETING_FLOW = 0

export class Thread {}
export class ThreadEvent {}

export function createThread({ botId, channelId, userId, ...data }) {
  const thread = new Thread()
  Object.assign(thread, data)
  thread.id = uuid.v4()
  thread.botIdChannelIdUserId = compositeId(botId, channelId, userId)
  thread.botId = botId
  thread.channelId = channelId
  thread.userId = userId

  const now = new Date().toISOString()
  thread.created = now
  thread.changed = now

  thread.status = THREAD_STATUS_OPEN

  const params = {
    TableName: threadTable,
    Item: thread,
  }

  return new Promise((resolve, reject) => {
    client.put(params, (err, data) => {
      if (err) return reject(err)
      return resolve(thread)
    })
  })
}

export function createEvent({ threadId, botId, channelId, messageId, ...data }) {
  const event = new ThreadEvent()
  Object.assign(event, data)
  event.threadId = threadId
  event.botId = botId
  event.channelId = channelId
  if (messageId) {
    event.botIdChannelIdMessageId = compositeId(botId, channelId, messageId)
    event.messageId = messageId
  }

  const now = new Date().toISOString()
  event.created = now
  event.changed = now

  const params = {
    TableName: threadEventTable,
    Item: event,
  }

  return new Promise((resolve, reject) => {
    client.put(params, (err, data) => {
      if (err) return reject(err)
      return resolve(event)
    })
  })
}

export function getThreadEvents(threadId) {
  const params = {
    TableName: threadEventTable,
    KeyConditionExpression: 'threadId = :threadId',
    ExpressionAttributeValues: {
      ':threadId': threadId,
    },
  }

  return new Promise((resolve, reject) => {
    client.queryAll(params, (err, items) => {
      if (err) return reject(err)
      return resolve(items.map(item => fromDB(ThreadEvent, item)))
    })
  })
}

export function getOpenThread({ botId, channelId, userId }) {
  const params = {
    TableName: threadTable,
    KeyConditionExpression: 'botIdChannelIdUserId = :botIdChannelIdUserId AND #status = :status',
    ExpressionAttributeValues: {
      ':botIdChannelIdUserId': compositeId(botId, channelId, userId),
      ':status': THREAD_STATUS_OPEN,
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    IndexName: 'ThreadBotIdChannelIdUserIdStatus',
  }

  return new Promise((resolve, reject) => {
    client.queryAll(params, async (err, items) => {
      if (err) return reject(err)
      const response = {}

      if (items.length) {
        response.thread = fromDB(Thread, items[0])
      }

      if (response.thread) {
        try {
          response.events = await getThreadEvents(response.thread.id)
        } catch (err) {
          return reject(err)
        }
      }
      return resolve(response)
    })
  })
}

export function closeThread({ botId, channelId, userId, id }) {
  const params = {
    TableName: threadTable,
    Key: {
      id,
      botIdChannelIdUserId: compositeId(botId, channelId, userId),
    },
    UpdateExpression: `
      SET
        #status = :status,
        #changed = :changed
    `,
    ExpressionAttributeNames: {
      '#status': 'status',
      '#changed': 'changed',
    },
    ExpressionAttributeValues: {
      ':status': THREAD_STATUS_CLOSED,
      ':changed': new Date().toISOString(),
    },
    ReturnValues: 'ALL_NEW',
  }

  return new Promise((resolve, reject) => {
    client.update(params, (err, data) => {
      if (err) return reject(err)
      const thread = fromDB(Thread, data.Attributes)
      return resolve(thread)
    })
  })
}
