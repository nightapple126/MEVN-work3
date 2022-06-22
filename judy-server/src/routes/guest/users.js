var express = require('express');
var router = express.Router();
var controller = require('../../controllers/users.controller');
var passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/login/facial',controller.facialLogin);
router.get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log('Passed!');
});
router.post('/enroll',controller.enroll);
router.post('/recognize',controller.recognize);
router.post('/checkin',controller.checkin);
module.exports = router;
