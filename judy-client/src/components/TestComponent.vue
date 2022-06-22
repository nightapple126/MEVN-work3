<template>

    <div id="test">
        <Button @click.native="order" type="primary" shape="circle" icon="ios-search"></Button>

        <OrderModal v-if="active" v-on:orderCompleted="orderCompleted" :toggled="active" :movie="ordered_movie" :food="ordered_plate">

        </OrderModal><br>

        <qrcode-reader v-if="reading" @decode="onDecode"></qrcode-reader>



    </div>

</template>

<script>
import OrderModal from "./restaurant/OrderModal.vue";
import { QrcodeReader } from "vue-qrcode-reader";

import Order from "@/services/Order";

export default {
  components: {
    OrderModal,
    QrcodeReader
  },
  name: "",
  data() {
    return {
      ordering: false,
      food: undefined,
      movie: undefined,
      reading: true
    };
  },
  computed: {
    startReading() {
      this.reading = true;
    },
    active() {
      return this.ordering;
    },
    ordered_movie() {
      return this.movie;
    },
    ordered_plate() {
      return this.food;
    }
  },
  methods: {
    order() {
      console.log("Ordering");
      this.ordering = true;

      this.movie = {
        _id: "5ad5d4a22af7cc318817fa03",
        price: 50,
        title: "John Wick",
        thumbnail: "john-wick.jpg"
      };
      //   this.food={
      //       _id:"5ac6a4593d1e654250756b21",
      //       label: "Couscous",
      //       price: 500,
      //       plate_photo: "1ee2e8a0-3826-11e8-8919-6397f8847c10.jpeg"
      //   }
    },
    orderCompleted(state) {
      this.ordering = false;
      if (state == "canceled") {
        this.$Message.error("Order canceled");
      } else if (state == "ok") {
        this.$Message.success("Order completed !");
      } else if ((state = "error")) {
        this.$Message.error(
          "There was an error processing your order, please try again later."
        );
      }
    },
    onDecode(content) {
      console.log(content);
      this.reading= false;
    }
  },
  mounted() {}
};
</script>
<style scoped>

</style>