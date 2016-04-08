export uuid from 'node-uuid';

import client, { fromDB, resolveTableName } from './client';

export class Bot extends Object {};

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

export function getBot(id) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      Key: { id },
    };

    client.get(params, (err, data) => {
      if (err) return reject(err);
      const bot = fromDB(Bot, data.Item);
      return resolve(bot);
    });
  });
}
