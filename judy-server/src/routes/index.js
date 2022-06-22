var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/admin', (req, res) => {
  res.send({ message: 'You are in admin panel!!' });
});

module.exports = router;
