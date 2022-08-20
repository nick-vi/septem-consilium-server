const { addDays, startOfWeek, endOfWeek } = require('date-fns')

module.exports.getWeekStartAndEnd = (weekInterval = 0) => {
  const date = addDays(new Date(), 7 * weekInterval)

  return {
    start: startOfWeek(date),
    end: endOfWeek(date)
  }
}
