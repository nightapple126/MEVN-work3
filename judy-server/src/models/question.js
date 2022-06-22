const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var questionSchema = new Schema({
    content: {
        type: String
    },
    reverse_scale:{
        type: {
            o: Number,
            c: Number,
            e: Number,
            a: Number,
            n: Number,
        }
    },
    openess: {
        type: Number
    },
    conscientiousness: {
        type: Number
    },
    extravesion: {
        type: Number
    },
    agreeableness: {
        type: Number
    },
    neuroticism: {
        type: Number
    }
}, { collection: 'question' });

module.exports = mongoose.model('Question', questionSchema);