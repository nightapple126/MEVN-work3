<template>
    <div class="restaurant-container">
        <Feedback service="FOOD"></Feedback>
        <div class="plates-section">
            <Plate v-for="plate in plates" class="plate" :key="plate._id" :plate="plate"></Plate>
        </div>
    </div>
</template>
<script>
import Feedback from '@/components/feedback/FeedBackForm'
import Plate from './PlateCard.guest'
import Food from '@/services/Food'
export default {
  components: {
      Plate,
      Feedback
  },
  name: 'AllPlate',
  data() {
      return {
        plates: []
    }
  },
  methods: {

  },
  async mounted() {
      try {
          this.plates = (await Food.getForGuest()).data.plates
          console.log(this.plates)
      }catch(e) {
          console.log(e);
      }
  }
}
</script>
<style scoped>
    .plates-section {
        margin-top: 2em;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
    .restaurant-container {
         display: flex;
        flex-direction: column;
        align-items: center;
        margin: 2em 1em 2em 1em;
    }
    .plate {
        margin-right: 1em
    }
</style>

