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
                            :items="recurringOptionsWithSelectedDate"
                            dense
                            outlined
                            label="Recurrence"
                            :disabled="isEditing"
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
import DatePicker from './DatePicker'
import TimePicker from './TimePicker'
import ColorPicker from './ColorPicker'

import eventService from '@/services/eventService'
import recurringEventService from '@/services/recurringEventService'
import dateArithmetic from '@/services/dateArithmetic'

import { bus } from '@/main'

export default {
   components: {
       TimePicker,
       DatePicker,
       ColorPicker
   },


   data: () => ({
        radioGroup: 'Only This Event',
        editOptions: [
        'Only This Event',
        'This and All Sibling Events',
        'This and all following sibling Events'
        
        ],
        formTitle: 'Add a new Event',
        nameInput: '',
        detailsInput: '',
        recurringOptionSelected: "Doesn't repeat",
        recurringOptionsToType: [
            "none",
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
        weekdays: [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ],
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
                    console.log(this.currEvent)
                    console.log(this.selectedColor)
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
            this.selectedColor = '#F07F1D'

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
       recurringOptionsWithSelectedDate(){
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
           return result
       },
       recurringType:{
           get(){     
               const selected = this.recurringOptionSelected.split(' ')[0]

               switch(selected){
                  case "Doesn't":
                      return 'none'
                  case "Daily":
                      return 'daily'
                  case "Weekly":
                      return 'weekly' //for now
                  case "Monthly":
                      if(this.recurringOptionSelected.includes('last')){
                          return 'monthly-last'
                      } else {
                          return 'monthly'
                      }
                  case "Annually":
                       return 'annually'
                  case "Every":
                       return 'weekdays'
                  case "...Custom":
                       return 'custom'
               }
           },
           set(newType){
                switch(newType){
                    case "none":
                        this.recurringOptionSelected = "Doesn't repeat"
                        break
                    case "daily":
                        this.recurringOptionSelected = "Daily"
                        break
                    case "weekly":
                        this.recurringOptionSelected = `Weekly on ${this.currWeekday}`
                        break
                    case "monthly-last":
                        this.recurringOptionSelected = `Monthly on last ${this.currWeekday}`
                        break
                    case "monthly":
                        this.recurringOptionSelected = `Monthly on ${this.currNthWeekday} ${this.currWeekday}`
                        break
                    case "annually":
                        this.recurringOptionSelected = `Annually on ${this.dateInWords}`
                        break
                    case "weekdays":
                        this.recurringOptionSelected = `Every Weekday (starting on ${this.dateInWords})`
                        break
                    case "custom":
                        this.recurringOptionSelected = "...Custom" 
                }
           }
       },
       frequenzy:{
           get(){
                const index = this.recurringOptionsWithSelectedDate.indexOf(this.recurringOptionSelected)
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
                    color: this.selectedColor,
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
               this.selectedColor = newEvent.color
               this.recurringType = newEvent.type
               this.recurringId = newEvent.recurringId
           }
       }
   }

}
</script>

<style scoped>
.test{
    border-radius: 3px;
    border-style: solid;
    border-color: black;
    background-color: black;
}
</style>