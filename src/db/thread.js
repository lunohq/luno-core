import uuid from 'node-uuid'

import client, { compositeId, fromDB, resolveTableName } from './client'

const debug = require('debug')('core:db:thread')

export const threadTable = resolveTableName('thread-v1')
export const threadEventTable = resolveTableName('thread-event-v1')
export const threadLogTable = resolveTableName('thread-log-v1')

export const THREAD_STATUS_OPEN = 0
export const THREAD_STATUS_CLOSED = 1

export const EVENT_MESSAGE_RECEIVED = 0
export const EVENT_MESSAGE_SENT = 1
export const EVENT_GREETING_FLOW = 2
export const EVENT_HELP_FLOW = 3
export const EVENT_HUMAN_FLOW = 4
export const EVENT_ANSWER_FLOW = 5
export const EVENT_FEEDBACK = 6
export const EVENT_SMART_ANSWER = 7
export const EVENT_MULTIPLE_RESULTS = 9
export const EVENT_NO_RESULTS = 10
export const EVENT_CLARIFICATION = 11
export const EVENT_ESCALATION_FLOW = 12

export const THREAD_LOG_NO_FEEDBACK = 0
export const THREAD_LOG_POSITIVE_FEEDBACK = 1
export const THREAD_LOG_NEGATIVE_FEEDBACK = 2

export const FLOW_EVENTS = [
  EVENT_GREETING_FLOW,
  EVENT_HELP_FLOW,
  EVENT_HUMAN_FLOW,
  EVENT_ANSWER_FLOW,
  EVENT_ESCALATION_FLOW,
]

export class Thread {}
export class ThreadEvent {}
export class ThreadLog {}

function validate(required) {
  for (const key in required) {
    if (!required[key]) {
      throw new Error(`missing required field: (${key})`)
    }
  }
}

export async function createThread({ botId, channelId, userId, teamId, open, ...data }) {
  validate({ botId, channelId, userId })

  const thread = new Thread()
  Object.assign(thread, data)
  thread.id = uuid.v4()
  thread.botIdChannelIdUserId = compositeId(botId, channelId, userId)
  thread.botId = botId
  thread.channelId = channelId
  thread.userId = userId
  thread.teamId = teamId

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

function generateEvent({ offset, threadId, botId, channelId, messageId, userId, teamId, ...data }) {
  validate({ threadId, botId, channelId, userId })
  const event = new ThreadEvent()
  Object.assign(event, data)
  event.id = uuid.v4()
  event.threadId = threadId
  event.botId = botId
  event.channelId = channelId
  event.userId = userId
  event.teamId = teamId
  if (messageId) {
    event.botIdChannelIdMessageId = compositeId(botId, channelId, messageId)
    event.messageId = messageId
  }

  let now = new Date()
  if (offset) {
    now = new Date(Date.now() + parseInt(offset))
  }

  now = now.toISOString()
  event.created = now
  event.changed = now
  return event
}

export async function createEvent(args) {
  const event = generateEvent(args)
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
  const items = await client.queryAll(params)
  return items.map(item => fromDB(ThreadEvent, item))
}

export async function getThread({ botId, channelId, userId, id }) {
  const params = {
    TableName: threadTable,
    Key: { id, botIdChannelIdUserId: compositeId(botId, channelId, userId) },
  }
  const data = await client.get(params).promise()
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
  const data = await client.update(params).promise()
  return fromDB(Thread, data.Attributes)
}

export async function getOrOpenThread(params) {
  let response = await getOpenThread(params)
  if (!response.thread && params.open) {
    const thread = await createThread(params)
    response = { thread, events: [] }
  }
  return response
}

export async function commitThread({ thread, close }) {
  const params = {
    RequestItems: {},
  }

  const events = []
  let commit = false
  for (const index in thread.events) {
    const event = thread.events[index]
    if (event.id) {
      events.push(event)
      continue
    }

    if (!params.RequestItems[threadEventTable]) {
      params.RequestItems[threadEventTable] = []
    }

    commit = true
    const generated = generateEvent({ offset: index, ...event })
    events.push(generated)
    params.RequestItems[threadEventTable].push({ PutRequest: { Item: generated } })
  }

  let closePromise
  if (close && thread.model && thread.model.status !== THREAD_STATUS_CLOSED) {
    closePromise = closeThread(thread.model)
  }

  const promises = []
  if (closePromise) {
    promises.push(closePromise)
    // if we're closing the thread, set the status on the model so we can
    // create the thread log in parallel
    thread.model.status = THREAD_STATUS_CLOSED
  }
  if (commit) {
    promises.push(client.batchWrite(params).promise())
  }
  // TODO remove teamId check once we have backfilled teamId
  if (thread.model.teamId) {
    promises.push(createThreadLog(thread))
  }

  const results = await Promise.all(promises)
  if (closePromise) {
    thread.model = results[0]
  }

  if (events.length) {
    thread.events = events
  }
  return results
}

export async function createThreadLog(thread) {
  const { model } = thread
  const log = new ThreadLog()
  log.userId = model.userId
  log.threadId = model.id
  log.channelId = model.channelId
  log.created = model.created
  log.teamId = model.teamId
  log.status = model.status

  const events = thread.events ? thread.events : []
  log.length = events.length

  let message
  for (const event of events) {
    switch (event.type) {
      case EVENT_MESSAGE_RECEIVED: {
        if (!message && event.message) {
          message = {
            threadEventId: event.id,
            message: event.message,
          }
        }
        break
      }
      default:
    }
  }

  if (!message) {
    throw new Error('ThreadLog must contain a message')
  }

  log.message = message

  const params = {
    TableName: threadLogTable,
    Item: log,
  }
  debug('Creating thread log', params)
  await client.put(params).promise()
  return log
}

export async function getThreadLogs(teamId) {
  const params = {
    TableName: threadLogTable,
    IndexName: 'TeamIdCreated',
    ScanIndexForward: false,
    KeyConditionExpression: '#teamId = :teamId',
    ExpressionAttributeNames: {
      '#teamId': 'teamId',
    },
    ExpressionAttributeValues: {
      ':teamId': teamId,
    },
  }
  // TODO support pagination
  const data = await client.query(params).promise()
  return data.Items.map(item => fromDB(ThreadLog, item))
}

export async function getThreadLog({ teamId, threadId }) {
  const params = {
    TableName: threadLogTable,
    Key: { teamId, threadId },
  }
  const data = await client.get(params).promise()
  let log
  if (data.Item) {
    log = fromDB(ThreadLog, data.Item)
  }
  return log
}
