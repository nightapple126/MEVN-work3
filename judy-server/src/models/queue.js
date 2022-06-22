const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var queueSchema = new Schema({
    tracks: [{
        type: Schema.ObjectId,
        ref:"Track"
    }],
    current: Number,
    paused_at: Number,
    guest_id: {
        type: Schema.ObjectId,
        ref: "Guest"
    }
}, { collection: 'queue' });

module.exports = mongoose.model('Queue', queueSchema);