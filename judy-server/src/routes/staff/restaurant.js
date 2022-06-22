const express = require('express');
const router = express.Router();
const controller = require('../../controllers/restaurant.controller');

router.post('/upload', controller.uploadPlate);
router.post('/', controller.addPlate);
router.get('/:id', controller.getPlateById);
router.put('/:id', controller.updatePlate);
router.get('/', controller.getAllPlate);
router.delete('/:id', controller.deletePlate);

module.exports = router;