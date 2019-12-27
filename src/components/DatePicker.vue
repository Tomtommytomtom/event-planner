<template>
      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="isSecondClick"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="dateRangeText"
            :label="label"
            prepend-icon="mdi-calendar"
            outlined
            dense
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="dates"
          range
          no-title
          scrollable
          @change="sendData"
        >
        </v-date-picker>
      </v-menu>
</template>


<script>
  import { bus } from '../main'

  export default {
    props: ['label','defaultDateStart','defaultDateEnd'],
    data: () => ({
      dates: [],
      menu: false,
    }),
    methods: {
        sendData() {

          bus.$emit('sendPickedDates', this.dates)
        },
        setDates(){
          this.dates = [this.defaultDateStart, this.defaultDateEnd]
        }
    },
    watch: {
        defaultDateStart: function(){
          this.setDates()
        },
        defaultDateEnd: function(){
          this.setDates()
        }
    },
    computed: {
      dateRangeText() {
        if((this.dates[0] === this.dates[1]) && (new Date().toISOString().substr(0,10) === this.dates[0])) {
          return 'Today'
        } else if (this.dates[0] === this.dates[1]){
          return this.dates[0]
        } else {
          return this.dates.join(' ~ ')
        }

      },
      isSecondClick() {
        return this.dates.length === 2;
      }
    },
    created(){
        this.dates = [this.defaultDateStart, this.defaultDateEnd]
    }
  }
</script>