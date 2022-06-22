<template>

    <div id="test">
        

        <qrcode-reader v-if="reading" @decode="onDecode"></qrcode-reader>



    </div>

</template>

<script>

import { QrcodeReader } from "vue-qrcode-reader";

import Order from "@/services/Order";
import router from "../../router";

export default {
  components: {
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
    onDecode(content) {
      console.log(content);
      this.reading= false;
      Order.confirm(content).then(res=>{
         this.$Message.success("Order successfully confirmed");
         router.push('/profile')
      }).catch(err=>{
         this.$Message.error("Error confirming order");
      })
    }
  },
  mounted() {}
};
</script>
<style scoped>

</style>