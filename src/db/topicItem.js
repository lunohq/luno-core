import Redlock from 'redlock'

import client, { compositeId, fromDB, resolveTableName } from './client'

export const table = resolveTableName('topic-item-v1')

export class TopicItem {}

function generateTopicItem({ teamId, topicId, itemId, createdBy }) {
  const topicItem = new TopicItem()
  topicItem.teamId = teamId
  topicItem.topicId = topicId
  topicItem.itemId = itemId
  topicItem.createdBy = createdBy
  topicItem.teamIdTopicId = compositeId(teamId, topicId)

  const now = new Date().toISOString()
  topicItem.created = now
  return topicItem
}

export async function createTopicItem(data) {
  const topicItem = generateTopicItem(data)
  const params = {
    TableName: table,
    Item: topicItem,
  }

  await client.put(params).promise()
  return topicItem
}

export async function getTopicIdsForItem({ teamId, itemId }) {
  const params = {
    TableName: table,
    IndexName: 'TeamIdItemIdIndex',
    KeyConditionExpression: 'teamId = :teamId and itemId = :itemId',
    ExpressionAttributeValues: {
      ':teamId': teamId,
      ':itemId': itemId,
    },
  }
  const data = await client.query(params).promise()
  let topicIds = []
  if (data.Items) {
    for (const item of data.Items) {
      topicIds.push(item.topicId)
    }
  }
  return topicIds
}

export async function getItemsForTopic({ teamId, topicId }) {
  const params = {
    TableName: table,
    IndexName: 'TeamIdTopicIdCreatedIndex',
    KeyConditionExpression: 'teamIdTopicId = :teamIdTopicId',
    ExpressionAttributeValues: {
      ':teamIdTopicId': compositeId(teamId, topicId),
    },
    ScanIndexForward: false,
  }
  const data = await client.query(params).promise()
  return data.Items.map(item => fromDB(TopicItem, item))
}

export async function removeItemFromTopics({ itemId, topicIds, teamId }) {
  const params = {
    RequestItems: {
      [table]: [],
    },
  }
  for (const topicId of topicIds) {
    params.RequestItems[table].push({
      DeleteRequest: {
        Key: { teamIdTopicId: compositeId(teamId, topicId), itemId },
      },
    })
  }
  return client.batchWrite(params).promise()
}

export async function addItemToTopics({ itemId, topicIds, teamId, createdBy }) {
  const params = {
    RequestItems: {
      [table]: [],
    },
  }
  for (const topicId of topicIds) {
    params.RequestItems[table].push({
      PutRequest: {
        Item: generateTopicItem({ itemId, topicId, teamId, createdBy }),
      },
    })
  }
  return client.batchWrite(params).promise()
}

export async function removeItem({ teamId, itemId }) {
  const topicIds = await getTopicIdsForItem({ teamId, itemId })
  return removeItemFromTopics({ teamId, topicIds, itemId })
}
