const User = require('../models/person');
const Guest = require('../models/guest');
const passport = require('passport');
const jwt = require('jsonwebtoken');
var config = require('../../config/config.json');
var Kairos = require('kairos-api');
var Kairosclient = new Kairos(config.KAIROS_CREDENTIALS.APP_ID, config.KAIROS_CREDENTIALS.KEY);
const passportJwt = require('passport-jwt');
const ExtractJWT = passportJwt.ExtractJwt;
const uuid = require("uuid/v1");

let controller = {
    register(req, res) {
        var password = req.body.password;
        var user = req.body;
        delete user.password;
        User.register(new User(user), password)
            .then(data => {
                console.log('Registration success');
                passport.authenticate('local')(req, res, function () {
                    res.send({ message: 'redirect to login' });
                });
            })
            .catch(err => {
                console.log(err);
                res.status(400).send({ message: `Error while registring new user: ${err}` });
            })
            ;
    },
    login(req, res) {
        passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err || !user) return res.status(500).json({ message: 'Something went wrong!' + err, user: user });
            req.login(user, { session: false }, (err) => {
                if (err) return res.status(500).json({ message: err });
                const token = jwt.sign(user.toJSON(), 'Bearer', {
                    expiresIn: 604800
                });
                return res.json({ user, token });
            });
        })(req, res);
    },
    enroll(req, res) {

        var photo;
        var base64 = false;
        if (req.files !== undefined) {
            photo = (req.files.photo.data.toString("base64"));
        }
        else {
            base64 = true;
            photo = req.body.photo;
        }

        jwtFR = ExtractJWT.fromAuthHeaderAsBearerToken();
        if (!jwtFR(req)) {
            return res.send({ message: 'Unauthorized! login first' });
        }
        const user = jwt.verify(jwtFR(req), 'Bearer');
        var params = {
            image: photo,
            subject_id: user.username,
            gallery_name: 'judy_smartbutler_users',
            selector: 'SETPOSE'
        };
        var imageName = "";
        console.log(base64 == true)
        if (base64 == true) {
            imageName = uuid() + ".jpg";
            console.log(imageName);
            var base64Data = photo.replace(/^data:image\/jpeg;base64,/, "");
            console.log(base64Data);
            require("fs").writeFile(__dirname + "/../../public/uploads/user/" + imageName, base64Data, 'base64', function (err) {
                if (err == null) {
                    User.findByIdAndUpdate(user._id, { picture: imageName }).then(data => {
                        console.log(data);
                        Kairosclient.enroll(params)
                            .then(function (result) { res.json(imageName); })
                            .catch(function (err) { res.json(err); });
                    }).catch(err => {
                        res.json(err);
                    })
                }
            })
        }
        else {
            imageName = uuid() + "." + req.files.photo.mimetype.split("/")[1];
            req.files.photo.mv(__dirname + "/../../public/uploads/user/" + imageName);
            User.findByIdAndUpdate(user._id, { picture: imageName }).then(data => {
                console.log(data);
                Kairosclient.enroll(params)
                    .then(function (result) { res.json(imageName); })
                    .catch(function (err) { res.json(err); });
            }).catch(err => {
                res.json(err);
            })
        }



    },
    facialLogin(req, res) {
        if (req.files !== undefined)
            photo = (req.files.photo.data.toString("base64"));
        else
            photo = req.body.photo;


        var params = {
            image: photo,
            gallery_name: 'judy_smartbutler_users'
        }


        Kairosclient.recognize(params).then(results => {
            if (results.body.images === undefined) {
                res.status(401);
                res.send("No face detected");
            }
            else if (results.body.images[0].candidates === undefined) {
                res.status(401);
                res.send("Not recognized");
            }
            else {
                var username = results.body.images[0].candidates[0].subject_id;
                User.findOne({ username: username }).then(data => {
                    if (data != null) {
                        const token = jwt.sign(data.toJSON(), 'Bearer', {
                            expiresIn: 604800
                        });
                        res.json({ user: data, token });
                    }
                    else {
                        res.status(400);
                        res.send("Invalid")
                    }
                }).catch(err => {
                    res.sendStatus(500);
                    console.log(err);
                })
            }

        }).catch(err => {
            console.log(err);
            res.send(err);
        })
    },
    recognize(req, res) {
        jwtFR = ExtractJWT.fromAuthHeaderAsBearerToken();
        if (!jwtFR(req)) {
            return res.send({ message: 'Unauthorized! login first' });
        }
        const user = jwt.verify(jwtFR(req), 'Bearer');
        var photo;

        if (req.files !== undefined)
            photo = (req.files.photo.data.toString("base64"));
        else
            photo = req.body.photo;


        var params = {
            image: photo,
            gallery_name: 'judy_smartbutler_users'
        }


        Kairosclient.recognize(params).then(results => {

            if (results.body.Errors === undefined) {
                if (results.body.images[0].candidates === undefined) {
                    res.sendStatus(401);
                }

                res.sendStatus(results.body.images[0].candidates.filter(el => el.subject_id == user.username).length != 0 ? 200 : 401);
            }
            else
                res.sendStatus(401);
        }).catch(err => {
            res.json(err);
        })
    },
    checkin: function (req, res) {
        var data = req.body;
        var mainGuest = data[0];
        data.splice(0, 1);
        console.log(mainGuest);
        console.log(data);
        User.insertMany(data).then(all => {
            for (var i = 0 ; i < data.length;i++){
                data[i].person_id= all[i]._id;
            }
            
            Guest.insertMany(data).then(guests => {
                mainGuest.room_mates = [];
                guests.forEach(g => {
                    mainGuest.room_mates.push(g._id);
                })
                var password = mainGuest.password;
                delete mainGuest["password"];
                User.register(mainGuest, password).then(l => {
                    mainGuest.person_id = l._id;
                    var ma = new Guest(mainGuest);

                    ma.save().then(result => {
                        res.json(ma);
                    }).catch(err => {
                        res.json(err);
                    })
                }).catch(err => {
                    console.log(err);
                })

            });
        })

    }
};

module.exports = controller;