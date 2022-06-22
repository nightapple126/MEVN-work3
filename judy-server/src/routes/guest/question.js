
const express = require('express');
const router = express.Router();
const questionController = require('../../controllers/question.controller');
const passport = require('passport');
router.get('/', passport.authenticate('jwt', { session: false }), questionController.GetQuestions);
router.post('/add',passport.authenticate('jwt', { session: false }),questionController.addQuestions);
router.post('/respond',passport.authenticate('jwt', { session: false }),questionController.respondToQuestions);
module.exports = router;