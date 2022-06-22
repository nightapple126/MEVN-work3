
const passportJwt = require('passport-jwt');
const ExtractJWT = passportJwt.ExtractJwt;
const jwt = require('jsonwebtoken');
var apiai = require('apiai');

var TextToSpeech = require("../controllers/texttospeech.controller");
var BotInteraction = require('../models/bot_interaction');
var places = require('../../config/places.json');
let controller = {
    getInteractions(req, res) {
        if (req.query.user == undefined)
            BotInteraction.find({}).then(results => {
                res.json(results);
            }).catch(err => res.send(err));
        else
            BotInteraction.find({ person_id: req.query.user }).then(results => {
                res.json(results);
            }).catch(err => res.send(err));
    },
    addInteraction(req, res) {
        var interaction = new BotInteraction(req.body);
        interaction.save().then(result => {
            res.json({ message: "success", result: result });
        }).catch(err => {
            res.json(err);
        })
    },
    query(req, res) {

        jwtFR = ExtractJWT.fromAuthHeaderAsBearerToken();
        if (!jwtFR(req)) {
            return res.send({ message: 'Unauthorized! login first' });
        }
        const user = jwt.verify(jwtFR(req), 'Bearer');

        var app = apiai("04675c8d7afa4dbaacbec94914645029");

        var options = {
            sessionId: user._id
        };


        var request = app.textRequest(req.body.query, options);

        request.on('response', function (response) {
            var resolved = !(response.result.action == "input.unknown");
            var interaction = new BotInteraction({
                query: req.body.query,
                matched: resolved,
                response: response.result.fulfillment.speech,
                person_id: user._id
            });
            interaction.save().then(() => {

                TextToSpeech.synthesize(response.result.fulfillment.speech).then(filename => {
                    res.json({
                        response: response.result.fulfillment.speech,
                        intent: response.result.metadata.intentName,
                        params: response.result.parameters,
                        audio: filename
                    });
                }).catch(err => {
                    res.json({
                        response: response.result.fulfillment.speech,
                        intent: response.result.metadata.intentName,
                        params: response.result.parameters,
                        audio: undefined
                    });
                })

            });
        });

        request.on('error', function (error) {
            res.json(error);
        });

        request.end();
    },
    getStats(req, res) {
        BotInteraction.aggregate([{ "$project": { "words": { $split: ["$query", " "] }, "_id": false } }]).then(data => {
            var words = new Set();
            var all = [];
            data.forEach(element => {
                element.words.forEach(word => {
                    words.add(word);
                    all.push(word);
                })
            })
            console.log(words);
            var results = [];
            words.forEach((word) => {
                results.push({
                    word: word,
                    count: all.filter(a => a == word).length
                })
            })
            res.json(results.sort((a, b) => {
                return b.count - a.count
            }));

        }).catch(err => {
            res.json(err);
        })
    },
    addEntity: addEntity,
    destroyAudio(req, res) {
        var filename = req.body.filename;
        TextToSpeech.destroy(filename).then(() => {
            res.send("Okay");
            console.log("audio destroyed");
        }).catch(err => {
            res.json(err);
        });
    },
    trainplaces(req, res) {
        places.places.forEach((elem) => {
            addEntity("6b7625d8-6521-4755-802d-74e6e7130c5a", elem);
        })
        res.send("kdsq");
    }
};

function addEntity(id, value) {

    var request = require("request");
    var synonyms;
    if (id == "6b7625d8-6521-4755-802d-74e6e7130c5a") {
        synonyms = value.split("_");
        synonyms.push(value.replace("_", " "));
    }
    else {
        synonyms = value.split(' ');
        synonyms.push(value);
    }
    
    var data = [
        {
            "synonyms": synonyms,
            "value": value
        }
    ]
    request({
        url: "https://api.dialogflow.com/v1/entities/" + id + "/entries",
        headers: {
            "Authorization": "Bearer " + "9ae2f5a3a0ee497893b252c328fa5880",
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(data)

    }, function (error, response, body) {
        console.log(error);
    })

}
module.exports = controller;
