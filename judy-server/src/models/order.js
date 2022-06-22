const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var request = require("request");
var orderSchema = new Schema({
    food_id: {
        type: Schema.ObjectId,
        ref: 'Food'
    },
    movie_id: {
        type: Schema.ObjectId,
        ref: 'Movie'
    },
    price: {
        type: Number
    },
    order_date: {
        type: Date, default: Date.now()
    },
    guest_id: {
        type: Schema.ObjectId,
        ref: 'Guest'
    },
    placed_at: {
        type: Date, default: Date.now()
    },
    status: {
        type: String, enum: ['PENDING', 'COMPLETED'], default: "PENDING"
    },
    room_id: {
        type: Schema.ObjectId,
        ref: 'Room'
    }
}, { collection: 'order' });


orderSchema.post("save", function (doc) {
    if (doc.movie_id !== undefined) {
        return;
    }
    var url = "https://chart.googleapis.com/chart?cht=qr&chl=" + doc._id + "&choe=UTF-8&chs=150x150";
    var fs = require('fs'),
        request = require('request');
    var path = (__dirname+"../../../public/uploads/restaurant/qr/");
    var download = function (uri, filename, callback) {
        request.head(uri, function (err, res, body) {
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    };

    download(url, path+doc._id+'.png', function () {
        console.log('done');
    });

})

module.exports = mongoose.model('Order', orderSchema);

