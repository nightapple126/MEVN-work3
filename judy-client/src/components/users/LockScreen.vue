<template>
    <div id="LockScreen">
        <div>
                    <vue-webcam ref='webcam'></vue-webcam>
        </div>
        <Button v-bind:disabled="disabled" type="primary" @click="take_photo">Unlock account</Button>
        
    </div>
    
</template>
<script>
import VueWebcam from "vue-webcam";
import User from "@/services/User";
export default {
  components: {
    VueWebcam
  },
  name: "LockScreen",
  data() {
    return {
      photo: null,
      disabled: false
    };
  },
  methods: {
    take_photo() {
      this.photo = this.$refs.webcam.getPhoto();
      this.disabled = true;
      User.recognize(this.photo)
        .then(res => {
          if (res.status==200){
              this.$store.commit("toggleLock",false);
          }
          this.disabled = false;
        })
        .catch(err => {
          console.log(err);
          this.disabled = false;
        });
    }
  }
};
</script>
