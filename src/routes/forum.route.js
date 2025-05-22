const forumController = require('../controllers/forum.controller');
const express = require('express');
const router = express.Router();

router.post('/', forumController.createForum);

router.get('/', forumController.getForums);

router.get('/user/:userId', forumController.getForumsForUser);

module.exports = router;