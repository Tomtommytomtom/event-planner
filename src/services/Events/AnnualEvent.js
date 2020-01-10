import Event from './Events'
import DateArithmetic from '../DateArithmetic'

export default class AnnualEvent extends Event {
    constructor(event){
        super(event,true)
        this.type = event.type
        this.frequenzy = event.frequenzy || 1
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

    toString(){
        return `"${this.name}" repeating ${this.getRecurringString()}`
    }

    getDaysToBeRepeatedMultiplier(){
        return 150
    }

    getRecurringString(){
        return this.frequenzy > 1
            ?   `every ${this.frequenzy} Years`
            :   'annually'
    }

    
}