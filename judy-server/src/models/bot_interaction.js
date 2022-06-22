const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var botSchema = new Schema({
    at: {
        type:Date,default:Date.now()
    },
    query: {
        type: String
    },
    matched: {
        type: Boolean
    },
    response:{
        type: String
    },
    person_id: {
        type: Schema.ObjectId,
        ref: 'Person'
    }
}, { collection: 'bot_interaction' });

botSchema.post('save',function(doc){
    console.log("After save");
})

module.exports = mongoose.model('Bot', botSchema);