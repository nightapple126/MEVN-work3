const express = require('express');
const router = express.Router();
const foodController = require('../../controllers/restaurant.controller');
const passport = require('passport');
//const authRequired = require('../middlewares/authentication');

//router.post('/plate');
router.get('/', passport.authenticate('jwt', { session: false }), foodController.getAllPlate);
router.post('/like', passport.authenticate('jwt', { session: false }), foodController.likePlate);
router.post('/unlike', passport.authenticate('jwt', { session: false }), foodController.unlikePlate);
router.get('/bot_query', passport.authenticate('jwt', { session: false }), foodController.getByLabel);
router.get('/like/check', passport.authenticate('jwt', { session: false }), foodController.doUserLikesPlate);
router.post('/rate', passport.authenticate('jwt', { session: false }), foodController.ratePlate);
router.get('/get/rate', passport.authenticate('jwt', { session: false }), foodController.getRateUser);

module.exports = router;