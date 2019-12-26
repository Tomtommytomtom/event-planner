<template>
  <v-row justify="end">
      <v-btn
        right
        bottom
        fixed
        app 
        fab 
        x-large 
        color="primary" 
        dark 
        @click="dialog = true"
        >
            <v-icon x-large>
                mdi-plus
            </v-icon>
        </v-btn>
    <v-dialog
        v-model="dialog"
        width="80%"
        :fullscreen="$vuetify.breakpoint.xsOnly"
        @click:outside="clearForm"
    >
      <v-card class="pa-2">
        <v-form ref="form" v-model="valid">
            <v-container class="ms-auto">
                <v-card-title>
                <span class="headline">{{ formTitle }} | debug-dialog: {{ dialog }} | debug-valid: {{ valid }}</span>
                </v-card-title>
                <v-text-field
                    v-model="nameInput"
                    dense
                    label="Name"
                    outlined
                    required
                ></v-text-field>
                <v-textarea
                    v-model="detailsInput"
                    dense
                    label="Description"
                    outlined
                    clearable
                ></v-textarea>
            </v-container>
            <v-container>
                <v-row>
                    <v-col>
                        <DatePicker 
                            :default-date="pickedDates" 
                            label="Event Duration"
                        ></DatePicker>
                    </v-col>
                    <v-col>
                        <v-select
                            v-model="repeatOptionSelected"
                            :items="reocurringOptions"
                            dense
                            outlined
                            label="Recurrence"
                            prepend-icon="mdi-calendar-repeat"
                        ></v-select>
                    </v-col>
                </v-row>
            </v-container>
            <v-divider class="mb-7"></v-divider>
            <v-container>
                <v-row>
                    <v-col>
                        <TimePicker 
                            :default-time="startTime" 
                            label="Start Time"
                        ></TimePicker>
                    </v-col>
                    <v-col>
                        <TimePicker 
                            :default-time="endTime"
                            label="End Time"
                        ></TimePicker>
                    </v-col>
                </v-row>
            </v-container>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn 
                    color="primary"
                    text
                    @click="clearForm"
                >Close</v-btn>
                <v-btn 
                    color="primary" 
                    text 
                    :disabled="!valid" 
                    @click="submitForm"
                >Save</v-btn>
            </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import DatePicker from './DatePicker'
import TimePicker from './TimePicker'

import eventService from '@/services/eventService'

import { bus } from '@/main'

export default {
   components: {
       TimePicker,
       DatePicker
   },


   data: () => ({
        formTitle: 'Add a new Event',
        nameInput: '',
        detailsInput: '',
        repeatOptionSelected: "Doesn't repeat",
        reocurringOptions: [
            "Doesn't repeat",
            "Daily",
            "Weekly",
            "Monthly",
            "Annualy",
            "Every Weekday (Monday to Friday)",
        ],
        dialog: false,
        pickedDates: [],
        selecteDates: [],
        startTime: null,
        endTime: null
   }),
    methods : {
        submitForm(){
            console.log('added', this.currEvent)
            eventService.addOrUpdate(this.currEvent)
        },
        clearForm(){
            this.dialog = false

            this.resetDatePicker()
            this.resetTextInputFields()
            this.resetTimePickers()
        },
        resetDatePicker(){
            this.pickedDates = this.selecteDates
        },
        resetTextInputFields(){
            this.nameInput = ''
            this.detailsInput = ''
        },
        resetTimePickers(){
            this.startTime = null
            this.endTime = null
        },
        setToday(){
            const today = new Date().toISOString().substr(0,10)
            this.pickedDates = [today, today]
            this.selecteDates = this.pickedDates
            console.log(this.pickedDates)
        },
   },
   created(){
       this.setToday()

       bus.$on('sendSelectedDate', date => {
           this.pickedDates = [date, date]
           this.selecteDates = this.pickedDates
       })
       bus.$on('sendPickedDates', (dates) => {
           this.pickedDates = dates
       })
       bus.$on('sendSelectedTime Start Time', time => {
           console.log(time)
           this.startTime = time
       })
       bus.$on('sendSelectedTime End Time', time => {
           this.endTime = time
       })
       bus.$on('openForm', () => this.dialog = true)

   },
   watch:{
       pickedDates(){
           console.log('pickedDateChanged')
       },
       pickedTimes(){
           console.log('picked times changed')
       }
   },
   computed: {
       startTimeAutocomplete(){
           if(!this.startTime && this.endTime){
               console.log('hi')
               return " 00:00"
           } else if(!this.startTime && !this.endTime){
               return ''
           } else {
               return ' ' + this.startTime
           }
       },
       endTimeAutocomplete(){
           if(this.startTime && !this.endTime){
               return " 23:59"
           } else if(!this.startTime && !this.endTime){
               return ''
           }else{
               return ' ' + this.endTime
           }
       },
       startDateAndTime(){
           return this.pickedDates[0] + this.startTimeAutocomplete
       },
       endDateAndTime(){
           return this.pickedDates[1] + this.endTimeAutocomplete
       },
       currEvent(){
           console.log(this.startDateAndTime)
           const event = {
               name: this.nameInput,
               details: this.detailsInput,
               start: this.startDateAndTime,
               end: this.endDateAndTime,
               color: 'secondary'
           }
           console.log(event)
           return event
       }
   }

}
</script>