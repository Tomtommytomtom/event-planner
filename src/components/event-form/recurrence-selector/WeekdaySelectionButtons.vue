<template>
    <div>
        <p>Repeat On</p>
        <v-btn-toggle
            v-model="selectedWeekdays"
            multiple
            mandatory
            active-class=" primary darken-1"
            rounded
            borderless
            dark    
            class="ml-1" 
        >
            <v-btn
                text
                class=" mx-2"
                v-for="n in 7"
                :key="n"
                :value="weekdayIndex[n - 1]"
                @click="update"
            >
                {{ buttonLabels[n - 1] }}
            </v-btn>
        </v-btn-toggle>
        <p>{{selectedWeekdays}}</p>
    </div>
</template>
<script>
export default {
    props: ['value'],

    data: () => ({
        buttonLabels : [
            'M',
            'T',
            'W',
            'T',
            'F',
            'S',
            'S'
        ],
        weekdayIndex: [1,2,3,4,5,6,0],
        selectedWeekdays: []
    }),
    methods: {
        update(){
            console.log(this.selectedWeekdays)
            this.$emit('input', this.selectedWeekdays)
        },
    },
    watch: {
        value(){
            this.selectedWeekdays = this.value
        },
    },
    created(){
        console.log(this.value,this.selectedWeekdays)
        this.selectedWeekdays = this.value
    }
}
</script>

<style>

</style>