<template>
    <div>
        <v-btn
            @click="menu = true"
            color="primary"
            outlined
        >
        <slot></slot>
        </v-btn>
        <v-menu
            ref="menu"
            :close-on-content-click="false"
            v-model="menu"
            right
        >
            <v-sheet
                dark
            >
                <v-date-picker
                    color="primary"
                    ref="datepicker"
                    v-model="date"
                    @input="sendDate"
                    @click:month="sendMonth"
                    scrollable
                    elevation="0"
                    :events="functionEvents"
                >
                </v-date-picker>
                <v-sheet
                    tile
                    class="d-flex"
                    color="primary"
                ><span class="title mx-auto">Calendar Navigation</span></v-sheet>
            </v-sheet>
        </v-menu>
    </div>    
</template>

<script>
export default {
    props: ['value','calendarType','events'],

    data: () => ({
        menu: false,
        date: new Date().toISOString().substr(0,10),
        type:'month',
        disabled: false,
        eventColors: []
    }),

    methods:{
        resetDatePicker(){
            if(this.$refs.datepicker){
                const tableDate = this.date.split('-').splice(0,2).join('-')
                this.$refs.datepicker.tableDate = tableDate
            }
        },
        sendMonth(month){

            if(this.isTypeMonth){
                this.date = month
                this.$emit('input', this.dateToSend)
                this.menu = false
            }
        },
        sendDate(){

            this.$emit('input', this.dateToSend)
            this.menu = false
        },
        setValue(){

            this.date = this.value
        },
        setType(){
            this.type = this.calendarType
        },
        functionEvents(date){
            const [year , month , day] = date.split('-')

            const events = this.getEventsInDate(date)
            const colors = events.map(event => event.color)
            const uniqueColors = this.removeDuplicates(colors)

            if(uniqueColors.length > 3) return uniqueColors.slice(0,3)

            if(uniqueColors) return uniqueColors

            return false

        },
        getEventsInDate(date){
            return this.events.filter(event => event.start === date)
        },
        removeDuplicates(array){
            const noDuplicates = [...new Set(array)]
            return Array.from(noDuplicates)
        }
    },

    created(){
        this.setValue()
    },

    computed:{
        dateToSend(){
            if(this.date.length < 8){
                return this.date + '-01'
            } else {
                return this.date
            }
        },
        isTypeMonth(){
            return this.type === 'month'
        },
    },

    watch: {
        value(){
            this.setValue()
        },
        calendarType(){
            this.setType()
        },
        menu(){
            this.resetDatePicker()
        },
    }
}
</script>

