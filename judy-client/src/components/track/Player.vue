<template>
<Card style="width:500px":bordered="true">
            <p slot="title">{{currentTrack.title}}</p>

              <p>
               <youtube class="musicFrame" :video-id="videoId" player-width="450" player-height="300" @ready="ready" :mute='muted' @playing="playing" :player-vars="{autoplay: 1}"></youtube>

              </p>   

                 <p class="details">
                    <Row>
                      <Col span="6"><Button @click.native="previous"  type="primary" icon="ios-skipbackward"  ></Button></Col>
                      <Col span="12"><Button type="dashed" @click.native="pause" icon="pause"  ></Button>
                     <Button @click.native="play" type="dashed" icon="play">
                     </Button>
                     <Button v-if="!muted" @click.native='toggleMute' type="dashed" icon="volume-mute" ></Button>
                      <Button v-else @click.native='toggleMute' type="dashed" icon="volume-high" ></Button></Col>
                      <Col   span="6"><Button @click.native="next" type="primary" icon="ios-skipforward"></Button></Col>
                    </Row> 
                      
                 </p>
                    

</Card>

  <!--Row>
        <Col span="12"><div id="player"></div></Col>
        <Col span="11" style="margin-left:10px">
            <Input @on-keyup.enter="search" v-model="criteria" icon="ios-search-strong" placeholder="Search..." ></Input>
            <br>
            <br>
<table>
  <thead>
    <tr>
      <th>Queue</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for ="track in tracks" :key="track._id" >
  
      <td  data-label="track">{{track.title}} <Icon v-if="checkTrackIndex(track)" color="#19be6b" type="social-youtube" />
</td>
  
    </tr>
  </tbody>
</table>


        </Col>
        </Row-->
  <!--section>
    <h2>add options</h2>
    <youtube :video-id="videoId" player-width="1280" player-height="750" :player-vars="{autoplay: 1}"></youtube>
  </section-->
</template>
<script>
import Queue from '@/services/Queue'
import Track from '@/services/Track'
export default {
   name : 'Player',
   props : ['query'],
   mounted(){
     
   },
   data() {
     return {
       muted: false,
       currentTrack:{
         title:'',
         author:'',
         time:''
       },
       videoId: 'ScMzIvxBSi4',
       currentVideo:"",
             columns1: [
                    {
                        title: 'Tracks',

                    }],
            queue : {},
            tracks: [],
            done : false,
            criteria : "",
     };
  },
   methods: {
    ready (player) {
      this.player = player
      
    },
      next(){
        
        var next = this.queue.data[0].current>=this.queue.data[0].tracks.length-1 ? 0 : this.queue.data[0].current+1;
        this.queue.data[0].current = next;
        this.currentTrack.title= this.queue.data[0].tracks[next].title;
        this.currentTrack.author = this.queue.data[0].tracks[next].author;
        this.videoId = this.queue.data[0].tracks[next].videoId;
        this.change(this.videoId);
       Queue.SetCurrent(next,this.queue.data[0]._id).then(res=>{
            console.log("test")
            
           
        }).then(err=>{
            console.log(err);
        });
      },
       previous(){
        
        var next = this.queue.data[0].current ==0 ? this.queue.data[0].tracks.length-1 : this.queue.data[0].current-1;
        this.queue.data[0].current = next;
        this.currentTrack.title= this.queue.data[0].tracks[next].title;
        this.currentTrack.author = this.queue.data[0].tracks[next].author;
        this.videoId = this.queue.data[0].tracks[next].videoId;
        this.change(this.videoId);
       Queue.SetCurrent(next,this.queue.data[0]._id).then(res=>{
            console.log("test")
            
           
        }).then(err=>{
            console.log(err);
        });
      },
    checkTrackIndex(track){
      let index =this.tracks.indexOf(track);
     // console.log(track);
      if(index==this.queue.data[0].current){
        return  true;
      }
      else {
        return false;
      }

    },
    playing (player) {
      !this.player.getCurrentTime ? this.currentTrack.time=0.0 : this.currentTrack.time=this.player.getCurrentTime();
      },
      toggleMute(){
        this.muted=!this.muted;
      },
    change (currentVideo) {
      // when you change the value, the player will also change.
      // If you would like to change `playerVars`, please change it before you change `videoId`.
      // If `playerVars.autoplay` is 1, `loadVideoById` will be called.
      // If `playerVars.autoplay` is 0, `cueVideoById` will be called.

      this.videoId = currentVideo
    },
    stop () {
      this.player.stopVideo()
    },
    getDuration(){
      !this.player.getCurrentTime ? this.currentTrack.time=0.0 : this.currentTrack.time=this.player.getCurrentTime();
      
    },
    pause () {
      this.player.pauseVideo()
    },
    play(){
      this.player.playVideo()
    },
    search(){
      console.log("Searching for "+this.criteria)
    Track.searchOnYoutube(this.criteria).then(data=>{
        var index=  Math.floor(Math.random()*25);
        console.log(data.data[index]);
        var track = {
          "videoId" : data.data[index].id.videoId,
          "title": data.data[index].snippet.title,
          "author": data.data[index].snippet.channelTitle
        };
        
        Queue.AddToQueue(track,this.queue.data[0]._id).then(result =>{
          Queue.Queue().then(q=>{
            this.tracks = q.data[0].tracks; 
            this.queue=q;
            Queue.SetCurrent(this.tracks.length-1,this.queue.data[0]._id);
            var currentVideo=this.queue.data[0].tracks[this.queue.data[0].tracks.length-1].videoId;
            
            console.log(this.player);
            console.log(this.videoId);
            
            this.currentTrack.title = track.title;
            this.currentTrack.author = track.author
            this.change(currentVideo);
            }).catch(err=>console.log(err));
          
        }).catch(err=>{
            console.log(err);
        });

        // Save track
        // Add To Queue
    }).catch(err=>{
        console.log(err)
    });
}
  }
  ,
  async beforeCreate(){
     this.queue = (await Queue.Queue())        
          this.tracks=(this.queue.data[0].tracks);
          this.criteria = this.query;
          this.search();
          if (this.tracks.length != 0 ){
          console.log(this.queue.data[0].tracks[0]);
          this.videoId=this.queue.data[0].tracks[this.queue.data[0].current].videoId;4
          this.currentTrack.title= this.queue.data[0].tracks[this.queue.data[0].current].title
          
          }
          else {
            this.videoId="ScMzIvxBSi4";
          }
  }
}
</script>
<style>
table {
  border: 1px solid #ccc;
  width: 100%;
  margin: 0;
  padding: 0;
  border-collapse: collapse;
  border-spacing: 0;
}

table tr {
  border: 1px solid #ddd;
  padding: 5px;
}

table th,
table td {
  padding: 10px;
  text-align: center;
}

table th {
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 1px;
}
.musicCardBody{
    display: flex;
    flex-direction: row;
}
.musicDescription{
  padding: 5px;
  display:flex;
  flex-direction:column;
}
.musicAuthor, .musicTime{
  color:#808080;
}
.detail {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
@media screen and (max-width: 600px) {

table { border: 0; }

table thead { display: none; }

table tr {
  margin-bottom: 10px;
  display: block;
  border-bottom: 2px solid #ddd;
}

table td {
  display: block;
  text-align: right;
  font-size: 13px;
  border-bottom: 1px dotted #ccc;
}

table td:last-child { border-bottom: 0; }

table td:before {
  content: attr(data-label);
  float: left;
  text-transform: uppercase;
  font-weight: bold;
}


}
</style>