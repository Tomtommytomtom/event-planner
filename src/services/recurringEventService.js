import eventService from './eventService'
import dateArithmetic from './dateArithmetic'

let recurringEvents = [
    {
      recurringId: 1,
      name: 'DAILY',
      details: 'dummy event reocurring weekly',
      type: 'daily',
      start: '2019-12-03',
      end: '2019-12-03',
      color: 'secondary',
      frequenzy: 1
    },
    {
      recurringId: 2,
      name: 'WEEKLY',
      details: 'dummy event reocurring weekly',
      type: 'weekly',
      start: '2019-12-05',
      end: '2019-12-05',
      color: 'secondary',
      frequenzy: 7
    },
    {
        recurringId: 3,
        name: 'anuualy',
        details: 'dummy event reocurring weekly',
        type: 'annualy',
        start: '2018-12-11',
        end: '2019-12-11',
        color: 'secondary',
        frequenzy: 0
      },
]

const getNextMonth = date => {
    const [year, month, day] = date.split('-')
    console.log('insinde getNextMonth now',year, month)
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
        recurringId: eventService.getHighestAttribute(recurringEvents, 'recurringId') + 1
    }
}

const applyRecurringEventsUntilEndOfNextMonth = date => {
    const dateUntil = getNextMonth(date)
    applyRecurringToStaticEventsUntil(date)
    console.log(dateUntil)
    applyRecurringToStaticEventsUntil(dateUntil) 
}

const applyRecurringToStaticEventsUntil = date => {
    const eventsToApply = getEventsToApplyForMonth(date)
    console.log('for this month',date.split('-')[1], ' i have to add these events:',eventsToApply)

    if(!eventsToApply){
        return
    }

    eventsToApply.forEach(event => {

        let nextEvent = getNextEvent(event)

        let counter = 32

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
        case 'annualy':
            nextDateAndTime = getNextTimeAndDateForAnnual(event)
            break
        case 'weekdays':
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
        start: getSameDateNextYear(event) + getEventTime(event.start),
        end: getSameDateNextYear(event) + getEventTime(event.end)
    }
}

const getSameDateNextYear = event => {
    const[year, month , day] = event.start.split('-')
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
    console.log(result, ' have already been applied this month')
    return result

}

export default {
    applyRecurringEventsUntilEndOfNextMonth
}