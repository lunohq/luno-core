// A custom error class we can check against to make it easier to return errors
// to the client
export default class LunoError extends Error {
  constructor(message, code) {
    super()
    this.message = message
    this.code = code
  }
}
