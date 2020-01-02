<template>
    <v-select
        v-model="recurringTypeDisplay"
        :items="recurringOptionsDisplay"
        @input="sendType"
        dense
        outlined
        label="Recurrence"
        prepend-icon="mdi-calendar-repeat"
    ></v-select>
</template>

<script>
import dateArithmetic from '@/services/dateArithmetic'

export default {
    props: ['value','currStartDate'], //value = { type, frequenzy }

    data: () => ({
        recurringType: '',
        frequenzy: 0,
        startDate: new Date().toISOString().substr(0,10),
        weekdays: [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ],
    }),
    methods:{
        sendType(){
            this.$emit('input', {
                frequenzy: this.frequenzy,
                type: this.recurringType
            })
        },
        setValue(){
            this.frequenzy = this.value.frequenzy
            this.recurringType = this.value.type
        },
        setStartDate(){
            this.startDate = this.currStartDate.split(' ')[0]
        }
    },
    created(){
        this.setValue()
        this.setStartDate()
    },
    computed:{
        recurringOptionsDisplay(){
            let result = [
               "Doesn't repeat",
               'Daily',
               `Weekly on ${this.currWeekday}`,
               `Monthly on ${this.currNthWeekday} ${this.currWeekday}`,
               `Annually on ${this.dateInWords}`,
               `Every Weekday (starting on ${this.dateInWords})`,
               '...Custom'
            ]
           if(this.currNthWeekday === 'fifth'){
               result = result.slice(0,3).concat([`Monthly on last ${this.currWeekday}`]).concat(result.slice(4))
           } else if(this.isCurrWeekdayLast && this.currNthWeekday === 'fourth') {
               result = result.slice(0,4).concat([`Monthly on last ${this.currWeekday}`],[]).concat(result.slice(4))
           }
           if(!result.includes(this.recurringTypeDisplay)){
               result = result.concat([this.recurringTypeDisplay])
           }
           return result
        },
        recurringTypeDisplay:{
            get(){
                switch(this.recurringType){
                    case "none":
                        return "Doesn't repeat"
                        break
                    case "daily":
                        return "Daily"
                        break
                    case "weekly":
                        return `Weekly on ${this.currWeekday}`
                        break
                    case "monthly-last":
                        return `Monthly on last ${this.currWeekday}`
                        break
                    case "monthly":
                        return `Monthly on ${this.currNthWeekday} ${this.currWeekday}`
                        break
                    case "annually":
                        return `Annually on ${this.dateInWords}`
                        break
                    case "weekdays":
                        return `Every Weekday (starting on ${this.dateInWords})`
                        break
                    case "custom":
                        return "...Custom" 
                }
           },
           set(newType){
                console.log(newType)
                const selected = newType.split(' ')[0]
                let frequenzy
                let result
                switch(selected){
                    case "Doesn't":
                        result  = 'none'
                        break
                    case "Daily":
                        frequenzy = 1
                        result  = 'daily'
                        break
                    case "Weekly":
                        frequenzy = 7
                        result  = 'weekly'
                        break
                    case "Monthly":
                        if(this.recurringOptionSelected.includes('last')){
                            result  = 'monthly-last'
                        break
                        } else {
                            result  = 'monthly'
                        break
                        }
                    case "Annually":
                        result  = 'annually'
                        break
                    case "Every":
                        result  = 'weekdays'
                        break
                    case "...Custom":
                        result  = 'custom'
                        break
                }
                this.frequenzy = frequenzy
                this.recurringType = result
           }
        },
        isCurrWeekdayLast(){
        const result = dateArithmetic.isLastWeekdayOfMonth(this.startDate)
        return result
        },
        currWeekday(){
            return this.weekdays[dateArithmetic.getWeekday(this.startDate)]
        },
        currNthWeekday(){
            const [nth, weekday] = dateArithmetic.getNthWeekday(this.startDate)

            const nthString = ['','first','second','third','fourth','fifth']
            return nthString[nth]
        },
        dateInWords(){
            return dateArithmetic.getMonthAndDayInWords(this.startDate)
        },
    },
    watch: {
        value(){
            this.setValue()
        },
        currStartDate(){
            this.setStartDate()
        },
    }
}
</script>