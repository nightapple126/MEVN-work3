const express = require('express');
const router = express.Router();
const queueController = require('../../controllers/queue.controller');
const passport = require('passport');

router.post('/add',passport.authenticate('jwt', { session: false }),queueController.addToQueue);
router.get('/',passport.authenticate('jwt', { session: false }),queueController.getQueue);
router.get('/removeFromQueue',passport.authenticate('jwt', { session: false }),queueController.removeFromQueue);
router.get('/SetCurrent',passport.authenticate('jwt', { session: false }),queueController.SetCurrent);


module.exports = router;