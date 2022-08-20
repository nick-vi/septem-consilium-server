const mongoose = require('mongoose')
const { logger } = require('../logger')

const mongoConnect = async (address, dbName, username, password) => {
  try {
    await mongoose.connect(`mongodb+srv://${username}:${password}@${address}${dbName}?retryWrites=true&w=majority`,
      { useNewUrlParser: true })

    logger.info('Connected to database successfully..')
  } catch (e) {
    logger.info('Something went wrong', e)
  }
}

mongoConnect(
  process.env.DB_ADDRESS,
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD
)
