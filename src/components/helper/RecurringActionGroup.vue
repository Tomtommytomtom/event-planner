<template>
  <v-card dark>
    <v-card-title>
      <slot />
    </v-card-title>
    <v-container class="d-flex px-5">
      <v-radio-group v-model="selectedOption">
        <v-radio
          v-for="radioOption in radioOptions"
          :key="radioOptions.indexOf(radioOption)"
          class="text-no-wrap"
          color="primary"
          :label="radioOption"
          :value="radioOption"
          @click="send()"
        />
      </v-radio-group>
    </v-container>
    <v-card flat class="d-flex ma-0 pa-3">
      <v-spacer />
      <v-btn text color="primary" @click="close()">
        Cancel
      </v-btn>
      <v-btn text color="primary" @click="submit()">
        {{ submitButtonLabel }}
      </v-btn>
    </v-card>
  </v-card>
</template>

<script>
export default {
  props: {
    value: String,
    radioOptions: Array,
    submitButtonLabel: String
  },

  data: function() {
    return {
      selectedOption: this.value
    }
  },
  watch: {
    selectedOption() {
      this.$emit('input', this.selectedOption)
    }
  },
  methods: {
    close() {
      console.log(this.selectedOption, this.radioOptions)
      this.$emit('close')
    },
    submit() {
      this.$emit('submit')
    }
  }
}
</script>

<style></style>
