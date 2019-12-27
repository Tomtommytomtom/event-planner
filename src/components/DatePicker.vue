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
          reactive
          range
          no-title
          scrollable
          @change="sendData"
          @input="sendOnlyOneSelected"
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
        sendOnlyOneSelected(date){
          if(this.dates[0] && !this.dates[1]){
            console.log('sent in sendONly', this.dates[1])
            bus.$emit('sendPickedDates', [date,date])
          }
        },
        sendData() {
          bus.$emit('sendPickedDates', this.dates)
        },
        setDates(){
          this.dates = [this.defaultDateStart, this.defaultDateEnd]
        },
        formatDate(date){
          if(!date) return null

          const [year, month, day] = date.split('-')
          return `${day}/${month}/${year}`
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
          return this.formattedStartDate
        } else {
          console.log('in else')
          return [this.formattedStartDate, this.formattedEndDate].join(' ~ ')
        }

      },
      formattedStartDate() {
        return this.formatDate(this.dates[0])
      },
      formattedEndDate(){
        return this.formatDate(this.dates[1])
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