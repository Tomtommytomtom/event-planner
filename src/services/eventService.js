import recurringEventService from "./recurringEventService"
import { stat } from "fs"
import dateArithmetic from "./dateArithmetic"

let staticEvents = []

// let staticEvents = [
//     {
//       id: 1,
//       name: 'Event 1',
//       details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu neque id nisl viverra faucibus. Nullam ac consectetur arcu. In gravida libero in velit accumsan interdum. Cras in massa magna',
//       start: '2019-12-02',
//       end: '2019-12-06',
//       color: 'secondary'
//     },
//     {
//       id: 2,
//       name: 'Event 2',
//       details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu neque id nisl viverra faucibus. Nullam ac consectetur arcu. In gravida libero in velit accumsan interdum. Cras in massa magna',
//       start: '2019-12-02',
//       end: '2019-12-12',
//       color: 'secondary'
//     },
//     {
//       id:3,
//       name: 'Event 3',
//       details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu neque id nisl viverra faucibus. Nullam ac consectetur arcu. In gravida libero in velit accumsan interdum. Cras in massa magna',
//       start: '2019-12-15',
//       end: '2019-12-15',
//       color: 'secondary'
//     },
//     {
//       id: 4,
//       name: 'Event 4',
//       details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu neque id nisl viverra faucibus. Nullam ac consectetur arcu. In gravida libero in velit accumsan interdum. Cras in massa magna',
//       start: '2019-12-02',
//       end: '2019-12-05',
//       color: 'secondary'
//     },
//     {
//       id: 5,
//       name: 'Event 5',
//       details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu neque id nisl viverra faucibus. Nullam ac consectetur arcu. In gravida libero in velit accumsan interdum. Cras in massa magna',
//       start: '2019-12-21',
//       end: '2019-12-24',
//       color: 'secondary'
//     },
//   ]

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

const updateRecurringEventsinStatic = eventToUpdate => {

  recurringEventService.updateOneEvent(eventToUpdate)

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

const deleteStaticEventsAndRecurring = recurringEvent => {
  deleteEvent(recurringEvent, 'recurringId')
  recurringEventService.deleteEvent(recurringEvent)
}

const deleteEvent = (eventToDelete, identifier) => {
  staticEvents = staticEvents.filter(event => event[identifier] !== eventToDelete[identifier])  
}

const deleteStaticEventsAndRecurringAfterDate = (recurringEvent) => {
  staticEvents = staticEvents.filter(event => {
    return !(event.recurringId === recurringEvent.recurringId && dateArithmetic.doesEventStartAfterOrOnDate(event.start, recurringEvent.start))
  })
  recurringEventService.deleteEvent(recurringEvent)
}

const giveNewEventAnId = event => {
  return {
    ...event,
    id: getHighestAttributeInArray(staticEvents,'id') + 1
  }
}

const getHighestAttributeInArray = (array,attribute) => {

  return array.reduce((prev, curr) => {
    return prev[attribute] >= curr[attribute]
        ? prev[attribute]
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
  getAll,
  addOrUpdate,
  deleteEvent,
  getHighestAttributeInArray,
  getAllEventsInMonth,
  updateRecurringEventsinStatic,
  deleteStaticEventsAndRecurring,
  deleteStaticEventsAndRecurringAfterDate
}