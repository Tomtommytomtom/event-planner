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
}

class FrequentEvent extends Event {
    constructor(event , type, frequenzy, recurringId){
        super(event)
        this.type = type
        this.frequenzy = frequenzy

        this.recurringId = recurringId || recurringIds++
    }

    getNextDays(){
        return {
            start: DateArithmetic.addDaysToDate(this.getStartDay(),this.frequenzy),
            end: DateArithmetic.addDaysToDate(this.getStartDay(),this.frequenzy)
        }
    }

    createDuplicateWithNextDate(){
        const { start, end } = this.getNextDate()
        return new FrequentEvent({
            ...this,
            start,
            end
        }, this.type, this.frequenzy, this.recurringId)
    }

    getAmountOfDaysToBeRepeated(){
        return this.type === 'weekly'
            ? DAYS_IN_YEAR * 7 * this.frequenzy
            : DAYS_IN_YEAR * 2 * this.frequenzy 
    }
}

class MonthlyEvent extends Event {
    constructor(event, type, last){
        super(event)
        this.type = type
        this.frequenzy = frequenzy
        this.last = last
    }

    getNextDays(){
        return {

        }
    }
}

class AnnualEvent extends Event {
    constructor(event, type, frequenzy){
        super(event)
        this.type = type
        this.frequenzy = frequenzy
    }
}

export {
    FrequentEvent,
    MonthlyEvent,
    AnnualEvent
}