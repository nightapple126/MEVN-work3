const Person = require("../models/person");
var Stat = require("../models/stat");

let controller = {
  addStatistique(req, res) {
    const st = req.body.type;
    var stat = new Stat({
      type: st
    });
    stat
      .save()
      .then(result => {})
      .catch(err => {});
    res.status(200).send({ message: " record data" });
  },
  getStatistique(req, res) {
    list = [];
 food = 0 ; 
 bot = 0 ; 
 event = 0 ; 
 music = 0 ; 
    Stat.find({ type: "food" })
      .then(result => {
      food=  result.length ;
      })
      .catch(err => {
        res.status(500).send({ message: "Oops error in our server!!" + err });
      });
    Stat.find({ type: "bot" })
      .then(result => {
        bot= result.length;
      })
      .catch(err => {
        res.status(500).send({ message: "Oops error in our server!!" + err });
      });
    Stat.find({ type: "event" })
      .then(result => {
        event= result.length ;
        
      })
      .catch(err => {
        res.status(500).send({ message: "Oops error in our server!!" + err });
      });

      Stat.find({ type: "music" })
      .then(result => {
          
      music=result.length;

      list.push({food : food , bot : bot , event : event  , music : music })
         res.status(200).send(list);
      }).catch(err => {
          res.status(500).send({ message: 'Oops error in our server!!' + err });
      });


  
  }
};

module.exports = controller;
