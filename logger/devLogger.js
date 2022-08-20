const { createLogger, format, transports } = require('winston')

const { combine, timestamp, printf, colorize } = format

const myFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] > ${level}: ${message}`
})

module.exports.devLogger = () => {
  return (
    createLogger({
      level: 'debug',
      format: combine(
        colorize(),
        timestamp({ format: 'dd/MM/YYYY - HH:mm:ss' }),
        myFormat
      ),
      transports: [
        new transports.Console()
      ]
    })
  )
}
