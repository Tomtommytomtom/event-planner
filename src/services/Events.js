import DateArithmetic from './DateArithmetic'

let ids = 6
let recurringIds = 1

const DAYS_IN_YEAR = 365

export default class Event {
    constructor({ name, details, start, end, color }){
        this.name = name
        this.details = details
        this.start = start
        this.end = end
        this.color = color
        this.id = ids++
        console.log(ids, this)
    }

    getNextDate(){
        return this.addTimeBackTo(this.getNextDays())
    }

    getStartDay() {
        return this.start.split(' ')[0]
    }

    getEndDay() {
        return this.end.split(' ')[0]
    }

    getStartTime(){
        const time = this.start.split(' ')[1]
        return time
            ? ' ' + time
            : ''
    }

    getEndTime() {
        const time = this.end.split(' ')[1]
        return time
            ? ' ' + time
            : ''
    }

    addTimeBackTo({ start , end}){
        return{
            start: start + this.getStartTime(),
            end: end + this.getEndTime()
        }
    }

    getNextDays(){
        return { start: this.start, end: this.end }
    }

    getDurationOfEvent(){
        if(this.getStartDay() === this.getEndDay()){
            return 0
        } else {
            return DateArithmetic.getDifference(this.getEndDay(), this.getStartDay())
        }
    }

    getNextMonth(){
        const [year, month, day] = this.getStartDay.split('-')

        if(+month + 1 < 13){
        return `${year}-${+month + 1}-01` 
        } else {
        return `${+year + 1}-01-01`
        }
    }

    getWeekday(){
        return DateArithmetic.getWeekday(this.getStartDay())
    }

    getDateInXDays(days){
        return DateArithmetic.addDaysToDate(this.getStartDay(), days)
    }

    getTomorrow(){
        this.getDateInXDays(1)
    }
    getWeekdayInXDays(days){
        return DateArithmetic.getWeekday(this.getDateInXDays(days))
    }
}

class FrequentEvent extends Event {
    constructor(event , { type, frequenzy, recurringId }){
        super(event)
        this.type = type
        this.frequenzy = frequenzy

        this.recurringId = recurringId || recurringIds++
    }

    getNextDays(){
        return {
            start: this.getDateInXDays(this.frequenzy),
            end: this.getDateInXDays(this.frequenzy)
        }
    }

    createDuplicateWithNextDate(){
        console.log(this,'inspect this')
        return new FrequentEvent({
            ...this,
            ...this.getNextDate()
        },this)
    }

    getAmountOfDaysToBeRepeated(){
        return this.type === 'weekly'
            ? DAYS_IN_YEAR * 7 * this.frequenzy
            : DAYS_IN_YEAR * 2 * this.frequenzy 
    }
}

class MonthlyEvent extends Event {
    constructor(event, type, recurringId){
        super(event)
        this.type = type
        this.frequenzy = frequenzy

        this.recurringId = recurringId || recurringIds++
    }

    isOnLastWeekday(){
        return this.type === 'monthlylast'
    }

    getNextDays(){
        return {

        }
    }
}

class AnnualEvent extends Event {
    constructor(event, type, frequenzy, recurringId){
        super(event)
        this.type = type
        this.frequenzy = frequenzy

        this.recurringId = recurringId || recurringIds++
    }

    getNextDays(){
        const duration = this.getDurationOfEvent()

        return {
            start: this.getSameDayInFrequenzyYears(),
            end: DateArithmetic.addDaysToDate(this.getSameDayInFrequenzyYears(), duration)
        }
    }

    getSameDayInFrequenzyYears(){
        const[year, month , day] = this.getStartDay.split('-')
        return [+year + this.frequenzy, month, day].join('-')
    }
}

class WeekdayEvent extends Event {
    constructor(event, type, frequenzy, weekdays, recurringId){
        super(event)
        this.type = type
        this.weekdays = weekdays
        this.frequenzy = frequenzy

        this.recurringId = recurringId || recurringIds ++
    }

    getNextDays(){
        let daysToAdd
        const getWeekday = DateArithmetic.getWeekday
        const duration = this.getDurationOfEvent()

        for(let i = 1 + this.frequenzy ; i <= 7 + this.frequenzy ; i++){
            if(weekdays[this.getWeekdayInXDays(i)]){       // example weekdays array: [true, false, false, true, false, false, true] where [Sun,Mon,Tue,Wedn,Thur,Fri,Sat] 
                daysToAdd = i
                break
            }
        }

        const newStartDate = this.getDateInXDays(daysToAdd)

        return {
            start: newStartDate,
            end: DateArithmetic.addDaysToDate(newStartDate, duration)
        }
    }
}

export {
    FrequentEvent,
    MonthlyEvent,
    AnnualEvent,
    WeekdayEvent
}