const express = require('express');
const router = express.Router();
const passport = require('passport');

const controller = require('../../controllers/order.controller');

router.post('/',passport.authenticate('jwt', { session: false }),controller.addOrder)

router.get('/',passport.authenticate('jwt', { session: false }),controller.getOrders)

router.put('/:id',passport.authenticate('jwt', { session: false }),controller.confirm_order)

module.exports=router;