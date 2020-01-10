import Event from './Events'
import DateArithmetic from '../DateArithmetic'

export default class MonthlyEvent extends Event {
    constructor(event){
        super(event,true)
        this.type = event.type
        this.frequenzy = event.frequenzy || 1

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

    toString(){
        return `"${this.name} repeating ${this.getRecurringString()}`
    }

    getRecurringString(){
        return this.isOnLastWeekday()
            ?`on last ${this.getWeekdayString()}`
            :`every ${this.getNthWeekday()} ${this.getWeekdayString()}`
        
    }

}
