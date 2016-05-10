import getClient, { config } from './getClient'

const type = 'answer'

const client = getClient()

export function indexAnswer({ id, ...body }) {
  return new Promise((resolve, reject) => {
    client.index({
      ...config.write,
      type,
      id,
      body,
      routing: body.botId,
    }, (err, res) => {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}

export function deleteAnswer(botId, id) {
  return new Promise((resolve, reject) => {
    client.delete({
      ...config.write,
      type,
      id,
      routing: botId,
    }, (err, res) => {
      if (err && err.status !== 404) return reject(err)
      return resolve(res)
    })
  })
}

function getQuery(botId, query) {
  return {
    query: {
      filtered: {
        query: {
          common: {
            title: {
              query,
              cutoff_frequency: 0.001,
            },
          },
        },
        filter: {
          term: { botId: botId },
        },
      },
    },
  }
}

export function search(botId, query, options = {}) {
  const body = getQuery(botId, query)
  return new Promise((resolve, reject) => {
    client.search({
      ...config.read,
      ...options,
      type,
      body,
    }, (err, res) => {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}

export function explain(botId, query, answerId) {
  const body = getQuery(botId, query)
  return new Promise((resolve, reject) => {
    client.explain({
      ...config.read,
      ...config.explain,
      type,
      body,
      id: answerId,
      routing: botId,
    }, (err, res) => {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}

export function validate(botId, query) {
  const body = getQuery(botId, query)
  return new Promise((resolve, reject) => {
    client.indices.validateQuery({
      ...config.read,
      ...config.explain,
      type,
      body,
      explain: true,
      routing: botId,
    }, (err, res) => {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}

export function analyze({ query, ...rest }) {
  return new Promise((resolve, reject) => {
    client.indices.analyze({
      ...config.read,
      ...rest,
      type,
      text: query,
    }, (err, res) => {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}
