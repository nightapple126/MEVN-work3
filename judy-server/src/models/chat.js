const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var chatSchema = new Schema({
    person_sender: {
        type: Schema.ObjectId,
        ref: 'Person'
    },
    person_reciver: {
        type: Schema.ObjectId,
        ref: 'Person'
    },
    date: {
        type: Date,
        default: Date.now   
    },
    message: {
        type: String
    }

}, { collection: 'chat' });

module.exports = mongoose.model('Chat', chatSchema);