import eventService from './eventService'
import dateArithmetic from './dateArithmetic'
//let recurringEvents = []
let recurringEvents = [
    {
      recurringId: 1,
      name: 'Bi-Weekly Event',
      details: 'dummy event reocurring weekly',
      type: 'custom-days',
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
        start: '2017-12-11',
        end: '2017-12-11',
        color: 'secondary',
        frequenzy: 2
    },
    {
        recurringId: 4,
        name: 'Monthly',
        details: 'On Every second Saturday of wednesday',
        type: 'monthly',
        start: '2019-12-28',
        end: '2019-12-28',
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
    {
        recurringId: 6,
        name: 'My Birthday',
        details: '11th of july',
        start: '2019-07-11',
        end: '2019-07-11',
        type: 'annualy',
        color: 'primary',
        frequenzy: 0
    },
    {
        recurringId: 7,
        name: 'Lauras Birthday',
        details: 'better not forget',
        start: '2019-04-02',
        end: '2019-04-02',
        type: 'annualy',
        color: 'primary',
        frequenzy: 0
    },
]

//------------------------------------------Mutators------------------------------------

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
            nextDateAndTime = getNextTimeAndDateByFrequenzy(event)
            break
        case 'monthly':
            nextDateAndTime = getNextTimeAndDateForMonthly(event)
            break
        case 'annualy':
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
            nextDateAndTime = getNextTimeAndDateForWeekdays(event)
            break
    }
    const nextEvent = {
        ...event,
        ...addEventTimeBack(nextDateAndTime, event)
    }
    console.log('next Event i am adding', nextEvent)

    return nextEvent
}

const getNextTimeAndDateByFrequenzy = event => {
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

const getNextTimeAndDateForMonthly = event => {

    const [nth,weekday] = dateArithmetic.getNthWeekday(event.start)
    const nextMonth = getNextMonth(event.start)



    const eventStart = dateArithmetic.getNthWeekdayOfMonth(nth,weekday, nextMonth)
    const eventEnd = dateArithmetic.addDaysToDate(eventStart, getDurationOfEvent(event))
    
    return {
        start: eventStart,
        end: eventEnd
    }
}

const getNextTimeAndDateForWeekdays = event => {
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
    applyRecurringEventsUntilEndOfNextMonth,
    addOne,
    updateOneEvent,
    updateEvent,
    deleteEvent
}