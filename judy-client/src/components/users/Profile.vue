<template>
    <div id="profile">
       <Modal
        v-model="reciept"
        title="Reciept">
          <table style="width:100%">
              <tr>
                <td style="width:60%;text-align:center">Item</td>
                <td style="width:40%;text-align:center">Price</td>
              </tr>
          </table>
          <hr style="margin-bottom:7px">
          <table  style="width:100%;margin-bottom:7px" >
             <tr v-for="order in orders" :key="order._id" style="margin-bottom:7px">
                    <td style="width:60%;text-align:center" v-if="order.movie_id!==undefined">
                      <span style="font-weight:bold">Movie : </span>
                      {{order.movie_id.title}}
                    </td>
                    <td style="width:60%;text-align:center" v-if="order.food_id!==undefined">
                      <span style="font-weight:bold">Food : </span>
                      {{order.food_id.label}}
                    </td>
                    <td style="width:40%;text-align:center"> <span style="font-weight:bold">{{order.price}}</span> Dinars</td>
                </tr>
          </table>
          <hr style="margin-bottom:7px">
          <table style="width:100%">
              <tr>
                <td style="width:60%;text-align:center">Total</td>
                <td style="width:40%;text-align:center">{{total}} Dinars</td>
              </tr>
          </table>
         
      </Modal>
       <Modal
        v-model="modal1"
        title="Update profile picture"
        @on-ok="ok"
        @on-cancel="cancel"
        ok-text="Apply"
        cancel-text="Cancel"
        >
       <p style="margin:auto;width:fit-content">
          <Upload :on-success="uploadSuccess" :on-error="uploadError" :headers="headers" action="http://52.50.26.211:3000/guest/users/enroll" name="photo" style="float:left">
          <Button type="ghost" icon="ios-cloud-upload-outline">Upload a picture</Button> 
          
        </Upload>
        <span style="margin-left:0.5em;margin-right:0.5em;font-weight:bold">or </span> 
        <Button type="ghost" icon="camera" @click.native="openWebcam"> Take one! </Button>
       
        
       </p>
      <div v-if="webcam" style="margin:auto;width:fit-content">
         <div v-if="!previewing">
                    <vue-webcam ref='webcam'></vue-webcam>
        </div>
        <Button v-if="!previewing" style="margin:auto;display:block" icon="happy" v-bind:disabled="disabled" type="primary" @click="take_photo">Cheese ! </Button>
        <img v-bind:src="photo" alt="" v-if="previewing">
        <Button v-if="previewing" style="margin:auto;display:block" icon="happy" v-bind:disabled="disabled" type="primary" @click="take_another_photo">Take another picture ? </Button>

      </div>
       </Modal>
       <div class="banner">
        <div class="cover-picture">
        </div>
            <div class="profile-picture">
                <div class="image-container">
                  <img :src="userPicture" alt="">
                  <div class="overlay">
                    <div class="text">
                        <Button @click.native="open"><Icon type="camera"></Icon> Change</Button>
                    </div>
                  </div>
                </div>
                
            </div>
            
       </div>
       <Row>    
            <Col span="7" style="padding-left:1em">
                <Card style="width:100%;height:1000px">
                    <p slot="title" >
                       Recent activity     
                    </p>
                    <a href="#" slot="extra" v-on:click="viewReciept">
                        <Icon type="clipboard"></Icon>
                        Reciept
                    </a>
                    <p class="timeline" >
                       <Timeline>
                            <TimelineItem v-for="order in orders" :key="order._id">
                                <Icon v-if="order.movie_id!==undefined" class="timeline-icon" type="film-marker" slot="dot"></Icon>
                                <Icon v-if="order.food_id!==undefined" class="timeline-icon" type="fork" slot="dot"></Icon>
                                <Icon v-if="order.food_id!==undefined" class="timeline-icon" type="knife" slot="dot"></Icon>
                                <p class="time">3 hours ago</p>
                                <p v-if="order.food_id!==undefined" class="content">Ordered {{order.food_id.label}}</p>
                                <p v-if="order.movie_id!==undefined" class="content">Watched {{order.movie_id.title}}</p>
                            </TimelineItem>
                            
                      </Timeline>
                    </p>
                </Card>
            </Col>
           <Col span="14"  offset="1" style="padding-right:1em">
               
                        <Calendar
                                :first-day="1"
                                :all-events="events"
                        ></Calendar>
                    
            </Col>
            
       </Row>
    </div>
   
</template>
<script>
import VueWebcam from "vue-webcam";
import { Calendar } from "../../vue-bootstrap-calendar";
import User from "@/services/User";
import Order from "@/services/Order";
export default {
  name: "",
  components: {
    Calendar
  },
  data() {
    return {
      modal1: false,
      webcam: false,
      photo: null,
      disabled: false,
      previewing: false,
      headers: { Authorization: "Bearer " + this.$store.state.token },
      orders: [],
      reciept: false
    };
  },
  computed: {
    events() {
      return this.$store.state.events;
    },
    user() {
      return this.$store.state.user;
    },
    userPicture() {
      if (this.user.picture !== undefined && this.user.picture != null) {
        return "http://52.50.26.211:3000/uploads/user/" + this.user.picture;
      } else {
        return "http://52.50.26.211:3000/uploads/user/user.png";
      }
    },
    total(){
        return this.orders.reduce((total,element)=>{
            return total+element.price;
        },0)
    }
  },
  methods: {
    viewReciept() {
      console.log("Reciept");
      this.reciept = true;
    },
    ok() {
      console.log(this.webcam);
      if (this.photo != null && this.webcam) {
        User.enroll(this.photo)
          .then(image => {
            console.log(image);
            this.$store.commit("updatePicture", image.data);
            this.modal1 = false;
            this.photo = null;
          })
          .catch(err => {});
      }
    },
    cancel() {
      this.webcam = false;
    },
    open() {
      this.modal1 = true;
    },
    openWebcam() {
      this.webcam = true;
    },
    take_photo() {
      this.photo = this.$refs.webcam.getPhoto();
      this.previewing = true;
    },
    take_another_photo() {
      this.photo = null;
      this.previewing = false;
    },
    handleUpload(file) {
      this.photo = file;
      console.log(file);
      return false;
    },
    uploadSuccess(response, file, fileList) {
      this.$store.commit("updatePicture", response);
      this.modal1 = false;
      this.photo = null;
    },
    uploadError(error, file, fileList) {
      console.log(file);
    }
  },
  mounted() {
    Order.myOrders()
      .then(res => {
        this.orders = res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>
<style scoped>
.time {
  font-size: 14px;
  font-weight: bold;
}
.content {
  padding-left: 5px;
}
.time,
.content {
  text-align: left;
  padding-left: 1em;
}

.timeline {
  width: 80%;
  margin: auto;
}

.timeline-icon {
  font-size: 30px;
}

.cover-picture {
  width: 100%;
  height: 200px;
  background-image: url(http://52.50.26.211:3000/uploads/user/cover.jpg);
  background-position: center;
  background-repeat: no-repeat;
}

.banner {
  position: relative;
  margin-bottom: 1em;
  height: 250px;
}

.profile-picture {
  position: absolute;
  left: 5%;
  bottom: 5%;
  width: 14%;
  height: 150px;
  z-index: 3;
}

.profile-picture img {
  width: 100%;
  height: 100%;
  border: 3px solid white;
}
.form-group {
  display: none !important;
}
.image-container {
  position: relative;
  height: 100%;
}

.image {
  display: block;
  width: 100%;
  height: auto;
}

.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: 0.5s ease;
  background-color: #bbc8ccd1;
}

.image-container:hover .overlay {
  opacity: 1;
}

.text {
  color: white;
  font-size: 20px;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
}
</style>