<template>
  <v-container class="pa-4" width="80%">
    <v-row class="fill-height">
      <v-col >
        <v-sheet height="64" class="elevation-4">
          <v-toolbar flat color="white">
            <v-btn color="primary" text class="mr-4" @click="setToday">
              Today
            </v-btn>
            <v-btn elevation="1" dark color="primary" left fab  small @click="prev">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <calendar-picker
              v-model="focus"
            >{{ title }}</calendar-picker>
            <v-spacer></v-spacer>
            <v-btn elevation="1" dark color="primary" right fab  small @click="next">
              <v-icon >mdi-chevron-right</v-icon>
            </v-btn>
            <v-menu bottom right>
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  color="primary"
                  v-on="on"
                >
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
        
        <v-sheet height="750px">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :event-margin-bottom="3"
            :now="today"
            :type="type"
            :short-intervals="true"
            @moved="sendDate"
            @click:day="openFormAndSendDay"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @click:interval="sendDateAndTime"
            @click:time="sendDateAndTime"
            @change="updateRange"
          ></v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            full-width
            offset-x
          >
            <v-card
              color="grey lighten-4"
              min-width="200px"
              flat
            >
              <v-toolbar
                :color="selectedEvent.color"
                dark
              >
                <v-btn
                icon
                @click="editEvent(selectedEvent)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn 
                  icon
                  @click="deleteDialog = true"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>

                <v-dialog
                  v-model="deleteDialog"
                  width="70%"
                >
                  <v-card v-if="deleteNonRecurring">
                    <v-card-title>Delete {{selectedEvent.name}} ?</v-card-title>
                    <v-card-text>Are you sure you want to delete?</v-card-text>
                    <v-card flat class="d-flex ma-0 pa-3">
                      <v-btn
                        @click="deleteDialog = false"
                        text
                        color="primary"
                      >
                        Close
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                        @click="deleteSelectedEvent(selectedEvent)"
                        text
                        color="primary"
                      >
                        Delete
                      </v-btn>
                    </v-card>
                  </v-card>
                  <v-card v-else>
                    <v-card-title>You're deleting a {{ selectedEvent.type }} recurring Event {{selectedEvent.name}}</v-card-title>
                    <v-container class="d-flex px-5">
                        <v-radio-group v-model="radioGroup">
                          <v-radio
                            class="text-no-wrap"
                            color="primary"
                            v-for="deleteOption in deleteOptions"
                            :key="deleteOptions.indexOf(deleteOption)"
                            :label="deleteOption"
                            :value="deleteOption"
                          ></v-radio>
                        </v-radio-group>
                    </v-container>
                    <v-card flat class="d-flex ma-0 pa-3">
                      <v-btn
                        @click="deleteDialog = false"
                        text
                        color="primary"
                      >
                        Close
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                        @click="deleteSelectedRecurringEvent(selectedEvent)"
                        text
                        color="primary"
                      >
                        Delete
                      </v-btn>
                    </v-card>
                  </v-card>
                </v-dialog>

              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.details"></span>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  text
                  color="secondary"
                  @click="selectedOpen = false"
                >
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

import recurringEventService from '@/services/recurringEventService'
import eventService from '@/services/eventService'

import CalendarPicker from './CalendarPicker'

import { bus } from '@/main'

  export default {
    components: {
        CalendarPicker
    },
    data: () => ({
      

      radioGroup: 'Only This Event',
      deleteOptions: [
        'Only This Event',
        'This and All Sibling Events',
        'This and all following sibling Events'
        
      ],
      deleteDialog: false,
      today: new Date().toISOString().substr(0,10),
      focus: new Date().toISOString().substr(0,10),
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
      },
      start: null,
      end: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
    }),
    computed: {
      title () {
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

        const startDay = start.day + this.nth(start.day)
        const endDay = end.day + this.nth(end.day)

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
      deleteNonRecurring(){
        if(!this.selectedEvent.recurringId){
          return true
        } else {
          return false
        }
      },
      monthFormatter () {
        return this.$refs.calendar.getFormatter({
          timeZone: 'UTC',
          month: 'long',
        })
      },
    },
    mounted () {
      this.$refs.calendar.checkChange()
    },
    methods: {
      openFormAndSendDay(day){
        this.sendDate(day)
        bus.$emit('openForm')
      },
      deleteSelectedEvent(event){
        eventService.deleteEvent(event,'id')
        this.deleteDialog = false
        this.selectedOpen = false
        this.refreshEvents()
      },
      deleteSelectedRecurringEvent(event){
        switch(this.radioGroup){
          case 'Only This Event': 

            eventService.deleteEvent(event,'id')
            break
          case 'This and All Sibling Events':

            eventService.deleteStaticEventsAndRecurring(event)
            break
          case 'This and all following sibling Events':

            eventService.deleteStaticEventsAndRecurringAfterDate(event)
            break
        }
        
        this.deleteDialog = false
        this.selectedOpen = false
        this.refreshEvents()
      },
      editEvent(event){
        bus.$emit('editEvent', event)
      },
      sendDateAndTime(dayAndTime){
        this.sendDate(dayAndTime)
        const startTimeFullHour = `${String(dayAndTime.hour).padStart(2,'0')}:00`
        bus.$emit('sendStartTime', startTimeFullHour)
        bus.$emit('openForm')
      },
      sendDate( dayAndTime ){
        bus.$emit('sendSelectedDate', dayAndTime.date )
      },
      refreshEvents(){
        this.events = eventService.getAll()
      },
      viewDay ( dayAndTime ) {
        this.focus = dayAndTime.date
        this.type = 'day'
        bus.$emit('sendSelectedDate', dayAndTime.date )
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = this.today
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => this.selectedOpen = true, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      updateRange ({ start, end }) {
        this.start = start
        this.end = end

        recurringEventService.applyRecurringEventsUntilEndOfNextMonth(start.date)
      },
      nth (d) {
        return d > 3 && d < 21
          ? 'th'
          : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
      },
    },
    created(){
        this.refreshEvents()
        bus.$on('refreshEvents', () => this.refreshEvents())
    },
    watch: {
        focus(){

           bus.$emit('sendSelectedDate', this.focus)
        },
    }
  }
</script>