import uuid from 'node-uuid'

import client, { compositeId, fromDB, resolveTableName } from './client'

const threadTable = resolveTableName('thread-v1')
const threadEventTable = resolveTableName('thread-event-v1')

const THREAD_STATUS_OPEN = 0
const THREAD_STATUS_CLOSED = 1

export const EVENT_GREETING_FLOW = 0
export const EVENT_HELP_FLOW = 1
export const EVENT_HUMAN_FLOW = 2
export const EVENT_ANSWER_FLOW = 3
export const EVENT_FEEDBACK = 4
export const EVENT_SMART_ANSWER = 5
export const EVENT_MULTIPLE_RESULTS = 7
export const EVENT_NO_RESULTS = 8
export const EVENT_CLARIFICATION = 9

export const FLOW_EVENTS = [
  EVENT_GREETING_FLOW,
  EVENT_HELP_FLOW,
  EVENT_HUMAN_FLOW,
  EVENT_ANSWER_FLOW,
]

export class Thread {}
export class ThreadEvent {}

function validate(required) {
  let error
  for (const key in required) {
    if (!required[key]) {
      error = new Error(`missing required field: (${key})`)
    }
  }
  return error
}

export function createThread({ botId, channelId, userId, ...data }) {
  const invalid = validate({ botId, channelId, userId })
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
    if (invalid) return reject(invalid)

    client.put(params, (err, data) => {
      if (err) return reject(err)
      return resolve(thread)
    })
  })
}

export function createEvent({ threadId, botId, channelId, messageId, userId, ...data }) {
  const invalid = validate({ threadId, botId, channelId, userId })
  const event = new ThreadEvent()
  Object.assign(event, data)
  event.threadId = threadId
  event.botId = botId
  event.channelId = channelId
  event.userId = userId
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
    if (invalid) return reject(invalid)

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

export function getThread({ botId, channelId, userId, id }) {
  const params = {
    TableName: threadTable,
    Key: { id, botIdChannelIdUserId: compositeId(botId, channelId, userId) },
  }
  return new Promise((resolve, reject) => {
    client.get(params, async (err, data) => {
      if (err) return reject(err)
      const response = {}

      if (data.Item) {
        response.thread = fromDB(Thread, data.Item)
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

export function lookupThread({ botId, channelId, messageId }) {
  const params = {
    TableName: threadEventTable,
    KeyConditionExpression: 'botIdChannelIdMessageId = :botIdChannelIdMessageId',
    ExpressionAttributeValues: {
      ':botIdChannelIdMessageId': compositeId(botId, channelId, messageId),
    },
    IndexName: 'ThreadEventBotIdChannelIdMessageId',
  }

  return new Promise((resolve, reject) => {
    client.queryAll(params, async (err, items) => {
      if (err) return reject(err)
      const item = items[0]
      let thread
      if (item) {
        try {
          thread = await getThread({ botId, channelId, userId: item.userId, id: item.threadId })
        } catch (err) {
          return reject(err)
        }
      }
      return resolve(thread)
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
  const invalid = validate({ botId, channelId, userId, id })
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
    if (invalid) return reject(invalid)
    client.update(params, (err, data) => {
      if (err) return reject(err)
      const thread = fromDB(Thread, data.Attributes)
      return resolve(thread)
    })
  })
}
