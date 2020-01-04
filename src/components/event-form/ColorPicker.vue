<template>
    <div>
        <v-btn fab small class="white--text" depressed :color="color" @click="dialog = true">
            <v-icon >
                mdi-brush
            </v-icon>
        </v-btn>
        <v-btn
            text
            @click="dialog = true"
            color="primary"
        >
            pick a color
        </v-btn>
        <v-dialog
            v-model="dialog"
            width="fit-content"
        >
            <v-card
                class="pa-2"
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
                    class="mx-2 mt-2"
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