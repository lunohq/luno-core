/**
 * Return a table name for the model based on env variables.
 *
 * @param {String} model model name
 * @return {String} resolved table name
 */
export function resolveTableName(model) {
  const { env: { STAGE } } = process;
  return `${STAGE}-${model}`;
}

/**
 * Return a model type with the values from the db.
 *
 * @param {Type} Model type of model
 * @param {Object} data data to copy to the model
 * @return {Object} returns the inflated model
 */
export function fromDB(Model, data) {
  const model = new Model();
  return Object.assign(model, data);
}

export default (() => {
  const AWS = require('aws-sdk');
  const DocumentClient = AWS.DynamoDB.DocumentClient;
  return new DocumentClient();
})();
