import client, { fromDB, resolveTableName } from './client';

const table = resolveTableName('team-v1');

export class Team {};

export function getTeam(id) {
  const params = {
    TableName: table,
    Key: { id },
  };

  return new Promise((resolve, reject) => {
    client.get(params, (err, data) => {
      if (err) return reject(err);

      let team;
      if (data.Item) {
        team = fromDB(Team, data.Item);
      }

      return resolve(team);
    });
  });
}

export function updateTeam(team) {

  // normalize to camel case
  team.bot.userId = team.bot.user_id;
  delete team.bot.user_id;

  const now = new Date().toISOString();
  const params = {
    TableName: table,
    Key: { id: team.id },
    UpdateExpression: `
      SET
        #createdBy = if_not_exists(createdBy, :createdBy),
        #name = :name,
        #slack = :slack,
        #created = if_not_exists(#created, :created),
        #changed = :changed
    `,
    ExpressionAttributeNames: {
      '#createdBy': 'createdBy',
      '#name': 'name',
      '#slack': 'slack',
      '#created': 'created',
      '#changed': 'changed',
    },
    ExpressionAttributeValues: {
      ':createdBy': team.createdBy,
      ':name': team.name,
      ':slack': {
        bot: team.bot,
        url: team.url,
        token: team.token,
      },
      ':created': now,
      ':changed': now,
    },
    ReturnValues: 'ALL_NEW',
  };

  return new Promise((resolve, reject) => {
    client.update(params, (err, data) => {
      if (err) return reject(err);
      const team = fromDB(Team, data.Attributes);
      return resolve(team);
    });
  });
}

export function getTeams() {
  const params = {
    TableName: table,
  };
  return new Promise((resolve, reject) => {
    client.query(params, (err, data) => {
      if (err) return reject(err);
      return resolve(data.Items.map((item) => fromDB(Team, item)));
    });
  });
}
