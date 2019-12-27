<template>
      <v-menu
        ref="menu"
        v-model="menu2"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="time"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="time"
            :label="label"
            placeholder="00:00"
            outlined
            dense
            prepend-icon="mdi-calendar-clock"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker
          v-if="menu2"
          v-model="time"
          @click:minute="$refs.menu.save(time)"
          @change="sendData"
        ></v-time-picker>
      </v-menu>
</template>


<script>
  import { bus } from '../main'

  export default {
    props: ['label','defaultTime'],
    data () {
      return {
        time: null,
        menu2: false,
        
      }
    },
    watch: {
        clear: function(){
            this.time = null
        }
    },
    methods: {
        sendData(){

          bus.$emit(`sendSelectedTime ${this.label}`, this.time)
        }
    },
    watch: {
      defaultTime(){
        this.time = this.defaultTime

      }
    },
    created() {
       this.time = this.defaultTime
    }
  }
</script>