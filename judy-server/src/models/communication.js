const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var communicationSchema = new Schema({
    persons: {
        type: Array[Schema.ObjectId]
    },
    duration: {
        type: Number
    },
    rating: {
        type: Number
    }
}, { collection: 'communication' });

module.exports = mongoose.model('Communication', communicationSchema);
