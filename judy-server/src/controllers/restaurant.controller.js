const uuid = require("uuid/v1");

const Food = require("../models/food");
const PersoneLikesFood = require('../models/person_likes_food');
const PersonRatesFood = require('../models/person_rates_food');
const removeService = require("../utils/removeFile");
const Person = require('../models/person');

let controller = {
  addPlate(req, res) {
    const data = req.body;
    console.log(data);
    Food.insertMany(data)
      .then(data => {
        res.send({ message: "Plate added!!" });
      })
      .catch(err => {
        console.log(err);
        res.status(500).send({ message: "something went wrong!!!!" });
      });
  },
  getPlate(req, res) {
    res.send({ message: "Many plates!!" });
  },
  uploadPlate(req, res) {
    if (!req.files)
      return res.status(400).send({ message: "No file to upload!" });
    let platePhoto = req.files.plate_photo;
    const filename =
      uuid() +
      "." +
      platePhoto.mimetype.substr(platePhoto.mimetype.indexOf("/") + 1);
    platePhoto.mv(
      __dirname + "/../../public/uploads/restaurant/plates/" + filename,
      err => {
        if (err)
          return res
            .status(500)
            .send({ message: "erreur while uploading" + err });
        res.send({ filename: filename });
      }
    );
  },
  getPlateById(req, res) {
    const id = req.params.id;
    Food.findById(id)
      .then(data => {
        res.send({ plate: data });
      })
      .catch(err => {
        console.log("something went wrong!!" + err);
        res.status(500).send({ message: "Somthing went wrong!!!" });
      });
  },
  updatePlate(req, res) {
    const data = req.body;
    const id = req.params.id;
    Food.findById(id)
      .then(plate => {
        if (
          data.plate_photo != plate.plate_photo &&
          data.plate_photo != "" &&
          plate.plate_photo != ""
        ) {
          removeService.removePlateImage(plate.plate_photo);
        }
        console.log(plate);
        Food.update({ _id: id }, data, (err, data) => {
          if (err)
            return res
              .status(500)
              .send({ message: "something went wrong " + err });
          return res.send({ message: "Plate modified!" });
        });
      })
      .catch(err => {
        console.log("something went wrong!!" + err);
      });
  },
  getAllPlate(req, res) {
    Food.find()
    .then(plates => {
      res.send({ plates: plates });
    })
    .catch(err => {
      res.status(500).send({ message: 'Something went wrong' });
    })
    ;
  },
  deletePlate(req, res) {
    const id = req.params.id;
    Food.deleteOne({ _id: id }, (err) => {
      if(err) res.status(500).send({ message: 'Something went wrong' });
      res.send({ message: 'Plate deleted successfully' });
    });
  },
  likePlate(req, res) {
    const plate = req.body.plate;
    const user = req.body.user;
    
    Food.findById(plate._id)
    .then(data => {
      Person.findById(user._id)
      .then(person => {
        PersoneLikesFood.insertMany({ food_id: data._id, guest_id: person._id })
        .then(result => {
          res.send({ message: 'done' });
        })
        .catch(err => {
          res.status(500).send({ message: 'something went wrong err: ' + err });
        });
      })
      .catch(err => {
        res.status(401).send({ message: 'User not found !!' });
      });
    })
    .catch(err => {
      res.status(401).send({ message: 'plate not found!!' });
    });
  },
  doUserLikesPlate(req, res) {
    plateId = req.query.plateId;
    userId = req.query.userId;

    //console.log(plateId);
    //console.log(userId);

    PersoneLikesFood
    .findOne({ guest_id: userId, food_id: plateId })
    .then(data => {
      if(data) return res.send({message: 'done!!'});
      console.log('this is some data: ' + data);
      res.status(301).send({message: 'no like'});
    })
    .catch(err => {
      res.status(500).send({ message: 'something went wrong err:' + err });
    });
  },
  getByLabel(req, res) {
    let query = req.query.label;
    
    Food
    .find()
    .where('label')
    .regex(new RegExp('' + query + '', 'i'))
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({ message: 'something went wrong!!' + err });
    });
  },
  unlikePlate(req, res) {
    const plate = req.body.plate;
    const user = req.body.user;
    
    Food.findById(plate._id)
    .then(data => {
      Person.findById(user._id)
      .then(person => {
        PersoneLikesFood.remove({ food_id: data._id, guest_id: person._id })
        .then(result => {
          Food
          .updateOne({ _id: plate._id  }, { $inc: { 'likes': -1 } })
          .then(data => {
              console.log(data);
          });
          res.send({ message: 'done' });
        })
        .catch(err => {
          res.status(500).send({ message: 'something went wrong err: ' + err });
        });
      })
      .catch(err => {
        res.status(401).send({ message: 'User not found !!' });
      });
    })
    .catch(err => {
      res.status(401).send({ message: 'plate not found!!' });
    });
  },
  ratePlate(req, res) {
    const plate = req.body.plate;
    const user = req.body.user;
    const rate = req.body.rate;

    Food.findById(plate._id)
    .then(data => {
      Person.findById(user._id)
      .then(person => {
        PersonRatesFood.findOneAndUpdate({food_id: data._id, guest_id: person._id}, { food_id: data._id, guest_id: person._id, rate: rate }, {upsert: true})
        .then(result => {
          Food.getRatesAvg(data._id);
          res.send({ message: 'done' });
        })
        .catch(err => {
          res.status(500).send({ message: 'something went wrong err: ' + err });
        });
      })
      .catch(err => {
        res.status(401).send({ message: 'User not found !!' + err });
      });
    })
    .catch(err => {
      res.status(401).send({ message: 'plate not found!!' });
    });
  },
  getRateUser(req, res) {
    plateId = req.query.plateId;
    userId = req.query.userId;

    //console.log(plateId);
    //console.log(userId);

    PersonRatesFood
    .findOne({ guest_id: userId, food_id: plateId })
    .then(data => {
      if(data) return res.send({rate: data.rate});
      console.log('this is some data: ' + data);
      res.status(301).send({message: 'no rate'});
    })
    .catch(err => {
      res.status(500).send({ message: 'something went wrong err:' + err });
    });
  }
};

module.exports = controller;
