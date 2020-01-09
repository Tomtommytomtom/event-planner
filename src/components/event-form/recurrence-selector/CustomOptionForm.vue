<template>
    <v-card 
        width="500"
        dark
    >
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
                        color="primary"
                    >
                    </v-autocomplete>
                </v-col>
            </v-row>

            <weekday-selection-buttons
                @input="updateSelectedWeekdays"
                :current-weekday="currentWeekday"
                v-if="isSelectionWeekly"
                class="ml-4"
            >
            </weekday-selection-buttons>

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
import IncrementTextField from './IncrementTextField'
import WeekdaySelectionButtons from './WeekdaySelectionButtons'

export default {
    props: ['value', 'currentWeekday'], 

    components: {
        IncrementTextField,
        WeekdaySelectionButtons
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
            'weekdays',
            'annually'
        ],
        selectedWeekdays: []
    }),

    methods: {
        saveOptions(){
            this.$emit('input', {
                frequenzy: +this.frequenzyCounter,
                type: this.customType,
                customString: this.customString,
                selectedWeekdays: this.selectedWeekdays
            })
            this.saveForm()
        },
        saveForm(){
            this.$emit('close-form')
        },
        resetForm(){
            this.$emit('reset-form')
        },
        customTypeToDisplay(customType){
            const type = customType.split('-')[0]
            const index = this.typeToDisplay.indexOf(type)

            return this.typeOptions[index]
        },
        updateSelectedWeekdays(selectedWeekdays){
            this.selectedWeekdays = selectedWeekdays
        },
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
            
        },
          isSelectionWeekly(){
            return this.customType === 'weekdays-custom'
        }
    },
    created(){
        console.log(this.currentWeekday,'inside custom option form')
    }
}
</script>