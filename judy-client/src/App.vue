<template>
 <div id="app">
    <DevapesBase>
          <router-view v-if="locked=='false'||locked==false"/>
          <LockScreen v-if="locked=='true'||locked==true">

          </LockScreen>
    </DevapesBase>
 </div>
</template>

<script>
import DevapesBase from "./components/Base";
import LockScreen from "./components/users/LockScreen.vue";

export default {
  name: "App",
  components: {
    DevapesBase,
    LockScreen
  },
  computed: {
    locked() {
      console.log(this.$store.getters.locked);
      return this.$store.getters.locked;
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100% !important;
}

body,
html {
  /* height: 100%!important; */
  overflow: auto !important;
  max-height: 100% !important;
  height: 100% !important;
}
</style>
