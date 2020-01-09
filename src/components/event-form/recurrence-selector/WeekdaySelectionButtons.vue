<template>
  <div>
      <v-btn
        class="mx-2"
        small
        fab
        color="primary"
        elevation="0"
        v-for="weekday in weekdays"
        :key="weekday"
        :outlined="!isActive[weekday]"
        @click="update(weekday)"
      >
        {{ weekdayLabels[weekday] }}
      </v-btn>
  </div>
</template>

<script>
export default {
    props:['currentWeekday'],

    data: () => ({
        isActive: [],
        weekdays:[1,2,3,4,5,6,0],
        weekdayLabels: ['S','M','T','W','T','F','S']
    }),

    methods: {
        update(weekday){
            if(this.isOnlyOneSelected(weekday)){
                console.log(weekday)
                this.updateActiveArray(weekday)
                console.log(this.isActive)
                this.$emit('input', this.isActive)
            }
        },
        updateActiveArray(weekday){
            let temp = this.isActive
            temp[weekday] = !this.isActive[weekday]
            this.isActive = undefined
            this.isActive = temp
        },
        isOnlyOneSelected(weekday){
            console.log(weekday, this.isActive)
            return this.isActive.reduce((acc, curr, index) => {
                if(index === weekday){
                    return acc || !curr
                } else {
                    return acc || curr
                }
            }, false)
        }
    },

    computed: {
        isActiveArray:{
            get(n){
               return this.isActive[n]
            },
            set(n){
                let temp = this.isActive
                temp[n] = !this.isActive[n]
                this.isActive = undefined
                this.isActive = temp
            }
        },
    },

    created(){
        this.isActive = new Array(this.weekdays.length)
        this.isActive.fill(false) 
        console.log(this.currentWeekday)
        this.isActive[this.currentWeekday] = true       
    },
}
</script>

<style>

</style>