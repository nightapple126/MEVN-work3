const express = require('express');
const router = express.Router();
const controller = require('../../controllers/movie.controller');
const passport = require('passport');

router.post('/upload', controller.uploadMovie);
router.get('/watch',controller.loadMovie);
router.get('/all',controller.allMovies);

router.post('/add',controller.postMovie);


module.exports = router;