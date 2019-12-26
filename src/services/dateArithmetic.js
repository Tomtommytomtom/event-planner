
const addDaysToDate = (date, days) => {
    let dateObject = dateStringToObject(date)
    dateObject.setDate(dateObject.getDate() + days + 1)
    return dateObjectToString(dateObject)
}

const dateStringToObject = (date) => {
    const [year, month, day] = date.split('-')
    return new Date(year, month - 1, day)
}

const dateObjectToString = (dateObject) => {
    return dateObject.toISOString().substr(0,10)
}

const doesEventStartBeforeDate = (eventStart, date) => {
    const [eventYear, eventMonth] = eventStart.split('-')
    const [year, month] = date.split('-')

    if(eventYear > year) {
        return false
    }
    if(eventMonth > month){
        return false
    }
    return true
}




export default {
    addDaysToDate,
    doesEventStartBeforeDate,
}