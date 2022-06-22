<template>
<div style="background-color:#CFD8DC;">
    <div class="row">
<video id="video"
           width="720"
           poster="//shaka-player-demo.appspot.com/assets/poster.jpg"
           controls autoplay></video> 
    </div>
  
        <Card style="background-color:white;">
           <div class="etiquette">
                 <img :src="movie.thumbnail" alt="Forest">

              <div class="columns">
                  <h2>{{movie.title}}</h2>
                    <Rate allow-half v-model="valueHalf"></Rate>
                    <div class="wholeparag">
                 <p class="parag" style="font-weight:bold;padding-left:0!important;">Synopsis</p>
                 <p class="parag">Aboard the USS Enterprise, the most-sophisticated starship ever built, a novice crew embarks on its maiden voyage. Their path takes them on a collision course with Nero (Eric Bana), a Romulan commander whose mission of vengeance threatens all mankind. If humanity would survive, a rebellious young officer named James T. Kirk (Chris Pine) and a coolly logical Vulcan named Spock (Zachary Quinto) must move beyond their rivalry and find a way to defeat Nero before it is too late.</p>
                  </div>
             </div>
         </div>
        </Card>
        

    </div>
</template>
<script>
import shaka from "shaka-player/dist/shaka-player.compiled.js";
import Movie from '@/services/Movie';
//import { shaka_player } from "../../node_modules/shaka-player/dist/shaka-player.compiled.js";
export default {
    data () {
            return {
                valueHalf: 2.5,
                movie:{
                  title:"",
                  description:"",
                  dash_manifest:""
                }
            }
        },
         async mounted(){
         console.log(this.$route.params);
         let q = (await Movie.loadMovie(this.$route.params.id) )
                this.movie = q.data;

        },
  beforeCreate() {
    var manifestUri =
      "//storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd";

    function initApp() {
      // Install built-in polyfills to patch browser incompatibilities.
      shaka.polyfill.installAll();

      // Check to see if the browser supports the basic APIs Shaka needs.
      if (shaka.Player.isBrowserSupported()) {
        // Everything looks good!
        initPlayer();
      } else {
        // This browser does not have the minimum set of APIs we need.
        console.error("Browser not supported!");
      }
    }

    function initPlayer() {
      // Create a Player instance.
      var video = document.getElementById("video");
      var player = new shaka.Player(video);

      // Attach player to the window to make it easy to access in the JS console.
      window.player = player;

      // Listen for error events.
      player.addEventListener("error", onErrorEvent);

      // Try to load a manifest.
      // This is an asynchronous process.
      player
        .load(manifestUri)
        .then(function() {
          // This runs if the asynchronous load is successful.
          console.log("The video has now been loaded!");
        })
        .catch(onError); // onError is executed if the asynchronous load fails.
    }

    function onErrorEvent(event) {
      // Extract the shaka.util.Error object from the event.
      onError(event.detail);
    }

    function onError(error) {
      // Log the error.
      console.error("Error code", error.code, "object", error);
    }

    document.addEventListener("DOMContentLoaded", initApp);
  }
};
</script>
<style scoped>
img {
  border: 1px solid #ddd; /* Gray border */
  border-radius: 4px; /* Rounded border */
  padding: 5px; /* Some padding */
  width: 150px; /* Set a small width */
  height:200px;
  margin: 10px;
}

/* Add a hover effect (blue shadow) */
img:hover {
  box-shadow: 0 0 2px 1px rgba(0, 140, 186, 0.5);
}
.columns {
    margin-top:1em;
    display: flex;
    flex-direction: column;
    margin-left: 5em;
        align-items: left;

}
.etiquette{
    display: flex;
    flex-direction: row;
}
.parag{
    text-align: left;
    padding-left: 0.5em;
}
.wholeparag{
    display: flex;
    flex-direction: row;
}

</style>



