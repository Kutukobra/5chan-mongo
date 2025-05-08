const userController = require('../controllers/user.controller');
const express = require('express');
const router = express.Router();

router.post('/', userController.register);

module.exports = router;