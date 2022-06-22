<template>
<div>


    <div class="video" style="position:absolute" hidden>
        <div id="videoBig">
                    <video id="videoOutput" autoplay width="600px" height="450px" poster="https://52.50.26.211:3000/kurento/img/judy.png"></video>
                    </div>
                    <div id="videoSmall">
                    <video id="videoInput" autoplay width="240px" height="180px" poster="https://52.50.26.211:3000/kurento/img/judy.png"></video>
                    </div>   
        </div>
    <div class="container   judymsg"   >
                <input   v-model="kurentoSender" id="name" name="name"  hidden  > 
                <a id="register" hidden></a>   
                <div class="row" id="messsageArea">
                     <input  v-model="kurentoReciver"  id="peer" name="peer"  type="text" hidden>
                   
                    <br>
                </div>
            </div>


    
   
  <body>
<div id="frame" style="position:relative">
	<div id="sidepanel">
		<div id="profile">
			<div class="wrap">
				<img id="profile-img" 	 :src="getMyImage()"  class="online" alt="" />
				<p>{{kurentoSender}}</p>
				
				<div id="status-options">
					<ul>
						<li id="status-online" class="active"><span class="status-circle"></span> <p>Online</p></li>
						<li id="status-away"><span class="status-circle"></span> <p>Away</p></li>
						<li id="status-busy"><span class="status-circle"></span> <p>Busy</p></li>
					
					</ul>
				</div>
			
			</div>
		</div>
    	    <RadioGroup v-model="radio">
        <Radio label="Conversation" @click.native="offlineconversation()">
          <span>Conversation</span>
        </Radio>
       <Radio label="Onlineguest" @click.native="onlineconversation()">
         <span>Online guest</span>
        </Radio>
    </RadioGroup>
		<div id="search">
    
			<label for=""><i class="fa fa-search" aria-hidden="true"></i></label>
			<input type="text"  v-model="word" placeholder="Search contacts..."  v-on:keyup="search(word)" />
		</div>
		<div id="contacts">
			<ul>
			
				<li  v-for="users in connectedUsersSearch " :key="users.id" v-if="users.username != user.username" v-on:click="getReciver(users)" :class="{ 'contact': users.username !== reciver, 'contact active': users.username === reciver }">
					<div class="wrap">
						<span class="contact-status online"></span>
						<img :src="getImage(users.picture)" alt=""  height="45px" />
						<div class="meta">
							<p class="name">{{users.username}}</p>
							<p class="preview">&nbsp;&nbsp;&nbsp;</p>
						</div>
					</div>
				</li>
			
			
			</ul>
		</div>
	
	</div>
	<div class="content">
		<div class="contact-profile" v-if="reciver != ''">
			<img :src="reciverImage" alt="" />
			<p>{{reciver}}</p>
			
		</div>
		<div class="messages">
			<ul>
				<li  v-for="msg in messages" :key="msg._id" :class="{ 'sent': msg.person_reciver === senderID, 'sent': msg.person_sender === senderID ,'replies': msg.person_reciver !== senderID, 'replies': msg.person_sender !== senderID }">
					
					<img :src="getMyImage()"  v-if="msg.person_reciver !== senderID && msg.person_sender === senderID" />
					<img :src="reciverImage"  v-if="msg.person_reciver === senderID && msg.person_sender !== senderID" />
					<p>{{msg.message}}</p>
				</li>
				
				
			</ul>
		</div>
		<div class="message-input">
			<div class="wrap">
			<input type="text" v-model="msg" placeholder="Type a message " v-on:keyup.enter="sendMsg" v-if="reciver !== '' " id="text" />
	
			 		<a id="call"  class="btn btn-success " :class="{ 'btn btn-success': kurentoReciver != '', 'hidden': kurentoReciver == '' }" >
                        <span class="glyphicon glyphicon-play"></span> Call</a>
												<span class="video" hidden>   <a id="terminate"  class="btn btn-danger "  >
                        <span class="glyphicon glyphicon-stop"></span> Stop</a> </span> 
			</div>
		</div>
	</div>
		</div>
</body>

</div>
 

    
</template>
<script>
export default {
  name: "Chat",

  data() {
    return {
      connectedUsers: [],
      connectedUsersSearch: [],
      myConversation  : [] ,

      word: "",
      messages: [],
      socketMessage: "",
      reciverSocketId: "",
      reciver: "",
      reciverID: "",
      reciverImage: "",

      senderID: this.$store.state.user._id,
      msg: "",
      kurentoSender: this.$store.state.user.username,
      kurentoReciver: "",
      modal3: false , 
      radio : "Conversation"
    };
  },
  sockets: {
    connect() {
      this.$socket.emit("newuser", this.$store.state.user, function(data) {
        if (data) {
        }
      });

      this.$socket.emit(
        "myConversation",
        {
          sender: this.senderID,
          socket: this.$socket.id
        },
        function(data) {
          if (data) {
          }
        }
      );
    },

    disconnect() {},

    getusers(data) {
      this.connectedUsers = data;
      this.connectedUsersSearch = this.connectedUsers;
    },
    bye(data) {
      this.connectedUsers = data;
      this.connectedUsersSearch = this.connectedUsers;
    },

    newmessage(data) {
      if (this.reciver == data.from) {
        this.$socket.emit("getmessage", {
          sender: this.senderID,
          reciver: this.reciverID,
          socket: this.$socket.id
        });
      } else {
        var notification = new Notification(data.from, {
          body: data.msg,
          icon: "http://52.50.26.211:3000/uploads/user/" + data.senderImage
        });
      }
    },
    listmessage(data) {
      this.messages = data;
    }
    ,
    getmyConversation(data){
       this.myConversation = data;

      this.connectedUsersSearch = this.myConversation;

      console.log(JSON.stringify(data));
    }

    ///////
  },
  methods: {
    getImage(url) {
      return "http://52.50.26.211:3000/uploads/user/" + url;
    },
    getMyImage() {
      return (
        "http://52.50.26.211:3000/uploads/user/" + this.$store.state.user.picture
      );
    },
    getImageIcon() {
      return "https://52.50.26.211:3000/uploads/kurento/img/judy.png";
    },
    search(word) {
      console.log(JSON.stringify(this.connectedUsers));
      if (word == "") {
        this.connectedUsersSearch = this.connectedUsers;
      } else {
        this.connectedUsersSearch = this.connectedUsers.filter(x => {
          return x.username.includes(word);
        });
      }
    },

    getReciver(data) {
      this.reciverSocketId = data.id;
      this.reciver = data.username;
      this.reciverID = data.userId;
      this.kurentoReciver = data.username;
      this.getReciverImage(data.picture);
      this.$socket.emit("getmessage", {
        sender: this.senderID,
        reciver: this.reciverID,
        socket: this.$socket.id
      });
    },
    getReciverImage(img) {
      this.reciverImage = "http://52.50.26.211:3000/uploads/user/" + img;
    },
    sendMsg() {
      this.$socket.emit("sendmessage", {
        sender: this.senderID,
        reciver: this.reciverID,
        msg: this.msg,
        reciverSocketId: this.reciverSocketId,
        senderName: this.$store.state.user.username,
        senderImage: this.$store.state.user.picture
      });
      this.messages.push({ message: this.msg, person_sender: this.senderID });
      this.msg = "";
    }
    ,
    offlineconversation(){
       this.$socket.emit(
        "myConversation",
        {
          sender: this.senderID,
          socket: this.$socket.id
        },
        function(data) {
          if (data) {
          }
        }
      );
       this.connectedUsersSearch = this.myConversation;
    },
    onlineconversation(){
 
      this.connectedUsersSearch = this.connectedUsers;
    },

    ////  kurento
  },
  mounted() {},

  create() {},
  beforeCreate() {
    // var ws = new WebSocket('wss://52.50.26.211:3000/one2one');

    //var ws = new WebSocket('wss://52.50.26.211:3000/one2one');
    var videoInput;
    var videoOutput;
    var webRtcPeer;

    var registerName = null;
    const NOT_REGISTERED = 0;
    const REGISTERING = 1;
    const REGISTERED = 2;
    var registerState = null;

    function setRegisterState(nextState) {
      switch (nextState) {
        case NOT_REGISTERED:
          $("#register").attr("disabled", false);

          $("#terminate").attr("disabled", false);
          break;

        case REGISTERING:
          $("#register").attr("disabled", true);
          break;

        case REGISTERED:
          $("#register").attr("disabled", true);
          setCallState(NO_CALL);
          break;

        default:
          return;
      }
      registerState = nextState;
    }

    const NO_CALL = 0;
    const PROCESSING_CALL = 1;
    const IN_CALL = 2;
    var callState = null;

    function setCallState(nextState) {
      switch (nextState) {
        case NO_CALL:
          $("#call").attr("disabled", false);
          $("#terminate").attr("disabled", false);
          break;

        case PROCESSING_CALL:
          $("#call").attr("disabled", true);
          $("#terminate").attr("disabled", false);
          break;
        case IN_CALL:
          $("#call").attr("disabled", true);
          $("#terminate").attr("disabled", false);
          break;
        default:
          return;
      }
      callState = nextState;
    }

    window.onload = function() {
      // console = new Console();

      setRegisterState(NOT_REGISTERED);
      var drag = new Draggabilly(document.getElementById("videoSmall"));
      var drag1 = new Draggabilly(document.getElementById("videoBig"));
      videoInput = document.getElementById("videoInput");
      videoOutput = document.getElementById("videoOutput");

      document.getElementById("register").addEventListener("click", function() {
        register();
      });
      document.getElementById("call").addEventListener("click", function() {
        call();
        var $video = $(".video");
        $video.show();
      });

      document
        .getElementById("terminate")
        .addEventListener("click", function() {
          stop();
          var $video = $(".video");
          $video.hide();
        });
    };

    window.onbeforeunload = function() {
      ws.close();
    };

    ws.onmessage = function(message) {
      var parsedMessage = JSON.parse(message.data);
      console.info("Received message: " + message.data);

      switch (parsedMessage.id) {
        case "registerResponse":
          resgisterResponse(parsedMessage);
          break;
        case "callResponse":
          callResponse(parsedMessage);
          break;
        case "incomingCall":
          incomingCall(parsedMessage);
          var $video = $(".video");
          $video.show();

          break;
        case "startCommunication":
          startCommunication(parsedMessage);
          var $video = $(".video");
          $video.show();
          break;
        case "stopCommunication":
          console.info("Communication ended by remote peer");
          stop(true);
          var $video = $(".video");
          $video.hide();
          var $judyBody = $(".judymsg");
          $judyBody.show();

          break;
        case "iceCandidate":
          webRtcPeer.addIceCandidate(parsedMessage.candidate);
          break;
        default:
          console.error("Unrecognized message", parsedMessage);
      }
    };

    function resgisterResponse(message) {
      if (message.response == "accepted") {
        setRegisterState(REGISTERED);
      } else {
        setRegisterState(NOT_REGISTERED);
        var errorMessage = message.message
          ? message.message
          : "Unknown reason for register rejection.";
        console.log(errorMessage);
        alert("Error registering user. See console for further information.");
      }
    }

    function callResponse(message) {
      if (message.response != "accepted") {
        console.info("Call not accepted by peer. Closing call");
        var errorMessage = message.message
          ? message.message
          : "Unknown reason for call rejection.";
        console.log(errorMessage);
        stop(true);
      } else {
        setCallState(IN_CALL);
        webRtcPeer.processAnswer(message.sdpAnswer);
      }
    }

    function startCommunication(message) {
      setCallState(IN_CALL);
      webRtcPeer.processAnswer(message.sdpAnswer);
    }

    function incomingCall(message) {
      // If bussy just reject without disturbing user
      if (callState != NO_CALL) {
        var response = {
          id: "incomingCallResponse",
          from: message.from,
          callResponse: "reject",
          message: "bussy"
        };
        var $video = $(".video");
        $video.hide();
        return sendMessage(response);
      }

      setCallState(PROCESSING_CALL);

      if (
        confirm(
          "User " + message.from + " is calling you. Do you accept the call?"
        )
      ) {
        var $video = $(".video");
        $video.show();

        var $judyBody = $(".judymsg");
        $judyBody.hide();

        showSpinner(videoInput, videoOutput);

        var options = {
          localVideo: videoInput,
          remoteVideo: videoOutput,
          onicecandidate: onIceCandidate
        };

        webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(
          options,
          function(error) {
            if (error) {
              console.error(error);
              setCallState(NO_CALL);
            }

            this.generateOffer(function(error, offerSdp) {
              if (error) {
                console.error(error);
                setCallState(NO_CALL);
              }
              var response = {
                id: "incomingCallResponse",
                from: message.from,
                callResponse: "accept",
                sdpOffer: offerSdp
              };
              sendMessage(response);
              var $video = $(".video");
              $video.show();
            });
          }
        );
      } else {
        var response = {
          id: "incomingCallResponse",
          from: message.from,
          callResponse: "reject",
          message: "user declined"
        };
        sendMessage(response);
        var $video = $(".video");
        $video.hide();
        stop(true);
      }
    }

    function register() {
      var name = document.getElementById("name").value;
      if (name == "") {
        window.alert("You must insert your user name");
        return;
      }

      setRegisterState(REGISTERING);

      var message = {
        id: "register",
        name: name
      };
      sendMessage(message);
      document.getElementById("peer").focus();
    }

    function call() {
      if (document.getElementById("peer").value == "") {
        window.alert("You must specify the peer name");
        return;
      }

      setCallState(PROCESSING_CALL);

      showSpinner(videoInput, videoOutput);

      var options = {
        localVideo: videoInput,
        remoteVideo: videoOutput,
        onicecandidate: onIceCandidate
      };

      webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function(
        error
      ) {
        if (error) {
          console.error(error);
          setCallState(NO_CALL);
        }

        this.generateOffer(function(error, offerSdp) {
          if (error) {
            console.error(error);
            setCallState(NO_CALL);
          }
          var message = {
            id: "call",
            from: document.getElementById("name").value,
            to: document.getElementById("peer").value,
            sdpOffer: offerSdp
          };
          sendMessage(message);
        });
      });
    }

    function stop(message) {
      setCallState(NO_CALL);
      if (webRtcPeer) {
        webRtcPeer.dispose();
        webRtcPeer = null;

        if (!message) {
          var message = {
            id: "stop"
          };
          sendMessage(message);
        }
      }
      hideSpinner(videoInput, videoOutput);
    }

    function sendMessage(message) {
      var jsonMessage = JSON.stringify(message);
      console.log("Senging message: " + jsonMessage);
      ws.send(jsonMessage);
    }

    function onIceCandidate(candidate) {
      console.log("Local candidate" + JSON.stringify(candidate));

      var message = {
        id: "onIceCandidate",
        candidate: candidate
      };
      sendMessage(message);
    }

    function showSpinner() {
      for (var i = 0; i < arguments.length; i++) {
        arguments[i].poster = "./img/transparent-1px.png";
        arguments[i].style.background =
          'center transparent url("https://52.50.26.211:3000/kurento/img/spinner.gif") no-repeat';
      }
    }

    function hideSpinner() {
      for (var i = 0; i < arguments.length; i++) {
        arguments[i].src = "";
        arguments[i].poster = "./img/webrtc.png";
        arguments[i].style.background = "";
      }
    }

    /**
     * Lightbox utility (to display media pipeline image in a modal dialog)
     */
    $(document).delegate('*[data-toggle="lightbox"]', "click", function(event) {
      event.preventDefault();
      $(this).ekkoLightbox();
    });

    setRegisterState(REGISTERING);
    var message = {
      id: "register",
      name: this.$store.state.user.username
    };
    sendMessage(message);
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  }
};
</script>















<style scoped>
body {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-height: 100vh !important;
  background: #ffffff !important;
  font-family: "proxima-nova" !important;
  font-size: 1.2em !important;
  letter-spacing: 0.2px !important;
  color: #32465a !important;
  text-rendering: optimizeLegibility !important;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.004) !important;
  -webkit-font-smoothing: antialiased !important;
}

#frame {
  width: 95% !important;
  min-width: 360px !important;
  max-width: 1000px !important;
  height: 92vh !important;
  min-height: 300px !important;
  max-height: 650px !important;
  background: #e6eaea !important;
}
@media screen and (max-width: 360px) {
  #frame {
    width: 100% !important;
    height: 100vh !important;
  }
}
#frame #sidepanel {
  float: left !important;
  min-width: 280px !important;
  max-width: 340px !important;
  width: 40% !important;
  height: 100% !important;
  background: #2c3e50 !important;
  color: #f5f5f5 !important;
  overflow: hidden !important;
  position: relative !important;
}
@media screen and (max-width: 735px) {
  #frame #sidepanel {
    width: 58px !important;
    min-width: 58px !important;
  }
}
#frame #sidepanel #profile {
  width: 80% !important;
  margin: 25px auto !important;
}
@media screen and (max-width: 735px) {
  #frame #sidepanel #profile {
    width: 100% !important;
    margin: 0 auto !important;
    padding: 5px 0 0 0 !important;
    background: #32465a !important;
  }
}
#frame #sidepanel #profile.expanded .wrap {
  height: 210px !important;
  line-height: initial !important;
}
#frame #sidepanel #profile.expanded .wrap p {
  margin-top: 20px !important;
}
#frame #sidepanel #profile.expanded .wrap i.expand-button {
  -moz-transform: scaleY(-1) !important;
  -o-transform: scaleY(-1) !important;
  -webkit-transform: scaleY(-1) !important;
  transform: scaleY(-1) !important;
  filter: FlipH !important;
  -ms-filter: "FlipH" !important;
}
#frame #sidepanel #profile .wrap {
  height: 60px !important;
  line-height: 60px !important;
  overflow: hidden !important;
  -moz-transition: 0.3s height ease !important;
  -o-transition: 0.3s height ease !important;
  -webkit-transition: 0.3s height ease !important;
  transition: 0.3s height ease !important;
}
@media screen and (max-width: 735px) {
  #frame #sidepanel #profile .wrap {
    height: 55px !important;
  }
}
#frame #sidepanel #profile .wrap img {
  width: 50px !important;
  border-radius: 50% !important;
  padding: 3px !important;
  border: 2px solid #e74c3c !important;
  height: auto !important;
  float: left !important;
  cursor: pointer !important;
  -moz-transition: 0.3s border ease !important;
  -o-transition: 0.3s border ease !important;
  -webkit-transition: 0.3s border ease !important;
  transition: 0.3s border ease !important;
}
@media screen and (max-width: 735px) {
  #frame #sidepanel #profile .wrap img {
    width: 40px !important;
    margin-left: 4px !important;
  }
}
#frame #sidepanel #profile .wrap img.online {
  border: 2px solid #2ecc71 !important;
}
#frame #sidepanel #profile .wrap img.away {
  border: 2px solid #f1c40f !important;
}
#frame #sidepanel #profile .wrap img.busy {
  border: 2px solid #e74c3c !important;
}
#frame #sidepanel #profile .wrap img.offline {
  border: 2px solid #95a5a6 !important;
}
#frame #sidepanel #profile .wrap p {
  float: left !important;
  margin-left: 15px !important;
}
@media screen and (max-width: 735px) {
  #frame #sidepanel #profile .wrap p {
    display: none !important;
  }
}
#frame #sidepanel #profile .wrap i.expand-button {
  float: right !important;
  margin-top: 23px !important;
  font-size: 0.8em !important;
  cursor: pointer !important;
  color: #435f7a !important;
}
@media screen and (max-width: 735px) {
  #frame #sidepanel #profile .wrap i.expand-button {
    display: none !important;
  }
}
#frame #sidepanel #profile .wrap #status-options {
  position: absolute !important;
  opacity: 0 !important;
  visibility: hidden !important;
  width: 150px !important;
  margin: 70px 0 0 0 !important;
  border-radius: 6px !important;
  z-index: 99 !important;
  line-height: initial !important;
  background: #435f7a !important;
  -moz-transition: 0.3s all ease !important;
  -o-transition: 0.3s all ease !important;
  -webkit-transition: 0.3s all ease !important;
  transition: 0.3s all ease !important;
}
@media screen and (max-width: 735px) {
  #frame #sidepanel #profile .wrap #status-options {
    width: 58px !important;
    margin-top: 57px !important;
  }
}
#frame #sidepanel #profile .wrap #status-options.active {
  opacity: 1 !important;
  visibility: visible !important;
  margin: 75px 0 0 0 !important;
}
@media screen and (max-width: 735px) {
  #frame #sidepanel #profile .wrap #status-options.active {
    margin-top: 62px !important;
  }
}
#frame #sidepanel #profile .wrap #status-options:before {
  content: "" !important;
  position: absolute !important;
  width: 0 !important;
  height: 0 !important;
  border-left: 6px solid transparent !important;
  border-right: 6px solid transparent !important;
  border-bottom: 8px solid #435f7a !important;
  margin: -8px 0 0 24px !important;
}
@media screen and (max-width: 735px) {
  #frame #sidepanel #profile .wrap #status-options:before {
    margin-left: 23px !important;
  }
}
#frame #sidepanel #profile .wrap #status-options ul {
  overflow: hidden !important;
  border-radius: 6px !important;
}
#frame #sidepanel #profile .wrap #status-options ul li {
  padding: 15px 0 30px 18px !important;
  display: block !important;
  cursor: pointer !important;
}
@media screen and (max-width: 735px) {
  #frame #sidepanel #profile .wrap #status-options ul li {
    padding: 15px 0 35px 22px !important;
  }
}
#frame #sidepanel #profile .wrap #status-options ul li:hover {
  background: #496886 !important;
}
#frame #sidepanel #profile .wrap #status-options ul li span.status-circle {
  position: absolute !important;
  width: 10px !important;
  height: 10px !important;
  border-radius: 50% !important;
  margin: 5px 0 0 0 !important;
}
@media screen and (max-width: 735px) {
  #frame #sidepanel #profile .wrap #status-options ul li span.status-circle {
    width: 14px !important;
    height: 14px !important;
  }
}
#frame
  #sidepanel
  #profile
  .wrap
  #status-options
  ul
  li
  span.status-circle:before {
  content: "" !important;
  position: absolute !important;
  width: 14px !important;
  height: 14px !important;
  margin: -3px 0 0 -3px !important;
  background: transparent !important;
  border-radius: 50% !important;
  z-index: 0 !important;
}
@media screen and (max-width: 735px) {
  #frame
    #sidepanel
    #profile
    .wrap
    #status-options
    ul
    li
    span.status-circle:before {
    height: 18px !important;
    width: 18px !important;
  }
}
#frame #sidepanel #profile .wrap #status-options ul li p {
  padding-left: 12px !important;
}
@media screen and (max-width: 735px) {
  #frame #sidepanel #profile .wrap #status-options ul li p {
    display: none !important;
  }
}
#frame
  #sidepanel
  #profile
  .wrap
  #status-options
  ul
  li#status-online
  span.status-circle {
  background: #2ecc71 !important;
}
#frame
  #sidepanel
  #profile
  .wrap
  #status-options
  ul
  li#status-online.active
  span.status-circle:before {
  border: 1px solid #2ecc71 !important;
}
#frame
  #sidepanel
  #profile
  .wrap
  #status-options
  ul
  li#status-away
  span.status-circle {
  background: #f1c40f !important;
}
#frame
  #sidepanel
  #profile
  .wrap
  #status-options
  ul
  li#status-away.active
  span.status-circle:before {
  border: 1px solid #f1c40f !important;
}
#frame
  #sidepanel
  #profile
  .wrap
  #status-options
  ul
  li#status-busy
  span.status-circle {
  background: #e74c3c !important;
}
#frame
  #sidepanel
  #profile
  .wrap
  #status-options
  ul
  li#status-busy.active
  span.status-circle:before {
  border: 1px solid #e74c3c !important;
}
#frame
  #sidepanel
  #profile
  .wrap
  #status-options
  ul
  li#status-offline
  span.status-circle {
  background: #95a5a6 !important;
}
#frame
  #sidepanel
  #profile
  .wrap
  #status-options
  ul
  li#status-offline.active
  span.status-circle:before {
  border: 1px solid #95a5a6 !important;
}
#frame #sidepanel #profile .wrap #expanded {
  padding: 100px 0 0 0 !important;
  display: block !important;
  line-height: initial !important !important;
}
#frame #sidepanel #profile .wrap #expanded label {
  float: left !important;
  clear: both !important;
  margin: 0 8px 5px 0 !important;
  padding: 5px 0 !important;
}
#frame #sidepanel #profile .wrap #expanded input {
  border: none !important;
  margin-bottom: 6px !important;
  background: #32465a !important;
  border-radius: 3px !important;
  color: #f5f5f5 !important;
  padding: 7px !important;
  width: calc(100% - 43px) !important;
}
#frame #sidepanel #profile .wrap #expanded input:focus {
  outline: none !important;
  background: #435f7a !important;
}
#frame #sidepanel #search {
  border-top: 1px solid #32465a !important;
  border-bottom: 1px solid #32465a !important;
  font-weight: 300 !important;
}
@media screen and (max-width: 735px) {
  #frame #sidepanel #search {
    display: none !important;
  }
}
#frame #sidepanel #search label {
  position: absolute !important;
  margin: 10px 0 0 20px !important;
}
#frame #sidepanel #search input {
  font-family: "proxima-nova", "Source Sans Pro", sans-serif !important;
  padding: 10px 0 10px 46px !important;
  width: calc(100% - 25px) !important;
  border: none !important;
  background: #32465a !important;
  color: #f5f5f5 !important;
}
#frame #sidepanel #search input:focus {
  outline: none !important;
  background: #435f7a !important;
}
#frame #sidepanel #search input::-webkit-input-placeholder {
  color: #f5f5f5 !important;
}
#frame #sidepanel #search input::-moz-placeholder {
  color: #f5f5f5 !important;
}
#frame #sidepanel #search input:-ms-input-placeholder {
  color: #f5f5f5 !important;
}
#frame #sidepanel #search input:-moz-placeholder {
  color: #f5f5f5 !important;
}
#frame #sidepanel #contacts {
  height: calc(100% - 177px) !important;
  overflow-y: scroll !important;
  overflow-x: hidden !important;
}
@media screen and (max-width: 735px) {
  #frame #sidepanel #contacts {
    height: calc(100% - 149px) !important;
    overflow-y: scroll !important;
    overflow-x: hidden !important;
  }
  #frame #sidepanel #contacts::-webkit-scrollbar {
    display: none !important;
  }
}
#frame #sidepanel #contacts.expanded {
  height: calc(100% - 334px) !important;
}
#frame #sidepanel #contacts::-webkit-scrollbar {
  width: 8px !important;
  background: #2c3e50 !important;
}
#frame #sidepanel #contacts::-webkit-scrollbar-thumb {
  background-color: #243140 !important;
}
#frame #sidepanel #contacts ul li.contact {
  position: relative !important;
  padding: 10px 0 15px 0 !important;
  font-size: 0.9em !important;
  cursor: pointer !important;
}
@media screen and (max-width: 735px) {
  #frame #sidepanel #contacts ul li.contact {
    padding: 6px 0 46px 8px !important;
  }
}
#frame #sidepanel #contacts ul li.contact:hover {
  background: #32465a !important;
}
#frame #sidepanel #contacts ul li.contact.active {
  background: #32465a !important;
  border-right: 5px solid #435f7a !important;
}
#frame #sidepanel #contacts ul li.contact.active span.contact-status {
  border: 2px solid #32465a !important !important;
}
#frame #sidepanel #contacts ul li.contact .wrap {
  width: 88% !important;
  margin: 0 auto !important;
  position: relative !important;
}
@media screen and (max-width: 735px) {
  #frame #sidepanel #contacts ul li.contact .wrap {
    width: 100% !important;
  }
}
#frame #sidepanel #contacts ul li.contact .wrap span {
  position: absolute !important;
  left: 0 !important;
  margin: -2px 0 0 -2px !important;
  width: 10px !important;
  height: 10px !important;
  border-radius: 50% !important;
  border: 2px solid #2c3e50 !important;
  background: #95a5a6 !important;
}
#frame #sidepanel #contacts ul li.contact .wrap span.online {
  background: #2ecc71 !important;
}
#frame #sidepanel #contacts ul li.contact .wrap span.away {
  background: #f1c40f !important;
}
#frame #sidepanel #contacts ul li.contact .wrap span.busy {
  background: #e74c3c !important;
}
#frame #sidepanel #contacts ul li.contact .wrap img {
  width: 40px !important;
  border-radius: 50% !important;
  float: left !important;
  margin-right: 10px !important;
}
@media screen and (max-width: 735px) {
  #frame #sidepanel #contacts ul li.contact .wrap img {
    margin-right: 0px !important;
  }
}
#frame #sidepanel #contacts ul li.contact .wrap .meta {
  padding: 1px 0 0 0 !important;
}
@media screen and (max-width: 735px) {
  #frame #sidepanel #contacts ul li.contact .wrap .meta {
    display: none !important;
  }
}
#frame #sidepanel #contacts ul li.contact .wrap .meta .name {
  font-weight: 800 !important;
  display: left !important;
}
#frame #sidepanel #contacts ul li.contact .wrap .meta .preview {
  margin: 5px 0 0 0 !important;
  padding: 0 0 1px !important;
  font-weight: 400 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  -moz-transition: 1s all ease !important;
  -o-transition: 1s all ease !important;
  -webkit-transition: 1s all ease !important;
  transition: 1s all ease !important;
}
#frame #sidepanel #contacts ul li.contact .wrap .meta .preview span {
  position: initial !important;
  border-radius: initial !important;
  background: none !important;
  border: none !important;
  padding: 0 2px 0 0 !important;
  margin: 0 0 0 1px !important;
  opacity: 0.5 !important;
}
#frame #sidepanel #bottom-bar {
  position: absolute !important;
  width: 100% !important;
  bottom: 0 !important;
}
#frame #sidepanel #bottom-bar button {
  float: left !important;
  border: none !important;
  width: 50% !important;
  padding: 10px 0 !important;
  background: #32465a !important;
  color: #f5f5f5 !important;
  cursor: pointer !important;
  font-size: 0.85em !important;
  font-family: "proxima-nova", "Source Sans Pro", sans-serif !important;
}
@media screen and (max-width: 735px) {
  #frame #sidepanel #bottom-bar button {
    float: none !important;
    width: 100% !important;
    padding: 15px 0 !important;
  }
}
#frame #sidepanel #bottom-bar button:focus {
  outline: none !important;
}
#frame #sidepanel #bottom-bar button:nth-child(1) {
  border-right: 1px solid #2c3e50 !important;
}
@media screen and (max-width: 735px) {
  #frame #sidepanel #bottom-bar button:nth-child(1) {
    border-right: none !important;
    border-bottom: 1px solid #2c3e50 !important;
  }
}
#frame #sidepanel #bottom-bar button:hover {
  background: #435f7a !important;
}
#frame #sidepanel #bottom-bar button i {
  margin-right: 3px !important;
  font-size: 1em !important;
}
@media screen and (max-width: 735px) {
  #frame #sidepanel #bottom-bar button i {
    font-size: 1.3em !important;
  }
}
@media screen and (max-width: 735px) {
  #frame #sidepanel #bottom-bar button span {
    display: none !important;
  }
}
#frame .content {
  float: right !important;
  width: 60% !important;
  height: 100% !important;
  overflow: hidden !important;
  position: relative !important;
}
@media screen and (max-width: 735px) {
  #frame .content {
    width: calc(100% - 58px) !important;
    min-width: 300px !important !important;
  }
}
@media screen and (min-width: 900px) {
  #frame .content {
    width: calc(100% - 340px) !important;
  }
}
#frame .content .contact-profile {
  width: 100% !important;
  height: 60px !important;
  line-height: 60px !important;
  background: #f5f5f5 !important;
}
#frame .content .contact-profile img {
  width: 40px !important;
  border-radius: 50% !important;
  float: left !important;
  margin: 9px 12px 0 9px !important;
}
#frame .content .contact-profile p {
  float: left !important;
}
#frame .content .contact-profile .social-media {
  float: right !important;
}
#frame .content .contact-profile .social-media i {
  margin-left: 14px !important;
  cursor: pointer !important;
}
#frame .content .contact-profile .social-media i:nth-last-child(1) {
  margin-right: 20px !important;
}
#frame .content .contact-profile .social-media i:hover {
  color: #435f7a !important;
}
#frame .content .messages {
  height: auto !important;
  min-height: calc(100% - 93px) !important;
  max-height: calc(100% - 93px) !important;
  overflow-y: scroll !important;
  overflow-x: hidden !important;
}
@media screen and (max-width: 735px) {
  #frame .content .messages {
    max-height: calc(100% - 105px) !important;
  }
}
#frame .content .messages::-webkit-scrollbar {
  width: 8px !important;
  background: transparent !important;
}
#frame .content .messages::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3) !important;
}
#frame .content .messages ul li {
  display: inline-block !important;
  clear: both !important;
  float: left !important;
  margin: 15px 15px 5px 15px !important;
  width: calc(100% - 25px) !important;
  font-size: 0.9em !important;
}
#frame .content .messages ul li:nth-last-child(1) {
  margin-bottom: 20px !important;
}

#frame .content .messages ul li.sent img {
  margin: 6px 8px 0 0 !important;
}
#frame .content .messages ul li.sent p {
  background: #435f7a !important;
  color: #f5f5f5 !important;
}
#frame .content .messages ul li.replies img {
  float: right !important;
  margin: 6px 0 0 8px !important;
}
#frame .content .messages ul li.replies p {
  background: #f5f5f5 !important;
  float: right !important;
}
#frame .content .messages ul li img {
  width: 22px !important;
  border-radius: 50% !important;
  float: left !important;
}
#frame .content .messages ul li p {
  display: inline-block !important;
  padding: 10px 15px !important;
  border-radius: 20px !important;
  max-width: 205px !important;
  line-height: 130% !important;
}
@media screen and (min-width: 735px) {
  #frame .content .messages ul li p {
    max-width: 300px !important;
  }
}
#frame .content .message-input {
  position: absolute !important;
  bottom: 0 !important;
  width: 100% !important;
  z-index: 99 !important;
}
#frame .content .message-input .wrap {
  position: relative !important;
}
#frame .content .message-input .wrap input {
  font-family: "proxima-nova", "Source Sans Pro", sans-serif !important;
  float: left !important;
  border: none !important;
  width: calc(100% - 90px) !important;
  padding: 11px 32px 10px 8px !important;
  font-size: 0.8em !important;
  color: #32465a !important;
}
@media screen and (max-width: 735px) {
  #frame .content .message-input .wrap input {
    padding: 15px 32px 16px 8px !important;
  }
}
#frame .content .message-input .wrap input:focus {
  outline: none !important;
}
#frame .content .message-input .wrap .attachment {
  position: absolute !important;
  right: 60px !important;
  z-index: 4 !important;
  margin-top: 10px !important;
  font-size: 1.1em !important;
  color: #435f7a !important;
  opacity: 0.5 !important;
  cursor: pointer !important;
}
@media screen and (max-width: 735px) {
  #frame .content .message-input .wrap .attachment {
    margin-top: 17px !important;
    right: 65px !important;
  }
}
#frame .content .message-input .wrap .attachment:hover {
  opacity: 1 !important;
}
#frame .content .message-input .wrap button {
  float: right !important;
  border: none !important;
  width: 50px !important;
  padding: 12px 0 !important;
  cursor: pointer !important;
  background: #32465a !important;
  color: #f5f5f5 !important;
}
@media screen and (max-width: 735px) {
  #frame .content .message-input .wrap button {
    padding: 16px 0 !important;
  }
}
#frame .content .message-input .wrap button:hover {
  background: #435f7a !important;
}
#frame .content .message-input .wrap button:focus {
  outline: none !important;
}
.hidden {
  display: none !important;
}
.sent {
  width: 30% !important;
}
</style>