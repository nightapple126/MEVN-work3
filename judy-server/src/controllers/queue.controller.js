const passportJwt = require('passport-jwt');
const ExtractJWT = passportJwt.ExtractJwt;
const jwt = require('jsonwebtoken');
var Queue = require('../models/queue');
var Guest = require('../models/guest');
var Track = require('../models/track');

let controller = {

    getQueue(req, res) {


        jwtFR = ExtractJWT.fromAuthHeaderAsBearerToken();
        if (!jwtFR(req)) {
            return res.send({ message: 'Unauthorized! login first' });
        }
        const user = jwt.verify(jwtFR(req), 'Bearer');

        var userId = user._id;
        Guest.find({ person_id: userId }).then(guest => {
            var g = guest;
            Queue.find({ guest_id: guest[0]._id }).populate('guest_id').populate("tracks").then(data => {
                console.log(g[0]._id);
                if (data.length == 0) {
                    var queue = new Queue({
                        guest_id: g[0]._id,
                        current: 0,
                        paused_at: 0
                    });
                    console.log(queue);
                    queue.save().then(result => {
                        res.json(result);
                    }).catch(error => {
                        console.log(error);
                        res.send(error);
                    });
                }
                else {
                    res.send(data);
                }

            }).catch(err => {
                res.send(err);
                console.log(err);
            })
        }).catch(err => {
            res.json(err);
        })



    },
    addToQueue(req, res) {
        jwtFR = ExtractJWT.fromAuthHeaderAsBearerToken();
        if (!jwtFR(req)) {
            return res.send({ message: 'Unauthorized! login first' });
        }
        const user = jwt.verify(jwtFR(req), 'Bearer');
        var track = new Track(req.body);
        track.save().then(result => {
            var trackId = result._id;
            console.log("Track Saved");
            Guest.find({ person_id: user._id }).then(guest => {
                Queue.updateOne({ guest_id: guest[0]._id }, { $push: { tracks: trackId } }).then(data => {
                    res.json(data);
                    console.log('worked');
                }).catch(error => {
                    res.json(error);
                    console.log('Not Working');
                });
            }).catch(err => res.json(err));
        }).catch(errors => {
            res.json(errors);
        })
     
    },
    removeFromQueue(req,res) {
        jwtFR = ExtractJWT.fromAuthHeaderAsBearerToken();
        if (!jwtFR(req)) {
            return res.send({ message: 'Unauthorized! login first' });
        }
        var Qid = req.query.qid;
        var trackId = req.query.trackid;
        Queue.update({_id : Qid}, { $pull: { tracks:trackId}}).then(data => {
            res.send('Item Removed');
        }).catch(err=>{
            res.json(err);
        });
    },
    SetCurrent(req,res) {
        jwtFR = ExtractJWT.fromAuthHeaderAsBearerToken();
        if (!jwtFR(req)) {
            return res.send({ message: 'Unauthorized! login first' });
        }
        var Qid = req.query.qid;
        var trackindex = req.query.trackindex;
        console.log(trackindex);
        Queue.update({_id:Qid},{current:trackindex}).then(data=>{
            console.log(data);
        }).catch(err=>{
            console.log(err);
        });  
     },
    QueueSettings() {
        //UpdateSettings
    }

}
module.exports = controller;