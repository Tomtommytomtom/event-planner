<template>
  <div>
    <v-row justify="center" align="center" no-gutters>
      <p class="ma-4">On</p>
      <v-btn
        v-for="weekday in weekdays"
        :key="weekday"
        class="mx-2 body-2"
        style="border-width: 1px"
        :class="{
          primary: isActive[weekday]
        }"
        small
        fab
        elevation="0"
        :outlined="!isActive[weekday]"
        @click="sendSelected(weekday)"
      >
        {{ weekdayLabels[weekday] }}
      </v-btn>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    currentWeekday: Number
  },

  data: function() {
    return {
      isActive: [false, false, false, false, false, false, false],
      weekdays: [1, 2, 3, 4, 5, 6, 0],
      weekdayLabels: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    }
  },

  created() {
    this.updateActiveArray(this.currentWeekday)
    this.$emit('input', this.isActive)
  },

  methods: {
    sendSelected(weekday) {
      if (this.isOnlyOneSelected(weekday)) {
        this.updateActiveArray(weekday)
        this.$emit('input', this.isActive)
      }
    },
    updateActiveArray(weekday) {
      this.$set(this.isActive, weekday, !this.isActive[weekday])
    },
    isOnlyOneSelected(weekday) {
      console.log(weekday, this.isActive)
      return this.isActive.reduce((acc, curr, index) => {
        if (index === weekday) {
          return acc || !curr
        } else {
          return acc || curr
        }
      }, false)
    }
  }
}
</script>

<style scoped></style>
