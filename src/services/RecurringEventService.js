import EventService from './EventService'
import DateArithmetic from './DateArithmetic'

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

export default {
    applySingleRecurringToStatic
}