<template>
    <v-row>
        <v-col>
            <time-picker 
                v-model="startTime" 
                label="Start Time"
            ></time-picker>
        </v-col>
        <v-col>
            <time-picker 
                v-model="endTime"
                label="End Time"
            ></time-picker>
        </v-col>
    </v-row>
</template>

<script>
import TimePicker from './TimePicker'
export default {
    components: {
        TimePicker
    },

    props: ['value','currentDates'],

    data: () => ({
        times: {
            start: null,
            end: null
        },
        dates: {}
    }),

    methods: {
        setTimes(){
            this.times = this.value
        },
        setDates(){
            this.dates = this.currentDates
        },
        swapTimes(){
            this.times = {
                start: this.times.end,
                end: this.times.start
            }
            //TODO send notification that its been swapped.
        },
        sendTimes(){
            this.correctTimes()
            this.$emit('input',this.times)
        },
        correctTimes(){
            if(!this.isTimeComboValid){
                console.log('we in here')
                this.swapTimes()
            }
        }
    },

    computed: {
        isSameDay(){
            return this.dates.start === this.dates.end
        },
        isTimeComboValid(){
            if(!this.startTime || !this.endTime){
                console.log('i should not be in here')
                return true
            }

            const [startHour, startMinutes] = this.startTime.split(':')
            const [endHour, endMinutes] = this.endTime.split(':')

            console.log(startHour <= endHour, 'dsuyfgdsuygdsauyasdg')
            console.log(startHour === endHour)
            console.log(startMinutes < endMinutes)
            console.log(this.isSameDay)

            return (startHour <= endHour || ((startHour === endHour) && (startMinutes < endMinutes))) || !this.isSameDay
        },
        startTime: {
            get(){
                return this.times.start
            },
            set(start){
                this.times = { ...this.times , start }
                console.log(this.times,'inside start setter')
            }
        },
        endTime: {
            get(){
                return this.times.end
                
            },
            set(end){
                this.times = { ...this.times, end }
                console.log(this.times,'inside end setter')
            }
        }
    },

    created(){
        this.setTimes()
        this.setDates()
    },

    watch:{
        value(){
            this.setTimes()    
        },
        currentDates(){
            this.setDates()
            this.correctTimes()
        },
        times(){
            this.sendTimes()
        },
    }

}
</script>