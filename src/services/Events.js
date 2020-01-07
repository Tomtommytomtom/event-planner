import DateArithmetic from './DateArithmetic'

let id = 6

class Event {
    constructor({ name, details, start, end, color }){
        this.name = name
        this.details = details
        this.start = start
        this.end = end
        this.color = color
        this.id = id++
    }

    getNext(){
        return false
    }

    getStartDay() {
        return this.start.split(' ')[0]
    }

    getEndDay() {
        return this.end.split(' ')[0]
    }

    getStartTime(){
        const time = this.end.split(' ')[1]
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
}

class FrequentEvent extends Event {
    constructor({ name, details, start, end, color, type, frequenzy }){
        super(name, details, start, end, color)
        this.type = type
        this.frequenzy = frequenzy
    }

    getNextDays(){
        return {
            start: DateArithmetic.addDaysToDate(this.getStartDay(),this.frequenzy),
            end: DateArithmetic.addDaysToDate(this.getStartDay(),this.frequenzy)
        }
    }

    getNextDate(){
        return this.addTimeBackTo(this.getNextDays())
    }

    createDuplicateWithNextDate(){
        return new FrequentEvent({
            ...this,
            ...this.getNextDate()
        })
    }
}

class MonthlyEvent extends Event {
    constructor(name, details, start, end, color, type, frequenzy){
        super(name, details, start, end, color)
        this.type = type
        this.frequenzy = frequenzy
    }

    getNextDays(){

    }

    getNextDate(){
        return this.addTimeBackTo(this.getNextDays())
    }
}

class AnnualEvent extends Event {
    constructor(name, details, start, end, color, type, frequenzy){
        super(name, details, start, end, color)
        this.type = type
        this.frequenzy = frequenzy
    }

    getNext(){
        
    }
}

export default Event;