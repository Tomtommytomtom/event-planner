import EventService from './EventService'
import DateArithmetic from './DateArithmetic'

let recurringIds = 1


const applySingleRecurringToStatic = event => {    
    console.log(event)     
    let eventToAdd = EventService.createAddAndReturnRecurring(event)

    let nextEvent = eventToAdd.createDuplicateWithNextDate()

    const daysToAdd = eventToAdd.getAmountOfDaysToBeRepeated()
    const threshold = DateArithmetic.addDaysToDate(nextEvent.start, daysToAdd)

    while(shouldBeApplied(nextEvent.start, threshold)){
        EventService.pushEvent(nextEvent)
        nextEvent = nextEvent.createDuplicateWithNextDate()
    }
}

const shouldBeApplied = (eventStart, date) => {
    return DateArithmetic.doesEventStartBeforeDate(eventStart, date)
}

// const getYearsToAddInDays = (event) => {
//     const dayInAYear = 365
//     const type = event.type.split('-')[0]

//     switch(type){
//         case 'daily':
//             return dayInAYear * event.frequenzy * 2
//         case 'weekly':
//             return dayInAYear * event.frequenzy * 7
//         case 'monthly':
//             return dayInAYear * 50
//         case 'annually':
//             return dayInAYear * 200
//         case 'weekdays':
//             return dayInAYear * 2
//     }
// } 



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