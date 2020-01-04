<template>
    <div>
        <v-snackbar
            v-for="snackbar in snackbars"
            :key="snackbar.id"
            v-model="snackbar.active"
            :bottom="snackbar.bottom"
            :top="!snackbar.bottom"
            :timeout="snackbar.timeout"
            :color="snackbar.color"
        >
            {{snackbar.message}}
            <v-btn
                color="white"
                text
                @click="snackbar.active = false"
            >
                Close
            </v-btn>
        </v-snackbar> 
    </div>
</template>

<script>
import { bus } from '@/main'

export default {
    props: ['value'],

    data: () => ({
        message: 'default',

        snackbars:{

            success: {
                timeout: 2000,
                color: 'success',
                message: 'default',
                active: false,
                id:0,
                bottom: true
            },

            info: {
                timeout: 2000,
                color: 'info',
                message: 'default',
                active: false,
                id:1,
                bottom: false
            },

            error: {
                timeout: 2000,
                color: 'error',
                message: 'default',
                active: false,
                id:2,
                bottom: true
            }
        }
        
    }),

    methods:{
        setSnackbar(type, args){
            const snackbar = this.snackbars[type]

            snackbar.message = args.message
            snackbar.timeout = args.timeout
            snackbar.active = true
        }
    },

    computed:{
    },

    created(){
        bus.$on('success', args => {
            this.setSnackbar('success', args)
        })
        bus.$on('info', args => {
            this.setSnackbar('info', args)
        })
        bus.$on('error', args => {
            this.setSnackbar('error', args)
        })
    }
}
</script>