<template>
<canvas ref='canvas' > </canvas>
</template>
<script>
import VueCharts from 'vue-chartjs'
import { Doughnut } from 'vue-chartjs'
  import stat from '@/services/Stat'
    export default {
        name: 'Stat',
        extends: Doughnut,
        data() {
            return {
              data : []

            }
        },
        methods: {

        },
        async mounted() {
           
             try {
                var resp = (await stat.get());
                this.data = resp.data ;
               // console.log(this.data[0].music);
             } catch (error) {
               
             }
             this.renderChart({
      labels: ['Music', 'Food', 'Event', 'Bot'],
      datasets: [
        {
          backgroundColor: [
            '#41B883',
            '#E46651',
            '#00D8FF',
            '#DD1B16'
          ],
          data: [this.data[0].music, this.data[0].food, this.data[0].event, this.data[0].bot]
        }
      ]
    }, {responsive: true, maintainAspectRatio: false})
        }
    }
</script>
<style scoped>

</style>