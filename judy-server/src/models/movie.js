const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var movieSchema = new Schema({
    price:{
        type:Number
    },
    thumbnail:{
        type:String
    },
    title: {
        type: String
    },
    dash_manifest: {
        type: String
    },
    hits: {
        type: Number
    },
    genres: {
        type: [String]
    }
}, { collection: 'movie' });

module.exports = mongoose.model('Movie', movieSchema);