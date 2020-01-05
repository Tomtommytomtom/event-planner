<template>
    <v-row>
        <v-col>
            <time-picker 
                :color="color"
                v-model="startTime" 
                label="Start Time"
            ></time-picker>
        </v-col>
        <v-col>
            <time-picker 
                :color="color"
                v-model="endTime"
                label="End Time"
            ></time-picker>
        </v-col>
    </v-row>
</template>

<script>
import TimePicker from './TimePicker'

import { bus } from '@/main'

export default {
    components: {
        TimePicker
    },

    props: ['value','currentDates','color'],

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
            bus.$emit('info',{
                message:'Times were invalid, so they have been swapped.',
                timeout: 4000
            })
        },
        sendTimes(){
            this.correctTimes()
            this.$emit('input',this.times)
        },
        correctTimes(){
            if(!this.isTimeComboValid){

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
                return true
            }

            const [startHour, startMinutes] = this.startTime.split(':').map(string => Number(string))
            const [endHour, endMinutes] = this.endTime.split(':').map(string => Number(string))

            return (startHour < endHour || ((startHour === endHour) && (startMinutes < endMinutes))) || !this.isSameDay || this.isStartTimeSameAsEndTime
        },
        isStartTimeSameAsEndTime(){
            return this.startTime === this.endTime
        },
        startTime: {
            get(){
                return this.times.start
            },
            set(start){
                this.times = { ...this.times , start }
            }
        },
        endTime: {
            get(){
                return this.times.end
                
            },
            set(end){
                this.times = { ...this.times, end }

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