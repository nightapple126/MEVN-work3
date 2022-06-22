const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    finish_date: {
        type: Date,
        required: true
    },
    location: {
        type: Object
    },
    type: {
        type: String
    },
    audience_number: {
        type: Number
    },
    remaining_place: {
        type: Number
    },
    description: {
        type: String
    },
    organizer: {
        type: String
    },
    sponsors: [{
        type: String
    }],
    event_image: {
        type: String
    },
    created_by: {
        type: Schema.ObjectId
    }
});

module.exports = mongoose.model('Event', eventSchema);