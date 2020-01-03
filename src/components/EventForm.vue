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
      <v-card class="pa-4">
        <v-form ref="form" v-model="valid">
            <v-card-title>
                <span
                    class="headline"
                >{{ formTitle }}</span>
            </v-card-title>
                <v-container>
                <v-text-field
                    v-model="nameInput"
                    dense
                    label="Name"
                    outlined
                    :rules="[rules.required, rules.nameCounter, rules.nonWhiteSpaces]"
                    counter="100"
                >
                </v-text-field>
                <v-textarea
                    v-model="detailsInput"
                    dense
                    label="Description"
                    outlined
                    clearable
                    counter="500"
                    :rules="[rules.descriptionCounter]"
                    no-resize
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
                            :disabled="isEditing"
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
            <v-card-actions>
                <ColorPicker
                    v-model="selectedColor"
                ></ColorPicker>
                <v-spacer></v-spacer>
                <v-btn 
                    color="primary"
                    text
                    @click="clearForm"
                >cancel</v-btn>
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
        originalEditedEvent: {},
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
        recurringId: undefined,
        valid: false,
        rules: {
            required: v => !!v || 'Required',
            nameCounter: v => v.length <= 100 || 'Max 100 Characters',
            descriptionCounter: v => v.length <= 500 || 'Max 500 Characters',
            nonWhiteSpaces: v => { 
                const regEx = /\S+/ //any non white space character
                return regEx.test(v) || 'Invalid, Please enter more than just spaces.'
            },

        }
   }),
    methods : {
        submitRecurringEdit(){
            switch(this.radioGroup){
            case 'Only This Event': 
                eventService.updateEvent(this.currEvent)
                this.sendEditedEventNotification(`Sucessfully edited single recurring Event "${this.currEvent.name}" starting on ${this.eventStartInWords}!`)
                break
            case 'This and All Sibling Events':
                eventService.updateRecurringEventsInStatic(this.currEvent)
                this.sendEditedEventNotification(`Sucessfully edited all "${this.currEvent.name}" Events!`)
                break
            case 'This and all following sibling Events':
                this.sendEditedEventNotification(`Sucessfully edited all "${this.currEvent.name}" Events starting on the ${this.eventStartInWords} and later!`)
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
                    this.sendEditedEventNotification(`Successfully edited Event "${this.currEvent.name}!"`)
                }
            } else {    
                if(this.isRepeating){
                    recurringEventService.addNewToStaticAndApplyForNow(this.currEvent, this.selectedDate)
                    this.sendAddedEventNotification(`Successfully added recurring Event "${this.currEvent.name}"!`)
                } else {
                    this.sendAddedEventNotification(`Successfully added Event "${this.currEvent.name}"!`)
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
            this.originalEditedEvent = this.currEvent
            this.dialog = true
        },
        setColor(colorObject){
            this.color = colorObject.hex
        },
        clearForm(){
            this.dialog = false
            this.formTitle = "Add a new Event"

            this.id = undefined
            this.recurringId = undefined
            this.recurringOptionSelected = "Doesn't repeat"
            this.selectedColor = '#F07F1D'



            this.resetRecurringInfo()
            this.resetDatePicker()
            this.resetTextInputFields()
            this.resetTimePickers()
            
            this.$refs.form.resetValidation()
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
        setStartTime(time){

            this.startTime = time
        },
        sendAddedEventNotification(message){
            bus.$emit('notification', {
                color: 'success',
                message,
                timeout: 2000
            })
        },
        sendEditedEventNotification(message){
            bus.$emit('notification', {
                color: 'success',
                message,
                timeout: 4000
            })
        },
        sendErrorMessage(message){
            bus.$emit('notification', {
                color: 'error',
                message,
                timeout:2000
            })
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
       bus.$on('sendStartTime', time => {
            this.startTime = time
       })
       bus.$on('editEvent', event => {

           this.currEvent = event
           this.editEvent()
       })

   },
   computed: {
       isEditing(){
           return !!this.currEvent.id
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
       eventStartInWords(){
           return dateArithmetic.getDateInWords(this.currEvent.start)
       },
       startDateAndTime:{
           get(){
              return this.startDate + this.startTimeAutocomplete
           },
           set(newDateAndTime){

               const [date,time] = newDateAndTime.split(' ')

               this.startDate = date
               if(time) {
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
               if(time){
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
