import EventService from './EventService'
import DateArithmetic from './DateArithmetic'
let recurringEvents = []

//------------------------------------------Mutators------------------------------------

const addNewToStaticAndApplyForNow = (event, date) => {
    const eventToAdd = giveNewEventARecurringId(event)
    addOne(eventToAdd)
    applyRecurringEventsUntilEndOfNextMonth(date)
    EventService.addOne(eventToAdd)
}

const addOne = event => {
    recurringEvents.push(event)
}

const giveNewEventARecurringId = event => {
    return {
        ...event,
        recurringId: EventService.getHighestAttributeInArray(recurringEvents, 'recurringId') + 1
    }
}

const updateEvent = recurringEvent => {
    recurringEvents = recurringEvents.filter(event => recurringEvent.recurringId !== event.recurringId)
    recurringEvents.push(recurringEvent)
}

const updateOneEvent = recurringEvent => {
    let newEvent
    recurringEvents = recurringEvents.filter(event => {
        if(recurringEvent.recurringId !== event.recurringId){
            return true
        } else {

            newEvent = {
                ...recurringEvent,
                start: event.start,
                end: event.end
            }
            return false
        }
    })

    recurringEvents.push(newEvent)
}

const deleteEvent = recurringEvent => {
    recurringEvents = recurringEvents.filter(event => recurringEvent.recurringId !== event.recurringId)
}

//----------------------------------------Applicators--------------------------------------------

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
        console.log('next event is ',nextEvent)
        let prevEvent = event

        while(shouldBeApplied(nextEvent.start, date)){
            EventService.addOne(nextEvent)
            prevEvent = nextEvent
            nextEvent = getNextEvent(nextEvent)
        }

        updateEvent(prevEvent)
    })
}

const getEventsToApplyForMonth = date => {

    return recurringEvents.filter(event => !isAlrdyInStaticForMonth(event, date))
}

const isAlrdyInStaticForMonth = (event, date) => {
    const result = EventService
        .getAllEventsInMonth(date)
        .map(staticEvent => staticEvent.recurringId)
        .includes(event.recurringId)
    return result
}

const getNextEvent = event => {

    let nextDateAndTime = {}
    const type = event.type.split('-')[0]

    switch(type){
        case 'daily':
            nextDateAndTime = getNextDateByFrequenzy(event)
            break
        case 'weekly':
            const weeklyEvent = {
                ...event,
                frequenzy: event.frequenzy*7
            }
            nextDateAndTime = getNextDateByFrequenzy(weeklyEvent)
            break
        case 'monthly':
            nextDateAndTime = getNextDateForMonthly(event)
            break
        case 'monthlylast':
            nextDateAndTime = getLastWeekdayForMonthly(event)
            break
        case 'annually':
            if(!event.frequenzy){
                nextDateAndTime = getNextDateForAnnual(event)
            } else {
                nextDateAndTime = event
                for (let i = 0; i < event.frequenzy; i++){
                    nextDateAndTime = getNextDateForAnnual(nextDateAndTime)
                }
            }
            break
        case 'weekdays':
            nextDateAndTime = getNextDateForWeekdays(event)
            break
    }
    const nextEvent = {
        ...event,
        ...addEventTimeBack(nextDateAndTime, event)
    }

    return nextEvent
}

const getNextDateByFrequenzy = event => {
    return {
        start: DateArithmetic.addDaysToDate(event.start, event.frequenzy),
        end: DateArithmetic.addDaysToDate(event.end, event.frequenzy)
    }
}

const getNextDateForAnnual = event => {
    const start = event.start.split(' ')[0]
    console.log(start)
    const end = event.start.split(' ')[0]

    const startNextYear = getSameDateNextYear(start)
    console.log(startNextYear)
    const duration = getDurationOfEvent(event)
    console.log(duration)

    return {
        start: startNextYear,
        end: DateArithmetic.addDaysToDate(startNextYear,duration)
    }
}

const getNextDateForMonthly = event => {
    return getNthWeekdayForMonthly(event)
    
}

const getNthWeekdayForMonthly = (event) => {
    const [nth,weekday] = DateArithmetic.getNthWeekday(event.start)
    const nextMonth = getNextMonth(event.start)

    const eventStart = DateArithmetic.getNthWeekdayOfMonth(nth,weekday, nextMonth)
    const eventEnd = DateArithmetic.addDaysToDate(eventStart, getDurationOfEvent(event))
    
    return {
        start: eventStart,
        end: eventEnd
    }
}

const getLastWeekdayForMonthly = (event) => {
    const weekday = DateArithmetic.getWeekday(event.start)
    const duration = getDurationOfEvent(event)
    
    const nextMonth = getNextMonth(event.start)

    const start = DateArithmetic.getDateofLastWeekdayInMonth(weekday,nextMonth)
    const end = DateArithmetic.addDaysToDate(start, duration)

    return { start, end }
}

const getNextDateForWeekdays = event => {
    return {
        start: DateArithmetic.getNextWeekday(event.start),
        end: DateArithmetic.getNextWeekday(event.end)
    }
}

const addEventTimeBack = (dateAndTime,event) => {
    return {
        start: dateAndTime.start + getEventTime(event.start),
        end: dateAndTime.end + getEventTime(event.end)
    }
}

const getEventTime = dateAndTime => {
    const time = dateAndTime.split(' ')[1]

    return !time 
        ? '' 
        : ' ' + time
}

const shouldBeApplied = (eventStart, date) => {
    return DateArithmetic.doesEventStartBeforeDate(eventStart, date)
}



const getSameDateNextYear = event => {
    const[year, month , day] = event.split('-')
    return [+year + 1, month, day].join('-')
}

const getDurationOfEvent = event => {
    const [startDate] = event.start.split(' ')
    const [endDate] = event.end.split(' ')
    if(startDate === endDate){
        return 0
    } else {
        return DateArithmetic.getDifference(endDate, startDate)
    }
}


const getNextMonth = date => {
    const [year, month, day] = date.split('-')

    if(+month + 1 < 13){
      return `${year}-${+month + 1}-01` 
    } else {
      return `${+year + 1}-01-01`
    }
  }


export default {
    addNewToStaticAndApplyForNow,
    applyRecurringEventsUntilEndOfNextMonth,
    addOne,
    updateOneEvent,
    updateEvent,
    deleteEvent,

}