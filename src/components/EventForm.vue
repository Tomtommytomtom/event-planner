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
                <span class="headline">{{ formTitle }} | debug-dialog: {{ dialog }} | debug-valid: {{ valid }} id: {{id}}</span>
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
                            :default-date-start="startDate"
                            :default-date-end="endDate" 
                            label="Event Duration"
                        ></DatePicker>
                    </v-col>
                    <v-col>
                        <v-select
                            v-model="recurringOptionSelected"
                            :items="recurringOptions"
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
                <v-color-picker
                    :value="color"
                    @update:color="setColor"
                    mode="hexa"
                    :hide-canvas="true"
                    :hide-mode-switch="true"
                    :hide-inputs="true"
                    :show-swatches="true"
                    width="400"
                    disabled
                    flat
                    :swatches="colorArray"
                    class="ml-5 mb-5"
                >
                </v-color-picker>
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
import recurringEventService from '@/services/recurringEventService'

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
        recurringOptionSelected: "Doesn't repeat",
        recurringOptions: [
            "Doesn't repeat",
            "Daily",
            "Weekly",
            "Monthly",
            "Annualy",
            "Every Weekday (Monday to Friday)",
        ],
        recurringOptionsToType: [
            "daily",
            "weekly",
            "monthly",
            "annualy",
            "weekdays",
        ],
        frequenzyForTypes: [
            0,
            1,
            7,
            0,
            0,
            0
        ],
        dialog: false,
        selectedDate: '',
        startDate: '',
        endDate: '',
        startTime: null,
        endTime: null,
        color: '#F07F1D',
        colorArray: [
            ['#F07F1D'],
            ['#303030'],
            ['#454545'],
            ['#606060'],
            ['#757575'],
            ['#909090'],
            ['#A9A9A9'],
        ],
        id: undefined
   }),
    methods : {
        submitForm(){
            if(this.isRepeating){
               console.log(this.currEvent)
               recurringEventService.addOne(this.currEvent)

               recurringEventService.applyRecurringEventsUntilEndOfNextMonth(this.selectedDate)
               eventService.addOne(this.currEvent)
            } else {
               eventService.addOrUpdate(this.currEvent)
            }

            bus.$emit('refreshEvents') 
        },
        setColor(colorObject){
            this.color = colorObject.hex
        },
        clearForm(){
            this.dialog = false

            this.id = undefined
            this.recurringOptionSelected = "Doesn't repeat"
            this.resetDatePicker()
            this.resetTextInputFields()
            this.resetTimePickers()
        },
        resetDatePicker(){
            this.startDate = this.selectedDate
            this.endDate = this.selectedDate
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
            this.startDate = today
            this.endDate = today
            this.selectedDate = today
        },
   },
   created(){
       this.setToday()

       bus.$on('sendSelectedDate', date => {
           this.startDate = date
           this.endDate = date
           this.selectedDate = date
       })
       bus.$on('sendPickedDates', (dates) => {
           console.log('sent ', dates)
           this.startDate = dates[0]
           this.endDate = dates[1]
       })
       bus.$on('sendSelectedTime Start Time', time => {

           this.startTime = time
       })
       bus.$on('sendSelectedTime End Time', time => {
           this.endTime = time
       })
       bus.$on('openForm', () => this.dialog = true)
       bus.$on('editEvent', event => {
           this.currEvent = event

           this.dialog = true
       })

   },
   watch:{
        selectedDate(){

        }
   },
   computed: {
       isRepeating(){
          return this.recurringOptionSelected !== "Doesn't repeat"
       },
       recurringType:{
           get(){
                const [ discard , ...recurringOptionsOnly] = this.recurringOptions
                const index = recurringOptionsOnly.indexOf(this.recurringOptionSelected)
                return this.recurringOptionsToType[index]
           },
           set(newType){
                const [ discard , ...recurringOptionsOnly] = this.recurringOptions
                const index = this.recurringOptionsToType.indexOf(newType)

               this.recurringOptionSelected = recurringOptionsOnly[index]
           }
       },
       frequenzy:{
           get(){
               const index = this.recurringOptions.indexOf(this.recurringOptionSelected)
               return this.frequenzyForTypes[index]
           }
       },
       startTimeAutocomplete(){
           if(!this.startTime && this.endTime){

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
       startDateAndTime:{
           get(){
              return this.startDate + this.startTimeAutocomplete
           },
           set(newDateAndTime){
               const [date,time] = newDateAndTime.split(' ')
               this.startDate = date
               if(!time) {
                  this.startTime = time
               }
           }
       },
       endDateAndTime:{
           get(){
                return this.endDate + this.endTimeAutocomplete
           },
           set(newDateAndTime){
               const [date,time] = newDateAndTime.split(' ')
               this.endDate = date
               if(!time){
                  this.endTime = time 
               } 
           }
       },
       currEvent:{
           get(){

                const event = {
                    name: this.nameInput,
                    details: this.detailsInput,
                    start: this.startDateAndTime,
                    end: this.endDateAndTime,
                    id: this.id,
                    color: this.color,
                    type: this.recurringType,
                    frequenzy: this.frequenzy
                }

                return event
           },
           set(newEvent){
               this.nameInput = newEvent.name
               this.detailsInput = newEvent.details
               this.startDateAndTime = newEvent.start
               this.endDateAndTime = newEvent.end
               this.id = newEvent.id
               this.color = newEvent.color
               this.recurringType = newEvent.type
           }
       }
   }

}
</script>