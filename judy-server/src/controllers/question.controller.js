const passportJwt = require('passport-jwt');
const ExtractJWT = passportJwt.ExtractJwt;
const jwt = require('jsonwebtoken');
var Question = require('../models/question');
var User = require('../models/person');
let controller = {
    addQuestions(req,res) {
     
            Question.insertMany(req.body).then(data => {
                res.send(data);
                console.log(data);
            }).catch(err => {
                res.send(err);
            });


    },
    GetQuestions(req,res) {
        jwtFR = ExtractJWT.fromAuthHeaderAsBearerToken();
        if (!jwtFR(req)) {
            return res.send({ message: 'Unauthorized! login first' });
        }
        var unanswered=[];
        var unanswered_id = [];
        const user = jwt.verify(jwtFR(req), 'Bearer');
        User.findById(user._id).then(result => {
            console.log("user Found")
            Question.find().then(data =>{
                console.log("Question Found");
                        if( typeof result.question !== undefined && result.question.length > 0  ){
                            ///jdid
                            data.forEach(element => {
                                unanswered_id.push(element._id);
                            });
                            Array.prototype.diff = function (a) {
                                return this.filter(function (i) {
                                    return a.indexOf(i) === -1;
                                });
                            };
                            console.log(unanswered_id.diff(result.question));
                            Question.find({'_id': { $in: unanswered_id.diff(result.question)}}).then(d => {
                                console.log(d);
                               return res.send(d);
                            }).catch(err=>{
                                console.log("Error retrieving data");
                            }) ;

                        }
                        else {
                           return res.send(data);
                        }
                      
                  
            }).catch( err => {
                return res.json(err);
            });
        }).catch(error=>{
           return res.json(error);
        });
       
    },
    respondToQuestions(req, res) {
        jwtFR = ExtractJWT.fromAuthHeaderAsBearerToken();
        if (!jwtFR(req)) {
            return res.send({ message: 'Unauthorized! login first' });
        }
        const user = jwt.verify(jwtFR(req), 'Bearer');
        var qid = req.body.question_id;
        Question.findById(qid).then(data => {
            var openness_d = data.openess;
            var conscientiousness_d = data.conscientiousness;
            var extravesion_d = data.extravesion;
            var agreeableness_d = data.agreeableness;
            var neuroticism_d = data.neuroticism;
            var reverse_d = data.reverse_scale;
            User.findById(user._id).then(result => {
                console.log(result.personality);
                if(result.personality !== undefined){
                   
                    var ipiv_question_score = {
                        openess: openness_d*reverse_d.o*req.body.rate + result.personality.openess,
                        conscientiousness: conscientiousness_d*reverse_d.c*req.body.rate + result.personality.conscientiousness,
                        extravesion: extravesion_d*reverse_d.e*req.body.rate + result.personality.extravesion,
                        agreeableness: agreeableness_d*reverse_d.a*req.body.rate + result.personality.agreeableness,
                        neuroticism: neuroticism_d*reverse_d.n*req.body.rate + result.personality.neuroticism
                    };
                    
                  
    
                }else{
                    var ipiv_question_score = {
                        openess: openness_d*reverse_d.o*req.body.rate ,
                        conscientiousness: conscientiousness_d*reverse_d.c*req.body.rate ,
                        extravesion: extravesion_d*reverse_d.e*req.body.rate ,
                        agreeableness: agreeableness_d*reverse_d.a*req.body.rate ,
                        neuroticism: neuroticism_d*reverse_d.n*req.body.rate
                    };
                }
                User.update({ _id: user._id }, {$set:{personality:ipiv_question_score} ,$push: { question: data._id } }).then(results => 
                    {
                        console.log("done");
                        console.log(results);
                        res.send(results)
                    }).catch(errors => {
                        res.send(errors)
                    })
            }
            ).catch(error=> 
                {
                    res.send(error)
                }
            );

        }).catch(err => {
            res.send(error)
        });
    }
}

module.exports = controller;