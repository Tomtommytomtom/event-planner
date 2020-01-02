<template>
        <v-autocomplete
            ref="autocomplete"
            @click:prepend="$refs.autocomplete.focus()"
            v-model="time"
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
        props: ['value','label'],

        data: () => ({
            dialog: false,
            hours: null,
            minutes: null,
            time: '00:00',
            items: [] 
        }),
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
                return listOfTimes 
            },
        },
        created(){
            this.setInitialTime()
            this.items = this.getTimes()
        },
        watch: {
            value(){

                this.time = this.value
            }
        },
    }
</script>