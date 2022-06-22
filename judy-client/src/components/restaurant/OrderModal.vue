<template>

    <div id="OrderModal">
        <Modal :value="open" width="360" @on-ok="completeOrder(true)" @on-cancel="completeOrder(false)">
            <p slot="header" style="text-align:center">
                <Icon type="information-circled"></Icon>
                <span>Order confirmation</span>
            </p>
            <div style="text-align:center">
                <p>Are you sure you want to complete this order ? </p>
                <p v-if="movie!==undefined">
                    <img style="width:300px;height:auto;margin-top:5px" v-bind:src="'http://52.50.26.211:3000/uploads/movies/'+movie.thumbnail" alt="">
                    <i style="margin-top:5px">{{movie.title}} - {{movie.price}} dollars</i>
                </p>
                 <p v-if="food!==undefined">
                    <img style="width:300px;height:auto;margin-top:5px" v-bind:src="'http://52.50.26.211:3000/uploads/restaurant/plates/'+food.plate_photo" alt="">
                    <i style="margin-top:5px">{{food.label}} - {{food.price}} dollars</i>
                </p>
            </div>
            
        </Modal>
    </div>
    
</template>
<script>

import Order from '@/services/Order';

export default {
  props: ["food", "movie","toggled"],
  name: "OrderModal",
  data() {
    return {
      modal_loading: false
    };
  },
  methods: {
    completeOrder(state) {
        if (state==false){
            this.$emit("orderCompleted","canceled");
            return;
        }

        var order = {};
        if (this.movie!==undefined){
            order.movie_id= this.movie._id;
        }
        else if (this.food!==undefined){
            order.food_id= this.food._id;
        }
        console.log(order);
        Order.order(order).then(res=>{
            console.log(res.data);
            this.$emit("orderCompleted","ok");
        }).catch(err=>{
            console.log(err);
            this.$emit("orderCompleted","error");
        })


        
    }
  },
  computed: {
      open(){
          return this.toggled;
      }
  },
  mounted() {}
};
</script>
<style scoped>

</style>