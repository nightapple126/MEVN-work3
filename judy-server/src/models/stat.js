const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var statSchema = new Schema({

    date: {
        type: Date,
        default: Date.now   
    },
    type: {
        type: String
    }

}, { collection: 'stat' });

module.exports = mongoose.model('Stat', statSchema);