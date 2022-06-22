<template>
    <div id="Bot">
        <OrderModal v-if="active" v-on:orderCompleted="orderCompleted" :toggled="active" :movie="ordered_movie" :food="ordered_plate">

        </OrderModal>
        <audio ref="audioElm" src=""></audio>

        <Row>
            <Col span="10">
                <img id="judy" src="../../assets/img/judy.png" alt=""> 
                 <div class="boxContainer" id="boxContainer" >
                <div class="box" v-bind:class="{box1:talking}"></div>
                <div class="box" v-bind:class="{box2:talking}"></div>
                <div class="box" v-bind:class="{box3:talking}"></div>
                <div class="box" v-bind:class="{box4:talking}"></div>
                <div class="box" v-bind:class="{box5:talking}"></div>
        </div>
        <Icon id="micro" size="50" @click.native="talk" color="#757575" type="android-microphone"></Icon>
        <Input id="bot-input" v-model="query" placeholder="Say something.." @on-keyup.enter="send" ></Input>
            </Col>
            <Col span="12" offset="2">
              <section ref="chatArea" id="chat-area" class="chat-area bigger">
                <p v-for="(message,i) in messages" :key=i class="message" :class="{ 'message-out': message.from === 'user', 'message-in': message.from !== 'user' }">
                  {{ message.content }}
                </p>
                <Player v-bind:query="musicQuery" v-if="intent=='play_music'">

                </Player>
                 <Places style="margin-bottom:1em;margin-top:1em" v-bind:params="params" v-if="intent=='find_place'" >

                     </Places>
                     <div style="margin-bottom:1em;margin-top:1em" class="food-list" v-if="intent=='view_events'">
                       <div class="arrow-left">
                         <Button @click.native="plate_index--" v-bind:disabled="canGoBack" type="primary" shape="circle" icon="arrow-left-b"></Button>
                       </div>
                       <EventCard v-if="ready"  :event="event">

                       </EventCard>
                      
                    
                      <div class="arrow-right">
                        <Button  @click.native="plate_index++" type="primary" shape="circle" icon="arrow-right-b" v-bind:disabled="canGoFurther"></Button>
                      </div>
                     </div>
                     <div style="margin-bottom:1em;margin-top:1em" class="food-list" v-if="intent=='order_food'&ready">
                       <div class="arrow-left">
                         <Button @click.native="plate_index--" v-bind:disabled="canGoBack" type="primary" shape="circle" icon="arrow-left-b"></Button>
                       </div>
                       <PlateCard v-on:ordered="plateOrdered" v-bind:plate="plate">

                      </PlateCard>
                      
                    
                      <div class="arrow-right">
                        <Button  @click.native="plate_index++" type="primary" shape="circle" icon="arrow-right-b" v-bind:disabled="canGoFurther"></Button>
                      </div>
                     </div>
              </section>
              
            </Col>
        
        </Row>
        
    </div>
    
</template>
<script>
import Bot from "@/services/Bot";
import PlateCard from "../restaurant/PlateCard.guest.vue";
import EventCard from "../event/EventCard.component.vue";
import Places from "../places/Places.vue";
import OrderModal from "../restaurant/OrderModal.vue";
import Event from "@/services/Event";
import Food from "@/services/Food";
import Place from "@/services/Place";
import Player from "../track/Player.vue";
export default {
  components: {
    PlateCard,
    Places,
    Player,
    OrderModal,
    EventCard
  },
  name: "Bot",
  updated() {
    document.getElementById("chat-area").scrollTop = document.getElementById(
      "chat-area"
    ).scrollHeight;
  },
  mounted() {
    Bot.getInteractions(this.$store.state.user)
      .then(data => {
        data.data.forEach(element => {
          this.messages.push({
            from: "user",
            content: element.query
          });
          this.messages.push({
            from: "bot",
            content: element.response
          });
        });
      })
      .catch(err => {});
    this.$refs.audioElm.onended = () => {
      console.log("Destroying");
      Bot.delete(this.audio)
        .then(data => {
          //console.log(data);
          this.audio = "";
        })
        .catch(err => {
          console.log(err);
        });
    };
  },
  data() {
    return {
      talking: false,
      recognition: undefined,
      query: "",
      additional_content: false,
      typing_text: "Hello ",
      plate_index: 0,
      intent: "",
      ready: false,
      plates: [],
      audio: "",
      params: {},
      messages: [],
      lastQuery: "",
      musicQuery: "",
      ordering: false,
      food: undefined,
      movie: undefined,
      events: []
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    plate() {
      return this.plates[this.plate_index];
    },
    event() {
      console.log("Returning "+JSON.stringify(this.events[this.plate_index]));
      
      return this.events[this.plate_index];
    },
    canGoBack() {
      return this.plate_index == 0;
    },
    canGoFurther() {
      if (this.intent == "order_food")
        return this.plate_index >= this.plates.length - 1;
      else return this.plate_index >= this.events.length - 1;
    },
    active() {
      return this.ordering;
    },
    ordered_movie() {
      return this.movie;
    },
    ordered_plate() {
      return this.food;
    }
  },
  methods: {
    play(filename) {
      this.$refs.audioElm.src =
        "http://52.50.26.211:3000/tmp/audio/" +
        filename;
      this.$refs.audioElm.play();
      this.audio = filename;
    },
    send() {
      this.lastQuery = this.query;
      var that = this;
      Bot.query(this.query)
        .then(res => {
          this.handle_bot_response(res);
          this.messages.push({
            from: "user",
            content: this.lastQuery
          });
          this.messages.push({
            from: "bot",
            content: res.data.response
          });
        })
        .catch(err => {
          console.log(err);
        });
      this.query = "";
    },
    async handle_view_events() {
      try {
        
        var resp = await (Event.getAllForGuest());
        this.events = resp.data.events;
        this.plate_index = 0;
        this.intent = "view_events";
        this.ready=true;
      } catch (err) {
        console.log(err);
      }
    },
    handle_bot_response(res) {
      var that = this;
      if (res.data.audio !== undefined) that.play(res.data.audio);
      setTimeout(() => {
        that.type(res.data.response, 0);
      }, 1500);
      console.log(res);
      if (res.data.intent == "view_events") {
        this.handle_view_events();
      } else if (res.data.intent == "order_food") {
        this.handle_food_order(res.data.params);
      } else if (res.data.intent == "find_place") {
        this.handle_place_search(res.data.params);
      } else if (res.data.intent == "play_music") {
        this.intent = "play_music";
        this.musicQuery =
          res.data.params.artist +
          " " +
          res.data.params["music-artist"] +
          " " +
          res.data.params["music-genre"] +
          " " +
          res.data.params.track;
      }
      this.intent = res.data.intent;
    },
    handle_place_search(params) {
      this.params = params;
      this.intent = "find_place";
    },
    handle_food_order(params) {
      this.intent = "order_food";
      if (params.food !== undefined && params.food != "") {
        Food.getPlateByLabem(params.food)
          .then(resp => {
            if (resp.data.length != 0) {
              this.plates = resp.data;
              this.plate_index = 0;
              this.ready = true;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    talk() {
      if (this.talking) {
        this.talking = false;
        this.recognition.stop();
        return;
      }
      this.recognition = new window.webkitSpeechRecognition();
      this.recognition.lang = "en-US";
      this.recognition.interimResults = false;
      var that = this;
      this.recognition.onresult = function(res) {
        console.log(res);
        var result = res.results[0][0].transcript;
        Bot.query(result)
          .then(res => {
            that.handle_bot_response(res);
          })
          .catch(err => {
            console.log(err);
          });
      };
      this.recognition.start();
      this.talking = true;
    },
    type(text, index) {
      var that = this;
      if (index == 0) {
        this.typing_text = "";
      }
      if (index >= text.length) {
        return;
      }
      setTimeout(function() {
        that.typing_text += text[index];
        that.type(text, index + 1);
      }, 100);
    },
    order(food, movie) {
      console.log("Ordering");
      this.ordering = true;

      this.movie = movie;
      this.food = food;
    },
    orderCompleted(state) {
      this.ordering = false;
      if (state == "canceled") {
        this.$Message.error("Order canceled");
      } else if (state == "ok") {
        this.$Message.success("Order completed !");
      } else if ((state = "error")) {
        this.$Message.error(
          "There was an error processing your order, please try again later."
        );
      }
    },
    plateOrdered(plate) {
      this.order(plate, undefined);
    }
  }
};
</script>
