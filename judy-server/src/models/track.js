const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bot_controller = require ("../controllers/bot_interaction.controller")
var trackSchema = new Schema({
    title: {
        type: String
    },
    videoId: {
        type: String
    },
    author: {
        type: String
    },
    genres: {
        type: [String]
    },
    hits: {
        type: Number
    }
}, { collection: 'track' });

module.exports = mongoose.model('Track', trackSchema);

trackSchema.post("save",function(doc){
    bot_controller.addEntity("86af170e-b856-49e0-a3f6-934a49110a85",doc.title);
});