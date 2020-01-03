<template>
    <div>
        <v-btn
            :color="color"
            @click="dialog = true"
            class="white--text"
            depressed
        >
            Pick A Color
        </v-btn>
        <v-dialog
            v-model="dialog"
            width="fit-content"
        >
            <v-card
            >
                <v-color-picker
                    show-swatches
                    hide-canvas
                    hide-inputs
                    hex
                    v-model="color"
                    @input="updateColor"
                    flat
                >
                </v-color-picker>
                <v-btn
                    @click="dialog = false"
                    text
                    color="primary"
                    class="mx-3 my-1"
                >save
                </v-btn>
            </v-card>
        </v-dialog>
        
    </div>
</template>

<script>
export default {
    props: ['value'],

    data: () => ({
        dialog: false,
        color: ''
    }),
    methods:{
        updateColor(){
            this.$emit('input', this.color)
        }
    },
    watch: {
        value(){
            this.color = this.value
        }
    },
    created(){
        this.color = this.value
    }
}
</script>