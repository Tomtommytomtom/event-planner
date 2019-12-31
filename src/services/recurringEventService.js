import eventService from './eventService'
import dateArithmetic from './dateArithmetic'
let recurringEvents = []
// let recurringEvents = [
//     {
//       recurringId: 1,
//       name: 'Bi-Weekly Event',
//       details: 'dummy event reocurring weekly',
//       type: 'custom-days',
//       start: '2019-12-03',
//       end: '2019-12-03',
//       color: 'secondary',
//       frequenzy: 14
//     },
//     {
//       recurringId: 2,
//       name: 'Weekly Event',
//       details: 'dummy event reocurring weekly',
//       type: 'weekly',
//       start: '2019-12-05',
//       end: '2019-12-05',
//       color: 'secondary',
//       frequenzy: 7
//     },
//     {
//         recurringId: 3,
//         name: 'Annual Event',
//         details: 'dummy event reocurring weekly',
//         type: 'annualy',
//         start: '2017-12-11',
//         end: '2017-12-11',
//         color: 'secondary',
//         frequenzy: 2
//     },
//     {
//         recurringId: 4,
//         name: 'Monthly',
//         details: 'On Every second Saturday of wednesday',
//         type: 'monthly',
//         start: '2019-12-28',
//         end: '2019-12-28',
//         color: 'secondary',
//         frequenzy: 0
//     },
//     {
//       recurringId: 5,
//       name: 'On every Weekday',
//       details: 'From Monday to Friday',
//       start: '2019-12-2',
//       end: '2019-12-2',
//       type: 'weekdays',
//       color: 'secondary',
//       frequenzy: 0
//     },
//     {
//         recurringId: 6,
//         name: 'My Birthday',
//         details: '11th of july',
//         start: '2019-07-11',
//         end: '2019-07-11',
//         type: 'annualy',
//         color: 'primary',
//         frequenzy: 0
//     },
//     {
//         recurringId: 7,
//         name: 'Lauras Birthday',
//         details: 'better not forget',
//         start: '2019-04-02',
//         end: '2019-04-02',
//         type: 'annualy',
//         color: 'primary',
//         frequenzy: 0
//     },
// ]

//------------------------------------------Mutators------------------------------------

const addNewToStaticAndApplyForNow = (event, date) => {
    const eventToAdd = giveNewEventARecurringId(event)
    eventService.addOne(eventToAdd)
    addOne(eventToAdd)
    applyRecurringEventsUntilEndOfNextMonth(date)
}

const addOne = event => {
    recurringEvents.push(event)
}

const giveNewEventARecurringId = event => {
    return {
        ...event,
        recurringId: eventService.getHighestAttributeInArray(recurringEvents, 'recurringId') + 1
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
        let prevEvent = event

        while(shouldBeApplied(nextEvent.start, date)){
            eventService.addOne(nextEvent)
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
    const result = eventService
        .getAllEventsInMonth(date)
        .map(staticEvent => staticEvent.recurringId)
        .includes(event.recurringId)
    return result
}

const getNextEvent = event => {

    let nextDateAndTime = {}
    switch(event.type){
        case 'daily':
        case 'weekly':
        case 'custom-days':
            nextDateAndTime = getNextDateByFrequenzy(event)
            break
        case 'monthly':
            nextDateAndTime = getNextDateForMonthly(event)
            break
        case 'monthly-last':
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
        start: dateArithmetic.addDaysToDate(event.start, event.frequenzy),
        end: dateArithmetic.addDaysToDate(event.end, event.frequenzy)
    }
}

const getNextDateForAnnual = event => {
    const start = event.start.split(' ')[0]
    const end = event.start.split(' ')[0]

    return {
        start: getSameDateNextYear(start) ,
        end: getSameDateNextYear(end)
    }
}

const getNextDateForMonthly = event => {
    return getNthWeekdayForMonthly(event)
    
}

const getNthWeekdayForMonthly = (event) => {
    const [nth,weekday] = dateArithmetic.getNthWeekday(event.start)
    const nextMonth = getNextMonth(event.start)

    const eventStart = dateArithmetic.getNthWeekdayOfMonth(nth,weekday, nextMonth)
    const eventEnd = dateArithmetic.addDaysToDate(eventStart, getDurationOfEvent(event))
    
    return {
        start: eventStart,
        end: eventEnd
    }
}

const getLastWeekdayForMonthly = (event) => {
    const weekday = dateArithmetic.getWeekday(event.start)
    const duration = getDurationOfEvent(event)
    
    const nextMonth = getNextMonth(event.start)

    const start = dateArithmetic.getDateofLastWeekdayInMonth(weekday,nextMonth)
    const end = dateArithmetic.addDaysToDate(start, duration)

    return { start, end }
}

const getNextDateForWeekdays = event => {
    return {
        start: dateArithmetic.getNextWeekday(event.start),
        end: dateArithmetic.getNextWeekday(event.end)
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
    return dateArithmetic.doesEventStartBeforeDate(eventStart, date)
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
        return dateArithmetic.getDifference(endDate, startDate)
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