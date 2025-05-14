const userController = require('../controllers/user.controller');
const express = require('express');
const router = express.Router();

router.post('/register', userController.register);

router.post('/login', userController.login);

router.delete('/delete', userController.deleteUser);
module.exports = router;