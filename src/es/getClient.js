import AWS from 'aws-sdk'
import { Client } from 'elasticsearch'
import connector from 'http-aws-es'
import env from '../config'

const indices = {
  write: 'luno-bot-write',
  read: 'luno-bot-read',
}

export const config = {
  indices,
  write: {
    index: indices.write,
  },
  read: {
    index: indices.read,
  },
  explain: env.es.explain,
}

function credentials() {
  return new Promise((resolve, reject) => {
    const provider = new AWS.CredentialProviderChain()
    provider.resolve((err, creds) => {
      if (err) return reject(err)
      resolve(creds)
    })
  })
}

export default function() {
  return new Client({
    apiVersion: '1.5',
    host: env.es.host,
    connectionClass: connector,
    log: 'info',
    amazonES: {
      region: env.aws.region,
      credentials: credentials(),
    },
    requestTimeout: 1000,
  })
}
