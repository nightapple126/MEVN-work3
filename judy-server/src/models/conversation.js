const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var conversationSchema = new Schema({
    person_owner: {
        type: Schema.ObjectId,
        ref: 'Person'
    },
    person_reciver: {
        type: Schema.ObjectId,
        ref: 'Person'
    },
  
  

}, { collection: 'conversation' });

module.exports = mongoose.model('conversation', conversationSchema);