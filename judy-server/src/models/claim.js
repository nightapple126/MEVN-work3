const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var claimSchema = new Schema({
    subject: {
        type: String
    },
    content: {
        type: String
    },
    sent_at: {
        type: Date
    },
    treated_by: {
        type: Schema.ObjectId,
        ref: 'Staff'
    },
    sent_by: {
        type: Schema.ObjectId, 
        ref: 'Guest'
    }
}, { collection: 'claim' });

module.exports = mongoose.model('Claim', claimSchema);