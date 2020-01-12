import DateArithmetic from '../DateArithmetic'

const DAYS_IN_YEAR = 365

let ids = 6
let recurringIds = 1

export default class Event {
  constructor({ name, details, start, end, color, recurringId }, isRecurring) {
    this.name = name
    this.details = details
    this.start = start
    this.end = end
    this.color = color
    this.id = ids++
    if (isRecurring) {
      this.recurringId = recurringId || recurringIds++
    }
  }

  getNextDate() {
    return this.addTimeBackTo(this.getNextDays())
  }

  getStartDay() {
    return this.start.split(' ')[0]
  }

  getEndDay() {
    return this.end.split(' ')[0]
  }

  getStartTime() {
    const time = this.start.split(' ')[1]
    return time ? ' ' + time : ''
  }

  getEndTime() {
    const time = this.end.split(' ')[1]
    return time ? ' ' + time : ''
  }

  getAmountOfDaysToBeRepeated() {
    return DAYS_IN_YEAR * this.frequenzy * this.getDaysToBeRepeatedMultiplier()
  }

  getDaysToBeRepeatedMultiplier() {
    return 0
  }

  addTimeBackTo({ start, end }) {
    return {
      start: start + this.getStartTime(),
      end: end + this.getEndTime()
    }
  }

  getNextDays() {
    return { start: this.start, end: this.end }
  }

  getDurationOfEvent() {
    if (this.getStartDay() === this.getEndDay()) {
      return 0
    } else {
      return DateArithmetic.getDifference(this.getEndDay(), this.getStartDay())
    }
  }

  getNextMonth() {
    return this.getMonthInXMonths(1)
  }

  getMonthInXMonths(monthsToAdd) {
    const [year, month] = DateArithmetic.addMonthsToDate(
      this.getStartDay(),
      monthsToAdd
    ).split('-')

    return `${year}-${month}-01`
  }

  getWeekday() {
    return DateArithmetic.getWeekday(this.getStartDay())
  }

  getWeekdayString() {
    return DateArithmetic.getWeekdayInWords(this.getWeekday())
  }

  getNthWeekday() {
    return DateArithmetic.getNthWeekday(this.getStartDay())
  }

  getStartDateInXDays(days) {
    return DateArithmetic.addDaysToDate(this.getStartDay(), days)
  }

  getEndDateInXDays(days) {
    return DateArithmetic.addDaysToDate(this.getEndDay(), days)
  }

  getTomorrow() {
    this.getStartDateInXDays(1)
  }
  getWeekdayInXDays(days) {
    return DateArithmetic.getWeekday(this.getStartDateInXDays(days))
  }

  toString() {
    return `${this.name}`
  }

  isSunday() {
    return this.getWeekday() === 0
  }
}
