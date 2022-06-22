<template>
  <Card @click.native="goToMovie(movie._id)" style="width:320px;">
        <div style="text-align:center">
            <p slot="title">{{movie.title}}</p>
            <img :src="movie.thumbnail" style="width:280px;height: 340px;">
            <h3>{{movie.title}}</h3>
            <span>Views : {{movie.hits}}</span>
        </div>
    </Card>
</template>
<script>
export default {
     name: 'video_thumbnail',
     props:['movie'],
     methods:{
         goToMovie(idx){
             this.$router.push({name:'Stream',params:{id:idx}});
             console.log("clicked")
         }
     },
  data(){
      return {

            moviee : {
            _id:"",    
            title:"",
            hits: 0,
            genres:[],
            thumbnail:'http://via.placeholder.com/380x200',
            dash_manifest:'//storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd'
        }
      }
  }
}
</script>
<style>

</style>

