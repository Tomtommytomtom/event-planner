<template>
  <div>
    <v-btn
      fab
      small
      class="white--text"
      depressed
      :color="color"
      @click="dialog = true"
    >
      <v-icon>
        mdi-brush
      </v-icon>
    </v-btn>
    <v-btn text color="primary" @click="dialog = true">
      pick a color
    </v-btn>
    <v-dialog v-model="dialog" width="fit-content">
      <v-card class="pa-2" dark>
        <v-color-picker
          v-model="color"
          show-swatches
          hide-canvas
          hide-inputs
          hex
          flat
          @input="updateColor"
        />
        <v-btn text color="primary" class="mx-2 mt-2" @click="dialog = false"
          >save
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    value: String
  },

  data: function() {
    return {
      dialog: false,
      color: this.value
    }
  },
  watch: {
    value() {
      this.color = this.value
    }
  },
  methods: {
    updateColor() {
      this.$emit('input', this.color)
    }
  }
}
</script>
