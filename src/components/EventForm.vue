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
      <v-card class="pa-4" dark>
        <v-form ref="form" v-model="valid">
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-container>
            <v-text-field
              v-model="nameInput"
              :color="componentColor"
              dense
              label="Name"
              outlined
              :rules="[rules.required, rules.nameCounter, rules.nonWhiteSpaces]"
              counter="140"
            />
            <v-textarea
              v-model="detailsInput"
              :color="componentColor"
              dense
              label="Description"
              outlined
              clearable
              counter="500"
              :rules="[rules.descriptionCounter]"
              no-resize
            />
          </v-container>
          <v-container>
            <v-row>
              <v-col>
                <date-picker
                  v-model="dates"
                  :color="componentColor"
                  label="Event Duration"
                />
              </v-col>
              <v-col>
                <recurrence-selector
                  v-model="recurringInfo"
                  :color="componentColor"
                  :curr-start-date="dates.start"
                  :disabled="isEditing"
                />
              </v-col>
            </v-row>
          </v-container>
          <v-divider class="mb-7" />
          <v-container>
            <start-and-end-time-picker
              v-model="times"
              :color="componentColor"
              :current-dates="dates"
            />
          </v-container>
          <v-card-actions>
            <color-picker v-model="selectedColor" />
            <v-spacer />
            <v-btn color="primary" text @click="clearForm">cancel</v-btn>
            <v-btn color="primary" text :disabled="!valid" @click="submitForm"
              >Save</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editDialog" width="80%">
      <recurring-action-group
        v-model="editOptionSelected"
        :radio-options="editOptions"
        submit-button-label="Apply Changes"
        @close="editDialog = false"
        @submit="submitRecurringEdit"
      >
        You're editing {{ currEvent.type }} recurring Event:
        {{ currEvent.name }} ?
      </recurring-action-group>
    </v-dialog>
  </v-row>
</template>

<script>
import DatePicker from './event-form/DatePicker'
import ColorPicker from './event-form/ColorPicker'
import RecurrenceSelector from './event-form/RecurrenceSelector'
import StartAndEndTimePicker from './event-form/StartAndEndTimePicker'
import RecurringActionGroup from './helper/RecurringActionGroup'

import EventService from '@/services/EventService'
import RecurringEventService from '@/services/RecurringEventService'
import DateArithmetic from '@/services/DateArithmetic'

import { bus } from '@/main'

export default {
  components: {
    DatePicker,
    ColorPicker,
    RecurrenceSelector,
    StartAndEndTimePicker,
    RecurringActionGroup
  },

  data: () => ({
    eventClassObject: {},

    componentColor: 'primary',

    recurringInfo: {
      type: 'none',
      frequenzy: 0
    },

    editOptionSelected: 'Only this event',
    editOptions: [
      'Only this event',
      'This and all sibling events',
      'This and all following sibling events'
    ],

    formTitle: 'Add a New Event',

    nameInput: '',
    detailsInput: '',

    selectedDate: '',
    startDate: '',
    endDate: '',

    dates: {
      start: '',
      end: ''
    },

    times: {
      start: null,
      end: null
    },

    selectedColor: '#F07F1D',

    id: undefined,
    recurringId: undefined,

    editDialog: false,
    dialog: false,

    valid: false,
    rules: {
      required: v => !!v || 'Required',
      nameCounter: v => v.length <= 140 || 'Max 100 Characters',
      descriptionCounter: v => v.length <= 500 || 'Max 500 Characters',
      nonWhiteSpaces: v => {
        const regEx = /\S+/ //any non white space character
        return regEx.test(v) || 'Invalid, Please enter more than just spaces.'
      }
    }
  }),
  computed: {
    isLongerThanOneDay() {
      return this.dates.start !== this.dates.end
    },
    isDaily() {
      return (
        this.recurringInfo.type.includes('daily') &&
        this.recurringInfo.frequenzy === 1
      )
    },
    isEditing() {
      return !!this.currEvent.id
    },
    isRepeating() {
      return this.currEvent.type !== 'none'
    },
    startTimeAutocomplete() {
      if (!this.times.start && this.times.end) {
        return ' 00:00'
      } else if (!this.times.start && !this.times.end) {
        return ''
      } else {
        return ' ' + this.times.start
      }
    },
    endTimeAutocomplete() {
      if (this.times.start && !this.times.end) {
        return ' 23:59'
      } else if (!this.times.start && !this.times.end) {
        return ''
      } else {
        return ' ' + this.times.end
      }
    },
    eventStartInWords() {
      return DateArithmetic.getDateInWords(this.currEvent.start)
    },
    startDateAndTime: {
      get() {
        return this.dates.start + this.startTimeAutocomplete
      },
      set(newDateAndTime) {
        const [date, time] = newDateAndTime.split(' ')
        this.dates = {
          ...this.dates,
          start: date
        }
        if (time) {
          this.times = {
            ...this.times,
            start: time
          }
        }
      }
    },
    endDateAndTime: {
      get() {
        return this.dates.end + this.endTimeAutocomplete
      },
      set(newDateAndTime) {
        const [date, time] = newDateAndTime.split(' ')
        this.dates = {
          ...this.dates,
          end: date
        }
        if (time) {
          this.times = {
            ...this.times,
            end: time
          }
        }
      }
    },
    currEvent: {
      get() {
        const event = {
          name: this.nameInput,
          details: this.detailsInput,
          start: this.startDateAndTime,
          end: this.endDateAndTime,
          id: this.id,
          color: this.selectedColor,
          type: this.recurringInfo.type,
          frequenzy: this.recurringInfo.frequenzy,
          weekdays: this.recurringInfo.selectedWeekdays,
          recurringId: this.recurringId
        }
        return event
      },
      set(newEvent) {
        this.eventClassObject = newEvent

        this.nameInput = newEvent.name
        this.detailsInput = newEvent.details
        this.startDateAndTime = newEvent.start
        this.endDateAndTime = newEvent.end
        this.id = newEvent.id
        this.selectedColor = newEvent.color
        this.recurringInfo = {
          type: newEvent.type,
          frequenzy: newEvent.frequenzy,
          selectedWeekdays: newEvent.weekdays
        }
        this.recurringId = newEvent.recurringId
      }
    }
  },
  created() {
    this.setToday()

    bus.$on('sendSelectedDate', date => {
      this.selectedDate = date
      this.dates = {
        start: date,
        end: date
      }
    })
    bus.$on('sendPickedDates', dates => {
      this.dates.start = dates[0]
      this.dates.end = dates[1]
    })

    bus.$on('openForm', () => this.openForm())

    bus.$on('sendStartTime', time => {
      this.times = {
        start: time,
        end: ''
      }
    })

    bus.$on('editEvent', event => {
      this.currEvent = event
      this.openFormToEditEvent()
    })
  },

  methods: {
    submitRecurringEdit() {
      console.log(this.eventClassObject.toString())
      switch (this.editOptionSelected) {
        case 'Only this event':
          EventService.updateEvent(this.currEvent)
          this.sendEditedEventNotification(
            `Sucessfully edited single recurring event "${this.currEvent.name}"
                    on ${this.eventStartInWords}!`
          )
          break

        case 'This and all sibling events':
          EventService.updateRecurringEventsInStatic(this.currEvent)
          this.sendEditedEventNotification(
            `Sucessfully edited all "${this.currEvent.name}" events!`
          )
          break

        case 'This and all following sibling events':
          this.sendEditedEventNotification(
            `Sucessfully edited all "${this.currEvent.name}" events 
                    starting on the ${this.eventStartInWords} and later!`
          )
          EventService.updateRecurringEventsInStaticAfterEventStart(
            this.currEvent
          )
          break
      }

      this.editDialog = false
      this.clearForm()
      bus.$emit('refreshEvents')
    },
    submitForm() {
      if (this.isEditing) {
        this.editEvent()
      } else {
        this.addEvent()
      }
    },
    editEvent() {
      if (this.isRepeating) {
        this.openEditDialog()
        return
      } else {
        EventService.addOrUpdate(this.currEvent)
        this.sendEditedEventNotification(
          `Successfully edited event "${this.currEvent.name}!"`
        )
      }
      this.clearFormAndRefresh()
    },
    addEvent() {
      if (this.isRepeating) {
        this.limitRecurringEvents()
        RecurringEventService.applySingleRecurringToStatic(this.currEvent)
        this.sendAddedEventNotification(
          `Successfully added recurring event "${this.currEvent.name}"!`
        )
      } else {
        this.sendAddedEventNotification(
          `Successfully added event "${this.currEvent.name}"!`
        )
        EventService.addOne(this.currEvent)
      }
      this.clearFormAndRefresh()
    },
    openEditDialog() {
      this.editDialog = true
    },
    openFormToEditEvent() {
      this.formTitle = `Edit Event "${this.currEvent.name}"`
      this.openForm()
    },
    clearFormAndRefresh() {
      this.clearForm()
      bus.$emit('refreshEvents')
    },
    clearForm() {
      this.closeForm()
      this.resetInputs()
      this.resetEditedInfo()
      this.$refs.form.resetValidation()
    },
    resetInputs() {
      this.resetRecurringInfo()
      this.resetDatePicker()
      this.resetTextInputFields()
      this.resetTimePickers()
    },
    resetEditedInfo() {
      this.id = undefined
    },
    resetColor() {
      this.selectedColor = '#F07F1D'
    },
    resetFormTitle() {
      this.formTitle = 'Add a New Event'
    },
    resetRecurringInfo() {
      this.recurringOptionSelected = "Doesn't repeat"
      this.recurringId = undefined
      this.recurringInfo = {
        type: 'none',
        frequenzy: 0,
        weekdays: [false, false, false, false, false, false, false]
      }
    },
    resetDatePicker() {
      this.dates = {
        start: this.selectedDate,
        end: this.selectedDate
      }
    },
    resetTextInputFields() {
      this.nameInput = ''
      this.detailsInput = ''
    },
    resetTimePickers() {
      this.times = {
        start: '',
        end: ''
      }
    },
    setToday() {
      const today = new Date().toISOString().substr(0, 10)
      this.dates.start = today
      this.dates.end = today
      this.selectedDate = today
    },
    setStartTime(time) {
      this.times.start = time
    },
    sendAddedEventNotification(message) {
      bus.$emit('success', {
        message,
        timeout: 7000
      })
    },
    sendEditedEventNotification(message) {
      bus.$emit('success', {
        message,
        timeout: 7000
      })
    },
    sendErrorMessage(message) {
      bus.$emit('sucess', {
        message,
        timeout: 7000
      })
    },
    setDurationToOneDay() {
      this.dates = {
        ...this.dates,
        end: this.dates.start
      }
    },
    limitRecurringEvents() {
      if (this.isDaily && this.isLongerThanOneDay) {
        this.setDurationToOneDay()

        bus.$emit('info', {
          message:
            'Daily events cannot be longer than one day, duration has been changed',
          timeout: 7000
        })
      }
    },
    closeForm() {
      this.dialog = false
    },
    openForm() {
      this.dialog = true
    }
  }
}
</script>
