

const express = require('express');
const router = express.Router();
const bot_interactionController = require('../../controllers/bot_interaction.controller');
const passport = require('passport');
//const authRequired = require('../middlewares/authentication');

//router.post('/plate');
router.get('/', passport.authenticate('jwt', { session: false }), bot_interactionController.getInteractions);

router.post('/query', passport.authenticate('jwt', { session: false }), bot_interactionController.query);

router.get('/stats', passport.authenticate('jwt', { session: false }), bot_interactionController.getStats);

router.post('/destroy',passport.authenticate('jwt', { session: false }), bot_interactionController.destroyAudio);


module.exports = router;