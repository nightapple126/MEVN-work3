const Service = require('../models/service');

let controller = {
    addService(req, res) {
        let service = req.body;
        Service.insertMany(service)
        .then(data => {
            return res.send({ message: 'service added!!' });
        })
        .catch(err => {
            return res.status(500).send({ message: 'error while adding new service' });
        });
    },
    editService(req, res) {
        let service = req.body;
        const name = req.query.name;
        console.log(name);
        Service.update({ name: name }, service)
        .then(data => {
            console.log(data);
            return res.send({ message: 'service modified!' });
        })
        .catch(err => {
            return res.status(500).send({ message: 'error while modifying service' });
        });
    },
    deleteService(req, res) {
        let service = req.params.name;
        Service.findOneAndRemove({ name: service })
        .then(data => {
            return res.send({ 'message': 'service deleted!!' });
        })
        .catch(err => {
            return res.status(500).send({ message: 'error while deleting a service!!' });
        });
    },
    getAllServices(req, res) {
        Service.find()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).send({ message: 'Something went wrong !!' + err });
        });
    },
    getServiceByName(req, res) {
        const name = req.params.name;
        Service.find({ name: name })
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).send({ message: 'something went wrong!! ' + err });
        });
    }
};

module.exports = controller;