<template>
    <div>
        <v-btn
            @click="menu = true"
            color="primary"
            outlined
            :class="{ onWideScreens : !$vuetify.breakpoint.xsOnly}"
        >
        <slot></slot>
        </v-btn>
        <v-menu
            :close-on-content-click="false"
            v-model="menu"
            right
        >
            <v-date-picker
                v-model="date"
                @input="sendDate"
                @click:month="sendMonth"
            >
            </v-date-picker>
        </v-menu>
    </div>    
</template>

<script>
export default {
    props: ['value','calendarType'],

    data: () => ({
        menu: false,
        date: new Date().toISOString().substr(0,10),
        type:'month'
    }),

    methods:{
        sendMonth(month){
            console.log('heya')
            if(this.isTypeMonth){
                this.date = month
                this.$emit('input', this.dateToSend)
                this.menu = false
            }
        },
        sendDate(){
            this.$emit('input', this.dateToSend)
            this.menu = false
        },
        setValue(){
            console.log(this.value)
            this.date = this.value
        },
        setType(){
            this.type = this.calendarType
        }
    },

    created(){
        this.setValue()
    },

    computed:{
        dateToSend(){
            if(this.type === 'month'){
                return this.date + '-01'
            } else {
                return this.date
            }
        },
        isTypeMonth(){
            return this.type === 'month'
        }
    },

    watch: {
        value(){
            this.setValue()
        },
        calendarType(){
            this.setType()
        }
    }
}
</script>

<style>
.onWideScreens{
    width: 200px;
}
</style>