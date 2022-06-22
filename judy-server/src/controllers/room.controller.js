var Room = require('../models/room');
var Guest = require('../models/guest');

let controller = {
    addRoom(req, res) {
        var room = new Room(req.body);
        room.save().then(r => {
            res.json(r);
        }).catch(err => {
            res.sendStatus(500);
        })
    },
    getAllRooms(req, res) {
        Room.find({}).then(rooms => {
            res.json(rooms)
        }).catch(err => {
            res.sendStatus(500)
        })
    },
    getFreeRooms(req, res) {
        var from = (req.body.from);
        var to = req.body.to;
        Guest.find({
            $or: [
                { $and: [{ checkin: { $lt: to }, checkin: { $gt: from }, checkout: { $gt: to } }] },
                { $and: [{ checkin: { $lt: from }, checkout: { $gt: from }, checkout: { $lt: to } }] },
                { $and: [{ checkin: { $lt: from }, checkout: { $gt: to } }] }
            ]
        }).populate('room_id').then((data => {
            var taken_rooms = [];
            data.forEach(element => {
                taken_rooms.push(""+element.room_id._id);
            });

            Room.find({}).then(rooms => {
                var tmp = [];
                rooms.forEach(el=>{tmp.push(""+el._id)});
                console.log(tmp);
                console.log(taken_rooms);
                Array.prototype.diff = function (a) {
                    return this.filter(function (i) {
                        return a.indexOf(i) == -1;
                    })
                }
                Room.find({"_id":{$in:tmp.diff(taken_rooms)}}).then(av=>{
                    res.json(av);
                },err=>{
                    res.status(500);
                    res.json(err);
                })
                
            }).catch(err => {
                res.json(err);
            })
        })).catch(err => {
            console.log(err);
            res.json(err);
        })
    },
    deleteRoom: function(req,res){
        Room.remove({_id:req.params.id}).then(d=>{
            res.sendStatus(200);
        }).catch(err=>{
            res.sendStatus(500)
        })
    }
};

module.exports = controller;