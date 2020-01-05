<template>
    <v-text-field
        color="primary"
        ref="field"
        prepend-inner-icon="mdi-minus"
        append-icon="mdi-plus"
        @click:prepend-inner="decrementCounter"
        @click:append="incrementCounter"
        @input="validateAndSend"
        v-model="counter"
        outlined
        dense
    >
    </v-text-field>    
</template>

<script>
export default {
    props: ['value'],

    data: () => ({
        counter: 0
    }),
    methods:{
        incrementCounter(){
            this.$refs.field.focus()
            this.counter++
        },
        decrementCounter(){
            this.$refs.field.focus()
            if(this.counter > 1){
                this.counter--
            }
        },
        validateAndSend(){
            if(this.isValidAmount){
                this.$emit('input',this.counter)
            } else {

            }
        },
    },
    computed:{
        isValidExpression(){
            const regEx = /\d+/
            return regEx.test(this.counter)
        },
        isValidAmount(){
            if(this.isValidExpression){
                return (this.counter > 1) && (this.counter < 9999)
            } else {
                return false
            }
        }
    },
    created(){
        this.counter = this.value
    },
    watch: {
        counter(){
            this.validateAndSend()
        }
    }
}
</script>