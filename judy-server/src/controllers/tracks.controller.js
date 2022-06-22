const passportJwt = require('passport-jwt');
const ExtractJWT = passportJwt.ExtractJwt;
const jwt = require('jsonwebtoken');
var track_repo = require('../services/track.repo');
var Track = require('../models/track');
var fs = require('fs');
var readline = require('readline');

let controller = {
    saveTrack(req, res) {
        Track.find({videoId : req.body.videoId}).then(data => {
            if (data.length == 0){
                console.log("length is 0");
                var track = new Track({
                    videoId : req.body.videoId,
                    title : req.body.title,
                    author : req.body.author,
                    hits : 1
                });
                track.save().then(result => {
                    res.json(result);
                    console.log(result);
                }).catch(err => {
                    res.json(err);
                });
            }else {
                console.log('Exists'); 
                Track.updateOne({videoId:req.body.videoId},{ $inc: { hits: 1 } }).then(updated=>{
                    console.log('Hits added');
                }).catch(errors=>{
                    res.json(errors);
                });
                res.send("Already Exists hit added");
            }
          
        }).catch(error => {
            res.json(error);
        })
    },
    testApi(req, res) {
        fs.readFile('client_secret.json', (err, content) => {
            if (err) {
                console.log('Error loading client secret file: ' + err);
                return;
            }
          //  var r = Math.floor(Math.random()*25)
            // Authorize a client with the loaded credentials, then call the YouTube API.
            //See full code sample for authorize() function code.
            track_repo.authorize(JSON.parse(content), {
                'params': {
                    'part': 'snippet',
                    'maxResults': '25',
                    'videoCategoryId': '10',
                    'q': req.query.q,
                    'type': 'video'
                }
            }, track_repo.searchListByKeyword, (data) => {
                res.json(data);
            });

        });
    }
}
module.exports = controller;

