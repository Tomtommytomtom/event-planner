import Event from './Events'
import DateArithmetic from '../DateArithmetic'

export default class WeekdayEvent extends Event {
    constructor(event){
        super(event,true)
        this.type = event.type
        this.weekdays = event.weekdays
        this.frequenzy = event.frequenzy

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
            console.log(this.weekdays[i],'if true add ',i, 'days to date and add')
            if(this.weekdays[this.getWeekdayInXDays(i)]){     
                daysToAdd += i
                break
            }
        }

        const newStartDate = this.getStartDateInXDays(daysToAdd)

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

    toString(){
        return `"${this.name}" repeating ${this.getRecurringString()}`
    }

    isWeekly(){
        return this.frequenzy === 1
    }

    getRecurringString(){
        return this.isWeekly()
            ? `every week on ${this.getRecurringWeekdayString()}`
            : `every ${this.frequenzy} weeks on ${this.getRecurringWeekdayString()}`
    }

    getRecurringWeekdayString(){
        return this.getWeekdayStringList().length === 1
            ? `${this.getWeekdayStringList()[0]}`
            : `(${this.getWeekdayStringList().join(', ')})`
    }

    getWeekdayStringList(){
        return this.weekdays.map((weekday,index) => weekday ? DateArithmetic.getWeekdayInWords(index) : weekday).filter(weekday => weekday)
    }


}

