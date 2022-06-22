const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    room_number: {
        type: Number
    },
    floor: {
        type: String
    }
}, { collection: 'room' });

module.exports = mongoose.model('Room', roomSchema);