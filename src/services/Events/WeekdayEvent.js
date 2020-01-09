export default class WeekdayEvent extends Event {
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

