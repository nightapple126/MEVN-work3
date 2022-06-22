const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

/* router.use((req, res, next) => {
    if (!req.user) return res.status(401).send({ message: 'You must login first!' });
    next(); 
}); */

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'Bearer'
}, (user, cb) => {
    cb(null, user);
}));
