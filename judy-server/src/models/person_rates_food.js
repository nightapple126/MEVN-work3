const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foodRates = require('./food');

let personRatesFoodSchema = new Schema({
    guest_id: {
        type: Schema.ObjectId,
        required: true
    },
    food_id: {
        type: Schema.ObjectId,
        required: true
    },
    rate: {
        type: Number,
        required: true
    }
});

personRatesFoodSchema.index({ 'guest_id': 1, 'food_id': 1 }, { unique: true });

module.exports = mongoose.model('PersonRatesFood', personRatesFoodSchema);