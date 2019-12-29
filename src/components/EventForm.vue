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
                <span class="headline">{{ formTitle }}</span>
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
    <v-dialog
            v-model="editDialog"
            width="80%"
        >
            <v-card>
            <v-card-title>You're editing {{ currEvent.type }} recurring Event: {{ currEvent.name }} ?</v-card-title>
            <v-container class="d-flex px-5">
                <v-card-text>Do you want to edit all sibling Events too?</v-card-text>
                <v-checkbox
                    color="primary"
                    class="text-no-wrap"    
                    v-model="editCheckbox"
                    label="Edit all"
                ></v-checkbox>
            </v-container>
                <v-card flat class="d-flex ma-0 pa-3">
                    <v-btn
                        @click="editDialog = false"
                        text
                        color="primary"
                    >
                        Close
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="submitRecurringEdit"
                        text
                        color="primary"
                    >
                        Apply Changes
                    </v-btn>
                </v-card>
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
        editDialog: false,
        editCheckbox: true,
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
        id: undefined,
        recurringId: undefined
   }),
    methods : {
        submitRecurringEdit(){
            if(this.editCheckbox){
                console.log('we in this')
                eventService.updateRecurringEventsinStatic(this.currEvent)
            } else {
                console.log('we in else')
                eventService.addOrUpdate(this.currEvent)
            }
            this.editDialog = false
            this.clearForm()
            bus.$emit('refreshEvents')
        },
        submitForm(){
            if(this.isEditing){
                if(this.isRepeating){
                    this.openEditDialog()
                    return
                } else {
                    eventService.addOrUpdate(this.currEvent)
                }
            } else {    
                if(this.isRepeating){
                    recurringEventService.addOne(this.currEvent)
                    recurringEventService.applyRecurringEventsUntilEndOfNextMonth(this.selectedDate)
                    eventService.addOne(this.currEvent)
                } else {
                    eventService.addOne(this.currEvent)
                }
            }
            this.clearForm()
            bus.$emit('refreshEvents') 
        },
        openEditDialog(){
            this.editDialog = true
        },
        editEvent(){
            if(this.isRepeating){
                
            } else {

            }
            this.formTitle = `Edit event ${this.currEvent.name}`
            this.dialog = true
        },
        setColor(colorObject){
            this.color = colorObject.hex
        },
        clearForm(){
            this.dialog = false
            this.formTitle = "Add a new Event"


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
           console.log('received ', dates)
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
           this.editEvent()
       })

   },
   watch:{
        selectedDate(){

        }
   },
   computed: {
       isEditing(){
           if(this.currEvent.id){
               console.log(true)
               return true
           } else {
               console.log(false)
               return false
           }
       },
       isRepeating(){
          return this.recurringOptionSelected !== "Doesn't repeat"
       },
       recurringType:{
           get(){
                const [ none , ...recurringOptionsOnly] = this.recurringOptions
                const index = recurringOptionsOnly.indexOf(this.recurringOptionSelected)
                return this.recurringOptionsToType[index]
           },
           set(newType){
                const [ none , ...recurringOptionsOnly] = this.recurringOptions
                const index = this.recurringOptionsToType.indexOf(newType)

                if(newType){
                    this.recurringOptionSelected = recurringOptionsOnly[index]
                } else {
                    this.recurringOptionSelected = none
                }
                
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
                    frequenzy: this.frequenzy,
                    recurringId: this.recurringId
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
               this.recurringId = newEvent.recurringId
           }
       }
   }

}
</script>