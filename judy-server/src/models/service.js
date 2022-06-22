const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let serviceSchema = new Schema({
    name: {
        type: String
    }
});

module.exports = mongoose.model('Service', serviceSchema);