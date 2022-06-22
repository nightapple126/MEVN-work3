<template>
  <div>
      <label v-if="!pos || edit">
        <gmap-autocomplete
          @place_changed="setPlace"
          :placeholder="placeholder"
          >
        </gmap-autocomplete>
      </label>
    <gmap-map
      :center="center"
      :zoom="12"
      style="width:100%;  height: 400px;"
    >
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        @click="center=m.position"
      ></gmap-marker>
    </gmap-map>
  </div>
</template>

<script>
export default {
  name: "GoogleMap",
  props: ['placeholder', 'pos', 'edit'],
  data() {
    return {
      // default to Montreal to keep it simple
      // change this to whatever makes sense
      center: { lat: 45.508, lng: -73.587 },
      markers: [],
      places: [],
      currentPlace: null
    };
  },
  beforeMount() {
    console.log(this.pos)
    if (this.pos) {
      this.currentPlace = this.pos
      this.addMarker()
    } else {
      this.geolocate()
    }   
  },
  created() {
    console.log(this.pos)
    if (this.pos) {
      this.currentPlace = this.pos
      this.addMarker()
    } else {
      this.geolocate()
    }   
  },

  methods: {
    // receives a place object via the autocomplete component
    setPlace(place) {
      this.currentPlace = place;
      console.log(place)
    },
    addMarker() {
      if (this.currentPlace) {
        let marker
        if(this.pos) {
          marker = {
          lat: this.currentPlace.geometry.location.lat,
          lng: this.currentPlace.geometry.location.lng
          };
        } else {
          marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
          };
        }
       
        this.markers = [];
        this.markers.push({ position: marker });
        this.places = [];
        this.places.push(this.currentPlace);
        this.center = marker;
      }
    },
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    }
  },
  watch: {
        'currentPlace': function() {
            this.addMarker()
            this.$emit('location', this.currentPlace)
        }
  }
};
</script>
<style scoped>
    input {
        display: inline-block;
        width: 100%;
        height: 32px;
        line-height: 1.5;
        padding: 4px 7px;
        font-size: 12px;
        border: 1px solid #dddee1;
        border-radius: 4px;
        color: #495060;
        background-color: #fff;
        background-image: none;
        position: relative;
        cursor: text;
        transition: border .2s ease-in-out,background .2s ease-in-out,box-shadow .2s ease-in-out;
    }
    div {
        display: flex;
        flex-direction: column
    }
    label {
        display: flex;
        flex-direction: row
    }
</style>
