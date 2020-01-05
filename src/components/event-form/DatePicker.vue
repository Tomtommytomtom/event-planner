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
    <v-sheet
        dark
    >
        <v-date-picker
            color="primary"
            ref="datepicker"
            v-model="dates"
            reactive
            range
            scrollable
            @change="sendData"
            @input="incrementClicks"
            :elevation=0
        >
        </v-date-picker>
        <v-sheet
            class="d-flex"
            color="primary"
            tile
        ><span class="title mx-auto">{{ tooltip }}</span></v-sheet>
    </v-sheet>
  </v-dialog>
</template>


<script>
  import { bus } from '@/main'
  import DateArithmetic from '@/services/DateArithmetic'

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
            },
            resetDatePicker(){
                if(this.dates[0] && this.$refs.datepicker){
                   const tableDate = this.dates[0]
                   this.$refs.datepicker.tableDate = tableDate 
                }
            },
            resetClicks(){
                this.clicks = 0
            }
        },
        watch: {
            value(){
                this.setDates()
            },
            clicks(){
                if(this.clicks == 2){
                    this.resetClicks()
                    this.dialog = false
                }
            },
            dialog(){
                this.resetClicks()

                if(this.isDialogClosed){
                    if(this.isOnlyOneSelected){
                        this.$emit('input',{
                            start: this.dates[0],
                            end: this.dates[0]
                        })
                    } else {
                        this.resetDatePicker()
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
                    return DateArithmetic.isDateBeforeDate(this.dates[0],this.dates[1])
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
            },
            isOnlyOneSelected(){
                return this.dates[0] && !this.dates[1]
            },
            NoneIsSelected(){
                return this.dates[0] && this.dates[1]
            },
            isDialogClosed(){
                return !this.dialog
            },
            tooltip(){
                if(this.NoneIsSelected){
                    return 'Pick Start Date'
                } else {
                    return 'Pick an End Date'
                }
            }
        },

        created(){
            this.dates = [this.value.start, this.value.end]
        },
    }
</script>