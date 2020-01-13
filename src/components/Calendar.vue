<template>
  <v-container class="pa-0">
    <v-row class="fill-height">
      <v-col class="px-2 py-0">
        <v-sheet height="7vh" dark tile color="grey darken-4">
          <v-toolbar flat dark class="fill-height" tile color="grey darken-4">
            <v-btn color="primary" text class="ml-2 mr-6" @click="setToday">
              Today
            </v-btn>
            <v-btn
              elevation="1"
              dark
              color="primary"
              left
              fab
              small
              @click="prev"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-spacer />
            <calendar-picker
              :events="events"
              v-show="!$vuetify.breakpoint.xsOnly"
              v-model="focus"
              :calendar-type="type"
              >{{ title }}</calendar-picker
            >
            <v-spacer />
            <v-btn
              elevation="1"
              dark
              color="primary"
              right
              fab
              small
              @click="next"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-menu bottom right>
              <template v-slot:activator="{ on }">
                <v-btn class="ml-2" text color="primary" v-on="on">
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Day</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Week</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Month</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <v-divider />
        <v-sheet height="86vh">
          <v-calendar
            dark
            ref="calendar"
            v-model="focus"
            color="primary"
            class="white--text"
            :events="events"
            :event-color="getEventColor"
            :event-margin-bottom="3"
            :now="today"
            :type="type"
            :short-intervals="false"
            :interval-minutes="180"
            :interval-count="9"
            interval-height="144px"
            @moved="sendDate"
            @click:day="openFormAndSendDay"
            @click:event="showEvent"
            @click:more="viewDayOrOpenForm"
            @click:date="viewDayOrOpenForm"
            @click:interval="sendDateAndTime"
            @click:time="sendDateAndTime"
            @change="updateRange"
          />
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card dark min-width="200px" flat>
              <v-toolbar :color="selectedEvent.color" dark>
                <v-btn icon @click="editEvent(selectedEvent)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-toolbar-title>{{
                  selectedEvent.toString()
                }}</v-toolbar-title>
                <v-spacer />
                <v-btn icon @click="deleteDialog = true">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>

                <v-dialog v-model="deleteDialog" width="70%">
                  <v-card v-if="deleteNonRecurring" dark>
                    <v-card-title
                      >Delete {{ selectedEvent.name }} ?</v-card-title
                    >
                    <v-card-text>Are you sure you want to delete?</v-card-text>
                    <v-card flat class="d-flex ma-0 pa-3">
                      <v-btn @click="deleteDialog = false" text color="primary">
                        Close
                      </v-btn>
                      <v-spacer />
                      <v-btn
                        @click="deleteSelectedEvent(selectedEvent)"
                        text
                        color="primary"
                      >
                        Delete
                      </v-btn>
                    </v-card>
                  </v-card>
                  <recurring-action-group
                    v-else
                    v-model="radioGroup"
                    :radio-options="deleteOptions"
                    @close="deleteDialog = false"
                    @submit="deleteSelectedRecurringEvent(selectedEvent)"
                    submit-button-label="Delete"
                  >
                    You're deleting a {{ selectedEvent.type }} recurring Event
                    {{ selectedEvent.name }}
                  </recurring-action-group>
                </v-dialog>
              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.details" />
              </v-card-text>
              <v-card-actions>
                <v-btn text color="primary" @click="selectedOpen = false">
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EventService from '@/services/EventService'
import DateArithmetic from '@/services/DateArithmetic'
const { nth } = DateArithmetic

import CalendarPicker from './calendar/CalendarPicker'
import RecurringActionGroup from './helper/RecurringActionGroup'

import { bus } from '@/main'

export default {
  components: {
    CalendarPicker,
    RecurringActionGroup
  },
  data: () => ({
    radioGroup: 'Only this event',
    deleteOptions: [
      'Only this event',
      'This and all sibling events',
      'This and all following sibling events'
    ],
    deleteDialog: false,
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day'
    },
    start: null,
    end: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: []
  }),
  computed: {
    title() {
      const { start, end } = this
      if (!start || !end) {
        return ''
      }

      const startMonth = this.monthFormatter(start)
      const endMonth = this.monthFormatter(end)
      const suffixMonth = startMonth === endMonth ? '' : endMonth

      const startYear = start.year
      const endYear = end.year
      const suffixYear = startYear === endYear ? '' : endYear

      const startDay = start.day + nth(start.day)
      const endDay = end.day + nth(end.day)

      switch (this.type) {
        case 'month':
          return `${startMonth} ${startYear}`
        case 'week':
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
        case 'day':
          return `${startMonth} ${startDay} ${startYear}`
      }
      return ''
    },
    deleteNonRecurring() {
      if (!this.selectedEvent.recurringId) {
        return true
      } else {
        return false
      }
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC',
        month: 'long'
      })
    }
  },
  watch: {
    focus() {
      bus.$emit('sendSelectedDate', this.focus)
    }
  },
  mounted() {
    this.$refs.calendar.checkChange()
  },
  created() {
    this.refreshEvents()
    bus.$on('refreshEvents', () => this.refreshEvents())
  },
  methods: {
    openFormAndSendDay(day) {
      this.sendDate(day)
      bus.$emit('openForm')
    },
    deleteSelectedEvent(event) {
      EventService.deleteEvent(event, 'id')
      bus.$emit('success', {
        message: `Successfully deleted event "${event.name}"`,
        timeout: 5000
      })
      this.deleteDialog = false
      this.selectedOpen = false
      this.refreshEvents()
    },
    deleteSelectedRecurringEvent(event) {
      console.log('yes we in this deleting thing my mans', this.radioGroup)
      switch (this.radioGroup) {
        case 'Only this event':
          EventService.deleteEvent(event, 'id')
          bus.$emit('success', {
            message: `Successfully deleted event "${event.name}"`,
            timeout: 5000
          })
          break
        case 'This and all sibling events':
          EventService.deleteStaticEventsAndRecurring(event)
          bus.$emit('success', {
            message: `Successfully deleted all recurring events "${event.name}"`,
            timeout: 6000
          })
          break
        case 'This and all following sibling events':
          EventService.deleteStaticEventsAndRecurringAfterDate(event)
          bus.$emit('success', {
            message: `Successfully deleted all recurring events on ${event.start} and following "${event.name}"`,
            timeout: 7000
          })
          break
      }
      this.deleteDialog = false
      this.selectedOpen = false
      this.refreshEvents()
    },
    editEvent(event) {
      bus.$emit('editEvent', event)
    },
    sendDateAndTime(dayAndTime) {
      this.sendDate(dayAndTime)
      const startTimeFullHour = `${String(dayAndTime.hour).padStart(2, '0')}:00`
      bus.$emit('sendStartTime', startTimeFullHour)
      bus.$emit('openForm')
    },
    sendDate(dayAndTime) {
      bus.$emit('sendSelectedDate', dayAndTime.date)
    },
    refreshEvents() {
      this.events = EventService.getAll()
    },
    viewDayOrOpenForm(dayAndTime) {
      this.focus = dayAndTime.date
      bus.$emit('sendSelectedDate', dayAndTime.date)
      if (this.type === 'day') {
        bus.$emit('openForm')
      }
      this.type = 'day'
    },
    getEventColor(event) {
      return event.color
    },
    setToday() {
      this.focus = this.today
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => (this.selectedOpen = true), 10)
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    updateRange({ start, end }) {
      this.start = start
      this.end = end
    }
  }
}
</script>
