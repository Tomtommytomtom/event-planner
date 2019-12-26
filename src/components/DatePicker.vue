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
    props: ['label','defaultDate'],
    data: () => ({
      dates: [],
      menu: false,
    }),
    methods: {
        sendData() {
          console.log(this.dates)
          bus.$emit('sendDates', this.dates)
        },
    },
    watch: {
        defaultTime: function(){
            this.dates = [this.defaultDate.start.date, this.defaultDate.end.date]
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
        this.dates = [this.defaultDate.start.date, this.defaultDate.end.date]
    }
  }
</script>