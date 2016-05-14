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
  for (const key in required) {
    if (!required[key]) {
      throw new Error(`missing required field: (${key})`)
    }
  }
}

export async function createThread({ botId, channelId, userId, ...data }) {
  validate({ botId, channelId, userId })

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

  await client.put(params).promise()
  return thread
}

export async function createEvent({ threadId, botId, channelId, messageId, userId, ...data }) {
  validate({ threadId, botId, channelId, userId })

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

  await client.put(params).promise()
  return event
}

export async function getThreadEvents(threadId) {
  const params = {
    TableName: threadEventTable,
    KeyConditionExpression: 'threadId = :threadId',
    ExpressionAttributeValues: {
      ':threadId': threadId,
    },
  }
  const data = await client.queryAll(params)
  return items.map(item => fromDB(ThreadEvent, item))
}

export async function getThread({ botId, channelId, userId, id }) {
  const params = {
    TableName: threadTable,
    Key: { id, botIdChannelIdUserId: compositeId(botId, channelId, userId) },
  }
  const data = await client.get(params)
  const response = {}

  if (data.Item) {
    response.thread = fromDB(Thread, data.Item)
  }

  if (response.thread) {
    response.events = await getThreadEvents(response.thread.id)
  }
  return response
}

export async function lookupThread({ botId, channelId, messageId }) {
  const params = {
    TableName: threadEventTable,
    KeyConditionExpression: 'botIdChannelIdMessageId = :botIdChannelIdMessageId',
    ExpressionAttributeValues: {
      ':botIdChannelIdMessageId': compositeId(botId, channelId, messageId),
    },
    IndexName: 'ThreadEventBotIdChannelIdMessageId',
  }

  const items = await client.queryAll(params)
  const item = items[0]
  let thread
  if (item) {
    thread = await getThread({ botId, channelId, userId: item.userId, id: item.threadId })
  }
  return thread
}

export async function getOpenThread({ botId, channelId, userId }) {
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

  const items = await client.queryAll(params)
  const response = {}
  if (items.length) {
    response.thread = fromDB(Thread, items[0])
  }

  if (response.thread) {
    response.events = await getThreadEvents(response.thread.id)
  }
  return response
}

export async function closeThread({ botId, channelId, userId, id }) {
  validate({ botId, channelId, userId, id })
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

  const data = await client.update(params)
  return fromDB(Thread, data.Attributes)
}
