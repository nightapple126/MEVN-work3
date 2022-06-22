const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bot_controller = require("../controllers/bot_interaction.controller");

const repo = require('../services/food.repo');

const foodSchema = new Schema({
    label: {
        type: String,
        unique: true
    },
    price: {
        type: Number
    },
    origin: {
        type: String
    },
    taste: {
        type: String
    },
    likes: {
        type: Number,
        default: 0
    },
    basic_ingredient: {
        type: Array()
    },
    is_halal: {
        type: Boolean
    },
    rate: {
        type: Number,
        default: 0
    },
    plate_photo: {
        type: String
    }
}, { collection: 'food' });

foodSchema.statics = repo;

foodSchema.post('insertMany',function(doc){
    bot_controller.addEntity("657b278e-c818-4502-b9ae-2ecc014fe683",doc[0].label);
});

module.exports = mongoose.model('Food', foodSchema);

