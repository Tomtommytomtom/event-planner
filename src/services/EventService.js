import DateArithmetic from "./DateArithmetic"
import Event from './Events/Events'
import FrequentEvent from './Events/FrequentEvent'
import MonthlyEvent from './Events/MonthlyEvent'
import AnnualEvent from './Events/AnnualEvent'
import WeekdayEvent from './Events/WeekdayEvent'

let staticEvents = [
  {
    name: 'Vue Conf',
    details: 'Vue.js Convention in Austin Texas at the Austin Convention Center',
    color: '#3eb882',
    start: '2020-03-02',
    end: '2020-03-04',
    id: 1,
    type: 'none',
    frequenzy: 0
  },
  {
    name: 'Viscom Dusseldorf',
    details: 'International Trade Fair for Visual Communication',
    color: 'primary',
    start:'2020-01-07',
    end: '2020-01-09',
    id: 2,
    type: 'none',
    frequenzy: 0
  },
  {
    name: 'Mobile Documentation for Industry 4.0 Seminar',
    details: 'Mobile Documentation for Industry 4.0 Seminar will give you an insight into the current state of mobile documentation on smartphones and tablet computers.',
    color: 'primary',
    start:'2020-01-14',
    end: '2020-01-15',
    id: 3,
    type: 'none',
    frequenzy: 0
  },
  {
    name: 'Infratech Essen',
    details: 'The main objective of this international expo is to bring members of consulting and engineering firms, architects and landscape designers under one roof and also to give them an opportunity to have a face.',
    color: 'primary',
    start:'2020-01-14',
    end: '2020-01-16',
    id: 4,
    type: 'none',
    frequenzy: 0
  },
  {
    name: 'Machine Learning and Artificial Intelligence - Compact Knowledge for Specialists and Executives Seminar',
    details: 'Machine Learning and Artificial Intelligence - Compact Knowledge for Specialists and Executives Seminar will explain and classify a wide range of technical terms and convey various machine learning concepts....',
    color: 'primary',
    start:'2020-01-28',
    end: '2020-01-29',
    id: 5,
    type: 'none',
    frequenzy: 0
  }
]

const getAll = () => {
  return staticEvents
}

const pushEvent = event => {
  staticEvents.push(event)
}

const addOrUpdate = event => {
  if(event.id){
    updateEvent(event)
  } else {
    addOne(event)
  }
}

const addOne = event => {
  const eventToAdd = new Event(event)
  pushEvent(eventToAdd)
}

const createAddAndReturnRecurring = event => {
  const recurring = createRecurring(event)

  pushEvent(recurring)

  return recurring
}

const createRecurring = event => {
  switch(event.type.split('-')[0]){
    case 'daily':
    case 'weekly':
      return createFrequent(event)
    case 'weekdays':
      return createWeekdays(event)
    case 'monthly':
    case 'monthlylast':
      return createMonthly(event)
    case 'annually':
      return createAnnual(event)
  }
}

const createFrequent = event => {
  console.log(event, FrequentEvent)
  return new FrequentEvent(event)
}

const createWeekdays = event => {
  return new WeekdayEvent(event)  
}

const createMonthly = event => {
  return new MonthlyEvent(event)
}

const createAnnual = event => {
  return new AnnualEvent(event)
}


const updateEvent = eventToUpdate => {
  staticEvents = staticEvents.filter( event => event.id !== eventToUpdate.id )
  staticEvents.push(eventToUpdate) 

}

const updateRecurringEventsInStatic = eventToUpdate => {
  let updatedEvents = []

  staticEvents = staticEvents.filter(event => {
    if(eventToUpdate.recurringId === event.recurringId){
      const eventWithCorrectId = {
        ...eventToUpdate,
        start: event.start,
        end: event.end,
        id: event.id
      }
      updatedEvents.push(eventWithCorrectId)
      return false
    } else {
      return true
    }
  })
  staticEvents = staticEvents.concat(updatedEvents)
}

const updateRecurringEventsInStaticAfterEventStart = (eventToUpdate) => {
  let updatedEvents = []

  staticEvents = staticEvents.filter(event => {
    if(eventToUpdate.recurringId === event.recurringId && DateArithmetic.doesEventStartAfterOrOnDate(event.start,eventToUpdate.start)){
      const eventWithCorrectId = {
        ...eventToUpdate,
        start: event.start,
        end: event.end,
        id: event.id
      }
      updatedEvents.push(eventWithCorrectId)
      return false
    } else {
      return true
    }
  })
  staticEvents = staticEvents.concat(updatedEvents)
}

const deleteStaticEventsAndRecurring = recurringEvent => {
  deleteEvent(recurringEvent, 'recurringId')
}

const deleteEvent = (eventToDelete, identifier) => {
  staticEvents = staticEvents.filter(event => event[identifier] !== eventToDelete[identifier])  
}

const deleteStaticEventsAndRecurringAfterDate = (recurringEvent) => {
  staticEvents = staticEvents.filter(event => {
    return !(event.recurringId === recurringEvent.recurringId && DateArithmetic.doesEventStartAfterOrOnDate(event.start, recurringEvent.start))
  })
}

const getFirstEventOfRecurringId = (recurringId) => {
  return staticEvents
    .filter(event => event.recurringId === recurringId)
    .reduce((acc, curr) => {
      return DateArithmetic.isEventBeforeEvent(acc, curr)
        ? acc
        : curr
    })
}

const getHighestAttributeInArray = (attribute) => {
  return staticEvents.reduce((acc, curr) => {

    if(!curr && !acc){
      return 0
    }
    return acc[attribute] >= curr[attribute]
        ? acc[attribute]
        : curr[attribute]
  },0)
}

const getAllEventsInMonth = date => {
  return staticEvents.filter(event => doesEventStartInMonth(event, date))
}

const doesEventStartInMonth = (event, date) => {
  const [eventYear, eventMonth, ] = event.start.split('-')
  const [dateYear, dateMonth, ] = date.split('-')

  if(eventYear != dateYear) return false
  if(eventMonth != dateMonth) return false
  return true
}

export default {
  pushEvent,
  addOne,
  updateEvent,
  getAll,
  addOrUpdate,
  deleteEvent,
  getHighestAttributeInArray,
  getAllEventsInMonth,
  updateRecurringEventsInStatic,
  deleteStaticEventsAndRecurring,
  deleteStaticEventsAndRecurringAfterDate,
  updateRecurringEventsInStaticAfterEventStart,
  createAddAndReturnRecurring
}