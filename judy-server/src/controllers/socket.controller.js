var Chat = require("../models/chat");
var Conversation = require("../models/conversation");
var kurento = require("kurento-client");
var minimist = require('minimist');
var argv = minimist(process.argv.slice(2), {
  default: {
      as_uri: "https://ec2-34-245-200-210.eu-west-1.compute.amazonaws.com:3001/",
      ws_uri: "ws://ec2-34-245-200-210.eu-west-1.compute.amazonaws.com:8888/kurento"
  }

});
module.exports = function(server, wss) {
  users = [];
  connections = [];


  var io = require("socket.io").listen(server);
  io.sockets.on("connection", function(socket) {
    connections.push(socket);
   // console.log("connected host =  " + connections.length);
    //console.log(socket.id);

    ///  disconnect
    socket.on("disconnect", function(data) {
      users.splice(users.findIndex(x => x.id === socket.id), 1);
      connections.splice(connections.indexOf(socket), 1);
    //  console.log("Disconnected  :  socket restant :  " + connections.length);

      io.sockets.emit("bye", users);
    });

    //myConversation
    socket.on("myConversation", function(data, callback) {
      callback(true);
     

      Conversation.find({
        person_owner: data.sender
      },'person_reciver').populate('person_reciver')

        .then(f => {
         
          myConversation = [];
          f.forEach( function(element){
           myConversation.push({
             // id: socket.id,
              userId: element.person_reciver._id,
              username: element.person_reciver.username,
              picture: element.person_reciver.picture
            })
            
          })
          console.log(JSON.stringify(myConversation));
          io.sockets.to(data.socket).emit("getmyConversation",myConversation);
        })
        .catch(error => {
          console.log("errrrrrr");
        });

   
        
     // io.sockets.emit("getmyConversation", users);
    });


    // send mesg

    socket.on("sendmessage", function(data) {
      // io.sockets.emit("new message", {msg : data});

      Conversation.find({
        person_owner: data.sender,
        person_reciver: data.reciver
      })
        .then(f => {
          if (JSON.stringify(f).length == 2) {
            var con = new Conversation({
              person_owner: data.sender,
              person_reciver: data.reciver
            })
              .save()
              .then(result => {})
              .catch(err => {});
          }
        })
        .catch(error => {
          console.log("errrrrrrrrrrrrr");
        });

      var chat = new Chat({
        person_sender: data.sender,
        person_reciver: data.reciver,
        message: data.msg
      });
      chat
        .save()
        .then(result => {})
        .catch(err => {});

      io.sockets.to(data.reciverSocketId).emit("newmessage", {
        msg: data.msg,
        from: data.senderName,
        senderImage: data.senderImage,
        sender: data.sender
      });
      // io.sockets.to( data.reciver ).emit("new message", {msg : data.msg , from : socket.username });
    });

    //getmessage
    socket.on("getmessage", function(data) {
      Chat.find()
        .and([
          {
            $or: [
              { person_sender: data.sender },
              { person_reciver: data.sender }
            ]
          },
          {
            $or: [
              { person_sender: data.reciver },
              { person_reciver: data.reciver }
            ]
          }
        ])
        .exec(function(err, results) {
          io.sockets.to(data.socket).emit("listmessage", results);
        });
    });

    // new user
    socket.on("newuser", function(data, callback) {
      callback(true);

      socket.username = data.username;
      users.push({
        id: socket.id,
        userId: data._id,
        username: socket.username,
        picture: data.picture
      });
      io.sockets.emit("getusers", users);
    });
  });

  /*
 * Definition of global variables.
 */

  var kurentoClient = null;
  var userRegistry = new UserRegistry();
  var pipelines = {};
  var candidatesQueue = {};
  var idCounter = 0;

  function nextUniqueId() {
    idCounter++;
    return idCounter.toString();
  }

  // Represents caller and callee sessions
  function UserSession(id, name, ws) {
    this.id = id;
    this.name = name;
    this.ws = ws;
    this.peer = null;
    this.sdpOffer = null;
  }

  UserSession.prototype.sendMessage = function(message) {
    this.ws.send(JSON.stringify(message));
  };

  // Represents registrar of users
  function UserRegistry() {
    this.usersById = {};
    this.usersByName = {};
  }

  UserRegistry.prototype.register = function(user) {
    this.usersById[user.id] = user;
    this.usersByName[user.name] = user;
  };

  UserRegistry.prototype.unregister = function(id) {
    var user = this.getById(id);
    if (user) delete this.usersById[id];
    if (user && this.getByName(user.name)) delete this.usersByName[user.name];
  };

  UserRegistry.prototype.getById = function(id) {
    return this.usersById[id];
  };

  UserRegistry.prototype.getByName = function(name) {
    return this.usersByName[name];
  };

  UserRegistry.prototype.removeById = function(id) {
    var userSession = this.usersById[id];
    if (!userSession) return;
    delete this.usersById[id];
    delete this.usersByName[userSession.name];
  };

  // Represents a B2B active call
  function CallMediaPipeline() {
    this.pipeline = null;
    this.webRtcEndpoint = {};
  }

  CallMediaPipeline.prototype.createPipeline = function(
    callerId,
    calleeId,
    ws,
    callback
  ) {
    var self = this;
    getKurentoClient(function(error, kurentoClient) {
      if (error) {
        return callback(error);
      }

      kurentoClient.create("MediaPipeline", function(error, pipeline) {
        if (error) {
          return callback(error);
        }

        pipeline.create("WebRtcEndpoint", function(
          error,
          callerWebRtcEndpoint
        ) {
          if (error) {
            pipeline.release();
            return callback(error);
          }

          if (candidatesQueue[callerId]) {
            while (candidatesQueue[callerId].length) {
              var candidate = candidatesQueue[callerId].shift();
              callerWebRtcEndpoint.addIceCandidate(candidate);
            }
          }

          callerWebRtcEndpoint.on("OnIceCandidate", function(event) {
            var candidate = kurento.getComplexType("IceCandidate")(
              event.candidate
            );
            userRegistry.getById(callerId).ws.send(
              JSON.stringify({
                id: "iceCandidate",
                candidate: candidate
              })
            );
          });

          pipeline.create("WebRtcEndpoint", function(
            error,
            calleeWebRtcEndpoint
          ) {
            if (error) {
              pipeline.release();
              return callback(error);
            }

            if (candidatesQueue[calleeId]) {
              while (candidatesQueue[calleeId].length) {
                var candidate = candidatesQueue[calleeId].shift();
                calleeWebRtcEndpoint.addIceCandidate(candidate);
              }
            }

            calleeWebRtcEndpoint.on("OnIceCandidate", function(event) {
              var candidate = kurento.getComplexType("IceCandidate")(
                event.candidate
              );
              userRegistry.getById(calleeId).ws.send(
                JSON.stringify({
                  id: "iceCandidate",
                  candidate: candidate
                })
              );
            });

            callerWebRtcEndpoint.connect(calleeWebRtcEndpoint, function(error) {
              if (error) {
                pipeline.release();
                return callback(error);
              }

              calleeWebRtcEndpoint.connect(callerWebRtcEndpoint, function(
                error
              ) {
                if (error) {
                  pipeline.release();
                  return callback(error);
                }
              });

              self.pipeline = pipeline;
              self.webRtcEndpoint[callerId] = callerWebRtcEndpoint;
              self.webRtcEndpoint[calleeId] = calleeWebRtcEndpoint;
              callback(null);
            });
          });
        });
      });
    });
  };

  CallMediaPipeline.prototype.generateSdpAnswer = function(
    id,
    sdpOffer,
    callback
  ) {
    this.webRtcEndpoint[id].processOffer(sdpOffer, callback);
    this.webRtcEndpoint[id].gatherCandidates(function(error) {
      if (error) {
        return callback(error);
      }
    });
  };

  CallMediaPipeline.prototype.release = function() {
    if (this.pipeline) this.pipeline.release();
    this.pipeline = null;
  };
  /*
wss.on('connection', function(ws) {
  var sessionId = nextUniqueId();
  console.log('Connection received with sessionId ' + sessionId);

  ws.on('error', function(error) {
      console.log('Connection ' + sessionId + ' error');
      stop(sessionId);
  });

  ws.on('close', function() {
      console.log('Connection ' + sessionId + ' closed');
      stop(sessionId);
      userRegistry.unregister(sessionId);
  });

  ws.on('message', function(_message) {
      var message = JSON.parse(_message);
      console.log('Connection ' + sessionId + ' received message ', message);

      switch (message.id) {
      case 'register':
          register(sessionId, message.name, ws);
          break;

      case 'call':
          call(sessionId, message.to, message.from, message.sdpOffer);
          break;

      case 'incomingCallResponse':
          incomingCallResponse(sessionId, message.from, message.callResponse, message.sdpOffer, ws);
          break;

      case 'stop':
          stop(sessionId);
          break;

      case 'onIceCandidate':
          onIceCandidate(sessionId, message.candidate);
          break;

      default:
          ws.send(JSON.stringify({
              id : 'error',
              message : 'Invalid message ' + message
          }));
          break;
      }

  });
});
*/

  /////
  // Recover kurentoClient for the first time.
  function getKurentoClient(callback) {
    if (kurentoClient !== null) {
      return callback(null, kurentoClient);
    }

    /* kurento(argv.ws_uri, function(error, _kurentoClient) {
      if (error) {
          var message = 'Coult not find media server at address ' + argv.ws_uri;
          return callback(message + ". Exiting with error " + error);
      }

      kurentoClient = _kurentoClient;
      callback(null, kurentoClient);
  });*/
  }

  function stop(sessionId) {
    if (!pipelines[sessionId]) {
      return;
    }

    var pipeline = pipelines[sessionId];
    delete pipelines[sessionId];
    pipeline.release();
    var stopperUser = userRegistry.getById(sessionId);
    var stoppedUser = userRegistry.getByName(stopperUser.peer);
    stopperUser.peer = null;

    if (stoppedUser) {
      stoppedUser.peer = null;
      delete pipelines[stoppedUser.id];
      var message = {
        id: "stopCommunication",
        message: "remote user hanged out"
      };
      stoppedUser.sendMessage(message);
    }

    clearCandidatesQueue(sessionId);
  }

  function incomingCallResponse(calleeId, from, callResponse, calleeSdp, ws) {
    clearCandidatesQueue(calleeId);

    function onError(callerReason, calleeReason) {
      if (pipeline) pipeline.release();
      if (caller) {
        var callerMessage = {
          id: "callResponse",
          response: "rejected"
        };
        if (callerReason) callerMessage.message = callerReason;
        caller.sendMessage(callerMessage);
      }

      var calleeMessage = {
        id: "stopCommunication"
      };
      if (calleeReason) calleeMessage.message = calleeReason;
      callee.sendMessage(calleeMessage);
    }

    var callee = userRegistry.getById(calleeId);
    if (!from || !userRegistry.getByName(from)) {
      return onError(null, "unknown from = " + from);
    }
    var caller = userRegistry.getByName(from);

    if (callResponse === "accept") {
      var pipeline = new CallMediaPipeline();
      pipelines[caller.id] = pipeline;
      pipelines[callee.id] = pipeline;

      pipeline.createPipeline(caller.id, callee.id, ws, function(error) {
        if (error) {
          return onError(error, error);
        }

        pipeline.generateSdpAnswer(caller.id, caller.sdpOffer, function(
          error,
          callerSdpAnswer
        ) {
          if (error) {
            return onError(error, error);
          }

          pipeline.generateSdpAnswer(callee.id, calleeSdp, function(
            error,
            calleeSdpAnswer
          ) {
            if (error) {
              return onError(error, error);
            }

            var message = {
              id: "startCommunication",
              sdpAnswer: calleeSdpAnswer
            };
            callee.sendMessage(message);

            message = {
              id: "callResponse",
              response: "accepted",
              sdpAnswer: callerSdpAnswer
            };
            caller.sendMessage(message);
          });
        });
      });
    } else {
      var decline = {
        id: "callResponse",
        response: "rejected",
        message: "user declined"
      };
      caller.sendMessage(decline);
    }
  }

  function call(callerId, to, from, sdpOffer) {
    clearCandidatesQueue(callerId);

    var caller = userRegistry.getById(callerId);
    var rejectCause = "User " + to + " is not registered";
    if (userRegistry.getByName(to)) {
      var callee = userRegistry.getByName(to);
      caller.sdpOffer = sdpOffer;
      callee.peer = from;
      caller.peer = to;
      var message = {
        id: "incomingCall",
        from: from
      };
      try {
        return callee.sendMessage(message);
      } catch (exception) {
        rejectCause = "Error " + exception;
      }
    }
    var message = {
      id: "callResponse",
      response: "rejected: ",
      message: rejectCause
    };
    caller.sendMessage(message);
  }

  function register(id, name, ws, callback) {
    function onError(error) {
      ws.send(
        JSON.stringify({
          id: "registerResponse",
          response: "rejected ",
          message: error
        })
      );
    }

    if (!name) {
      return onError("empty user name");
    }

    if (userRegistry.getByName(name)) {
      return onError("User " + name + " is already registered");
    }

    userRegistry.register(new UserSession(id, name, ws));
    try {
      ws.send(JSON.stringify({ id: "registerResponse", response: "accepted" }));
    } catch (exception) {
      onError(exception);
    }
  }

  function clearCandidatesQueue(sessionId) {
    if (candidatesQueue[sessionId]) {
      delete candidatesQueue[sessionId];
    }
  }

  function onIceCandidate(sessionId, _candidate) {
    var candidate = kurento.getComplexType("IceCandidate")(_candidate);
    var user = userRegistry.getById(sessionId);

    if (
      pipelines[user.id] &&
      pipelines[user.id].webRtcEndpoint &&
      pipelines[user.id].webRtcEndpoint[user.id]
    ) {
      var webRtcEndpoint = pipelines[user.id].webRtcEndpoint[user.id];
      webRtcEndpoint.addIceCandidate(candidate);
    } else {
      if (!candidatesQueue[user.id]) {
        candidatesQueue[user.id] = [];
      }
      candidatesQueue[sessionId].push(candidate);
    }
  }
};
