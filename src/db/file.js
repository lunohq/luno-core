import client, { fromDB, resolveTableName } from './client'

const table = resolveTableName('file-v1')

export class File {}

export async function createFile({ id, teamId, ...data }) {
  const file = new File()
  Object.assign(file, data)
  file.id = id
  file.teamId = teamId

  const now = new Date().toISOString()
  file.created = now
  file.changed = now

  const params = {
    TableName: table,
    Item: file,
  }

  await client.put(params).promise()
  return file
}

export async function deleteFile({ id, teamId }) {
  const params = {
    TableName: table,
    Key: { id, teamId },
    ReturnValues: 'ALL_OLD',
  }

  const data = await client.delete(params).promise()
  return fromDB(File, data.Attributes)
}

export async function getFile({ id, teamId }) {
  const params = {
    TableName: table,
    Key: { id, teamId },
  }

  const data = await client.get(params).promise()
  let file
  if (data.Item) {
    file = fromDB(File, data.Item)
  }
  return file
}

export async function getFiles({ teamId, ids }) {
  return client.batchGetAll({ table, items: ids, getKey: id => ({ teamId, id }) })
}

export async function deleteFiles({ teamId, ids }) {
  const keys = ids.map(id => ({ teamId, id }))
  return client.batchDeleteAll({ table, keys })
}
