<template>
    <div id="places">
        <Card>
        <p slot="title">
            Chose radius
        </p>
        
        <p>
             <Slider v-model="radius" :min=0 :max=5000 :step=100></Slider>
            <gmap-map v-if="data.length!=0"
                :center="center"
                :zoom="15"
                style="width: 550px; height: 300px"
            >

                <gmap-marker
                    
                    :position.sync="center"
                    :clickable="true"
                    ></gmap-marker>
                <gmap-marker
                    v-for="(place,i) of data"
                    :key= place.name
                    :position.sync="place.position"
                    :clickable="true"
                    :icon="icon(place.icon)"
                     @click="toggleInfoWindow(place,i)"
                    >
                      
                    
                </gmap-marker>
                 <gmap-info-window
                    :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false">
                            <p>
                                {{content}} 
                            </p>
                            <img v-bind:src="imageSource" alt="">
                            <p>
                                <Rate :disabled="true" allow-half v-model="rate_value"></Rate>
                            </p>
                    </gmap-info-window>  
            </gmap-map>
        </p>
      
      
        <div class="detail">
           
            <Button type="dashed" icon="search" @click="search">Go!</Button>
        </div>
    </Card>
       
    </div>
</template>
<script>
import Place from "@/services/Place";
import { loaded } from "vue2-google-maps";
export default {
  name: "PlacesList",
  props: ["params"],
  data() {
    return {
      rate_value: 0,
      radius: 2500,
      center: {
        lat: 36.8334276,
        lng: 10.2340335
      },
      googleMapsInitialized: false,
      data: [],
      infoWindowPos: {
        lat: 0,
        lng: 0
      },
      infoWinOpen: false,
      currentMidx: null,
      //optional: offset infowindow so it visually sits nicely on top of our marker
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      },
      content: "",
      imageSource: ""
    };
  },
  methods: {
    icon(path) {
      let baseIcon = {
        url: path
      };
      if (this.googleMapsInitialized) {
        // we have google maps in the window
        baseIcon.scaledSize = new window.google.maps.Size(30, 30);
      }
      return baseIcon;
    },
    search() {
      this.data=[];
      Place.find(this.params.place, this.radius)
        .then(data => {
            console.log(data.data.results.length+" restults")
          data.data.results.forEach(element => {
            this.data.push({
              position: element.geometry.location,
              icon: element.icon,
              name: element.name,
              rating: element.rating,
              address: element.vincinity,
              photo:
                element.photos === undefined
                  ? ""
                  : element.photos[0].photo_reference
            });
            
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    toggleInfoWindow(marker, idx) {
      var center = {
        lat: marker.position.lat + 0.5,
        lng: marker.position.lng
      };
      this.center = center;
      this.rate_value = marker.rating;
      this.infoWindowPos = marker.position;
      this.content = this.data[idx].name;

      this.imageSource =
        "https://maps.googleapis.com/maps/api/place/photo?photoreference=" +
        this.data[idx].photo +
        "&key=AIzaSyCe92gr43sp4saSVSes4G7xJtH67b41EoY&maxwidth=100";
      //check if its the same marker that was selected if yes toggle
      if (this.currentMidx == idx) {
        t;
        this.infoWinOpen = !this.infoWinOpen;
      } else {
        //if different marker set infowindow to open and reset current marker index
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    }
  },
  computed: {},
  async mounted() {
    loaded.then(() => {
      this.googleMapsInitialized = true; // define this property in data
    });
  }
};
</script>
<style scoped>

</style>