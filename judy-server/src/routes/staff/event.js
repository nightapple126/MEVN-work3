const express = require('express');
const router = express.Router();

const controller = require('../../controllers/event.controller');

router.post('/', controller.newEvent);
router.post('/upload', controller.upload);
router.put('/:id', controller.updateEvent);
router.get('/', controller.getAll);
router.delete('/:id', controller.deleteEvent);

module.exports = router;