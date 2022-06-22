const router = require('express').Router();
const roles = require('../../config/access.json').roles;
const passport = require('passport');
const passportJwt = require('passport-jwt');
const ExtractJWT = passportJwt.ExtractJwt;
const jwt = require('jsonwebtoken');

router.use('/', (req, res, next) => {
    if (req.url.includes('admin')) {
        jwtFR = ExtractJWT.fromAuthHeaderAsBearerToken();
        if (!jwtFR(req)) {
            return res.send({ message: 'Unauthorized! login first' });
        }
        const user = jwt.verify(jwtFR(req), 'Bearer');
        if (user.role === roles.admin) return next();
        return res.status(401).send({ message: 'Unauthorized!! You are not welcome here!!' });
    }

    if (req.url.includes('staff')) {
        jwtFR = ExtractJWT.fromAuthHeaderAsBearerToken();
        if (!jwtFR(req)) {
            return res.send({ message: 'Unauthorized! login first' });
        }
        const user = jwt.verify(jwtFR(req), 'Bearer');
        if (user.role === roles.staff) return next();
        return res.status(401).send({ message: 'Unauthorized!! You are not welcome here!!' });
    }

    return next();
});

module.exports = router;