const { logger } = require('../logger')

class ServerError extends Error {
  constructor (message, httpStatus) {
    super(message)
    this.error = message
    this.httpStatus = httpStatus
    logger.error(message)
  }
}

exports.ServerError = ServerError
