<template>
  <div v-if="event">
      <Card style="width:100%">
          <GoogleMap :pos="event.location"></GoogleMap>
        <div style="text-align:center">
            <h1>{{ event.title }}</h1>
            <p>{{ event.description }}</p>
           <Card>
               <div class="event-info">
                    <div class="left-side">
                        <table>
                            <tr>
                                <td><Icon type="calendar"></Icon>   Start date:</td>
                                <td> <span>{{ new Date(event.start_date).getDate() + ' ' + monthNames[new Date(event.start_date).getMonth()]}}</span></td>
                            </tr>
                            <tr>
                                <td><Icon type="calendar"></Icon>   Finishing Date:</td>
                                <td><span>{{ new Date(event.finish_date).getDate() + ' ' + monthNames[new Date(event.finish_date).getMonth()]}}</span></td>
                            </tr>
                            <tr>
                                <td><Icon type="clock"></Icon>   Time:</td>
                                <td>{{ new Date(event.start_date).toLocaleTimeString() }}</td>
                            </tr>
                            <tr>
                                <td><Icon type="grid"></Icon>   Type:</td>
                                <td>{{ event.type }}</td>
                            </tr>
                            <tr>
                                <td><Icon type="briefcase"></Icon>   Organizer:</td>
                                <td>{{ event.organizer }}</td>
                            </tr>
                            <tr>
                                <td><Icon type="cash"></Icon>   Sponsors:</td>
                                <td><Tag type="border" v-for="sponsor in event.sponsors" color="yellow" dot :key="sponsor">{{ sponsor }}</Tag></td>
                            </tr>
                            <tr>
                                <td><Icon type="ios-people"></Icon>   Audience number:</td>
                                <td>{{ event.audience_number }}</td>
                            </tr>
                            <tr>
                                <td><Icon type="android-person-add"></Icon>   Remaining place:</td>
                                <td>{{ event.audience_number }}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="right-side">
                        <img :src="imagePath + event.event_image" alt="">
                    </div>
               </div>
           </Card>
           <div class="btns">
                   <ButtonGroup size="large">
                       <Button v-if="!participated" icon="plus-round" @click="participate()" type="primary">Participate</Button>
                       <Button v-if="participated" icon="minus-round" @click="unparticipate()" type="error">Unparticipate</Button>
                       <Button icon="heart" v-if="!whishlist" @click="interrested()" type="success">Interested</Button>
                        <Button icon="heart-broken" @click="uninterrested()" v-if="whishlist" type="warning">Uninterested</Button>
                   </ButtonGroup>
               </div>
        </div>
    </Card>
  </div>
</template>
<script>
import GoogleMap from "@/components/reusable/GoogleMap";
import Event from "@/services/Event";
import Config from "@/utils/config";
export default {
  name: "EventDetails",
  components: {
    GoogleMap
  },
  data() {
    return {
      event: null,
      participated: false,
      imagePath: Config.URL + Config.UPLOAD_EVENT_PATH,
      monthNames: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      whishlist: false
    };
  },
  methods: {
      async participate() {
          try {
              await Event.participate(this.event)
              this.$store.commit('addEventParticipation', this.event)
              this.participated = true
          } catch (error) {
            console.log(error)   
          }
      },
      async unparticipate() {
          try {
              await Event.unparticipate(this.event)
              this.$store.commit('removeEventParticipation', this.event)
              this.participated = false
          } catch (error) {
            console.log(error)   
          }
      },
      async interrested() {
          try {
              await Event.interrested(this.event)
              this.$store.commit('addEventWhishlist', this.event)
              this.whishlist = true
          } catch (error) {
              console.log(error);
          }
      },
      async uninterrested() {
          try {
              await Event.uninterrested(this.event)
              this.$store.commit('removeEventWhishlist', this.event)
              this.whishlist = false
          } catch (error) {
              console.log(error);
          }
      }
  },
  mounted() {
      console.log(this.$store.state.user.participations.includes(this.event._id));
      console.log(this.$store.state.user.whishlist.includes(this.event._id));
      if (this.$store.state.user.whishlist.includes(this.event._id)) {
            this.whishlist = true
      }
      if (this.$store.state.user.participations.includes(this.event._id)) {
            this.participated = true
      }
  },
  async beforeCreate() {
    console.log(new Date().toLocaleTimeString());
    try {
      this.event = (await Event.getOneForGuest(
        this.$store.state.route.params.id
      )).data.event[0];
      this.participated = this.$store.state.user.participations.includes(this.event._id)
      this.whishlist = this.$store.state.user.whishlist.includes(this.event._id)
      console.log(this.event);
    } catch (error) {
      console.log(error);
    }
  }
};
</script>
<style scoped>
h1 {
  text-transform: uppercase;
  color: #a4b0be;
  font-weight: 900;
  margin-top: 2%;
}
p {
    margin-bottom: 2%
}
.event-info {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.left-side {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
}
.event-info tr td {
  font-size: 1.5em;
  text-align: left;
  width: 2%
}
.event-info tr td:last-child {
  font-weight: 900;
  font-size: 1.7em;
  color: black
}
.event-info tr td {
    padding: 1% 0 1% 0;
}
.right-side {
  width: 100%;
}
.right-side img {
  width: 100%;
}
.btns {
    margin-top: 2%
}
</style>


