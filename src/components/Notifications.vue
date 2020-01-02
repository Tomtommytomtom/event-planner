<template>
        <v-snackbar
            v-model="snackbar"
            bottom
            :timeout="timeout"
            :color="color"
        >
            {{message}}
            <v-btn
                color="white"
                text
                @click="snackbar = false"
            >
                Close
            </v-btn>
        </v-snackbar> 
</template>

<script>
import { bus } from '@/main'

export default {
    props: ['value'],

    data: () => ({
        color: 'success',
        message: 'default',
        timeout: 2000,
        snackbar: false
    }),

    methods:{

    },
    created(){
        bus.$on('notification', args => {
            this.color = args.color
            this.message = args.message
            this.timeout = args.timeout
            this.snackbar = true
        })
    }
}
</script>