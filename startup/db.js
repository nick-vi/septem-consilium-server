const mongoose = require('mongoose')
const { logger } = require('../logger')

const mongoConnect = async (dbName) => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/${dbName}`)

    logger.info('Connected to database successfully..')
  } catch (e) {
    logger.info('Something went wrong', e)
  }
}

mongoConnect(process.env.DB_NAME)
