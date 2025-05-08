const creatorController = require('../controllers/creator.controller');
const express = require('express');
const router = express.Router();

router.post('/', creatorController.registerCreator);

module.exports = router;