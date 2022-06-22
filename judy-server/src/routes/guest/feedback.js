const express = require('express');
const router = express.Router();
const passport = require('passport');

const controller = require('../../controllers/feedback.controller');

router.post('/', passport.authenticate('jwt', { session: false }), controller.addFeedback);

module.exports = router;