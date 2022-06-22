const router = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

var JsonCustomStrategy = require('passport-json-custom').Strategy;


router.use(passport.initialize());
router.use(passport.session());

var User = require('../models/person');

passport.use(new LocalStrategy(User.authenticate()));




passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


module.exports = router;