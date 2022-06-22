const Event = require('../models/event');
const uploader = require('../utils/upload');
const Person = require('../models/person');

let controller = {
    newEvent(req, res) {
        let event = req.body;
        console.log(event);
        Event.insertMany(event)
        .then(data => {
            return res.send({ message: 'Event added successfully !' });
        })
        .catch(err => {
            return res.status(500).send({ message: 'Error while adding new Event' + err });
        });
    },
    upload(req, res) {
        uploader.upload(req.files.event_photo, 'public/uploads/event/', function(err, filename) {
            if (err) console.log(err);
            res.send({ filename: filename });
        });
    },
    getAll(req, res) {
        Event.find({ start_date: { "$gte": new Date()  } })
        .then(events => {
            res.send({ events: events });
        })
        .catch(err => {
            res.status(500).send({ message: 'Oops error in our server!!' + err });
        });
    },
    getOneEvent(req, res) {
        const id = req.params.id;
        Event.find({ _id: id })
        .then(event => {
            res.send({ event: event });
        })
        .catch(err => {
            res.status(500).send({ message: 'Oops! an error has been occured!' + err });
        });
    },
    updateEvent(req, res) {
        const id = req.params.id;
        Event.findByIdAndUpdate(id, req.body)
        .then(data => {
            return res.send({ message: data });
        })
        .catch(err => {
            return res.status(500).send({ message: 'Oops! Error occured!!' });
        });
    },
    deleteEvent(req, res) {
        const id = req.params.id
        Event.findByIdAndRemove(id)
        .then(data => {
            return res.send({ message: 'Event deleted !' });
        })
        .catch(err => {
            return res.status(500).send({ message: 'Error has been occured! ' });
        });
    },
    participate(req, res) {
        const event = req.body;
        const user = req.user;
        Event.findById(event._id)
        .then(ev => {
            Person.findByIdAndUpdate(user._id, {'$addToSet': { participations: ev._id }})
            .then(data => {
                console.log(data);
                ev.remaining_place = ev.remaining_place --;
                res.send({ message: 'Participation is added to your list' });
            })
            .catch(err => {
                console.log(err);
                res.stauts(500).send({ message: 'Error while participating' });
            });
        })
        .catch(err => {
            console.log(err);
            res.stauts(500).send({ message: 'No event with this ID!' });
        });
    },
    unparticipate(req, res) {
        const event = req.body;
        const user = req.user;
        Event.findById(event._id)
        .then(ev => {
            Person.findByIdAndUpdate(user._id, {'$pull': { participations: ev._id }})
            .then(data => {
                console.log(data);
                ev.remaining_place = ev.remaining_place ++;
                res.send({ message: 'Participation is added to your list' });
            })
            .catch(err => {
                console.log(err);
                res.stauts(500).send({ message: 'Error while participating' });
            });
        })
        .catch(err => {
            console.log(err);
            res.stauts(500).send({ message: 'No event with this ID!' });
        });
    },
    interrested(req, res) {
        const event = req.body;
        const user = req.user;
        Event.findById(event._id)
          .then(ev => {
            Person.findByIdAndUpdate(user._id, {
              '$addToSet': { whishlist: ev._id }
            })
              .then(data => {
                console.log(data);
                res.send({
                  message: "event is added to your wishlist"
                });
              })
              .catch(err => {
                console.log(err);
                res
                  .stauts(500)
                  .send({ message: "Error while participating" });
              });
          })
          .catch(err => {
            console.log(err);
            res.stauts(500).send({ message: "No event with this ID!" });
          });
    },
    uninterrested(req, res) {
        const event = req.body;
        const user = req.user;
        Event.findById(event._id)
          .then(ev => {
            Person.findByIdAndUpdate(user._id, {
              '$pull': { whishlist: ev._id }
            })
              .then(data => {
                console.log(data);
                res.send({
                  message: "whishlist is pullled to your list"
                });
              })
              .catch(err => {
                console.log(err);
                res
                  .stauts(500)
                  .send({ message: "Error while participating" });
              });
          })
          .catch(err => {
            console.log(err);
            res.stauts(500).send({ message: "No event with this ID!" });
          });
    }
};

module.exports = controller;