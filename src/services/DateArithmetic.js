const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

const addDaysToDate = (date, days) => {
  const dateWithoutTime = getOnlyDate(date)
  let dateObject = dateStringToObject(dateWithoutTime)
  dateObject.setDate(dateObject.getDate() + days)

  return dateObjectToString(dateObject)
}

const addMonthsToDate = (date, months) => {
  let dateObject = dateStringToObject(date)
  dateObject.setMonth(dateObject.getMonth() + months)
  return dateObjectToString(dateObject)
}

const getOnlyDate = date => {
  return date.split(' ')[0]
}

const dateStringToObject = date => {
  const [year, month, day] = date.split('-')

  const dateObject = new Date(year, +month - 1, day.split(' ')[0])

  return dateObject
}

const dateObjectToString = dateObject => {
  let date = dateObject
  date.setHours(date.getHours() + 2)
  return date.toISOString().substr(0, 10)
}

const isEventBeforeEvent = (eventOne, eventTwo) => {
  const firstDate = eventOne.start.split(' ')[0]
  const secondDate = eventTwo.start.split(' ')[0]

  isDateBeforeDate(firstDate, secondDate)
}

const isDateBeforeDate = (stringOne, stringTwo) => {
  //unit test
  const eventOne = dateStringToObject(stringOne)
  const eventTwo = dateStringToObject(stringTwo)

  return eventOne < eventTwo
}

const isDateEqualOrBeforeDate = (stringOne, stringTwo) => {
  const dateObjects = [
    dateStringToObject(stringOne),
    dateStringToObject(stringTwo)
  ]
  return (
    isDateBeforeDate(stringOne, stringTwo) ||
    areTwoDateObjectsEqual(...dateObjects)
  )
}

const areTwoDateObjectsEqual = (objOne, objTwo) => {
  return objOne.getTime() === objTwo.getTime()
}

const doesEventStartBeforeOrInMonth = (eventStart, dateInMonth) => {
  const startObj = dateStringToObject(eventStart)
  const monthObj = dateStringToObject(getLastDayOfMonth(dateInMonth))

  return startObj <= monthObj
}

const isDateEqualOrAfter = (eventStart, date) => {
  //maybe refactor
  return !isDateBeforeDate(eventStart, date)
}

const getWeekday = date => {
  return dateStringToObject(date).getDay()
}

const getNthWeekday = date => {
  const weekday = getWeekday(date)
  const [year, month] = date.split('-')

  let numberOfWeekdaysUpUntilDate = 0
  let dateCounter = `${year}-${month}-01`

  while (isDateEqualOrBeforeDate(dateCounter, date)) {
    if (getWeekday(dateCounter) === weekday) {
      numberOfWeekdaysUpUntilDate++
    }
    dateCounter = getTomorrow(dateCounter)
  }
  return [numberOfWeekdaysUpUntilDate, weekday]
}

const getNthWeekdayOfMonth = (nth, weekday, date) => {
  let currNth = 0
  let currWeekday = date

  while (nth !== currNth) {
    if (weekday === dateStringToObject(currWeekday).getDay()) {
      currNth++
      if (currNth === nth) {
        break
      }
    }
    currWeekday = getTomorrow(currWeekday)
  }

  return currWeekday
}

const getDateofLastWeekdayInMonth = (weekday, date) => {
  let lastWeekOfMonth = getLastDayOfMonth(date)
  let result

  for (let i = 0; i < 7; i++) {
    if (weekday === dateStringToObject(lastWeekOfMonth).getDay()) {
      result = lastWeekOfMonth
    }
    lastWeekOfMonth = getYesterday(lastWeekOfMonth)
  }
  return result
}

const isLastWeekdayOfMonth = date => {
  let result = false
  let lastWeekOfMonth = getLastDayOfMonth(date)

  for (let i = 0; i < 7; i++) {
    if (date === lastWeekOfMonth) {
      result = true
      break
    }
    lastWeekOfMonth = getYesterday(lastWeekOfMonth)
  }

  return result
}

const getTomorrow = date => {
  return addDaysToDate(date, 1)
}

const getYesterday = date => {
  return addDaysToDate(date, -1)
}

const isNotWeekend = date => {
  return (
    dateStringToObject(date).getDay() > 0 &&
    dateStringToObject(date).getDay() < 6
  )
}

const getNextWeekday = date => {
  const tomorrow = getTomorrow(date)
  if (isNotWeekend(tomorrow)) {
    return tomorrow
  } else {
    return getNextWeekday(tomorrow)
  }
}

const getDifference = (endDate, startDate) => {
  const startDateObject = dateStringToObject(startDate)
  const endDateObject = dateStringToObject(endDate)
  const secondsBetween = Math.abs(endDateObject - startDateObject) / 1000
  const daysBetween = Math.floor(secondsBetween / (60 * 60 * 24))
  return daysBetween
}

const getMonthAndDayInWords = date => {
  const [, month, day] = date.split('-')
  const months = [
    '',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'October',
    'September',
    'November',
    'December'
  ]
  return `${months[+month]} ${+day + nth(day)}`
}

const getDateInWords = date => {
  const monthsAndDay = getMonthAndDayInWords(date)
  const year = date.split('-')[0]
  return `${monthsAndDay} ${year}`
}

const getWeekdayInWords = weekday => {
  return WEEKDAYS[weekday]
}

const nth = day => {
  
  return day > 3 && day < 21
    ? 'th'
    : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][day % 10]
}

const getLastDayOfMonth = date => {
  const [year, month] = date.split('-')
  return new Date(year, month, 1).toISOString().substr(0, 10)
}

export default {
  addDaysToDate,
  doesEventStartBeforeDate: doesEventStartBeforeOrInMonth,
  getWeekday,
  getNextWeekday,
  getDifference,
  getNthWeekday,
  getNthWeekdayOfMonth,
  getMonthAndDayInWords,
  isLastWeekdayOfMonth,
  getDateofLastWeekdayInMonth,
  doesEventStartAfterOrOnDate: isDateEqualOrAfter,
  getDateInWords,
  isEventBeforeEvent,
  isDateBeforeDate,
  getWeekdayInWords,
  nth,
  getLastDayOfMonth,
  dateStringToObject,
  dateObjectToString,
  addMonthsToDate
}
