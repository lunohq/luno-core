import AWS from 'aws-sdk'
import config from '../config'

class Client extends AWS.DynamoDB.DocumentClient {

  /**
   * Return all items that match the query.
   *
   * @param {Object} params the query params
   * @param {Function} cb callback
   * @param {Array} items array of items that will be returned
   */
  async queryAll(params, items = []) {
    const data = await this.query(params).promise()
    items.push(...data.Items)
    const { LastEvaluatedKey } = data
    if (LastEvaluatedKey) {
      const nextParams = Object.assign({}, params, { LastEvaluatedKey })
      await this.queryAll(nextParams, items)
    } else {
      return items
    }
  }

}

/**
 * Return a table name for the model based on env variables.
 *
 * @param {String} model model name
 * @return {String} resolved table name
 */
export function resolveTableName(model) {
  return `${config.stage}-${model}`
}

/**
 * Return a model type with the values from the db.
 *
 * @param {Type} Model type of model
 * @param {Object} data data to copy to the model
 * @return {Object} returns the inflated model
 */
export function fromDB(Model, data) {
  const model = new Model()
  return Object.assign(model, data)
}

/**
 * Helper for returning a composite key in our standard format.
 *
 * @param {Array[String]} parts composite id parts
 * @return {String} returns the composite id
 */
export function compositeId(...parts) {
  return parts.join('_')
}

/**
 * Helper for deconstructing a composite key in our standard foramt.
 *
 * @param {String} id composite id
 * @return {Array[String]} composite id parts
 */
export function deconstructId(id) {
  return id.split('_')
}

// XXX We shouldn't instantly connect to DynamoDB like this
export default new Client()
