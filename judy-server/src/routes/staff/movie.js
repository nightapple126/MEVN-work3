const express = require('express');
const router = express.Router();
const controller = require('../../controllers/movie.controller');
const passport = require('passport');

router.post('/upload', controller.uploadMovie);



module.exports = router;