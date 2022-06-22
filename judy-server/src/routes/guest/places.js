const express = require('express');
const router = express.Router();
const placesController = require('../../controllers/places.controller');
const passport = require('passport');



router.post('/',passport.authenticate('jwt', { session: false }), placesController.findPlace);


module.exports =router;