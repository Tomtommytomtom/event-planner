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
                        <RecurrenceSelector           
                            v-model="recurringInfo"
                            :curr-start-date="startDate"
                        >
                        </RecurrenceSelector>
                    </v-col>
                </v-row>
            </v-container>
            <v-divider class="mb-7"></v-divider>
            <v-container>
                <v-row>
                    <v-col>
                        <NewTimePicker 
                            v-model="startTime" 
                            label="Start Time"
                        ></NewTimePicker>
                    </v-col>
                    <v-col>
                        <NewTimePicker 
                            v-model="endTime"
                            label="End Time"
                        ></NewTimePicker>
                    </v-col>
                </v-row>
            </v-container>
            <v-card-actions class="pl-4 pb-5">
                <ColorPicker
                    v-model="selectedColor"
                ></ColorPicker>
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
                <v-radio-group v-model="radioGroup">
                          <v-radio
                            class="text-no-wrap"
                            color="primary"
                            v-for="editOption in editOptions"
                            :key="editOptions.indexOf(editOption)"
                            :label="editOption"
                            :value="editOption"
                          ></v-radio>
                </v-radio-group>
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
//TODO: disable recurrence selector when editing or think of a smart way to hanld changing recurrence type of an existing event.

import DatePicker from './DatePicker'
import TimePicker from './TimePicker'
import ColorPicker from './ColorPicker'
import NewTimePicker from './NewTimePicker'
import RecurrenceSelector from './RecurrenceSelector'

import eventService from '@/services/eventService'
import recurringEventService from '@/services/recurringEventService'
import dateArithmetic from '@/services/dateArithmetic'

import { bus } from '@/main'

export default {
   components: {
       TimePicker,
       DatePicker,
       ColorPicker,
       NewTimePicker,
       RecurrenceSelector
   },


   data: () => ({
        recurringInfo: {
            type: 'none',
            frequenzy: 0
        },
        radioGroup: 'Only This Event',
        editOptions: [
        'Only This Event',
        'This and All Sibling Events',
        'This and all following sibling Events'
        ],
        formTitle: 'Add a new Event',
        nameInput: '',
        detailsInput: '',
        editDialog: false,
        dialog: false,
        selectedDate: '',
        startDate: '',
        endDate: '',
        startTime: null,
        endTime: null,
        selectedColor: '#F07F1D',
        id: undefined,
        recurringId: undefined
   }),
    methods : {
        submitRecurringEdit(){
            switch(this.radioGroup){
            case 'Only This Event': 

                eventService.updateEvent(this.currEvent)
                break
            case 'This and All Sibling Events':

                eventService.updateRecurringEventsInStatic(this.currEvent)
                break
            case 'This and all following sibling Events':

                eventService.updateRecurringEventsInStaticAfterEventStart(this.currEvent)
                break
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
                    recurringEventService.addNewToStaticAndApplyForNow(this.currEvent, this.selectedDate)
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
            this.selectedColor = '#F07F1D'

            this.resetRecurringInfo()
            this.resetDatePicker()
            this.resetTextInputFields()
            this.resetTimePickers()
        },
        resetRecurringInfo(){
            this.recurringInfo = {
                type: 'none',
                frequenzy: 0
            }
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

           this.startDate = dates[0]
           this.endDate = dates[1]
       })
       bus.$on('openForm', () => this.dialog = true)
       bus.$on('editEvent', event => {
           console.log(event)
           this.currEvent = event
           this.editEvent()
       })

   },
   computed: {
       isEditing(){
           if(this.currEvent.id){

               return true
           } else {

               return false
           }
       },
       isRepeating(){
          return this.currEvent.type !== "none"
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
               console.log(this.recurringInfo,'inside currEvent getter')
                const event = {
                    name: this.nameInput,
                    details: this.detailsInput,
                    start: this.startDateAndTime,
                    end: this.endDateAndTime,
                    id: this.id,
                    color: this.selectedColor,
                    type: this.recurringInfo.type,
                    frequenzy: this.recurringInfo.frequenzy,
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
               this.selectedColor = newEvent.color
               this.recurringInfo = {
                   type: newEvent.type,
                   frequenzy: newEvent.frequenzy
               },
               this.recurringId = newEvent.recurringId
           }
       },
   }

}
</script>
