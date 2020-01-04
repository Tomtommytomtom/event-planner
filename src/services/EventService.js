import RecurringEventService from "./RecurringEventService"
import { stat } from "fs"
import DateArithmetic from "./DateArithmetic"

let staticEvents = []

const getAll = () => {
  return staticEvents
}

const addOrUpdate = event => {
  if(event.id){
    updateEvent(event)
  } else {
    addOne(event)
  }
}

const addOne = event => {
  const eventToAdd = giveNewEventAnId(event)
  staticEvents.push(eventToAdd)

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
  RecurringEventService.deleteEvent(recurringEvent)
}

const deleteEvent = (eventToDelete, identifier) => {
  staticEvents = staticEvents.filter(event => event[identifier] !== eventToDelete[identifier])  
}

const deleteStaticEventsAndRecurringAfterDate = (recurringEvent) => {
  staticEvents = staticEvents.filter(event => {
    return !(event.recurringId === recurringEvent.recurringId && DateArithmetic.doesEventStartAfterOrOnDate(event.start, recurringEvent.start))
  })
  RecurringEventService.deleteEvent(recurringEvent)
}

const giveNewEventAnId = event => {
  return {
    ...event,
    id: getHighestAttributeInArray('id') + 1
  }
}

const getFirstEventOfRecurringId = (recurringId) => {
  staticEvents
    .filter(event => event.recurringId === recurringId)
    .reduce((acc, curr) => {
      return DateArithmetic.isEventBeforeEvent(acc, curr)
        ? acc
        : curr
    })
}

const getHighestAttributeInArray = (attribute) => {
  return staticEvents.reduce((acc, curr) => {
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
  updateRecurringEventsInStaticAfterEventStart
}