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
        return this.type === 'weekly'
            ? 7
            : 2
    }
}
