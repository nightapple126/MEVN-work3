const Person = require('../models/person');
const Service = require('../models/service');

let controller = {
    addFeedback(req, res) {
        const user = req.user;
        const feedback = req.body;
        Service.findOne({ name: feedback.service })
        .then(data => {
            const person = Person.findById(user._id)
            .then(u => {
                if (u.feedback.filter(x => x.service.name === feedback.service).length === 0) {
                     Person.update({ _id: user._id }, { '$push': { feedback: { rate: feedback.rate, service: data, message: feedback.message } }})
                    .then(data => {
                        res.send({ service: data });
                    })
                    .catch(err => {
                        res.status(500).send({ message: err });
                    })
                    ;
                } else {
                    res.status(500).send({ message: "You have rate this service before!" });
                }
            })
            .catch(err => {
                res.status(500).send({ mesasge: 'Something went wrong !!' + err });
            });
        })
        .catch(err => {
                res.status(500).send({ mesasge: 'Something went wrong !!' + err });
        });
    }
};

module.exports = controller;