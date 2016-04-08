import client, { fromDB, resolveTableName } from './client';

const table = resolveTableName('team');

export class Team extends Object {};

export function createTeam(team) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      Item: team,
    };

    client.put(params, (err, data) => {
      if (err) return reject(err);
      return resolve(team);
    });
  });
}

export function getTeam(id) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      Key: { id },
    };

    client.get(params, (err, data) => {
      if (err) return reject(err);
      const team = fromDB(Team, data.Item);
      return resolve(team);
    });
  });
}
