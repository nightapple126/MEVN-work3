const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var staffSchema = new Schema({
    person_id: {
        type: Schema.ObjectId,
        ref: 'Person'
    },
    role: {
        type: String
    }
}, { collection: 'staff' });

module.exports = mongoose.model('Staff', staffSchema);