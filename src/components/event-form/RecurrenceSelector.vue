<template>
  <div>
    <v-select
      v-model="recurringTypeDisplay"
      :disabled="disabled"
      :color="color"
      :items="recurringOptionsDisplay"
      dense
      outlined
      label="Recurrence"
      prepend-icon="mdi-calendar-repeat"
    />
    <v-dialog v-model="customOptionsDialog" width="fit-content">
      <custom-option-form
        v-model="customOptionSelected"
        :current-weekday="currWeekdayIndex"
        @save-form="customOptionsDialog = false"
        @reset-form="resetCustom"
      />
    </v-dialog>
  </div>
</template>

<script>
import DateArithmetic from '@/services/DateArithmetic'

import CustomOptionForm from './recurrence-selector/CustomOptionForm'

export default {
  components: {
    CustomOptionForm
  },
  props: {
    value: Object,
    currStartDate: String,
    disabled: Boolean,
    color: String
  },

  data: function() {
    return {
      customString: '',
      customOptionsDialog: false,
      recurringType: this.value.type,
      frequenzy: this.value.frequenzy,
      startDate: this.currStartDate.split(' ')[0],
      weekdays: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ],
      selectedWeekdays: []
    }
  },
  computed: {
    recurringOptionsDisplay() {
      let result = [
        "Doesn't repeat",
        'Daily',
        `Weekly on ${this.currWeekday}`,
        `Monthly on ${this.currNthWeekday} ${this.currWeekday}`,
        `Annually on ${this.dateInWords}`,
        `Every Weekday (starting on ${this.dateInWords})`,
        '...Custom'
      ]
      if (this.currNthWeekday === 'fifth') {
        result = result
          .slice(0, 3)
          .concat([`Monthly on last ${this.currWeekday}`])
          .concat(result.slice(4))
      } else if (this.isCurrWeekdayLast && this.currNthWeekday === 'fourth') {
        result = result
          .slice(0, 4)
          .concat([`Monthly on last ${this.currWeekday}`], [])
          .concat(result.slice(4))
      }
      if (this.customString) {
        result = result.concat([this.recurringTypeDisplay])
      }
      return result
    },
    recurringTypeDisplay: {
      get() {
        const [selected, custom] = this.recurringType.split('-')
        if (custom) {
          return this.customString
        }
        switch (selected) {
          case 'none':
            return "Doesn't repeat"
          case 'daily':
            return 'Daily'
          case 'weekly':
            return `Weekly on ${this.currWeekday}`
          case 'monthlylast':
            return `Monthly on last ${this.currWeekday}`
          case 'monthly':
            return `Monthly on ${this.currNthWeekday} ${this.currWeekday}`
          case 'annually':
            return `Annually on ${this.dateInWords}`
          case 'weekdays':
            return `Every Weekday (starting on ${this.dateInWords})`
          default:
            return "Doesn't repeat"
        }
      },
      set(newType) {
        const selected = newType.split(' ')[0]
        let frequenzy = this.frequenzy
        let result = this.recurringType
        this.selectedWeekdays = []

        switch (selected) {
          case "Doesn't":
            result = 'none'
            break
          case 'Daily':
            frequenzy = 1
            result = 'daily'
            break
          case 'Weekly':
            frequenzy = 1
            result = 'weekly'
            break
          case 'Monthly':
            if (newType.includes('last')) {
              result = 'monthlylast'
              frequenzy = 1
              break
            } else {
              frequenzy = 1
              result = 'monthly'
              break
            }
          case 'Annually':
            frequenzy = 1
            result = 'annually'
            break
          case 'Every':
            result = 'weekdays'
            frequenzy = 1
            this.selectedWeekdays = [false, true, true, true, true, true, false]
            break
          case '...Custom':
            this.customOptionsDialog = true
            result = 'custom'
            break
        }
        this.frequenzy = frequenzy
        this.recurringType = result
      }
    },
    customOptionSelected: {
      get() {
        return {
          type: this.recurringType,
          frequenzy: this.frequenzy,
          customString: this.customString,
          selectedWeekdays: this.selectedWeekdays
        }
      },
      set(newOption) {
        this.recurringType = newOption.type
        this.frequenzy = newOption.frequenzy
        this.customString = newOption.customString
        this.selectedWeekdays = newOption.selectedWeekdays
      }
    },
    isCurrWeekdayLast() {
      const result = DateArithmetic.isLastWeekdayOfMonth(this.startDate)
      return result
    },
    currWeekdayIndex() {
      return DateArithmetic.getWeekday(this.startDate)
    },
    currWeekday() {
      return this.weekdays[DateArithmetic.getWeekday(this.startDate)]
    },
    currNthWeekday() {
      const nth = DateArithmetic.getNthWeekday(this.startDate)[0]

      const nthString = ['', 'first', 'second', 'third', 'fourth', 'fifth']
      return nthString[nth]
    },
    dateInWords() {
      return DateArithmetic.getMonthAndDayInWords(this.startDate)
    }
  },
  watch: {
    value() {
      this.setValue()
    },
    currStartDate() {
      this.setStartDate()
    },
    customOptionSelected() {
      this.sendType()
    },
    recurringType() {
      this.sendType()
    }
  },
  methods: {
    sendType() {
      
      this.$emit('input', this.customOptionSelected)
    },
    setValue() {
      this.frequenzy = this.value.frequenzy
      this.recurringType = this.value.type
    },
    setStartDate() {
      this.startDate = this.currStartDate.split(' ')[0]
    },
    resetCustom() {
      this.customOptionsDialog = false
      this.recurringType = 'none'
      this.customString = ''
    }
  }
}
</script>
