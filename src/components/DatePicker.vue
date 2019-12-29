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
      preventInvalidDateCombination(){

      },
      sendData() {


        if(!this.isDateComboValid){
          this.swapDates()
        }
        bus.$emit('sendPickedDates', this.dates)
      },
      setDates(){
        this.dates = [this.defaultDateStart, this.defaultDateEnd]
      },
      formatDate(date){
        if(!date) return null

        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      swapDates(){
        this.dates = [this.dates[1], this.dates[0]]
      }
    },
    watch: {
      dates: function(){

        //this.sendData(this.dates)
      },
      defaultDateStart: function(){

        this.setDates()
      },
      defaultDateEnd: function(){

        this.setDates()
      },
      menu: function(){
        if(!this.menu){
          if(this.dates[0] && !this.dates[1]){
          bus.$emit('sendPickedDates', [this.dates[0],this.dates[0]])

          }
        }
      }
    },
    computed: {
      isDateComboValid(){
        if(!this.dates[1]){
          return true
        }
        else{
          const [startYear, startMonth, startDay] = this.dates[0].split('-')
          const [endYear, endMonth, endDay] = this.dates[1].split('-')
          return (startYear <= endYear && startMonth <= endMonth && startDay <= endDay)
        }
      },
      dateRangeText() {
        if((this.dates[0] === this.dates[1]) && (new Date().toISOString().substr(0,10) === this.dates[0])) {
          return 'Today'
        } else if (this.dates[0] === this.dates[1]){
          return this.formattedStartDate
        } else {
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