const express = require('express');
const router = express.Router();

const controller = require('../../controllers/statistique.controller');

router.post('/', controller.addStatistique);
router.get('/', controller.getStatistique);

module.exports = router;