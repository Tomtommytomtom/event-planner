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
            :close-on-content-click="false"
            v-model="menu"
            right
        >
            <v-date-picker
                v-model="date"
                @input="sendDate"
                reactive
            >
            </v-date-picker>
        </v-menu>
    </v-div>    
</template>

<script>
export default {
    props: ['value'],

    data: () => ({
        menu: false,
        date: new Date().toISOString().substr(0,10),
    }),

    methods:{
        sendDate(){
            this.$emit('input', this.dateToSend)
            this.menu = false
        },
        setValue(){
            console.log(this.value)
            this.date = this.value
        },
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
    },

    watch: {
        value(){
            this.setValue()
        },
    }
}
</script>