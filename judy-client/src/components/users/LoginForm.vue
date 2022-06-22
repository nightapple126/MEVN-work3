<template>
    <div id="login">
        <Form style="width:20%;margin:auto"v-if="!usingWebcam" ref="formInline" :model="formInline" :rules="ruleInline">
        <FormItem prop="user">
            <Input type="text" v-model="formInline.user" placeholder="Username">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
        </FormItem>
        <FormItem prop="password">
            <Input type="password" v-model="formInline.password" placeholder="Password">
                <Icon type="ios-locked-outline" slot="prepend"></Icon>
            </Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formInline')">Signin</Button>
            <Button type="primary" @click.native="usingWebcam=true" icon="camera">Use facial recognition</Button>
        </FormItem>

    </Form>

    <div v-else>
        <div>
                <vue-webcam ref='webcam'></vue-webcam>
        </div>
        <Button v-bind:disabled="disabled" type="primary" @click="take_photo">Login</Button>
    </div>
    </div>
</template>
<script>
import VueWebcam from "vue-webcam";
import User from "@/services/User";
import router from "../../router";
export default {
  name: "LoginForm",
  components: [VueWebcam],
  data() {
    return {
      photo: null,
      disabled: false,
      usingWebcam: false,
      formInline: {
        user: "",
        password: ""
      },
      ruleInline: {
        user: [
          {
            required: true,
            message: "Please fill in the user name",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "Please fill in the password.",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "The password length cannot be less than 6 bits",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    take_photo() {
      this.photo = this.$refs.webcam.getPhoto();
      this.disabled = true;
      User.loginWithFacial(this.photo)
        .then(response => {
         
          this.disabled = false;
          this.$store.dispatch("setToken", response.data.token);
          this.$store.dispatch("setUser", response.data.user);
          this.$Message.success("You are logged in");
          router.push("bot");
        })
        .catch(err => {
          console.log(err);
          this.$Message.error("Failed to login!");
          this.disabled = false;
        });
    },
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.$Message.success("Success!");
          try {
            console.log(User);
            let response = await User.login({
              username: this.formInline.user,
              password: this.formInline.password
            });
            console.log(response.data);
            this.$store.dispatch("setToken", response.data.token);
            this.$store.dispatch("setUser", response.data.user);
            this.$Message.success("You are logged in");
            router.push("bot");
          } catch (error) {
            console.log(error);
            this.$Message.error("Failed to login!");
          }
        } else {
          this.$Message.error("Fail!");
        }
      });
    }
  }
};
</script>
