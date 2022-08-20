const mongoose = require('mongoose')
const { logger } = require('../logger')

const mongoConnect = async (dbEndpoint, dbName) => {
  try {
    await mongoose.connect(`${dbEndpoint}/${dbName}`)
    logger.info('Connected to database successfully..')
  } catch (e) {
    logger.info('Something went wrong', e)
  }
}

mongoConnect(
  process.env.DB_ENDPOINT,
  process.env.DB_NAME
)
