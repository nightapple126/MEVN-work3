<template>
    <Card style="width:350px">
        <p slot="title">
            <Icon size="19" type="fork"></Icon> <Icon size="19" type="knife"></Icon>
            {{ plate.label }}
        </p>
        <a href="#" slot="extra" v-on:click="order">
            <Icon type="clipboard"></Icon>
            Order
        </a>
        <p>
            <img class="plate-photo" height="150" width="250" :src="getPlatePhoto()" :alt="plate.label" >
        </p>
        <div class="detail">
                <span>Origin: <span class="info">{{ plate.origin }}</span></span>
                <span>Price: <span class="info">{{ plate.price }} DT</span></span>
        </div>
        <div>
            <Tag type="dot" color="blue" v-for="ing in ingredientsToArray()" :key="ing">{{ ing }}</Tag>
        </div>
        <p>
            <span class="taste">{{ plate.taste }}</span> 
        </p>
        <div class="detail">
             <Rate allow-half v-model="rate_value" @on-change="rate(rate_value)"></Rate>
            <Button type="dashed" icon="thumbsup" v-if="!liked" @click="like()" >Like</Button>
            <Button type="primary" v-if="liked" icon="thumbsup" @click="unlike()" >Dislike</Button>
        </div>
    </Card>
</template>
<script>
import Food from "@/services/Food";
export default {
  name: "Plate",
  props: ["plate"],
  data() {
    return {
      liked: false,
      rate_value: 0
    };
  },
  methods: {
    getPlatePhoto() {
      return (
        "http://52.50.26.211:3000/uploads/restaurant/plates/" +
        this.plate.plate_photo
      );
    },
    ingredientsToArray() {
      return this.plate.basic_ingredient;
    },
    async like() {
      try {
        await Food.likePlate({
          user: this.$store.state.user,
          plate: this.plate
        });
        this.liked = true;
      } catch (e) {
        console.log(e);
      }
    },
    async unlike() {
      try {
        await Food.unlikePlate({
          user: this.$store.state.user,
          plate: this.plate
        });
        this.liked = false;
      } catch (e) {
        console.log(e);
      }
    },
    rate(value) {
      Food.ratePlate({
        plate: this.plate,
        user: this.$store.state.user,
        rate: value
      })
        .then(data => {
          this.rate_value = value;
        })
        .catch(err => {
          console.log(err);
        });
    },
    order() {
      console.log("Ordering");
      this.$emit("ordered", this.plate);
    }
  },
  mounted() {},
  created() {
    let data = Food.doILikeThisPlate({
      user: this.$store.state.user,
      plate: this.plate
    })
      .then(data => {
        console.log(this.plate._id);
        this.liked = true;
      })
      .catch(err => {
        console.log(this.plate._id);
        this.liked = false;
        console.log(this.liked);
      });

    Food.getRateUser({ user: this.$store.state.user, plate: this.plate })
      .then(data => {
        this.rate_value = data.data.rate;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>
<style scoped>
.detail {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
span .info {
  font-weight: bold;
}
.taste {
  font-weight: bold;
  text-align: start;
  font-size: 22px;
}
</style>
