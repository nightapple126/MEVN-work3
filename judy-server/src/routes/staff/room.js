const express = require('express');
const router = express.Router();

const controller = require('../../controllers/room.controller');


router.post('/', controller.addRoom);

router.get('/',controller.getAllRooms);

router.post('/available',controller.getFreeRooms);

router.delete('/:id',controller.deleteRoom);

module.exports= router;