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
                :value="n - 1"
                @click="update"
            >
                {{ buttonLabels[n - 1] }}
            </v-btn>
        </v-btn-toggle>
    </div>
</template>
<script>
export default {
    props: ['value','currentWeekday'],

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
        selectedWeekdays: []
    }),
    methods: {
        update(){
            console.log('click',this.selectedWeekdays)
            this.$emit('input', this.selectedWeekdays)
        },
    },
    watch: {
        currentWeekday(){
            this.selectedWeekdays = this.currentWeekday
        },
    }
}
</script>

<style>

</style>