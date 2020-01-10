import Event from './Events'
import DateArithmetic from '../DateArithmetic'

export default class FrequentEvent extends Event {
    constructor(event){
        super(event,true)
        this.type = event.type
        this.frequenzy = event.frequenzy
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
        return this.isWeekly()
            ? 7
            : 2
    }

    toString(){
        return `"${this.name}" repeating ${this.getRecurringString()}`
    }
    
    getRecurringTypeInWords(){
        return this.isWeekly()
            ? 'week'
            : 'day'
    }

    getRecurringString(){
        return this.frequenzy > 1
            ? `every ${this.frequenzy} ${this.getRecurringTypeInWords()}s`
            : `every ${this.getRecurringTypeInWords()}`
    }
}
