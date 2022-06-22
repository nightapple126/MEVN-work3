const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var guestSchema = new Schema({
    person_id: {
        type: Schema.ObjectId,
        ref: 'Person'
    },
    room_mates: [Schema.ObjectId],
    room_id: {
        type: Schema.ObjectId,
        ref: 'Room'
    },
    checkin: {
        type: Date
    },
    checkout: {
        type: Date
    }
}, { collection: 'guest' });

module.exports = mongoose.model('Guest', guestSchema);