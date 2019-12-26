<template>
  <v-app>
    <v-app-bar
        app
        class="primary"
        dark
      >
        <h1><span class="font-weight-light">EVENT</span><span class="font-weight-regular grey--text text--darken-4">PLANNER</span></h1>
    </v-app-bar>
    <v-content>
      <Calendar></Calendar>
      <EventForm></EventForm>
      <Notifications></Notifications>
    </v-content>
  </v-app>
</template>

<script>
import Calendar from '@/components/Calendar'
import EventForm from '@/components/EventForm'
import Notifications from '@/components/Notifications'


export default {
  
  name: 'App',

  components: {
    Calendar,
    EventForm,
    Notifications    
  },

  data: () => ({

  }),
};
</script>
