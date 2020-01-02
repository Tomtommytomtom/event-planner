<template>
    <div>
        <v-select
            v-model="recurringTypeDisplay"
            :items="recurringOptionsDisplay"
            dense
            outlined
            label="Recurrence"
            prepend-icon="mdi-calendar-repeat"
        ></v-select>
        <v-dialog
            width="fit-content"
            v-model="customOptionsDialog"
        >
            <custom-option-form
                @close-form="customOptionsDialog = false"
                @reset-form="resetCustom"
                v-model="customOptionSelected"
            >
            </custom-option-form>
        </v-dialog>
    </div>
</template>

<script>
import dateArithmetic from '@/services/dateArithmetic'
import CustomOptionForm from './CustomOptionForm'

export default {
    props: ['value','currStartDate'], //value = { type, frequenzy }

    components: {
        CustomOptionForm
    },

    data: () => ({
        customString: '',
        customOptionsDialog: false,
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
            console.log('sent, ', this.customOptionSelected)
            this.$emit('input', this.customOptionSelected)
        },
        setValue(){
            this.frequenzy = this.value.frequenzy
            this.recurringType = this.value.type
        },
        setStartDate(){
            this.startDate = this.currStartDate.split(' ')[0]
        },
        resetCustom(){
            this.customOptionsDialog = false
            this.recurringType = 'none'
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
                const [selected, custom] = this.recurringType.split('-')
                console.log(selected, custom,'why would custom be undefined')
                if(custom){
                    return this.customString
                }
                switch(selected){
                    case "none":
                        return "Doesn't repeat"
                        break
                    case "daily":
                        return "Daily"
                        break
                    case "weekly":
                        return `Weekly on ${this.currWeekday}`
                        break
                    case "monthlylast":
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
                }
           },
           set(newType){
                console.log(newType,' in setting a new type for recurringTypeDisplay')
                const selected = newType.split(' ')[0]
                let frequenzy = this.frequenzy
                let result = this.recurringType
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
                            result  = 'monthlylast'
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
                        this.customOptionsDialog = true
                        return
                        break
                }
                this.frequenzy = frequenzy
                this.recurringType = result
                this.sendType()
           },
        },
        customOptionSelected: {
               get(){
                   return {
                       type: this.recurringType,
                       frequenzy: this.frequenzy
                   }
               },
               set(newOption){
                   console.log(newOption,'this is prolly where shit goes wrong')
                   this.recurringType = newOption.type
                   this.frequenzy = newOption.frequenzy
                   this.customString = newOption.customString
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
            console.log('value changed in recurrenceselector, changing now')
            //this.setValue()
        },
        currStartDate(){
            console.log('currStartDate changed in recurrenceselector, changin now')
            this.setStartDate()
        },
        customOptionSelected(){
            console.log(this.customOptionSelected,'inside customoptionselectedweatcher')
            this.sendType()
        }
    }
}
</script>