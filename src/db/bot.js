export uuid from 'node-uuid';

import client, { fromDB, resolveTableName } from './client';

export class Bot {};

export function createBot(bot) {
  return new Promise((resolve, reject) => {
    bot.id = uuid.v4();
    const params = {
      TableName: table,
      Item: bot,
    };

    client.put(params, (err, data) => {
      if (err) return reject(err);
      return resolve(bot);
    });
  });
}

export function getBot(teamId, id) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      Key: { teamId, id },
    };

    client.get(params, (err, data) => {
      if (err) return reject(err);
      const bot = fromDB(Bot, data.Item);
      return resolve(bot);
    });
  });
}

export function getBots(teamId) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      KeyConditionExpression: 'HashKey = :hkey',
      ExpressionAttributeValues: {
        ':hkey': teamId,
      },
    };

    client.query(params, (err, data) => {
      if (err) return reject(err);
      return data.Items.map((item) => fromDB(Bot, item));
    });
  });
}
