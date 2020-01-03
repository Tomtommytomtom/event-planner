<template>
    <v-card width="500">
        <v-form
            ref="form"
            v-model="valid"
        >
            <v-card-title>Recurrence Options</v-card-title>
            <v-row no-gutters class="d-flex ">
                <v-col cols="3" class="ml-2 ">
                    <v-card-text>Repeat every</v-card-text>
                </v-col>
                <v-col class="mr-1 mt-2">
                    <increment-text-field
                        v-model="frequenzyCounter"
                    >
                    </increment-text-field>
                </v-col>
                <v-col class="mx-2 mt-2">
                    <v-autocomplete
                        v-model="customTypeDisplay"
                        :items="typeOptions"
                        outlined
                        dense
                    >
                    </v-autocomplete>
                </v-col>
            </v-row>
            <v-container class="d-flex justify-end">
                <v-btn
                    text
                    color="primary"
                    @click="resetForm"
                >Cancel</v-btn>
                <v-btn
                    text
                    color="primary"
                    :disabled="!valid"
                    @click="saveOptions"
                >Save</v-btn>
            </v-container>
        </v-form>
    </v-card>
</template>

<script>
import IncrementTextField from './helper/IncrementTextField'

export default {
    props: ['value'], //value = { frequenzy, type + '-custom'}

    components: {
        IncrementTextField
    },

    data: () => ({
        valid: true,
        customType: 'daily-custom',
        frequenzyCounter: 1,
        typeOptions: [
            'Days',
            'Weeks',
            'Years'
        ],
        typeToDisplay: [
            'daily',
            'weekly',
            'annually'
        ]
    }),

    methods: {
        saveOptions(){
            this.$emit('input', {
                frequenzy: this.frequenzyCounter,
                type: this.customType,
                customString: this.customString
            })
            this.saveForm()
        },
        saveForm(){
            this.$emit('close-form')
        },
        resetForm(){
            this.$emit('reset-form')
        },
        setValue(){
            //this.frequenzyCounter = this.value.frequenzy  fix this being undefined
            //this.customType = this.value.type
        },
        customTypeToDisplay(customType){
            const type = customType.split('-')[0]
            const index = this.typeToDisplay.indexOf(type)

            return this.typeOptions[index]
        }
    },
    computed: {
        customString(){
            return `Every ${this.frequenzyCounter} ${this.customTypeDisplay}`
        },
        customTypeDisplay:{
            get(){
               return this.customTypeToDisplay(this.customType) 
            },
            set(newValue){

                const index = this.typeOptions.indexOf(newValue)
                this.customType = this.typeToDisplay[index] + '-custom'

            }
            
        }
    },
    created(){
        this.setValue()
    }
}
</script>