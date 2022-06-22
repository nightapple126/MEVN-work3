<template>
  <div class="hello">
      <Row>
          <Col span="12"> 
             <img id="judy" src="../assets/img/judy.png" alt=""> 
          </Col>
          <Col span="10" style="height:500px;display:flex"> 
             <p style="margin:auto;font-size:2.5em;font-style:italic">
               Welcome Mr  <span v-if="user!==undefined">{{user.username}}</span>, <br>

               We hope you have a wonderful stay at our hotel <br>

               If you're lost, or looking for something, <a href="/bot">Judy</a> is here to help!
             </p>

          </Col>
      </Row>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      val: ''
    }
  },
  methods: {
    doClick() {
      console.log('hello');
    }
  },
  computed:{
    user(){
      return this.$store.state.user;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
