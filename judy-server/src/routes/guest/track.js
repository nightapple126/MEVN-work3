const express = require('express');
const router = express.Router();
const trackController = require('../../controllers/tracks.controller');
const passport = require('passport');

router.get('/',trackController.testApi);
router.post('/save',trackController.saveTrack);
module.exports = router;