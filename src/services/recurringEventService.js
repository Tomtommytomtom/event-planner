import eventService from './eventService'
import dateArithmetic from './dateArithmetic'

let recurringEvents = [
    {
      recurringId: 1,
      name: 'Bi-Weekly Event',
      details: 'dummy event reocurring weekly',
      type: 'custom',
      start: '2019-12-03',
      end: '2019-12-03',
      color: 'secondary',
      frequenzy: 14
    },
    {
      recurringId: 2,
      name: 'Weekly Event',
      details: 'dummy event reocurring weekly',
      type: 'weekly',
      start: '2019-12-05',
      end: '2019-12-05',
      color: 'secondary',
      frequenzy: 7
    },
    {
        recurringId: 3,
        name: 'Annual Event',
        details: 'dummy event reocurring weekly',
        type: 'annualy',
        start: '2018-12-11',
        end: '2018-12-11',
        color: 'secondary',
        frequenzy: 0
      },
      {
        recurringId: 4,
        name: 'Monthly',
        details: 'On Every first Saturday of Month',
        type: 'monthly',
        start: '2019-12-7',
        end: '2019-12-7',
        color: 'secondary',
        frequenzy: 0
      },
      {
      recurringId: 5,
      name: 'On every Weekday',
      details: 'From Monday to Friday',
      start: '2019-12-2',
      end: '2019-12-2',
      type: 'weekdays',
      color: 'secondary',
      frequenzy: 0
      },
]

const getNextMonth = date => {
    const [year, month, day] = date.split('-')

    if(+month + 1 < 13){
      return `${year}-${+month + 1}-01` 
    } else {
      return `${+year + 1}-01-01`
    }
  }

const addOne = event => {
    const eventToAdd = giveNewEventARecurringId(event)
    recurringEvents.push(eventToAdd)
}

const giveNewEventARecurringId = event => {
    return {
        ...event,
        recurringId: eventService.getHighestAttributeInArray(recurringEvents, 'recurringId') + 1
    }
}

const applyRecurringEventsUntilEndOfNextMonth = date => {

    const dateUntil = getNextMonth(date)

    applyRecurringToStaticEventsUntil(date)

    applyRecurringToStaticEventsUntil(dateUntil) 
}

const applyRecurringToStaticEventsUntil = date => {
    const eventsToApply = getEventsToApplyForMonth(date)


    if(!eventsToApply){
        return
    }

    eventsToApply.forEach(event => {
        let nextEvent = getNextEvent(event)

        while(dateArithmetic.doesEventStartBeforeDate(nextEvent.start, date)){
            eventService.addOne(nextEvent)
            const eventToUpdate = nextEvent
            nextEvent = getNextEvent(nextEvent)
            if(!dateArithmetic.doesEventStartBeforeDate(nextEvent.start, date)){
                updateEvent(eventToUpdate)
            }
        }
    })
}

const getNextEvent = event => {

    let nextDateAndTime = {}
    switch(event.type){
        case 'daily':
        case 'weekly':
        case 'custom':
            nextDateAndTime = getNextTimeAndDateByFrequenzy(event)
            break
        case 'monthly':
            nextDateAndTime = getNextTimeAndDateForMonthly(event)
            break
        case 'annualy':
            nextDateAndTime = getNextTimeAndDateForAnnual(event)
            break
        case 'weekdays':
            nextDateAndTime = getNextTimeAndDateForWeekdays(event)

            break
    }
    const nextEvent = {
        ...event,
        ...nextDateAndTime
    }
    return nextEvent

}

const getNextTimeAndDateByFrequenzy = event => {
    return {
        start: dateArithmetic.addDaysToDate(event.start, event.frequenzy) + getEventTime(event.start),
        end: dateArithmetic.addDaysToDate(event.end, event.frequenzy) + getEventTime(event.end)
    }
}

const getNextTimeAndDateForAnnual = event => {
    return {
        start: getSameDateNextYear(event.start) + getEventTime(event.start),
        end: getSameDateNextYear(event.end) + getEventTime(event.end)
    }
}

const getNextTimeAndDateForMonthly = event => {

    const weekday = dateArithmetic.getWeekday(event.start)
    const nextMonth = getNextMonth(event.start)
    return {
        start: dateArithmetic.getFirstWeekdayOfMonth(weekday, nextMonth) + getEventTime(event.start),
        end: dateArithmetic.getFirstWeekdayOfMonth(weekday, nextMonth) + getEventTime(event.start)
    }
}

const getNextTimeAndDateForWeekdays = event => {
    return {
        start: dateArithmetic.getNextWeekday(event.start) + getEventTime(event.start),
        end: dateArithmetic.getNextWeekday(event.end) + getEventTime(event.end)
    }
}

const getSameDateNextYear = event => {
    const[year, month , day] = event.split('-')
    return [+year + 1, month, day].join('-')
}

const getEventTime = dateAndTime => {
    const time = dateAndTime.split(' ')[1]

    return !time 
        ? '' 
        : ' ' + time
}

const updateEvent = recurringEvent => {
    recurringEvents = recurringEvents.filter(event => recurringEvent.recurringId !== event.recurringId)
    recurringEvents.push(recurringEvent)
}

const getEventsToApplyForMonth = date => {
    return recurringEvents.filter(event => !isAlrdyInStaticForMonth(event, date))
}

const isAlrdyInStaticForMonth = (event, date) => {
    const result = eventService
        .getAllEventsInMonth(date)
        .map(staticEvent => staticEvent.recurringId)
        .includes(event.recurringId)

    return result

}

export default {
    applyRecurringEventsUntilEndOfNextMonth,
    addOne
}