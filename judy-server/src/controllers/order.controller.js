

const passportJwt = require('passport-jwt');
const ExtractJWT = passportJwt.ExtractJwt;
const jwt = require('jsonwebtoken');
var Order = require('../models/order');
var Guest = require('../models/guest');
var Movie = require('../models/movie');
var Food = require('../models/food');
let controller = {
    addOrder(req, res) {
        jwtFR = ExtractJWT.fromAuthHeaderAsBearerToken();
        if (!jwtFR(req)) {
            return res.send({ message: 'Unauthorized! login first' });
        }
        const user = jwt.verify(jwtFR(req), 'Bearer');
        var order = req.body;


        var order = new Order(order);
        Guest.find({ person_id: user._id }).then(guest => {

            if (guest.length == 0) {
                res.status(401);
                res.send("Guest not registered");
            }
            if ((Date.now() < guest[0].checkin) || (Date.now() > guest[0].checkout)) {
                res.send("Guest has not checked in, or has already checked out !");
            }
            else {
                order.guest = guest[0];
                order.room_id = guest[0].room_id;
                if (order.food_id !== undefined) {
                    Food.findById(order.food_id).then(food => {
                        order.price = food.price;
                        order.save().then(data => {
                            res.json(data);
                        }).catch(err => {
                            res.json(err);
                        })
                    }).catch(err => {
                        res.json(err);
                    })
                }
                else if (order.movie_id !== undefined) {
                    order.status = "COMPLETED";
                    Movie.findById(order.movie_id).then(movie => {
                        order.price = movie.price;
                        order.save().then(data => {
                            res.json(data);
                        }).catch(err => {
                            res.json(err);
                        })
                    }).catch(err => {
                        res.json(err);
                    })
                }

            }
        }).catch(err => {
            res.json(err);
        })

    },
    getOrders(req, res) {
        jwtFR = ExtractJWT.fromAuthHeaderAsBearerToken();
        if (!jwtFR(req)) {
            return res.send({ message: 'Unauthorized! login first' });
        }
        const user = jwt.verify(jwtFR(req), 'Bearer');
        Guest.find({ person_id: user._id }).then(guest => {
            if (guest.length == 0) {
                res.status(401);
                res.send("Guest not registered");
            }
            Order.find({ room_id: guest[0].room_id, $and: [{ placed_at: { "$gt": guest[0].checkin } }, { placed_at: { "$lt": guest[0].checkout } }] })
            .sort({placed_at: -1})
            .populate('movie_id')
            .populate('food_id')
            .then(orders => {
                res.json(orders);
            }).catch(err => {
                res.json(err)
            })
        }).catch(err => {
            res.json(err);
        });


    },
    confirm_order(req,res){
        console.log("Confirming");
        Order.findByIdAndUpdate(req.params.id,{status:"COMPLETED"}).then(s=>{ if (s==null) { res.status(500); res.send("Error")} res.send("Updated")}).catch(err=>{res.json(err)});
    }
}



module.exports = controller;