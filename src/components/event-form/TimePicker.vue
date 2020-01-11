<template>
    <v-autocomplete
        ref="autocomplete"
        :color="color"
        @click:prepend="$refs.autocomplete.focus()"
        v-model="timeDisplay"
        placeholder="00:00"
        :label="label"
        :items="items"
        @change="updateTime"
        outlined
        dense
        prepend-icon="mdi-calendar-clock"
    >
    </v-autocomplete>
</template>

<script>
    export default {
        props: {
            value: String,
            label: String,
            color: String
        },

        data: function(){
            return {
                dialog: false,
                hours: null,
                minutes: null,
                time: this.value,
                items: []  
            }
        },
        methods :{
            setInitialTime(){
                this.time = this.value
            },
            updateTime(){
                this.$emit('input', this.time)
            },
            getTimes(){
                let listOfTimes = []
                for(let hours = 0 ; hours < 24 ; hours++){
                    for(let minutes = 0 ; minutes < 60 ; minutes = minutes + 5)
                    listOfTimes.push(`${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}`)
                }
                listOfTimes = listOfTimes.concat(['23:59','Start of Day', 'for the rest of the Day'])
                return listOfTimes 
            },
        },

        computed :{
            timeDisplay:{
                get(){
                    if(this.time  === '00:00'){
                        return 'Start of Day'
                    } else if(this.time === '23:59'){
                        return 'for the rest of the Day'
                    } else {
                        return this.time
                    }
                },
                set(newValue){
                    if(newValue === 'Start of Day'){
                        this.time = '00:00'
                    } else if(newValue === 'for the rest of the Day'){
                        this.time = '23:59'
                    } else {
                        this.time = newValue
                    }
                }
            }
        },
        created(){
            this.items = this.getTimes()
        },
        watch: {
            value(){
                this.time = this.value
            }
        },
    }
</script>