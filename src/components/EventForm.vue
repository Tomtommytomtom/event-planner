<template>
  <v-row justify="end">
      <v-btn right bottom fixed app fab x-large color="primary" dark @click="dialog = true">
            <v-icon x-large>
                mdi-plus
            </v-icon>
        </v-btn>
    <v-dialog v-model="dialog" persistent width="80%" :fullscreen="$vuetify.breakpoint.xsOnly">
      <v-card class="pa-2">
        <v-form ref="form" v-model="valid">
            <v-card-title class="mt-5">
            <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-text-field
                v-model="nameInput"
                dense
                label="Name"
                outlined
            ></v-text-field>
            <v-textarea
                v-model="detailsInput"
                dense
                label="Description"
                outlined
                clearable
            ></v-textarea>
            <v-container>
                <v-row>
                    <v-col cols="6">
                        <DatePicker label="Event Duration"></DatePicker>
                    </v-col>
                    <v-col>
                        <v-select
                            v-model="repeatOptionSelected"
                            :items="reocurringOptions"
                            dense
                            outlined
                            label="Recurrence"
                            prepend-icon="mdi-calendar-repeat"
                        ></v-select>
                    </v-col>
                </v-row>
            </v-container>
            <v-divider class="mb-7"></v-divider>
            <v-container>
                <v-row>
                    <v-col cols="6">
                        <TimePicker :defaultTime="times[0]" label="Start Time"></TimePicker>
                    </v-col>
                    <v-col cols="6">
                        <TimePicker :defaultTime="times[1]" label="End Time"></TimePicker>
                    </v-col>
                </v-row>
            </v-container>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="clear">Close</v-btn>
            <v-btn color="primary" text :disabled="!valid" @click="saveEvent">Save</v-btn>
            </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import DatePicker from './DatePicker'
import TimePicker from './TimePicker'

export default {
    
}
</script>