<template>
  <v-dialog
    width="fit-content"
    v-model="dialog"
  >
        <template v-slot:activator="{ on }">
            <v-text-field
                v-model="dateRangeText"
                :label="label"
                prepend-icon="mdi-calendar"
                @click:prepend="dialog = true"
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
      scrollable
      @change="sendData"
      @input="incrementClicks"
    >
    </v-date-picker>
  </v-dialog>
</template>


<script>
//make v-model work properly in this
  import { bus } from '@/main'

    export default {
        props: ['value','label'],

        data: () => ({
            clicks: 0,
            dates: [],
            dialog: false,
        }),

        methods: {
            incrementClicks(){
                this.clicks++
            },
            sendData() {
                if(!this.isDateComboValid){
                    this.swapDates()
                }
                this.$emit('input', {
                    start: this.dates[0],
                    end: this.dates[1]
                })
            },
            setDates(){
                this.dates = [this.value.start, this.value.end]
            },
            formatDate(date){
                if(!date) return null

                const [year, month, day] = date.split('-')
                return `${day}/${month}/${year}`
            },
            swapDates(){
                this.dates = [this.dates[1], this.dates[0]]
                //TODO send notification that it has been swapped
            }
        },
        watch: {
            value(){
                this.setDates()
            },
            clicks(){
                if(this.clicks == 2){
                    this.clicks = 0
                    this.dialog = false
                }
            },
            dialog: function(){
                if(!this.dialog){
                    if(this.dates[0] && !this.dates[1]){
                    this.$emit('input',{
                        start: this.dates[0],
                        end: this.dates[0]
                    })
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

                    if(startYear > endYear){
                        console.log(startYear, 'is bigger than', endYear)
                        return false
                    } 
                    if(startMonth > endMonth){
                        console.log(startMonth, 'is bigger than', endMonth)
                        return false
                    } 
                    if(startDay > endDay && startMonth === endMonth){console.log(
                        startDay, 'is bigger than', endDay)
                        return false
                    } 
                    return true
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
            this.dates = [this.value.start, this.value.end]
        },
    }
</script>