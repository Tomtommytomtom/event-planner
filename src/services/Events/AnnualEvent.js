import Event from './Events'

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

    getDaysToBeRepeatedMultiplier(){
        return 150
    }
}