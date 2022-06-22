const express = require('express');
const router = express.Router();

const controller = require('../../controllers/service.controller');

router.post('/', controller.addService);
router.put('/', controller.editService);
router.delete('/:name', controller.deleteService);
router.get('/', controller.getAllServices);
router.get('/:name', controller.getServiceByName);

module.exports = router;