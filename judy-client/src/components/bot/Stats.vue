

<template>
    <canvas ref="canvas"></canvas>
</template>
<script>
import VueCharts from "vue-chartjs";
import Bot from "@/services/Bot";
import { Bubble } from "vue-chartjs";
export default {
  extends: Bubble,
  name: "",
  data() {
    return {};
  },
  methods: {
    getRandomColor() {
      var colors= [
          "#1976D2","#BBDEFB","#03A9F4","#0097A7","#FF5252","#3F51B5","#C5CAE9"
      ]
      return colors[Math.floor(Math.random()*colors.length)];
    }
  },
  mounted() {
    var datasets = [];
    Bot.stats()
      .then(res => {
        console.log(res.data);
        res.data.forEach(element => {
          var bubble = {
            label: element.word,
            backgroundColor: this.getRandomColor(),
            data: [
              {
                x: Math.abs(Math.floor(Math.random() * 80)),
                y: Math.abs(Math.floor(Math.random() * 80)),
                r: element.count
              }
            ]
          };
          datasets.push(bubble);
        });
        this.renderChart(
          {
            datasets: datasets
          },
          { responsive: true, maintainAspectRatio: false }
        );
      })
      .catch(err => {});
  }
};
</script>
<style scoped>

</style>