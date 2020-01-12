<template>
  <v-app>
    <v-app-bar app class="primary" dark>
      <h1>
        <span class="font-weight-light">EVENT</span
        ><span class="font-weight-regular grey--text text--darken-4"
          >PLANNER</span
        >
      </h1>
      <v-spacer></v-spacer>
      <v-btn color="black" outlined @click="clearData">
        DELETE ALL EVENTS (debug)
      </v-btn>
    </v-app-bar>
    <v-content class="grey darken-4 d-flex" dark>
      <calendar></calendar>
      <event-form></event-form>
      <notifications></notifications>
    </v-content>
  </v-app>
</template>

<script>
import Calendar from '@/components/Calendar'
import EventForm from '@/components/EventForm'
import Notifications from '@/components/Notifications'

import EventService from '@/services/EventService'
import { bus } from './main'

export default {
  name: 'App',

  components: {
    Calendar,
    EventForm,
    Notifications
  },

  data: () => ({}),

  methods: {
    clearData() {
      localStorage.clear()
      EventService.deleteAll()
      bus.$emit('refreshEvents')
    }
  }
}
</script>
