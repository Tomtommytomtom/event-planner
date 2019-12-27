
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

const getFirstWeekdayOfMonth = (weekday, date) => {
    let [year, month] = date.split('-')
    var day = 1
    for(day = 1 ; new Date(year, +month - 1, day).getDay() !== weekday; day++ ){
    }
    return [year, month, day].join('-')
}

const getWeekday = (date) => {
    return dateStringToObject(date).getDay()
}

const getTomorrow = date => {
    return addDaysToDate(date, 1)
}

const isNotWeekend = date => {
    return dateStringToObject(date).getDay() > 0 && dateStringToObject(date).getDay() < 6
}

const getNextWeekday = date => {
    const tomorrow = getTomorrow(date)
    if(isNotWeekend(tomorrow)){
        console.log(tomorrow, 'is a weekday')
        return tomorrow
    } else {
        console.log(tomorrow,' is not a weekday')
        return getNextWeekday(tomorrow)
    }
}




export default {
    addDaysToDate,
    doesEventStartBeforeDate,
    getWeekday,
    getFirstWeekdayOfMonth,
    getNextWeekday
}