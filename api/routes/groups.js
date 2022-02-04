const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticated');
const GameServices = require('../../services/groupServices/getGroupGameNumbers');

router.get('/', auth.isAuthenticated, async (req, res, next) => {
  const users = req.body.Users;
  const gameNumbers = await GameServices.getGroupGameNumbers(users);
  res.send(gameNumbers);
});

module.exports = router;
