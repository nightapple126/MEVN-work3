const express = require('express');
const router = express.Router();
const passport = require('passport');

const controller = require('../../controllers/event.controller.js');

router.get('/', controller.getAll);
router.get('/:id', controller.getOneEvent);
router.post('/participate', passport.authenticate('jwt', { session: false }), controller.participate);
router.post(
  "/unparticipate",
  passport.authenticate("jwt", { session: false }),
  controller.unparticipate
);
router.post(
  "/interresting",
  passport.authenticate("jwt", { session: false }),
  controller.interrested
);
router.post(
  "/uninterresting",
  passport.authenticate("jwt", { session: false }),
  controller.uninterrested
);

module.exports = router;