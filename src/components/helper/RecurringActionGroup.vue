<template>
  <v-card dark>
    <v-card-title>
      <slot></slot>
    </v-card-title>
    <v-container class="d-flex px-5">
      <v-radio-group v-model="selectedOption">
        <v-radio
          class="text-no-wrap"
          color="primary"
          v-for="radioOption in radioOptions"
          :key="radioOptions.indexOf(radioOption)"
          :label="radioOption"
          :value="radioOption"
          @click="send()"
        ></v-radio>
      </v-radio-group>
    </v-container>
    <v-card flat class="d-flex ma-0 pa-3">
      <v-spacer></v-spacer>
      <v-btn @click="close()" text color="primary">
        Cancel
      </v-btn>
      <v-btn @click="submit()" text color="primary">
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
