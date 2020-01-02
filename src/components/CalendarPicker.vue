<template>
    <v-div>
        <v-btn
            @click="menu = true"
            color="primary"
            outlined
            min-width="200"
        >
        <slot></slot>
        </v-btn>
        <v-menu
            v-model="menu"
            close-on-click
            right
        >
            <v-date-picker
                v-model="date"
                :type="type"
                @input="sendDate"
            >
            </v-date-picker>
        </v-menu>
    </v-div>    
</template>

<script>
export default {
    props: ['value','calendarType', 'calendarEvents'],

    data: () => ({
        menu: false,
        type: 'month',
        date: new Date().toISOString().substr(0,10),
    }),

    methods:{
        sendDate(){
            this.$emit('input', this.dateToSend)
        },
        setType(){
            if(this.calendarType === 'month'){
                this.type = 'month'
            } else {
                this.type = 'date'
            }
        },
        setValue(){
            this.date = this.value
        },
    },

    created(){
        this.setType()
        this.setValue()
    },

    computed:{
        dateToSend(){
            if(this.type === 'month'){
                return this.date + '-01'
            } else {
                return this.date
            }
        }
    },

    watch: {
        value(){
            this.setValue()
        },
        calendarType(){
            this.setType()
        },
    }
}
</script>