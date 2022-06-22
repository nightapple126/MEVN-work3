<template>
<div class="page">
    <Breadcrumb>
        <BreadcrumbItem to="/">Home</BreadcrumbItem>
        <BreadcrumbItem to="/components/breadcrumb">Movies</BreadcrumbItem>
    </Breadcrumb>
    <Input v-model="query" @on-keyup="search(query)" placeholder="Search"></Input>
  <div class="movie-selection">
          <videoT v-for="mov in movies_filtered" style="margin-right: 1em;" :key="mov._id" v-on:click="goToMovie(mov._id)" :movie="mov"></videoT>
    </div>
</div>
  
</template>
<script>
import videoT from './videothumbnail'
import Movie from '@/services/Movie'
export default {
    
    components: {
      videoT,
  },
  name: 'movielist',
  data(){
      return{
          query:"",
        movies:[],
        movies_filtered:[],
        loading:true
      }
  },methods:{
      search(query){
          if(query == ""){
              
              this.movies_filtered=this.movies;
          }else{
this.movies_filtered= this.movies.filter(x=>{
             return x.title.includes(query)
          })
          }
          
      }
    
  },
   async mounted() {
      try {
          let res = (await Movie.loadMovies());
          this.movies = res.data;
          this.movies_filtered = this.movies;
          console.log(this.movies)
      }catch(e) {
          console.log(e);
      }
  }
}
</script>

<style scoped>
.movie-selection {
        margin-top: 2em;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
    .page{
      display: flex;
        flex-direction: column;
        align-items: center;
        margin: 2em 1em 2em 1em;
    }

  
</style>
