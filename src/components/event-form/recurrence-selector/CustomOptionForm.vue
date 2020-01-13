<template>
  <v-card width="500" dark>
    <v-form ref="form" v-model="valid">
      <v-card-title>Recurrence Options</v-card-title>
      <v-row no-gutters class="d-flex ">
        <v-col cols="3" class="ml-2 ">
          <v-card-text>Repeat every</v-card-text>
        </v-col>
        <v-col class="mr-1 mt-2">
          <increment-text-field v-model="frequenzyCounter" />
        </v-col>
        <v-col class="mx-2 mt-2">
          <v-autocomplete
            v-model="customTypeDisplay"
            :items="typeOptions"
            outlined
            dense
            color="primary"
          />
        </v-col>
      </v-row>

      <weekday-selection-buttons
        v-if="isSelectionWeekly"
        :current-weekday="currentWeekday"
        @input="updateSelectedWeekdays"
      />

      <v-container class="d-flex justify-end">
        <v-btn text color="primary" @click="resetForm">Cancel</v-btn>
        <v-btn text color="primary" :disabled="!valid" @click="saveOptions"
          >Save</v-btn
        >
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
import IncrementTextField from './IncrementTextField'
import WeekdaySelectionButtons from './WeekdaySelectionButtons'

export default {
  components: {
    IncrementTextField,
    WeekdaySelectionButtons
  },
  props: {
    value: Object,
    currentWeekday: Number
  },

  data: function() {
    return {
      valid: true,
      customType: 'daily-custom',
      frequenzyCounter: 1,
      typeOptions: ['Days', 'Weeks', 'Years'],
      typeToDisplay: ['daily', 'weekdays', 'annually'],
      selectedWeekdays: []
    }
  },
  computed: {
    customString() {
      return `Every ${this.frequenzyCounter} ${this.customTypeDisplay}`
    },
    customTypeDisplay: {
      get() {
        return this.customTypeToDisplay(this.customType)
      },
      set(newValue) {
        const index = this.typeOptions.indexOf(newValue)
        this.customType = this.typeToDisplay[index] + '-custom'
      }
    },
    isSelectionWeekly() {
      return this.customType === 'weekdays-custom'
    }
  },

  methods: {
    saveOptions() {
      this.$emit('input', {
        frequenzy: +this.frequenzyCounter,
        type: this.customType,
        customString: this.customString,
        selectedWeekdays: this.selectedWeekdays
      })
      this.saveForm()
    },
    saveForm() {
      this.$emit('save-form')
    },
    resetForm() {
      this.$emit('reset-form')

      this.frequenzyCounter = 1
      this.resetSelectedWeekdays()
    },
    resetSelectedWeekdays() {
      this.selectedWeekdays.fill(false)
      this.$set(this.selectedWeekdays, this.currentWeekday, true)
    },
    customTypeToDisplay(customType) {
      const type = customType.split('-')[0]
      const index = this.typeToDisplay.indexOf(type)

      return this.typeOptions[index]
    },
    updateSelectedWeekdays(selectedWeekdays) {
      this.selectedWeekdays = selectedWeekdays
    }
  }
}
</script>
