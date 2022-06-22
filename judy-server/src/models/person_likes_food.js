const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Food = require('./food');

let personLikesFoodSchema = new Schema({
    guest_id: {
        type: Schema.ObjectId,
        required: true
    },
    food_id: {
        type: Schema.ObjectId,
        required: true
    }
});

personLikesFoodSchema.index({ 'guest_id': 1, 'food_id': 1 }, { unique: true });
personLikesFoodSchema.post('insertMany', (doc) => {
    Food
    .updateOne({ _id: doc[0].food_id }, { $inc: { 'likes': 1 } })
    .then(data => {
        console.log(data);
    });
});
personLikesFoodSchema.post('remove', (doc) => {
    console.log(doc[0]);
   
});

module.exports = mongoose.model('PersonLikesFood', personLikesFoodSchema);