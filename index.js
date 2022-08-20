require('dotenv').config()
const { morganMiddleware, logger } = require('./logger')
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())

if (!process.env.JWT_PRIVATE_KEY) throw Error('JWT private key is not defined')

if (process.env.NODE_DEV) {
  app.use(morganMiddleware)
}

require('./startup/db')
require('./startup/routes')(app)

app.listen(process.env.PORT, () => {
  logger.info(`App is listening on port ${process.env.PORT}...`)
})
