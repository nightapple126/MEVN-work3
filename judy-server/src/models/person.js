const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

var personSchema = new Schema({
    fullname: {
        type: String
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String
    },
    birthdate: {
        type: Date
    },
    password: {
        type: String
    },
    role: {
        type: String
    },
    profession: {
        type: String
    },
    question: [{
        type: Schema.ObjectId,
        ref: 'Question'
    }],
    personality: {
        type: {
            openess: Number,
            conscientiousness: Number,
            extravesion: Number,
            agreeableness: Number,
            neuroticism: Number
        }
    },
    feedback: [{
        rate: Number,
        service: {
            _id: Schema.ObjectId,
            name: String
        },
        message: String
    }],
    picture : {
        type:String,
        default:"user.png"
    },
    participations: [
        {
            type: Schema.ObjectId,
            ref: 'Event'
        }
    ],
    whishlist: [
        {
            type: Schema.ObjectId,
            ref: 'Event'
        }
    ]
}, { collection: 'person' });

personSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Person', personSchema);