import EventService from './EventService'
import DateArithmetic from './DateArithmetic'

let recurringIds = 1


const applySingleRecurringToStatic = event => {                   
    const eventToAdd = giveNewEventARecurringId(event)

    EventService.addOne(eventToAdd)

    let nextEvent = getNextEvent(eventToAdd)

    const daysToAdd = getYearsToAddInDays(eventToAdd)
    const threshold = DateArithmetic.addDaysToDate(nextEvent.start, daysToAdd)

    while(shouldBeApplied(nextEvent.start, threshold)){
        EventService.addOne(nextEvent)
        nextEvent = getNextEvent(nextEvent)
    }
}

const giveNewEventARecurringId = event => {

    return {
        ...event,
        recurringId: recurringIds++
    }
}

const getYearsToAddInDays = (event) => {
    const dayInAYear = 365
    const type = event.type.split('-')[0]

    switch(type){
        case 'daily':
            return dayInAYear * event.frequenzy * 2
        case 'weekly':
            return dayInAYear * event.frequenzy * 7
        case 'monthly':
            return dayInAYear * 50
        case 'annually':
            return dayInAYear * 200
        case 'weekdays':
            return dayInAYear * 2
    }
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

    const end = event.start.split(' ')[0]

    const startNextYear = getSameDateNextYear(start)

    const duration = getDurationOfEvent(event)


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
    applySingleRecurringToStatic
}