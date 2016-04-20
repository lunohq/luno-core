import uuid from 'node-uuid';

import client, { fromDB, resolveTableName } from './client';

const table = resolveTableName('regex-response-v1');

export class RegexResponse {};

export function createRegexResponse({ botId, ...data }) {
  const regexResponse = new RegexResponse();
  Object.assign(regexResponse, data);
  regexResponse.id = uuid.v4();
  regexResponse.botId = botId;

  const now = new Date().toISOString();
  regexResponse.created = now;
  regexResponse.changed = now;

  const params = {
    TableName: table,
    Item: regexResponse,
  };

  return new Promise((resolve, reject) => {
    client.put(params, (err, data) => {
      if (err) return reject(err);

      return resolve(regexResponse);
    });
  });
}

export function getRegexResponses(botId) {
  const params = {
    TableName: table,
    KeyConditionExpression: 'botId = :botId',
    ExpressionAttributeValues: {
      ':botId': botId,
    },
    IndexName: 'RegexResponseBotIdOrder',
  };

  return new Promise((resolve, reject) => {
    client.queryAll(params, (err, items) => {
      if (err) return reject(err);
      return resolve(items.map((item) => fromDB(RegexResponse, item)));
    });
  });
}

export function getRegexResponse(id) {
  const params = {
    TableName: table,
    Key: { id },
  };

  return new Promise((resolve, reject) => {
    client.get(params, (err, data) => {
      if (err) return reject(err);

      let regexResponse;
      if (data.Item) {
        regexResponse = fromDB(RegexResponse, data.Item);
      }

      return resolve(regexResponse);
    });
  });
}

export function deleteRegexResponse(botId, id) {
  const params = {
    TableName: table,
    Key: { id, botId },
    ReturnValues: 'ALL_OLD',
  };

  return new Promise((resolve, reject) => {
    client.delete(params, (err, data) => {
      if (err) return reject(err);
      return resolve(fromDB(RegexResponse, data.Attributes));
    });
  });
}

export function updateRegexResponse({ botId, id, regex, body }) {
  const now = new Date().toISOString();
  const params = {
    TableName: table,
    Key: { id: regexResponse },
    UpdateExpression: `
      SET
        #regex = :regex,
        #body = :body,
        #changed = :changed
    `,
    ExpressionAttributeNames: {
      '#regex': 'regex',
      '#body': 'body',
      '#changed': 'changed',
    },
    ExpressionAttributeValues: {
      ':regex': regex,
      ':body': body,
      ':changed': new Date().toISOString(),
    },
    ReturnValues: 'ALL_NEW',
  };

  return new Promise((resolve, reject) => {
    client.update(params, (err, data) => {
      if (err) return reject(err);
      const answer = fromDB(RegexResponse, data.Attributes);
      return resolve(answer);
    });
  });
}
