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
            <v-date-picker
                ref="datepicker"
                v-model="date"
                @input="sendDate"
                @click:month="sendMonth"
                scrollable
                :disabled="disabled"
            >
            </v-date-picker>
        </v-menu>
    </div>    
</template>

<script>
export default {
    props: ['value','calendarType'],

    data: () => ({
        menu: false,
        date: new Date().toISOString().substr(0,10),
        type:'month',
        disabled: false
    }),

    methods:{
        resetDatePicker(){
            if(this.$refs.datepicker){
                const tableDate = this.date.split('-').splice(0,2).join('-')
                this.$refs.datepicker.tableDate = tableDate
            }
        },
        sendMonth(month){
            console.log('heya')
            if(this.isTypeMonth){
                this.date = month
                this.$emit('input', this.dateToSend)
                this.menu = false
            }
        },
        sendDate(){
            console.log('this was called for whatever reason')
            this.$emit('input', this.dateToSend)
            this.menu = false
        },
        setValue(){
            console.log(this.value)
            this.date = this.value
        },
        setType(){
            this.type = this.calendarType
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
        }
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
        }
    }
}
</script>

