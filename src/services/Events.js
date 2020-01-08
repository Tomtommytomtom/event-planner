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

    getAmountOfDaysToBeRepeated(){
        return DAYS_IN_YEAR * this.frequenzy * this.getDaysToBeRepeatedMultiplier()
    }

    getDaysToBeRepeatedMultiplier(){
        return 0
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
        return this.getMonthInXMonths(1)
    }

    getMonthInXMonths(monthsToAdd){
        const [year, month, day] = this.getStartDay().split('-')

        const yearCarry = Math.floor((+month + monthsToAdd )/ 12)
        const remainingMonths = monthsToAdd % 12

        if(yearCarry === 0){
        return `${year}-${+month +remainingMonths}-01` 
        } else {
        return `${+year + yearCarry}-${remainingMonths}-01`
        }
    }

    getWeekday(){
        return DateArithmetic.getWeekday(this.getStartDay())
    }

    getNthWeekday(){
        return DateArithmetic.getNthWeekday(this.getStartDay())
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

    getEditMessage(){
        return `Successfully editeddsadsadassda ${this.name}!`
    }

    isSunday(){
        return this.getWeekday() === 0
    }
}



class FrequentEvent extends Event {
    constructor(event){
        super(event)
        this.type = event.type
        this.frequenzy = event.frequenzy
        this.recurringId = event.recurringId || recurringIds++
    }

    getNextDays(){
        return {
            start: this.getDateInXDays(this.getFrequenzy()),
            end: this.getDateInXDays(this.getFrequenzy())
        }
    }

    createDuplicateWithNextDate(){
        return new FrequentEvent({
            ...this,
            ...this.getNextDate()
        })
    }

    isWeekly(){
        return this.type.includes('weekly')
    }

    getFrequenzy(){
        if(this.isWeekly()){
            return this.frequenzy * 7
        } else {
            return this.frequenzy
        }
    }

    getDaysToBeRepeatedMultiplier(){
        return this.type === 'weekly'
            ? 7
            : 2
    }
}



class MonthlyEvent extends Event {
    constructor(event){
        super(event)
        this.type = event.type
        this.frequenzy = event.frequenzy || 1

        this.recurringId = event.recurringId || recurringIds++
    }

    createDuplicateWithNextDate(){
        return new MonthlyEvent({
            ...this,
            ...this.getNextDate()
        })
    }

    isOnLastWeekday(){
        return this.type === 'monthlylast'
    }

    getNextDays(){
        if(this.isOnLastWeekday()){
            return this.getNextDaysForLastWeekday()
        } else {
            return this.getNextDaysForNthWeekday()
        }
    }

    getNextDaysForLastWeekday(){
        const start = DateArithmetic.getDateofLastWeekdayInMonth(this.getWeekday(), this.getNextMonth())
            return {
                start,
                end: DateArithmetic.addDaysToDate(start, this.getDurationOfEvent())
            }
    }

    getNextDaysForNthWeekday(){
        const eventStart = DateArithmetic.getNthWeekdayOfMonth(...this.getNthWeekday(), this.getNextMonth()) //ugh, thats ugly
        const eventEnd = DateArithmetic.addDaysToDate(eventStart, this.getDurationOfEvent())
    
        return {
            start: eventStart,
            end: eventEnd
        }
    }

    getNextMonth(){
        return this.getMonthInXMonths(this.frequenzy)
    }

    getDaysToBeRepeatedMultiplier(){
        return 50
    }
}



class AnnualEvent extends Event {
    constructor(event){
        super(event)
        this.type = event.type
        this.frequenzy = event.frequenzy || 1
        this.recurringId = event.recurringId || recurringIds++
    }

    createDuplicateWithNextDate(){
        return new AnnualEvent({
            ...this,
            ...this.getNextDate()
        })
    }

    getNextDays(){
        const duration = this.getDurationOfEvent()

        return {
            start: this.getSameDayInFrequenzyYears(),
            end: DateArithmetic.addDaysToDate(this.getSameDayInFrequenzyYears(), duration)
        }
    }

    getSameDayInFrequenzyYears(){
        const[year, month , day] = this.getStartDay().split('-')
        return [+year + this.frequenzy, month, day].join('-')
    }

    getDaysToBeRepeatedMultiplier(){
        return 150
    }
}



class WeekdayEvent extends Event {
    constructor(event){
        super(event)
        console.log('inside weekdayevent constructor', event)
        this.type = event.type
        this.weekdays = event.weekdays
        this.frequenzy = event.frequenzy

        this.recurringId = event.recurringId || recurringIds ++
    }

    createDuplicateWithNextDate(){
        return new WeekdayEvent({
            ...this,
            ...this.getNextDate()
        })
    }

    getNextDays(){
        let daysToAdd = 0
        const duration = this.getDurationOfEvent()

        if(this.getLastDayOfWeekThisShouldBeApplied() === this.getWeekday()){
           daysToAdd += (this.frequenzy - 1) *7
        }

        for(let i = 1; i <= 7; i++){
            if(this.weekdays[this.getWeekdayInXDays(i)]){     
                daysToAdd += i
                break
            }
        }

        const newStartDate = this.getDateInXDays(daysToAdd)

        return {
            start: newStartDate,
            end: DateArithmetic.addDaysToDate(newStartDate, duration)
        }
    }

    getDaysToBeRepeatedMultiplier(){
        return 2
    }

    getLastDayOfWeekThisShouldBeApplied(){
        return this.weekdays.reduce((acc,curr,index) => {
            return curr
                ? index
                : acc
        },this.getWeekday())
    }

    getFirstDayOfWeekThisShouldBeApplied(){
        return this.weekdays.indexOf(true)
    }
}



export {
    FrequentEvent,
    MonthlyEvent,
    AnnualEvent,
    WeekdayEvent
}